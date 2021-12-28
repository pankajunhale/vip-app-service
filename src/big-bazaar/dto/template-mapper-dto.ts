export class TemplateMapperInfoDto {
    Id:number = 0;
    CustomerId: number = 0;
    InputFieldName: string = '';
    OutputFieldName: string = '';    
    SeparatedBy: string = '';
    MapperIndex: string = '';
    ColumnIndex: number = -1;
    FieldCount: number = -1;    
    IsHeader: boolean = false;    
    GroupName: string = '';         
    constructor() {}
}