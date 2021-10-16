import { IBigBazaarPurchaseOrderItemsDto } from "./big-bazaar.purchase.order.items.dto";
import { IBigBazaarPurchaseOrderItemsHeader } from "./big-bazaar.purchase.order.items.header";

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
    ItemsHeader: Array<string>;
    Items: Array<IBigBazaarPurchaseOrderItemsDto>;
    ItemColumnHeaders: Array<IBigBazaarPurchaseOrderItemsHeader>;
    MesageId: number;
    IsPdfConvertedToJson: boolean;
    JsonFile: string;
    JsonFilePath: string;
}

//SAP Mat code	Article EAN	Article Code	Description of Goods	Quantity	UoM	Storage Location	Plant	Order reason	Condition Type	Taxable Amount
