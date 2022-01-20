export class PurchaseOrderReportRequestDto {
    UserId: number = 0;
    PageIndex: number = 0;
    PageSize: number = 0;
    SearchTerm: string = '';
    StartDate: string = '';
    EndDate: string = '';
    DomainName: string = '';
    IsPODownloaded: number = 0;
    IsPOParsed: number = 0;
    constructor() {}
}