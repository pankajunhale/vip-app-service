import { BaseCustomerDto } from "./base.customer.dto";

export class SenderEmailDto extends BaseCustomerDto {
    Id = 0;
    Email = '';
    constructor() {
        super();
    }
}