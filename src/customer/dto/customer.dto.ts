import { BaseCustomerDto } from "./base.customer.dto";

export class CustomerDto extends BaseCustomerDto {
    Id = 0;
    Name = '';
    Address = '';
    Country = '';
    ShortName = '';
    DomainName = '';
    PurchaseOrderPdfTemplate = '';
    PurchaseOrderJsonTemplate = '';
    IsPdfConvertedToJson = false;
    State = '';
    City = '';
    CountryId = '';
    StateId = '';
    CityId = '';
    CustomerContactName = '';
    CustomerContactNumber = '';
    CustomerContactEmail = '';
    SenderEmailId = '' //TBD -move into table - time being saved as comma separated
    IsPdfTemplateMapped = false;
    
    constructor() {
        super();
    }
}