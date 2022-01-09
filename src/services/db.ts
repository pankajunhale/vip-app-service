import mysql from 'mysql';
import {DBConfig} from '../config';
const config = new DBConfig().config();
const connection = mysql.createConnection(config.db);
const connectionPool = mysql.createPool(config.db);
//
export class DB {
    constructor() {}
    async query(sql: any, values?: any): Promise<any> {
        await connection.connect((err)=> {
            if(err)
                throw new Error("Error in connecting to server");

            console.log('connected as id ',sql,values);            
            return connection.query(sql, values, (error,results)=> {
                console.log(`${err}-${results}`)
                if(error)
                    throw new Error("Error in processing your database request!");
                
                return results;
            },);
            
        });
        
    }

    getConnectionPool() {
        return connectionPool;
    }
}
