import mySql from 'mysql';
const env = process.env.SERVER;
export class DBConfig {

    constructor() {
    }
    config = (): any => {
      console.log('current env:',env);
      switch (env) {
        case 'development':
          return this.developmentConfig();          
          case 'qa':
            return this.qaConfig();          
      }
      
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
}

