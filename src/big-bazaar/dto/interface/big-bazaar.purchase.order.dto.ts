import { IBigBazaarPurchaseOrderItemsDto } from "./big-bazaar.purchase.order.items.dto";

export interface IBigBazaarPurchaseOrderDto {
    Id: string;
    PurchaseOrderNumber: string;
    SoldToParty: string;
    ShipToParty: string;
    PurchaseOrderDate: string;
    ValidTo: string;
    OrderType: string;
    SalesOrg: string;
    DistChannel: string;
    Division: string;
    StorageLocation: string;
    Plant: string;
    OrderReason: string;
    ConditonType: string;
    Items: Array<IBigBazaarPurchaseOrderItemsDto>
}

//SAP Mat code	Article EAN	Article Code	Description of Goods	Quantity	UoM	Storage Location	Plant	Order reason	Condition Type	Taxable Amount
