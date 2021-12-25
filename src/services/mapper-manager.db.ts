import { DB } from './db';
import { DB_Helper } from './helper';
import { DBConfig } from '../config';
import { MapperInfoDto } from '../mapper-manager/dto/mapper-info.dto';

export class MapperManagerDb {
    db = new DB();
    config = new DBConfig().config();
    helper = new DB_Helper();
    constructor() { }

    insertMapperInformation = (mapperList: Array<MapperInfoDto>) => {
        return new Promise((resolve, reject) => {
            const pool = this.db.getConnectionPool();
            const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
            pool.query(this.getInsertQuery(),
            [   mapperList.map(model => [
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