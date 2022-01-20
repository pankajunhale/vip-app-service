import { IBigBazaarPurchaseOrderItemsDto } from "./interface/big-bazaar.purchase.order.items.dto";

export class BigBazaarPurchaseOrderItemsDto implements IBigBazaarPurchaseOrderItemsDto {
    Id: number;
    PurchaseOrderMasterId: number;
    SAPMatCode: string;
    ArticleEAN: string;
    ArticleCode: string;
    DescriptionOfGoods: string;
    Quantity: string;
    UnitOfMeasure: string;
    TaxableAmount: string;
    HSN: string;
    MRP: string;
    BasicCost: string;
    SGST_Rate: string;
    SGST_Amount: string;
    CGST_Rate: string;
    CGST_Amount: string;
    TotalAmount: string;

    constructor() {
        this.Id = 0;
        this.PurchaseOrderMasterId = 0;
        this.SAPMatCode= "";
        this.ArticleEAN= "";
        this.ArticleCode = "";
        this.DescriptionOfGoods= "";
        this.Quantity= "";
        this.UnitOfMeasure= "";
        this.TaxableAmount= "";
        this.HSN = "";
        this.MRP= ""
        this.BasicCost = "";
        this.SGST_Rate = "";
        this.SGST_Amount = "";
        this.CGST_Rate = "";
        this.CGST_Amount = "";
        this.TotalAmount = "";
    }
    
    

}