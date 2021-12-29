import { DB } from './db';
import { DB_Helper } from './helper';
import { DBConfig } from '../config';
import { MapperInfoDto } from '../mapper-manager/dto/mapper-info.dto';
import { OutputFieldDto } from '../mapper-manager/dto/output-field.dto';

export class MapperManagerDb {
  db = new DB();
  config = new DBConfig().config();
  helper = new DB_Helper();
  constructor() { }

  async find(customerId: number) {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `SELECT * FROM mapper_detail where customer_id = ${customerId}`;
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

  async findAllOutputFields(customerId: number) {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `SELECT * FROM output_field_mapper where customer_id = ${customerId}`;
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

  insertMapperInformation = (mapperList: Array<MapperInfoDto>) => {
    return new Promise((resolve, reject) => {
      const pool = this.db.getConnectionPool();
      const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      pool.query(this.getInsertQuery(),
        [mapperList.map(model => [
          model.CustomerId,
          model.IsHeader,
          `${model.InputFieldName}`,
          `${model.OutputFieldName}`,
          `${model.SeparatedBy}`,
          `${model.MapperIndex}`,
          model.ColumnIndex,
          `${model.GroupName}`,
          model.FieldCount,
          model.CreatedBy,
          createdAt
        ])
        ], (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result.insertId);
        });
    });
  };

  deleteExistingOutputFields = (customerId: number, isHeader: number) => {
    return new Promise((resolve, reject) => {
      const selectQuery = `DELETE FROM output_field_mapper where customer_id = ${customerId} AND is_header = ${isHeader}`;
      this.db.getConnectionPool().query(selectQuery, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  };

  insertOutputFieldInformation = (mapperList: Array<OutputFieldDto>) => {
    return new Promise((resolve, reject) => {
      const pool = this.db.getConnectionPool();
      const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      pool.query(this.getOutputFieldMapperInsertQuery(),
        [mapperList.map(model => [
          model.CustomerId,
          model.IsHeader,
          `${model.Name}`,
          `${model.CellFieldCount}`,
          `${model.ColumnIndex}`,
          model.CreatedBy,
          createdAt
        ])
        ], (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result.insertId);
        });
    });
  };

  private getOutputFieldMapperInsertQuery = () => {
    const sql = `INSERT INTO output_field_mapper (        
        customer_id,
        is_header,
        name,
        column_index,
        field_count,            
        created_by,
        created_at
    ) VALUES ?`;
    return sql;
  }

  private getInsertQuery = () => {
    const sql = `INSERT INTO mapper_detail (        
          customer_id,
          is_header,
          input_field_name,
          output_field_name,
          separated_by,
          mapper_index,
          column_index,
          group_name,
          field_count,            
          created_by,
          created_at
      ) VALUES ?`;
    return sql;
  }

}