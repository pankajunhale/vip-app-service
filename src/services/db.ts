import mysql from 'mysql';
import {DBConfig} from '../config';
const config = new DBConfig().config();
const connection = mysql.createConnection(config.db);
//
export class DB {
    constructor() {}
    async query(sql: any, params?: any): Promise<any> {
        await connection.connect((err)=> {
            if(err)
                throw new Error("Error in connecting to server");

            console.log('connected as id ' + connection.threadId);
            return connection.query(sql,(error,results)=> {
                if(error)
                    throw new Error("Error in processing your database request!");
                
                return results;
            });
        });
        
    }

    getConnectionPool() {
        return mysql.createPool(config.db);;
    }
}
