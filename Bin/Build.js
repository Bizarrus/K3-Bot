import Logger from '../Source/Classes/Logger.js';
import ParseCLIArgs from 'command-line-args';
import CLIUsage from 'command-line-usage';
import Archiver from 'archiver';
import FS from 'fs';

class Build {
    Arguments = [
        { name: 'target', alias: 't', type: String, multiple: true },
        { name: 'watch', alias: 'w' },
        { name: 'help', alias: 'h' },
    ];
    Usage = [
        {
            header: 'Build {italic [Options]}',
            content: 'Build Browser-Extensions by given Options.'
        }, {
            header: 'Options',
            optionList: [
                {
                    name: 'target',
                    typeLabel: '{underline <name>}',
                    description: 'Specific the Build-Target. You can provide multiple values.\n\n{gray.underline Possible values}\n{yellow mozilla}\tFor Mozilla Firefox, Safari\n{yellow chrome}\tFor Google Chrome, Microsoft Edge, Opera\n'
                }, {
                    name: 'watch',
                    alias: 'w',
                    type: Boolean,
                    description: 'Build automatically when files changed.'
                }, {
                    name: 'help',
                    alias: 'h',
                    type: Boolean,
                    description: 'Print this usage guide.'
                }
            ]
        }
    ];

    constructor() {
        const options = ParseCLIArgs(this.Arguments);

        if(Object.keys(options).length === 0) {
            Logger.info(CLIUsage(this.Usage));
            return;
        }

        if(typeof(options.help) !== 'undefined') {
            Logger.info(CLIUsage(this.Usage));
            return;
        }

        if(typeof(options.target) === 'undefined' || options.target.length === 0) {
            Logger.error('No target specified.');
            return;
        }

        if(typeof(options.watch) !== 'undefined') {
            FS.watch('./Source', (eventType, filename) => {
                this.run(options);
            });
        }

        this.run(options);
    }

    run(options) {
        Logger.info('Run build.');

        /* Remove the old Build-Directory */
        FS.rm('./Build', {
            recursive: true,
            force: true
        }, (error) => {
            if(error){
                Logger.error(error.message);
                //return;
            }

            FS.mkdir('./Build', {
                recursive: true
            }, (error) => {
                if(error){
                    Logger.error(error.message);
                    //return;
                }

                options.target.forEach((target) => {
                    this.build(target);
                });
            });
        });
    }

    build(target) {
        let directory = './Build/' + target;

        FS.cpSync('./Source', directory, { recursive: true });
        FS.copyFileSync('./Config/manifest.' + target + '.json', directory + '/manifest.json');

        const archive = Archiver('zip', {
            zlib: {
                level: 9
            },
            comment: 'Webbrowser Pack-Builder'
        });

        const stream          = FS.createWriteStream('./Build/' + target + '.zip');

        archive.directory(directory, false).on('finish', () => {
            Logger.info('[INFO] Packed: ' + directory);
        }).on('error', error => {
            Logger.error('[ERROR]', error);
        }).on('warning', warning => {
            Logger.warn('[WARNING]', warning);
        }).pipe(stream);

        archive.finalize();
    }
}

new Build();