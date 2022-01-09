import { BaseMapperManagerDto } from "./base.mapper.manager.dto";

export class OutputFieldDto extends BaseMapperManagerDto {
    Id: number;
    CustomerId: number;
    Name: string;
    IsHeader: boolean;
    ColumnIndex: number = -1;
    CellFieldCount = 0;
    IsExist: boolean = false;    
    constructor(id: number, name: string, 
        isHeader: boolean, 
        columnIndex: number,
        customerId: number, 
        cellFieldCount: number) {       
        super(); 
        this.Id = id;
        this.CustomerId = customerId;
        this.Name = name;
        this.IsHeader = isHeader;
        this.ColumnIndex = columnIndex;
        this.CellFieldCount = cellFieldCount;
    }
}