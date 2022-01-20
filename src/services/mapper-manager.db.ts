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

  async findAllOutputFieldsForDetails(customerId: number) {
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

  async findAllOutputFieldsForHeader(customerId: number) {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `SELECT *, md.output_field_name as name FROM mapper_detail as md where md.customer_id = ${customerId}`;
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

  async isOutputFieldAlreadyExist(customerId: number, id: number): Promise<boolean>  {
    try {
      return new Promise((resolve, reject) => {
        const selectQuery = `SELECT * FROM output_field_mapper where id = ${id} AND customer_id = ${customerId}`;
        this.db.getConnectionPool().query(selectQuery, (err, results) => {
          if (err) {
            return reject(err);
          }
          const isExist = (results.length === 1 ? true : false);  
          return resolve(isExist);
        });
      });
    } catch (error) {
      const { message } = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  deleteExistingMapperInformation = (customerId: number) => {
    return new Promise((resolve, reject) => {
      const selectQuery = `DELETE FROM mapper_detail where customer_id = ${customerId}`;
      this.db.getConnectionPool().query(selectQuery, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  };

  insertMapperInformation = (mapperList: Array<MapperInfoDto>) => {
    return new Promise((resolve, reject) => {
      const pool = this.db.getConnectionPool();
      const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      pool.query(this.getInsertQuery(),
        [mapperList.map(model => 
          [
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
            createdAt,
            `${model.SearchLabel}`
          ]
        )
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

  saveOutputFieldInformation = (mapperList: Array<OutputFieldDto>, id: number, customerId: number ) => {
    mapperList.map((item: OutputFieldDto) => {
      this.isOutputFieldAlreadyExist(customerId, id).then((isExist: boolean) => {
        item.IsExist = isExist;
      })     
    })
  }
  insertOutputFieldInformation = (mapperList: Array<OutputFieldDto>, orderItemTableColumnCount: number) => {
    return new Promise((resolve, reject) => {
      const pool = this.db.getConnectionPool();
      const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      pool.query(this.getOutputFieldMapperInsertQuery(),
        [mapperList.map(model => [
          model.CustomerId,
          model.IsHeader,
          `${model.Name}`,
          `${model.ColumnIndex}`,
          `${model.CellFieldCount}`,
          orderItemTableColumnCount,
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

  updateOutputFields(list: Array<OutputFieldDto>, orderItemTableColumnCount: number): Promise<any> {
    try {
      let myPromise: Promise<any>;
      return new Promise((resolve, reject) => {
        list.map((model: OutputFieldDto) => {
          const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
          myPromise = new Promise((resolve, reject) => {
            this.db.getConnectionPool().query(
              `UPDATE output_field_mapper 
                SET
                  name = "${model.Name}",
                  column_index = ${model.ColumnIndex},
                  field_count = ${model.CellFieldCount},
                  table_column_count = ${orderItemTableColumnCount},             
                  updated_by = ${model.CreatedBy},
                  updated_at = "${updatedAt}"
                WHERE
                  id = ${model.Id}
              `,(err,results) => {
                  if (err) {
                    return reject(err);            
                  }
                  return resolve(results.affectedRows);
            })
          });
        });
        myPromise.then((value) => {
          return resolve(value);
        }).catch((resaon) => {
          return reject(resaon);
        })
        
      })
      
      
    } catch (error) {      
      const {message} = error as unknown as any;
      throw new Error("Error in processing your request:" + message);
    }
  }

  getOutputFieldDataForSave (data: any, isExist: boolean): Array<OutputFieldDto> {
    let listOfFilteredHeaderInfo = new Array<OutputFieldDto>();
    if(data && data.length) {
        listOfFilteredHeaderInfo = data.filter((item: OutputFieldDto) => {
            return (item.IsExist === isExist);
        })
    }
    console.log('Filtered Result: ', listOfFilteredHeaderInfo);
    return listOfFilteredHeaderInfo;
  }
  private getOutputFieldMapperInsertQuery = () => {
    const sql = `INSERT INTO output_field_mapper (        
        customer_id,
        is_header,
        name,
        column_index,
        field_count,
        table_column_count,        
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
          created_at,
          search_term
      ) VALUES ?`;
    return sql;
  }

}