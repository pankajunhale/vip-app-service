export class CustomerValidationInfoDto {
  
    DUPLICATE_CUSTOMER = 'DUPLICATE_CUSTOMER';
    DUPLICATE_DOMAIN = 'DUPLICATE_DOMAIN';
    DUPLICATE_SENDER_ID = 'DUPLICATE_SENDER_ID';
    INVALID_FILE_EXTENSION = 'INVALID_FILE_EXTENSION';
    EMPTY_FILE = 'EMPTY_FILE';

    ERROR_CODE_INFO: Array<any> = [
        { key: this.DUPLICATE_CUSTOMER ,errorCode:452, message: 'Customer already exist.'},
        { key: this.DUPLICATE_DOMAIN , errorCode:453, message: 'Customer domain already exist, please enter unique sender email id.'},
        { key: this.DUPLICATE_SENDER_ID, errorCode:454, message: 'Customer domain with sender emailId already exist.'},
        { key: this.INVALID_FILE_EXTENSION ,errorCode:455, message: 'Invalid file format, only PDF files are allowed.'},
        { key: this.EMPTY_FILE, errorCode:456, message: 'Invalid file format, file is empty.'}
    ];
    constructor () {}

    getErrorByCode(errorKey: string) {
        return this.ERROR_CODE_INFO.find((item: any) => {
            return (item.key === errorKey)
        })
    }
}