import { DB } from './db';
import { DB_Helper } from './helper';
import { DBConfig } from '../config';
import { IBigBazaarPurchaseOrderDto } from '../big-bazaar/dto/interface/big-bazaar.purchase.order.dto';
import { IBigBazaarPurchaseOrderItemsDto } from '../big-bazaar/dto/interface/big-bazaar.purchase.order.items.dto';

export class PurchaseOrderDb {
  db = new DB();
  config = new DBConfig().config();
  helper = new DB_Helper();
  constructor() { }

  async getMultiple(page: string) {
    const offset = this.helper.getOffset(parseInt(page), this.config.listPerPage);
    console.log(offset, this.config.listPerPage);
    const rows = await this.db.query(`SELECT * FROM purchase_order_master LIMIT ${offset},${this.config.listPerPage}`);
    const data = this.helper.emptyOrRows(rows);
    const meta = { page };
    return {
      data,
      meta
    }
  }

  async updatePurchaseOrderMaster(poData: IBigBazaarPurchaseOrderDto) {
    poData.Items.map((item) => {
      this.addPurchaseOrderDetails(item);
    })
  }

  async addPurchaseOrderDetails(poItem: IBigBazaarPurchaseOrderItemsDto) {
    const result = await this.db.query(
      `INSERT INTO purchase_order_details (article_code, article_ean) VALUES (
        ${
          [
            poItem.ArticleCode, poItem.ArticleEAN
          ]
        }
      )`
    );

    let message = 'Error in creating quote';
    if (result.affectedRows) {
      message = 'Quote created successfully';
    }
    return { message };
  }
}