import bigBazaarDao from '../dao/big-bazaar.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { IBigBazaarPurchaseOrderDto } from '../dto/interface/big-bazaar.purchase.order.dto';
import { BigBazaarPurchaseOrderDto } from '../dto/big-bazaar.purcahse.order.dto';
import shortid from 'shortid';
import { FilterPurchaseOrderRequest } from '../../common/filter.purchase-order';

class BigBazaarService implements CRUD {

    async create(resource: IBigBazaarPurchaseOrderDto) {
        const jsonFile = `BB-PO-1.json`;
        try {
            return bigBazaarDao.processAndCreatePO(jsonFile);
        } catch (error) {
            throw new Error(`Error in processing Purchase Order - ${jsonFile}`);
        }
    }

    async list(reqObj: FilterPurchaseOrderRequest) {
        return bigBazaarDao.getPurchaseOrders();
    }

    async readById(id: string) {
        const obj = new BigBazaarPurchaseOrderDto();
        obj.Id = shortid.generate();
        obj.PurchaseOrderNumber = "4527230340";
        return obj;
    }

    async deleteById(id: string) {
        return "";
    }
}

export default new BigBazaarService();
