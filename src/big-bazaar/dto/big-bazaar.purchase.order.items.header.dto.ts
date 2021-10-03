import { IBigBazaarPurchaseOrderItemsHeader } from "./interface/big-bazaar.purchase.order.items.header";

export class BigBazaarPurchaseOrderItemsHeader implements IBigBazaarPurchaseOrderItemsHeader {
    index = -1;
    hasSeparator = false;
    name = '';
    splitBy: string;
    columnIndex = -1;

    constructor (splitBy: string) {
        this.splitBy = splitBy;
    }

    findIndex(columnName: string,columnList: Array<string>): number {
        let colIndex = -1;
        columnList.map((item, index) => {
            item = item.toLowerCase().trim();
            columnName = columnName.toLowerCase().trim();
            if(item.indexOf(columnName) !== -1) {
                colIndex = index;
            }
        })
        return colIndex;
    }
  
    findColumnIndex(columnName: string, columnList: Array<string>): number {
        let colIndex = -1;
        columnList.map((item, index) => {
            if(item.toLowerCase().trim() === columnName.toLowerCase().trim()) {
                colIndex = index;
            }
        })
        return colIndex;
    }
} 