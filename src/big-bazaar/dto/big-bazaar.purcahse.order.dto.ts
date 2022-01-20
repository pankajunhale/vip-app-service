import { IBigBazaarPurchaseOrderDto } from "./interface/big-bazaar.purchase.order.dto";
import { IBigBazaarPurchaseOrderItemsDto } from "./interface/big-bazaar.purchase.order.items.dto";
import { IBigBazaarPurchaseOrderItemsHeader } from "./interface/big-bazaar.purchase.order.items.header";
import { TemplateMapperInfoDto } from "./template-mapper-dto";

export class BigBazaarPurchaseOrderDto implements IBigBazaarPurchaseOrderDto {
    Id: number;
    CustomerId = 0;
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
    ItemsHeader: string[];
    Items: IBigBazaarPurchaseOrderItemsDto[];
    ItemColumnHeaders: Array<IBigBazaarPurchaseOrderItemsHeader>
    MesageId: number;
    IsPdfConvertedToJson: boolean;
    JsonFile: string;
    JsonFilePath: string;
    PurchaseOrderMasterId: number;
    TemplateMappingInformation: Array<TemplateMapperInfoDto>;
    TemplateHeaderLabel: Array<TemplateMapperInfoDto>;
    TemplateItemLabel: Array<TemplateMapperInfoDto>;

    constructor() {
        this.Id = 0;
        this.PurchaseOrderMasterId = 0;
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
        this.ItemsHeader = [];
        this.ItemColumnHeaders = [];
        this.Items = [];
        this.MesageId = 0;
        this.IsPdfConvertedToJson = false;
        this.JsonFile = '';
        this.JsonFilePath = '';
        this.TemplateMappingInformation = [];
        this.TemplateHeaderLabel = [];
        this.TemplateItemLabel = [];
        this.init();
    }

    private init() {
       // Order Type	Sales rg	Dist Ch	Div
       this.OrderType = "ZQHT";
       this.SalesOrg = "VIPL";
       this.DistChannel = "MT";
       this.Division = "HL";
    }
}
    
