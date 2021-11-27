import mySql from 'mysql';
const env = process.env;

export class DBConfig {

    constructor() {
    }
    config = () => {
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

