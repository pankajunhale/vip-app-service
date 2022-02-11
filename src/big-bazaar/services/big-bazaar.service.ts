import bigBazaarDao from '../dao/big-bazaar.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { IBigBazaarPurchaseOrderDto } from '../dto/interface/big-bazaar.purchase.order.dto';
import { BigBazaarPurchaseOrderDto } from '../dto/big-bazaar.purcahse.order.dto';
import shortid from 'shortid';
import { FilterPurchaseOrderRequest } from '../../common/filter.purchase-order';

class BigBazaarService {

    async create(model: IBigBazaarPurchaseOrderDto) {
        try {
            return bigBazaarDao.processAndCreatePO(model);
        } catch (error) {
            throw new Error(`Error in processing Purchase Order - ${model.JsonFile}`);
        }
    }

    async list() {
        return bigBazaarDao.getPurchaseOrderMaster();
    }

    async listPurchaseOrderDetails(masterId: number) {
        return bigBazaarDao.getPurchaseOrderDetailsById(masterId);
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

    async findPurchaseOrderItemFromTemplate(obj: IBigBazaarPurchaseOrderDto, listOfTableRow: string[]) {
        try {
            return bigBazaarDao.getPurchaseOrderItems(obj, listOfTableRow);
        } catch (error) {
            throw new Error(`Error in processing your request`);
        }
    }
}

export default new BigBazaarService();
