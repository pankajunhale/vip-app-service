export class FilterCustomerRequest {
    SearchTerm:string = '';
    PageSize = 10;
    PageIndex = 0;
    StartDate:string = '';
    EndDate:string = '';
    
    constructor() {

    }
}