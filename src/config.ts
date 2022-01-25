import * as dotenv from "dotenv";
export class DBConfig {

    constructor() {
      dotenv.config();
    }
    config = (): any => {
      console.log('dotenv:',process.env.DB_PORT);
      return this.getConfig();
    }
    
    private developmentConfig() {
      return {
        db: {
          host: 'localhost',
          user: 'root',
          password: 'vip@123456',
          database: 'vip-po-automation-dev-db',
          port: 3306
        },
        listPerPage:10
      }
    }


    /* 
      Use QA config, when hosted on QA/Testing/integration server 
    */
    private qaConfig() {
      return {
        db: {
          host: '148.72.214.82',
          user: 'root',
          password: '123456',
          database: 'vip-po-automation-dev-db',
          port: 3306
        },
        listPerPage:10
      }
    }

    
    /* 
      Use Prod config, when hosted on Prodcution server 
    */
    private prodConfig() {
      return {
        db: {
          host: 'localhost',
          user: 'root',
          password: 'vip@123456',
          database: 'vip-po-automation-dev-db',
          port: 3306
        },
        listPerPage:10
      }
    }


    private getConfig() {
      return {
        db: {
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB,
          port: process.env.DB_PORT
        },
        listPerPage:10
      }
    }
}

