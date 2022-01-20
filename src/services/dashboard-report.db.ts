  import { DB } from './db';
import { DB_Helper } from './helper';
import { DBConfig } from '../config';

export class DashboardReportDb {
  db = new DB();
  config = new DBConfig().config();
  helper = new DB_Helper();
  constructor() { }

  
  async findTotalCustomers(): Promise<number> {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `select COUNT(*) as total_customers from customer_information`;
        this.db.getConnectionPool().query(selectQuery, (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results[0].total_customers);
        });
      });
    } catch (error) {
      const { message } = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  async findTotalOrders(): Promise<number> {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `select COUNT(*) as total_orders from purchase_order_master`;
        this.db.getConnectionPool().query(selectQuery, (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results[0].total_orders);
        });
      });
    } catch (error) {
      const { message } = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  async findTotalSuccessfullyProcessedOrders(model: any): Promise<number> {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `select COUNT(*) as total_orders 
        from purchase_order_master 
        where purchase_order_number IS NOT NULL AND is_json_parsed = 1
        ${this.getBetweenClause(model)}`;
        this.db.getConnectionPool().query(selectQuery, (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results[0].total_orders);
        });
      });
    } catch (error) {
      const { message } = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  async findTotalFailedOrders(model: any): Promise<number> {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `select COUNT(*) as total_orders from purchase_order_master 
        where purchase_order_number IS NULL
        ${this.getBetweenClause(model)}`;

        this.db.getConnectionPool().query(selectQuery, (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results[0].total_orders);
        });
      });
    } catch (error) {
      const { message } = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  async findTotalDowonloadedOrders(model: any): Promise<number> {
    try {
      return new Promise((resolve, reject) => {
        
        const selectQuery = `select COUNT(*) as total_downloads from purchase_order_master 
        where is_pdf_downloaded = 1 
        ${this.getBetweenClause(model)}`;
        this.db.getConnectionPool().query(selectQuery, (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results[0].total_downloads);
        });
      });
    } catch (error) {
      const { message } = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  // todays data
  async findTodaysOrders(): Promise<number> {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `select COUNT(*) as total_orders from purchase_order_master 
        where DATE(created_at) = CURDATE()`;
        this.db.getConnectionPool().query(selectQuery, (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results[0].total_orders);
        });
      });
    } catch (error) {
      const { message } = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  async findTodaysSuccessfullyProcessedOrders(): Promise<number> {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `select COUNT(*) as total_orders from purchase_order_master 
        where DATE(created_at) = CURDATE() 
        AND purchase_order_number IS NOT NULL 
        AND is_json_parsed = 1`;
        this.db.getConnectionPool().query(selectQuery, (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results[0].total_orders);
        });
      });
    } catch (error) {
      const { message } = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  async findTodaysFailedOrders(): Promise<number> {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `select COUNT(*) as total_orders from purchase_order_master 
        where DATE(created_at) = CURDATE() AND purchase_order_number IS NULL`;
        this.db.getConnectionPool().query(selectQuery, (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results[0].total_orders);
        });
      });
    } catch (error) {
      const { message } = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  // customer info
  async findTopFiveCustomers(model: any): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        // const selectQuery = `SELECT *,DATE_FORMAT(created_at, '%d-%M-%Y') as formatted_created_at 
        // FROM customer_information
        // ORDER BY created_at DESC LIMIT 5`;
        const selectQuery = `SELECT DISTINCT(email_from) FROM purchase_order_master
        WHERE DATE(created_at) BETWEEN '${model.startDate}' AND '${model.endDate}'
        ORDER BY created_at DESC LIMIT 5`;
        this.db.getConnectionPool().query(selectQuery, (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        });
      });
    } catch (error) {
      const { message } = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  async findTopFivePurchaseOrderByCustomerDomain(isFindOnlyDownloaded: boolean,domainName: string, isDownloaded: number, isParsed: number, model: any): Promise<number> {
    try {
      return new Promise((resolve, reject) => {
        let selectQuery = '';
        if(!isFindOnlyDownloaded) {
          selectQuery = `select count(*) as total_count from purchase_order_master where 
          email_from LIKE '%${ domainName.toLowerCase() }%'
          AND is_pdf_downloaded = ${isDownloaded} 
          AND is_json_parsed = ${isParsed}
          ${this.getBetweenClause(model)}`;
        }
        else {
          selectQuery = `select count(*) as total_count from purchase_order_master where 
          email_from LIKE '%${ domainName.toLowerCase() }%'
          AND is_pdf_downloaded = ${isDownloaded}         
          ${this.getBetweenClause(model)}`;
        }
        
        this.db.getConnectionPool().query(selectQuery, (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results[0].total_count);
        });
      });
    } catch (error) {
      const { message } = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }
  // recent PO

  async findTopFivePurchaseOrders(model: any): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `SELECT id,email_From,pdf_file_name,purchase_order_number,DATE_FORMAT(created_at, '%d-%M-%Y') as formatted_created_at FROM purchase_order_master
        WHERE purchase_order_number IS NOT NULL 
        ${this.getBetweenClause(model)}
        ORDER BY created_at DESC
        LIMIT 5`;
        this.db.getConnectionPool().query(selectQuery, (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        });
      });
    } catch (error) {
      const { message } = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  async filterPurchaseOrderInformation(userId: any,objRequest: any): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `CALL sp_filter_purchase_order_data(?,?,?,?,?,?,?,?,?,?)`;
        this.db.getConnectionPool().query(selectQuery,[
          userId,
          objRequest.PageIndex,
          objRequest.PageSize,
          objRequest.SearchTerm ? objRequest.SearchTerm : null,
          objRequest.StartDate,
          objRequest.EndDate,
          objRequest.DomainName ? objRequest.DomainName : null,
          objRequest.IsPODownloaded,
          objRequest.IsPOParsed,
          objRequest.PoStatus
        ], (err, results) => {
          if (err) {
            return reject(err);
          }
          const data = {
            recordCount: results[0][0]['total_records'],
            purchaseOrders: results[1]
          }
          return resolve(data);
        });
      });
    } catch (error) {
      const { message } = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  async findAllDistinctEmailList(): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `SELECT DISTINCT(email_from) from purchase_order_master `;
        this.db.getConnectionPool().query(selectQuery, (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        });
      });
    } catch (error) {
      const { message } = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  private getBetweenClause(model: any) {
    const clause = `AND DATE(created_at) BETWEEN '${model.startDate}' AND '${model.endDate}'`;
    return clause;
  }

}