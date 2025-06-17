/**
 * Mein Chatserver
 * ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
 * Licensed Materials - Property of mein-chatserver.de.
 * © Copyright 2024. All Rights Reserved.
 *
 * @version 1.0.0
 * @author  Adrian Preuß
 */
 
import MySQL from 'mysql';
import Config from './Config.class.js';
 
export default (new class Database {
	Shutdown	= false;
	Connection	= null;
	
	constructor() {
		this.Connection = MySQL.createPool({
			connectionLimit:	Config.get('Database.CONNECTIONS', 10),
			debug:				Config.get('Logging.MYSQL', false),
			host: 				Config.get('Database.HOSTNAME', 'localhost'),
			port:				Config.get('Database.PORT', 3306),
			user: 				Config.get('Database.USERNAME', 'root'),
			password:			Config.get('Database.PASSWORD', ''),
			database:			Config.get('Database.DATABASE', 'unknown'),
			charset:			Config.get('Database.CHARSET', 'utf9'),
			timezone:			'Europe/Berlin',
			queryFormat:		(query, values) => {
				if(!values) {
					return query;
				}
				
				return query.replace(/\:(\w+)/g, (txt, key) => {
					if(values.hasOwnProperty(key)) {
						return MySQL.escape(values[key]);
					}
					
					return txt;
				});
			}
		});
	}
	
	destructor() {
		if(this.Shutdown) {
			return;
		}
		
		this.Shutdown = true;
		/*this.Connection.end((error) => {
			if(error) {
				Logger.error('Database', error);
			}
		});*/
	}
	
	now(date) {
		if(typeof(date) === 'undefined') {
			date = new Date();
		}
		
		const year		= date.getFullYear();
		const month		= (date.getMonth() + 1).toString().padStart(2, '0');
		const day		= date.getDate().toString().padStart(2, '0');
		const hours		= date.getHours().toString().padStart(2, '0');
		const minutes	= date.getMinutes().toString().padStart(2, '0');
		const seconds	= date.getSeconds().toString().padStart(2, '0');

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}
	
	exists(query, data, object) {
		return new Promise((success, failure) => {
			this.fetch(query, data, object).then((result) => {
				if(result.length === 0 || typeof(result[0]) === 'undefined') {
					success(false);
					return;
				}
				
				success(true);
			}).catch(failure);
		});
	}
	
	single(query, data, object) {
		return new Promise((success, failure) => {
			this.fetch(query, data, object).then((result) => {
				if(result.length === 0 || typeof(result[0]) === 'undefined') {
					success(null);
					return;
				}
				
				success(result[0]);
			}).catch(failure);
		});
	}
	
	fetch(query, data, object) {
		if(typeof(object) === 'undefined') {
			object = null;
		}
		
		return new Promise((success, failure) => {
			this.Connection.getConnection(function(connection_error, connection) {
				if(connection_error) {
					failure(connection_error);
					return;
				}
		
				connection.query(query, data, (query_error, results, fields) => {
					connection.release();
					
					if(query_error) {
						failure(query_error);
						return;
					}
					
					if(object !== null) {
						const construct = object.toString().match(/constructor\s*\(([^)]*)\)/);
						const args		= construct ? construct[1].split(',').map(arg => arg.trim()) : [];
						
						results.forEach((row, index) => {
							let instance = new object(...args.map(arg => row[arg]));
							
							/* Bind others */
							Object.entries(row).forEach(([ name, value ]) => {
								if(args.indexOf(name) === -1) {
									instance[name] = value;
								}
							});
							
							results[index] = instance;
						});
					}
					
					success(results);
				});
			});
		});
	}
	
	insert(table, parameters) {
		return new Promise((success, failure) => {
			this.Connection.getConnection((connection_error, connection) => {
				if(connection_error) {
					failure(connection_error);
					return;
				}
				
				let names		= [];
				let values		= [];
				
				Object.entries(parameters).forEach(([ name, value ]) => {
					names.push('`' + name + '`');
					values.push(':' + name);
				});
				
				Object.entries(parameters).forEach(([ name, value ]) => {
					if(typeof(value) === 'number') {
						parameters[name] = value;
					} else if(typeof(value) === 'boolean') {
						parameters[name] = value ? 1 : 0;
					} else if(value === 'NOW()') {
						parameters[name] = this.now();
					}
				});
				
				let query = 'INSERT INTO `' + table + '` (' + names.join(', ') + ') VALUES (' + values.join(', ') + ')';
				
				connection.query(query, parameters, (query_error, result, fields) => {
					connection.release();
					
					if(query_error) {
						failure([ query_error, query, parameters ]);
						return;
					}
					
					success(result.insertId);
				});
			});
		});
	}
	
	update(table, where, parameters) {
		return new Promise((success, failure) => {
			let fields	= [];
			let query	= null;
			
			Object.entries(parameters).forEach(([ name, value ]) => {
				if(value === 'NOW()') {
					parameters[name] = this.now();
				}
				
				fields.push('`' + name + '`=:' + name);
			});
			
			query	= 'UPDATE `' + table + '` SET ' + fields.join(', ') + ' WHERE ';
			
			if(Array.isArray(where)) {
				let checks	= [];
				
				where.forEach((entry) => {
					checks.push('`' + entry + '`=:' + entry);
				});
				
				query += checks.join(' AND ');
			} else {
				query = where + '`=:' + where;
			}
			
			this.Connection.getConnection(function(connection_error, connection) {
				if(connection_error) {
					failure(connection_error);
					return;
				}
			
				connection.query(query, parameters, (query_error, result, fields) => {
					connection.release();
					
					if(query_error) {
						failure(query_error);
						return;
					}
					
					success(result.affectedRows);
				});
			});
		});
	}
}());