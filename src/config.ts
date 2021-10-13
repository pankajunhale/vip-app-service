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
          password: 'SQL123456',
          database: 'vip-po-automation-dev-db',
          waitForConnections: true,
          connectionLimit: 2,
          queueLimit: 0,
          debug: false,
          port: 3306
        },
        listPerPage:10
      }
    }
}

