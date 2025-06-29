import Config from '../../Classes/Config.class.js';
import GraphBuilder from '../../Classes/Network/GraphBuilder.class.js';
import { GraphQL, Type } from '../../Classes/Network/GraphQL.class.js';
import IPlugin from '../../Classes/IPlugin.interface.js';
import Logger from '../../Classes/Logger.class.js';
import Database from '../../Classes/Database.class.js';
import Calendar from '../../Classes/Utils/Calendar.class.js';
import Crypto from 'node:crypto';
import FileSystem from 'node:fs/promises';

export default class Albums extends IPlugin {
	Client			= null;
	Channels		= null;
	Profiles		= {};
	Queue			= [];
	Watcher			= null;
	
    constructor(client) {
        super();
		
		if(!Config.get('Plugins.Crawler.Enabled', true)) {
			return;
		}
		
		this.Client		= client;
		this.Channels	= this.Client.getPlugin('Channels');
		this.Client.on('plugin_Channels',	this.onPluginChannels.bind(this));
    }
	
	onPluginChannels(plugin) {
		this.updateCommentsStatistics();
		this.updateAlbumsStatistics();
		
		/* When Users inited */
		plugin.on('users', () => {
			this.Profiles	= plugin.getUsers();
			this.Watcher	= setInterval(() => this.handleProfileFetch(), 500);
		});
		
		/* When new User added */
		plugin.on('user', (user) => {
			this.Profiles[user.id] = user;
		});		
	}
	
	async handleProfileFetch() {
		if(Object.keys(this.Profiles).length === 0) {
			return;
		}
		
		if(this.Queue.length === 0) {
			this.Queue = [...Object.values(this.Profiles)];
			
			if(Config.get('Logging.Plugins.Crawler.Albums', true)) {
				Logger.info('[Crawler:Albums]', 'Requeue Profiles.', this.Queue.length);
			}
		}
		
		let user = this.Queue.shift();
		
		if(!user) {
			return;
		}
		
		if(Config.get('Logging.Plugins.Crawler.Albums', true)) {
			Logger.info('[Crawler:Albums]', 'Fetch', user.nickname);
		}
		
		try {
			await this.fetchAlbums(user);
		} catch(error) {
			Logger.error('[Crawler:Albums]', 'Fetch error', error);
		}
	}
	
	async fetchAlbums(user) {
		let url			= 'https://photo.knuddels.de/photos-requestuserinformation.html?';
		const params	= new URLSearchParams({
			id:			user.nickname,
			profile:	true,
			albums:		true,
			photoSize:	'VERY_LARGE'
		});
		
		try {
			const response = await fetch(`${url}${params}`);
			
			if(response.status !== 200) {
				if(Config.get('Logging.Plugins.Crawler.Albums', true)) {
					Logger.warning('[Crawler:Albums]', 'Image not found', user.nickname);
				}
				return;
			}
			
			const data = await response.json();
			
			await this.saveComments('PROFILE', user, data?.profile?.photo?.comments);
			await this.saveAlbums(user, data?.albums);
		} catch(error) {
			Logger.error('[Crawler:Albums]', 'FetchAlbums error', error);
		}
	}
	
	async saveComments(type, user, comments = []) {
		if(!Array.isArray(comments)) {
			return;
		}
		
		for(const comment of comments) {
			if(await Database.exists('SELECT `id` FROM `comments` WHERE `user`=:id AND `comment`=:comment AND `type`=:type LIMIT 1', {
				id:			user.id,
				type:		type,
				comment:	comment.id
			})) {
				continue;
			}
			
			if(Config.get('Logging.Plugins.Crawler.Albums', true)) {
				Logger.success('[Crawler:Albums]', 'Insert Comment', user.nickname);
			}

			await Database.insert('comments', {
				id:				null,
				user:			user.id,
				comment:		comment.id,
				type:			type,
				author:			comment.author,
				text:			comment.message,
				time_created:	'NOW()',
				time_posted:	new Date(comment.time)
			});
			
			this.updateCommentsStatistics();
		}
	}
	
	async updateCommentsStatistics() {
		let statistics	= await Database.single('SELECT COUNT(`id`) AS `total` FROM `comments` WHERE `type`=\'PROFILE\'');
		
		await Database.update('statistics', [ 'name' ], {
			name:	'comments_photo',
			value:	statistics.total
		});
	}
	
	async updateAlbumsStatistics() {
		let statistics	= await Database.single('SELECT COUNT(`id`) AS `total` FROM `albums`');
		
		await Database.update('statistics', [ 'name' ], {
			name:	'albums',
			value:	statistics.total
		});		
	}

	async saveAlbums(user, albums = []) {
		if(!Array.isArray(albums)) {
			return;
		}
		
		for(const album of albums) {
			const existing = await Database.single('SELECT `id` FROM `albums` WHERE `user` = :id AND `album` = :album LIMIT 1', {
				id:		user.id,
				album:	album.id
			});

			if(existing?.id) {
				await this.saveAlbumPictures(album, existing);
				continue;
			}
			
			if(Config.get('Logging.Plugins.Crawler.Albums', true)) {
				Logger.success('[Crawler:Albums]', 'Insert Album', user.nickname);
			}

			const data = {
				id:				null,
				user:			user.id,
				album:			album.id,
				title:			album.name,
				time_created:	'NOW()'
			};
			
			const id		= await Database.insert('albums', data);
			const created	= { ...data, id: id };
			await this.saveAlbumPictures(album, created);
			this.updateAlbumsStatistics();
		}
	}
	
	async saveAlbumPictures(album, database) {
		if(album?.photos) {
			for(const photo of album.photos) {
				//console.log(photo.id, photo.url);
			}
		}
		
		
		//await this.saveComments('PROFILE', user, data?.profile?.photo?.comments);
	}
}