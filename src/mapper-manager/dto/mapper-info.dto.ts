import { BaseMapperManagerDto } from "./base.mapper.manager.dto";

export class MapperInfoDto extends BaseMapperManagerDto {
    Id: number = 0;
    CustomerId: number = 0;
    InputFieldName: string = '';
    OutputFieldName: string = '';    
    OutputFieldId: number = 0;
    SeparatedBy: string = '';
    MapperIndex: string = '';
    CustomerName: string = '';
    IsHeader: boolean = false;
    GroupName: string = '';        
    ColumnIndex: number = -1;
    FieldCount: number = 0;

    constructor() {
        super();
    }

}