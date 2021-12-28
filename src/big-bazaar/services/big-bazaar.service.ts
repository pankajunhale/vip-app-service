import bigBazaarDao from '../dao/big-bazaar.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { IBigBazaarPurchaseOrderDto } from '../dto/interface/big-bazaar.purchase.order.dto';
import { BigBazaarPurchaseOrderDto } from '../dto/big-bazaar.purcahse.order.dto';
import shortid from 'shortid';
import { FilterPurchaseOrderRequest } from '../../common/filter.purchase-order';

class BigBazaarService implements CRUD {

    async create(model: IBigBazaarPurchaseOrderDto) {
        try {
            return bigBazaarDao.processAndCreatePO(model);
        } catch (error) {
            throw new Error(`Error in processing Purchase Order - ${model.JsonFile}`);
        }
    }

    async list(reqObj: FilterPurchaseOrderRequest) {
        return bigBazaarDao.getPurchaseOrders();
    }

    async readById(id: string) {
        const obj = new BigBazaarPurchaseOrderDto();
        return obj;
    }

    async deleteById(id: string) {
        return "";
    }

    async getPurchaseOrderMasterByDate(page: string) {
        try {
            return bigBazaarDao.getPurchaseOrderMaterByDate(page);
        } catch (error) {
            throw new Error(`Error in processing your request`);
        }
    }
}

export default new BigBazaarService();
