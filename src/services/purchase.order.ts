import {DB} from './db';
import {DB_Helper} from './helper';
import { DBConfig } from '../config';

export class PurchaseOrderDb {
    constructor() {}

    async getMultiple(page: string) {
        const config = new DBConfig().config();
        const helper = new DB_Helper();
        const offset = helper.getOffset(parseInt(page), config.listPerPage);
        console.log(offset, config.listPerPage);
        const rows = await new DB().query(`SELECT * FROM purchase_order_master LIMIT ${offset},${config.listPerPage}`);
        const data = helper.emptyOrRows(rows);
        const meta = {page};
        return {
          data,
          meta
        }
      }
      
}