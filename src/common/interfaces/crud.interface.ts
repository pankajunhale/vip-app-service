import { IBigBazaarPurchaseOrderDto } from "../../big-bazaar/dto/interface/big-bazaar.purchase.order.dto";
import { FilterPurchaseOrderRequest } from "../filter.purchase-order";

export interface CRUD {
    list: (reqObj: FilterPurchaseOrderRequest) => Promise<IBigBazaarPurchaseOrderDto[]>;
    create: (resource: any) => Promise<IBigBazaarPurchaseOrderDto>;
    readById: (id: string) => Promise<IBigBazaarPurchaseOrderDto>;
    deleteById: (id: string) => Promise<string>;
}
