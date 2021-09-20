import { IBigBazaarPurchaseOrderDto } from "./interface/big-bazaar.purchase.order.dto";
import { IBigBazaarPurchaseOrderItemsDto } from "./interface/big-bazaar.purchase.order.items.dto";

export class BigBazaarPurchaseOrderDto implements IBigBazaarPurchaseOrderDto {
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
    Items: IBigBazaarPurchaseOrderItemsDto[];

    constructor() {
        this.Id = '';
        this.PurchaseOrderNumber= '';
        this.SoldToParty= '';
        this.ShipToParty= '';
        this.PurchaseOrderDate= '';
        this.ValidTo= '';
        this.OrderType= '';
        this.SalesOrg= '';
        this.DistChannel= '';
        this.Division= '';
        this.StorageLocation= '';
        this.Plant= '';
        this.OrderReason= '';
        this.ConditonType= '';
        this.Items = [];
        this.init();
    }

    private init() {
       // Order Type	Sales rg	Dist Ch	Div
       this.OrderType = "SOME-CONSTANT";
       this.SalesOrg = "SOME-CONSTANT";
       this.DistChannel = "SOME-CONSTANT";
       this.Division = "SOME-CONSTANT";
    }
}
    
