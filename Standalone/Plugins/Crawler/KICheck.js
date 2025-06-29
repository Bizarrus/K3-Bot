import Config from '../../Classes/Config.class.js';
import IPlugin from '../../Classes/IPlugin.interface.js';
import Logger from '../../Classes/Logger.class.js';
import Database from '../../Classes/Database.class.js';
import FormData from 'form-data';
import Fetch from 'node-fetch';
import Crypto from 'node:crypto';
import FileSystem from 'node:fs/promises';
import Path from 'node:path';

export default class KICheck extends IPlugin {	
    constructor(client) {
        super();
		
		if(!Config.get('Plugins.Crawler.Enabled', true)) {
			return;
		}
		
		this.updateStatistics();
		this.loadPicture();
    }
	
	async loadPicture() {
		let photo = await Database.single('SELECT * FROM `pictures` WHERE `ki_value` IS NULL ORDER BY `time_created` ASC LIMIT 1');
		
		this.createRequest(photo);
	}
	
	async updateStatistics() {
		let statistics	= await Database.single('SELECT COUNT(`id`) AS `total` FROM `pictures` WHERE `ki_value` IS NOT NULL');
		
		await Database.update('statistics', [ 'name' ], {
			name:	'ai_checked',
			value:	statistics.total
		});		
	}
	
	async createRequest(picture) {
		try {
			const form		= new FormData();
			const file		= Path.resolve(`/var/www/knuddels/Crawler/storage/pictures/profiles/${picture.id}.img`);
			const buffer	= await FileSystem.readFile(file);
			
			if(buffer.length === 0) {
				throw new Error('Broken Image');
			}

			form.append('media', buffer, {
				filename:		`picture_${Date.now()}.jpg`,
				contentType:	'image/jpeg'
			});
			
			form.append('request_id', Crypto.randomUUID());
			
			form.getLength(async (error, length) => {
				if(error) {
					throw error;
				}
				
				const response = await Fetch('https://plugin.hivemoderation.com/api/v1/image/ai_detection', {
					method:				'POST',
					body:				form,
					mode:				'cors',
					cache:				'no-cache',
					credentials:		'same-origin',
					redirect:			'follow',
					referrerPolicy:		'no-referrer',
					headers:  {
						...form.getHeaders(),
						'Content-Length':	length,
						'Origin':			'chrome-extension://cmeikcgfecnhojcbfapbmpbjgllklcbi',
						'Accept':			'application/json, text/plain, */*',
						'User-Agent':		'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0'
					}
				});
			
				if(!response.ok) {
					const text = await response.text();
					throw new Error(`HTTP ${response.status}: ${text}`);
				}

				const json = await response.json();
				this.saveResult(picture, json.data.classes);
			});
		} catch(error) {
			console.log(error);
		}
	}
	
	async saveResult(picture, result) {
		const best		= result.reduce((previous, current) => (current.score > previous.score ? current : previous), result[0]);
		const ki_value	= [ 'not_ai_generated', 'none' ].indexOf(best.class) !== -1 ? 0 : best.score * 100;

		console.log('Best:',		best);
		console.log('ki_value:',	ki_value);

		await Database.update('pictures', [ 'id' ], {
			id:			picture.id,
			ki_value:	ki_value,
			ki_data:	JSON.stringify(result),
			time_ki:	'NOW()',
		});
		
		this.updateStatistics();
		
		setTimeout(() => {
			this.loadPicture()
		}, 60000);
	}
}