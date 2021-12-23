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
    try {
      // update po master
      await this.updatePurchaseOrderMasterInfo(poData).then((value) => {
        poData.Items.map((item) => {
          this.addPurchaseOrderDetails(poData,item);
        });
      })
    } catch (error) {
      const {message} = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
   
  }

  async addPurchaseOrderDetails(poMaster: IBigBazaarPurchaseOrderDto, poItem: IBigBazaarPurchaseOrderItemsDto) {
    try {
      return new Promise((resolve, reject) => {
      poItem.ArticleCode = poItem.ArticleCode.replace('\n', '');
      poItem.ArticleEAN = poItem.ArticleEAN.replace('\n', '');
      // TBD header get added when PO items more than 1 page...
      if(poItem.ArticleCode !== 'Article Code' && poItem.ArticleEAN !== 'Article EAN') {
        this.db.getConnectionPool().query(
          `INSERT INTO purchase_order_details (
            purchase_order_master_id,
            order_type, 
            sales_org, 
            distributed_channel,
            division,
            sold_to_party,
            ship_to_party,
            po_number,
            po_date,
            valid_to, 
            sap_material_code,
            article_code,
            article_ean,
            desc_of_goods,
            quantity,
            uom,
            basic_cost,
            taxable_value,
            sgst_rate,
            sgst_amt,
            cgst_rate,
            cgst_amt,
            total_amt,
            created_at
           ) VALUES (
            ${
              [
                `'${poMaster.Id}'`,
                `'${poMaster.OrderType}'`,
                `'${poMaster.SalesOrg}'`,
                `'${poMaster.DistChannel}'`,
                `'${poMaster.Division}'`,
                `'${poMaster.SoldToParty}'`,
                `'${poMaster.ShipToParty}'`,
                `'${poMaster.PurchaseOrderNumber}'`,
                `'${poMaster.PurchaseOrderDate}'`,
                `'${poMaster.ValidTo}'`,
                `'${poItem.SAPMatCode}'`,
                `'${poItem.ArticleCode.trim()}'`,
                `'${poItem.ArticleEAN.trim()}'`,
                `'${poItem.DescriptionOfGoods}'`,
                `'${poItem.Quantity}'`,
                `'${poItem.UnitOfMeasure}'`,
                `'${poItem.BasicCost}'`,
                `'${poItem.TaxableAmount}'`,
                `'${poItem.SGST_Rate}'`,
                `'${poItem.SGST_Amount}'`,
                `'${poItem.CGST_Rate}'`,
                `'${poItem.CGST_Amount}'`,
                `'${poItem.TotalAmount}'`,
                `CURDATE()`
              ]
            }
          )`
        ),((err: any,results: any) => {
          if(err){
            return reject(err);
          }
           console.log(results);      
           return resolve(results);
          });
        }
      })
    } catch (error) {
      console.log(error, poItem);
      const {message} = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
    
  }

  async getAllOpenPurchaseOrders() {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `SELECT id,message_id, purchase_order_number, 
        json_file_name, json_file_path,
        is_pdf_converted_to_json, DATE_FORMAT(created_at, '%Y-%m-%d') as created_at
        FROM purchase_order_master WHERE DATE(created_at) = CURDATE() 
        AND purchase_order_number IS NULL`;
        this.db.getConnectionPool().query(selectQuery,(err,results) => {
          if(err){
            return reject(err);
          }
           console.log(results);      
           return resolve(results);
        });
      });
    } catch (error) {      
      const {message} = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  async updatePurchaseOrderMasterInfo(poMaster: IBigBazaarPurchaseOrderDto) {
    try {
      return new Promise((resolve, reject) => {
        this.db.getConnectionPool().query(
          `UPDATE purchase_order_master 
            SET
              purchase_order_number = ${poMaster.PurchaseOrderNumber},            
              is_json_parsed = true, 
              updated_at = CURDATE()
            WHERE
              id = ${poMaster.Id}
          `,(err,results) => {
          if (err) {
            throw new Error("Error in updating PO Master with id:" + poMaster.Id);
          }
          return resolve(results.affectedRows);
        })
      })
      
    } catch (error) {
      const {message} = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }
}