import { DB } from './db';
import { DB_Helper } from './helper';
import { DBConfig } from '../config';
import { CustomerValidationInfoDto } from '../customer/dto/customer-validation-info.dto';
import express from 'express';
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

  async isCustomerAlreadyExist(model: any, action: string): Promise<boolean> {
    try {
      return new Promise((resolve, reject) => {
        let selectQuery = '';
        if(action === 'CREATE') {
          selectQuery = `SELECT * FROM customer_information where LOWER(name) = '${ model.Name.toLowerCase() }' `;
        }
        else {
          selectQuery = `SELECT * FROM customer_information where LOWER(name) = '${ model.Name.toLowerCase() }' AND id != ${model.Id}`;
        }
        
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

  async isCustomerDomainExist(model: any, action: string): Promise<boolean> {
    try {
      return new Promise((resolve, reject) => {
        let selectQuery = '';
        if(action === 'CREATE') {
          selectQuery = `SELECT * FROM customer_information where LOWER(domain_name) = '${ model.DomainName.toLowerCase() }' `;
        }
        else {
          selectQuery = `SELECT * FROM customer_information where LOWER(domain_name) = '${ model.DomainName.toLowerCase() }' AND id != ${model.Id}`;
        }
        
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

  async isDomainAndSenderEmailDomainValid(model: any, action: string): Promise<boolean> {
    try {
      return new Promise((resolve, reject) => {
        let selectQuery = '';
        if(action === 'CREATE') {
          selectQuery = `SELECT * FROM customer_information 
          where LOWER(domain_name) = '${ model.DomainName.toLowerCase() }' 
          AND LOWER(sender_email_id) LIKE '%${ model.SenderEmailId.toLowerCase() }%'`;
        }
        else {
          selectQuery = `SELECT * FROM customer_information 
          where LOWER(domain_name) = '${ model.DomainName.toLowerCase() }'
          AND LOWER(sender_email_id) LIKE '%${ model.SenderEmailId.toLowerCase() }%'
          AND id != ${model.Id}`;
        }
        
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
      const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
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
        `${model.PurchaseOrderPdfTemplate}`,        
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

  async validateCustomerBeforeSaving( action: string, model: any,res: express.Response): Promise<any> {
    const objErrorMessage = new CustomerValidationInfoDto();
    const isCustomerDuplicate: boolean = await this.isCustomerAlreadyExist(model, action);
    if(isCustomerDuplicate) {                
        return res.status(500).send({data: objErrorMessage.getErrorByCode(objErrorMessage.DUPLICATE_CUSTOMER)});
    }
    const isCustomerDomainDuplicate: boolean = await this.isCustomerDomainExist(model, action);
    if(isCustomerDomainDuplicate) {                
        return res.status(500).send({data: objErrorMessage.getErrorByCode(objErrorMessage.DUPLICATE_DOMAIN)});
    }
    const isCustomerDomainAndSenderEmailValid: boolean = await this.isDomainAndSenderEmailDomainValid(model, action);
    if(isCustomerDomainAndSenderEmailValid) {                
        return res.status(500).send({data: objErrorMessage.getErrorByCode(objErrorMessage.DUPLICATE_SENDER_ID)});
    }
}

  private getInsertQuery = () => {
    const sql = `INSERT INTO customer_information (
      name,
      short_name,
      domain_name,
      address,
      country_id,
      state_id,
      city_id,
      purchase_order_pdf_template,
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
// ER_CON_COUNT too many connnections
//https://devdotcode.com/complete-guide-to-build-a-restful-api-with-node-js-and-express/