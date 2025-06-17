import GraphBuilder from '../../Classes/Network/GraphBuilder.class.js';
import { GraphQL, Type } from '../../Classes/Network/GraphQL.class.js';
import Photo from '../../Classes/Network/Photo.class.js';
import Messenger from '../../Classes/Models/Messenger.class.js';
import IPlugin from '../../Classes/IPlugin.interface.js';

export default class QuestSolver extends IPlugin {
    Client  = null;
    Cache   = {};

    constructor(client) {
        super();

        this.Client = client;

        /* Open Quest-System */
        this.Client.on('connected', () => {
            //this.Client.sendSlashCommand('/opensystemapp EngagementSystemApp');
        });

        /* When Notification received */
        this.Client.on('notification', (notification) => {
            if(notification.key === 'engagementsystem') {
                console.info('[Quest] Claim:', notification.title, notification);
                this.Client.sendSlashCommand(notification.callToAction.slashCommand);

                try {
                    this.solveQuest(this.Cache[notification.callToAction.slashCommand.replace('/engagementsystem ', '')]);
                } catch(e) {
                    /* Do Nothing */
                }
            }
        });

        this.Client.on('messages', (messages) => {

        });

        /* When Quests received */
        this.Client.on('quests', (quests) => {
            quests.forEach((quest) => {
                this.Cache[quest.id] = quest;

                switch(quest.progress.state) {
                    // Finished, can be claimed
                    case 'claimable':
                        console.info('[Quest] Claim:', quest.shortDescription);
                        this.Client.sendSlashCommand('/engagementsystem ' + quest.id);
                        this.solveQuest(quest);
                    break;
                    case 'active':
                        console.info('[Quest] Try to Solve:', quest.title, quest.callToAction?.label);

                        switch(quest.callToAction.label) {
                            case 'Hobbies hinzufügen':
                                this.editProfile('EditStringListEntry', 'HOBBIES', '.');
                                this.solveQuest(quest);
                            break;
                            case 'Profilbild hochladen':
                                this.Client.sendSlashCommand('/opensystemapp ProfileCustomizationApp');

                                // Upload a Picture
                                Photo.createEmptyPicture(300, 300).then((image) => {
                                    Photo.uploadProfilePicture(image, (error) => {
                                        if(error) {
                                            console.error('[QuestSolver] Photo-Error:', error);
                                            return;
                                        }
                                
                                        // Solve the Quest
                                        this.Client.sendSlashCommand(quest.callToAction.slashCommand);
                                        this.solveQuest(quest);
                    
                                        // Delete the Picture
                                        setTimeout(() => {
                                            Photo.delete();
                                        }, 5000);
                                    });
                                });
                            break;
                            case 'Lieblingsserien hinzufügen':
                                this.editProfile('EditStringListEntry', 'SERIES', '.');
                                this.solveQuest(quest);
                            break;
                            case 'Lieblingsmusik hinzufügen':
                                this.editProfile('EditStringListEntry', 'MUSIC', '.');
                                this.solveQuest(quest);
                            break;
                            case 'Lieblingsbücher hinzufügen':
                                this.editProfile('EditStringListEntry', 'BOOKS', '.');
                                this.solveQuest(quest);
                            break;
                            case 'Lieblingsfilme hinzufügen':
                                this.editProfile('EditStringListEntry', 'MOVIES', '.');
                                this.solveQuest(quest);
                            break;
                            case 'Beziehungsstatus ändern':
                                this.editProfile('EditRelationshipStatusEntry', 'RELATIONSHIP_STATUS', 'FOREVER_ALONE');
                                this.solveQuest(quest);
                            break;
                            case 'Kiddies angeben':
                                this.editProfile('EditChildrenEntry', 'CHILDREN', 'I_GO_TO_THE_MONASTERY');
                                this.solveQuest(quest);
                            break;
                            case 'Readme ändern':
                                this.editProfile('EditStringListEntry', 'README', '.');
                                this.solveQuest(quest);
                            break;
                            case 'Fotomeet öffnen':
                                this.Client.sendSlashCommand(quest.callToAction.slashCommand);
                                this.solveQuest(quest);
                            break;
                            default:
                                switch(quest.title) {
                                    case 'Momente festhalten':
                                        this.Client.getMessenger().getRandomMessage().mark(true).then(() => {
                                            this.Client.sendSlashCommand(quest.callToAction.slashCommand);
                                            this.solveQuest(quest);
                                        });
                                    break;
                                    case 'Schatzsuche':
                                        let worldtour   = new GraphBuilder(Type.Mutation, 'SendAppDataEvent');
                                        worldtour.setAuthSession(this.Client.getSession());
                                        worldtour.setVariable('event',                   {
                                            appId:          'worldtour',
                                            channelName:    '',
                                            eventKey:       'selectStartLocation',
                                            eventValue:     JSON.stringify({
                                                portId:     44
                                            })
                                        });
                            
                                        GraphQL.call(worldtour).then((response) => {
                                            let setWorld   = new GraphBuilder(Type.Mutation, 'SendAppDataEvent');
                                            setWorld.setAuthSession(this.Client.getSession());
                                            setWorld.setVariable('event',                   {
                                                appId:          'worldtour',
                                                channelName:    '',
                                                eventKey:       'getWorld',
                                                eventValue:     JSON.stringify({})
                                            });
                                
                                            GraphQL.call(setWorld).then((response) => {
                                                let openChest   = new GraphBuilder(Type.Mutation, 'SendAppDataEvent');
                                                openChest.setAuthSession(this.Client.getSession());
                                                openChest.setVariable('event',                   {
                                                    appId:          'worldtour',
                                                    channelName:    '',
                                                    eventKey:       'openChest',
                                                    eventValue:     JSON.stringify({
                                                        chestId:    'FreeChest'
                                                    })
                                                });
                                    
                                                GraphQL.call(openChest).then((response) => {
                                                    this.Client.sendSlashCommand(quest.callToAction.slashCommand);
                                                    this.solveQuest(quest);
                                                }).catch(failure);
                                            }).catch(failure);
                                        }).catch(failure);
                                    break;
                                    case 'Whoops... das sollte bleiben':
                                        this.Client.getMessenger().getArchivedMessages().then((messages) => {
                                            messages[Math.floor(Math.random() * messages.length)].setArchived().then(() => {
                                                this.Client.sendSlashCommand(quest.callToAction.slashCommand);
                                                this.solveQuest(quest);
                                            });
                                        });
                                    break;
                                    case 'Putzfimmel':
                                        this.Client.getMessenger().getUnarchivedMessages().then((messages) => {
                                            messages[Math.floor(Math.random() * messages.length)].setArchived().then(() => {
                                                this.Client.sendSlashCommand(quest.callToAction.slashCommand);
                                                this.solveQuest(quest);
                                            });
                                        });
                                    break;
                                    case 'Kontaktfilter':
                                        let query   = new GraphBuilder(Type.Mutation, 'SendAppDataEvent');
                                        query.setAuthSession(this.Client.getSession());
                                        query.setVariable('event',                   {
                                            appId:          'FilterSettingsApp',
                                            channelName:    '',
                                            eventKey:       '__fetchEventRequest',
                                            eventValue:     JSON.stringify({
                                                id:     Math.random().toFixed(15),
                                                data:   {
                                                    minAge: 18,
                                                    maxAge: 97
                                                },
                                                key:    'setAgeRange'
                                            })
                                        });
                            
                                        GraphQL.call(query).then((response) => {
                                            this.Client.sendSlashCommand(quest.callToAction.slashCommand);
                                            this.solveQuest(quest);
                                        }).catch(failure);
                                    break;
                                    default:
                                        console.warn(quest);
                                    break;
                                }
                            break;
                        }
                    break;
                }
            });
        });
    }

    editProfile(type, key, value) {
         /*
            {field: "README", freeTextValue: "", freeTextPattern: null, freeTextMinLength: null,…}
            {field: "NAME", freeTextValue: "", freeTextPattern: null, freeTextMinLength: 2, freeTextMaxLength: 50,…}
            {field: "EMAIL", freeTextValue: "",…}
            {field: "ZIP_CODE", freeTextValue: "", freeTextPattern: "^[0-9]+$", freeTextMinLength: null,…}
            {field: "MUSIC", stringListValue: [], __typename: "ProfileEditEntryStringList"}
            {field: "HOBBIES", stringListValue: [], __typename: "ProfileEditEntryStringList"}
            {field: "MOVIES", stringListValue: [], __typename: "ProfileEditEntryStringList"}
            {field: "SERIES", stringListValue: [], __typename: "ProfileEditEntryStringList"}
            {field: "BOOKS", stringListValue: [], __typename: "ProfileEditEntryStringList"}
            {field: "LANGUAGES", stringListValue: [], __typename: "ProfileEditEntryStringList"}
            {field: "DATE_OF_BIRTH", dateValue: null, dateMinValue: "595551600000", dateMaxValue: "690159599000",…}
            {field: "SEXUAL_ORIENTATION", sexualOrientationValue: "UNKNOWN",…}
            {field: "RELATIONSHIP_STATUS", relationshipStatusValue: "UNKNOWN",…}
            {field: "CHILDREN", childrenValue: null, __typename: "ProfileEditEntryChildren"}
            {field: "SMOKER", smokerValue: null, __typename: "ProfileEditEntrySmoker"}
            {field: "COUNTRY_ENUM", countryValue: null, __typename: "ProfileEditEntryCountry"}
        */
        let query = new GraphBuilder(Type.Mutation, type);
        query.setAuthSession(this.Client.getSession());
        query.setVariable('field', key);

        switch(type) {
            case 'EditRelationshipStatusEntry':
            case 'EditChildrenEntry':
                query.setVariable('value', value);
            break;
            default:
                query.setVariable('value', [ value ]);
            break;
        }

        GraphQL.call(query);
    }

    solveQuest(quest) {
        let query = new GraphBuilder(Type.Mutation, 'SendAppDataEvent');
        query.setAuthSession(this.Client.getSession());
        query.setVariable('event',          {
            appId:          'EngagementSystemApp',
            channelName:    '',
            eventKey:       '__fetchEventRequest',
            eventValue:      JSON.stringify({
                id:     Math.random().toFixed(15),
                key:    'claimTask',
                data:   quest
            })
        });
        GraphQL.call(query);
    }
}