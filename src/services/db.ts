const mysql = require('mysql2/promise');
import {DBConfig} from '../config';
const config = new DBConfig().config();
const pool = mysql.createPool(config.db);

export class DB {
    constructor() {}
    async query(sql: any, params?: any): Promise<any> {
        const [rows, fields] = await pool.execute(sql, params);
        return rows;
    }
}
