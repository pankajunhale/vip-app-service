import { DB } from './db';
import { DB_Helper } from './helper';
import { DBConfig } from '../config';

export class CustomerDb {
  db = new DB();
  config = new DBConfig().config();
  helper = new DB_Helper();
  constructor() { }

  async find(customerId: number) {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `SELECT * FROM customer_information where id = ${ customerId }`;
        this.db.getConnectionPool().query(selectQuery,(err,results) => {
          if(err){
            return reject(err);
          }
          return resolve(results);
        });
      });
    } catch (error) {      
      const {message} = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  async findAll() {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `SELECT * FROM customer_information`;
        this.db.getConnectionPool().query(selectQuery,(err,results) => {
          if(err){
            return reject(err);
          }
          return resolve(results);
        });
      });
    } catch (error) {      
      const {message} = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  async isCustomerDomainExist(domainName: string) {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `SELECT * FROM customer_information where domain_name = '${ domainName.toLowerCase() }' `;
        this.db.getConnectionPool().query(selectQuery,(err,results) => {
          if(err){
            return reject(err);
          }
          let isExist = false;
          if(results.length) {
            isExist = true;
          } 
          return resolve(isExist);
        });
      });
    } catch (error) {      
      const {message} = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  async updateTemplateInfo(model: any) {
    try {
      const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      return new Promise((resolve, reject) => {
        this.db.getConnectionPool().query(
          `UPDATE customer_information 
            SET
              is_template_mapped = ${model.IsTemplateMapped}
              updated_by = ${model.UpdatedBy},
              updated_at = "${updatedAt}"
            WHERE
              id = ${model.Id}
          `,(err,results) => {
              if (err) {
                return reject(err);            
              }
              return resolve(results.affectedRows);
        })
      })
    } catch (error) {      
      const {message} = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  async updateCustomerInformaion(model: any) {
    try {
      const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      return new Promise((resolve, reject) => {
        this.db.getConnectionPool().query(
          `UPDATE customer_information 
            SET
              name = "${model.Name}",
              short_name = "${model.ShortName}",
              domain_name = "${model.DomainName.toLowerCase()}",
              address = "${model.Address}",
              country_id = ${model.CountryId},
              state_id = ${model.StateId},
              city_id = ${model.CityId},
              customer_contact_name = "${model.CustomerContactName}",
              customer_contact_email = "${model.CustomerContactEmail}",
              customer_contact_number = "${model.CustomerContactNumber}",
              sender_email_id = "${model.SenderEmailId}",              
              updated_by = ${model.UpdatedBy},
              updated_at = "${createdAt}"
            WHERE
              id = ${model.Id}
          `,(err,results) => {
              if (err) {
                return reject(err);            
              }
              return resolve(results.affectedRows);
        })
      })
      
    } catch (error) {
      const {message} = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  insertCustomer = (model: any) =>{
    return new Promise((resolve, reject)=>{
      const pool = this.db.getConnectionPool();
      const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const objCustomer = [
        `${model.Name}`,
        `${model.ShortName}`,
        `${model.DomainName.toLowerCase()}`,
        `${model.Address}`,
          model.CountryId,
          model.StateId,
          model.CityId,
        `${model.PurchaseOrderTemplate}`,        
        `${model.CustomerContactName}`,
        `${model.CustomerContactEmail}`,
        `${model.CustomerContactNumber}`,
        `${model.SenderEmailId}`,
          model.IsTemplateMapped,
          model.CreatedBy,               
          createdAt
      ];
      pool.query(this.getInsertQuery(), 
      objCustomer, (error, result)=>{
          if(error){
              return reject(error);
          }
          return resolve(result.insertId);
      });
    });
  };

  private getInsertQuery = () => {
    const sql = `INSERT INTO customer_information (
      name,
      short_name,
      domain_name,
      address,
      country_id,
      state_id,
      city_id,
      purchase_order_template,                                                        
      customer_contact_name,
      customer_contact_email,
      customer_contact_number,
      sender_email_id,
      is_template_mapped,
      created_by,
      created_at
     ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
     return sql;
  }


  
  
}