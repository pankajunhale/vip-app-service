import { IBigBazaarPurchaseOrderItemsDto } from "./interface/big-bazaar.purchase.order.items.dto";

export class BigBazaarPurchaseOrderItemsDto implements IBigBazaarPurchaseOrderItemsDto {
    SAPMatCode: string;
    ArticleEAN: string;
    ArticleCode: string;
    DescriptionOfGoods: string;
    Quantity: string;
    UnitOfMeasure: string;
    TaxableAmount: string;

    constructor() {
        this.SAPMatCode= "";
        this.ArticleEAN= "";
        this.ArticleCode = "";
        this.DescriptionOfGoods= "";
        this.Quantity= "";
        this.UnitOfMeasure= "";
        this.TaxableAmount= "";
    }

}