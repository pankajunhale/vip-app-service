import { DB } from './db';
import { DB_Helper } from './helper';
import { DBConfig } from '../config';
import { IBigBazaarPurchaseOrderDto } from '../big-bazaar/dto/interface/big-bazaar.purchase.order.dto';
import { IBigBazaarPurchaseOrderItemsDto } from '../big-bazaar/dto/interface/big-bazaar.purchase.order.items.dto';
import { TemplateMapperInfoDto } from '../big-bazaar/dto/template-mapper-dto';

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

  async getAllPurchaseOrderMaster(page: string = '2'): Promise<Array<TemplateMapperInfoDto>> {
    try {
      return new Promise((resolve, reject) => {
        const offset = this.helper.getOffset(parseInt(page), this.config.listPerPage);
        console.log(offset, this.config.listPerPage);
        const selectQuery = `select * from purchase_order_master 
        where purchase_order_number IS NOT NULL 
        LIMIT ${offset},${this.config.listPerPage}
        `;
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

  async getAllPurchaseOrderDetailsById(purchaeOrderMasterId: number): Promise<Array<TemplateMapperInfoDto>> {
    try {
      return new Promise((resolve, reject) => {
          const selectQuery = `select * from purchase_order_details where purchase_order_master_id = ${purchaeOrderMasterId}`;
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

  async updatePurchaseOrderMaster(poData: IBigBazaarPurchaseOrderDto) {
    try {
      // update po master
      await this.updatePurchaseOrderMasterInfo(poData).then((value) => {
        this.addPurchaseOrderDetails(poData,poData.Items);;
      },(error) => {
        console.log(error);
      });
     // const r = await this.updatePurchaseOrderMasterInfo(poData);

    } catch (error) {
      const {message} = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
   
  }

  private getOrderDetailInsertQuery(): string {
    const query = `INSERT INTO purchase_order_details (
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
      hsn,
      mrp,
      created_at
     ) VALUES ?`;
    return query;
  }
  addPurchaseOrderDetails(poMaster: IBigBazaarPurchaseOrderDto, list: Array<IBigBazaarPurchaseOrderItemsDto>) {
    try {
      return new Promise((resolve, reject) => {
        if(list && list.length <= 0){
          return reject("Purchase Order Item not foun for Master ID:" + poMaster.Id);
        }
      // if( poItem.ArticleCode) {
      //   poItem.ArticleCode = poItem.ArticleCode.replace('\n', '');
      // }
      // if(poItem.ArticleEAN) {
      //   poItem.ArticleEAN = poItem.ArticleEAN.replace('\n', '');
      // }
      // TBD header get added when PO items more than 1 page...
      //if(poItem.ArticleCode !== 'Article Code' && poItem.ArticleEAN !== 'Article EAN') {
        const pool = this.db.getConnectionPool();
        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        pool.query(this.getOrderDetailInsertQuery(),
          [list.map(poItem => [
                `${poMaster.Id}`,
                `${poMaster.OrderType}`,
                `${poMaster.SalesOrg}`,
                `${poMaster.DistChannel}`,
                `${poMaster.Division}`,
                `${poMaster.SoldToParty}`,
                `${poMaster.ShipToParty}`,
                `${poMaster.PurchaseOrderNumber}`,
                `${poMaster.PurchaseOrderDate}`,
                `${poMaster.ValidTo}`,
                `${poItem.SAPMatCode}`,
                `${poItem.ArticleCode}`,
                `${poItem.ArticleEAN}`,
                `${poItem.DescriptionOfGoods}`,
                `${poItem.Quantity}`,
                `${poItem.UnitOfMeasure}`,
                `${poItem.BasicCost}`,
                `${poItem.TaxableAmount}`,
                `${poItem.SGST_Rate}`,
                `${poItem.SGST_Amount}`,
                `${poItem.CGST_Rate}`,
                `${poItem.CGST_Amount}`,
                `${poItem.TotalAmount}`,
                `${poItem.HSN}`,
                `${poItem.MRP}`,
                createdAt
              ])
          ],(err: any,results: any) => {
          if(err){
            return reject(err);
          }
           console.log(results);      
           return resolve(results);
          });
      });
    } catch (error) {
      console.log(error);
      const {message} = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
    
  }

  async getCustomerBySenderEmailId(purchaseOrderFromEmailId: string) {
    try {
      
      return new Promise((resolve, reject) => {
        const splitResult = purchaseOrderFromEmailId.split('@');
        if(splitResult && splitResult.length > 0) {
          const email = splitResult[0].toUpperCase()
          const domainName: string = splitResult[1].toUpperCase();
          const selectQuery = `SELECT id,sender_email_id,domain_name FROM customer_information 
          where UPPER(domain_name) = "${domainName}"`;
          this.db.getConnectionPool().query(selectQuery,(err,results) => {
            if(err){
              return reject(err);
            }
             console.log(results); 
            // TBD:: sender_email_id Logic
            let customerId = 0;
            if(results && results.length > 0) {
              results.map((item: any) => {
                if(item.sender_email_id) {
                  if(item.sender_email_id.trim().toUpperCase().indexOf(purchaseOrderFromEmailId.trim().toUpperCase()) !== -1) {
                    customerId = item.id;
                  }
                }
              });
              if(customerId != 0) {
                return resolve(customerId);
              }
              else {
                return reject("Invalid sender email id, customer not found!");
              }
            }
            else {
              return reject("Invalid sender email id, domain not found!");    
            }
            
          });
        } else {
          return reject("Invalid sender email id.");
        }
      });
    } catch (error) {      
      const {message} = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  async getTemplateOrderItemDetailsByCustomerId(customerId: number): Promise<Array<TemplateMapperInfoDto>> {
    try {
      return new Promise((resolve, reject) => {
          const selectQuery = `select fm.* from output_field_mapper as fm 
          where fm.is_header = 0
          AND fm.customer_id = ${customerId}`;
          this.db.getConnectionPool().query(selectQuery,(err,results) => {
            if(err){
              return reject(err);
            }
            console.log(results);      
            return resolve(this.getTemplateDetails(results, 'DETAILS'));
          });
      });
    } catch (error) {      
      const {message} = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  async getTemplateHeaderDetailsByCustomerId(customerId: number): Promise<Array<TemplateMapperInfoDto>> {
    try {
      return new Promise((resolve, reject) => {
          const selectQuery = `SELECT md.* FROM mapper_detail as md 
          where md.is_header = 1
          AND md.customer_id = ${customerId}`;
          this.db.getConnectionPool().query(selectQuery,(err,results) => {
            if(err){
              return reject(err);
            }
            console.log(results);      
            return resolve(this.getTemplateDetails(results, 'HEADER'));
          });
      });
    } catch (error) {      
      const {message} = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  async getAllOpenPurchaseOrders() {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `SELECT id,message_id, purchase_order_number, 
        json_file_name, json_file_path,email_from,
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
              purchase_order_number = '${poMaster.PurchaseOrderNumber}',            
              is_json_parsed = true,
              customer_id = ${poMaster.CustomerId},
              updated_at = CURDATE()
            WHERE
              id = ${poMaster.Id}
          `,(err,results) => {
          if (err) {
            reject("Error in updating PO Master with id:" + poMaster.Id)
          }
          return resolve(results.affectedRows);
        })
      })
      
    } catch (error) {
      const {message} = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  private getTemplateDetails(response: any, type: string): Array<TemplateMapperInfoDto> {
    const list = new Array<TemplateMapperInfoDto>();
    if(response && response.length > 0) {
        response.map((item: any) => {
          if(type === 'HEADER') {
            const obj = new TemplateMapperInfoDto();
            obj.Id = item.id;
            obj.CustomerId = item.customer_id;
            obj.IsHeader = item.is_header;
            obj.InputFieldName = item.input_field_name;
            obj.OutputFieldName = item.output_field_name;
            obj.SeparatedBy = item.separated_by;
            obj.MapperIndex = item.mapper_index;
            obj.SearchTerm = item.search_term;
            //obj.ColumnIndex = -1;
            //obj.GroupName = '';                        
            list.push(obj);
          }
          else {
            const obj = new TemplateMapperInfoDto();
            obj.Id = item.id;
            obj.CustomerId = item.customer_id;
            obj.IsHeader = item.is_header;
            obj.OutputFieldName = item.name;
            // TBD :: ALL imp for processing JSON
            // throw an error if not a valid data..
            if(item.column_index && item.column_index > 0) {
              obj.ColumnIndex = (item.column_index - 1);
            }
            if(item.table_column_count && item.table_column_count > 0) {
              obj.OrderItemTableCount = (item.table_column_count);
            }
            obj.FieldCount = item.field_count;
            list.push(obj);
            //obj.SeparatedBy = item.separated_by;
            //obj.MapperIndex = item.mapper_index;
            //obj.InputFieldName = item.input_field_name;
            //obj.InputFieldName = item.input_field_name;
          }
            
        });
    }
    return list;
  }
}