import debug from 'debug';
import fs from 'fs';
import _ from 'underscore';
import { IBigBazaarPurchaseOrderDto } from '../dto/interface/big-bazaar.purchase.order.dto';
import { BigBazaarPurchaseOrderDto } from '../dto/big-bazaar.purcahse.order.dto';
const log: debug.IDebugger = debug('app:in-memory-dao');
import myHelper from '../../common/my-helper';
import BBConstatnts from '../../common/big-bazaar.constants';
import { IBigBazaarPurchaseOrderItemsDto } from '../dto/interface/big-bazaar.purchase.order.items.dto';
import { BigBazaarPurchaseOrderItemsDto } from '../dto/big-bazaar.purchase.order.items.dto';

class BigBazaarDAO {

    constructor() {
        log('Created new instance of BigBazaarDAO');
    }

    async processAndCreatePO(jsonFile: string): Promise<IBigBazaarPurchaseOrderDto>{
        const fileName = `${__dirname}/${jsonFile}`;
        try {
            console.clear();
            let listOfTableHeader: any = null;
            let listOfTableRow: any = [];
            const fileBuffer: any = fs.readFileSync(fileName);
            const rawPOResult = JSON.parse(fileBuffer);

            if (rawPOResult.length >= 2) {
                // header
                for (let index = 0; index < rawPOResult[2].data.length; index++) {
                    const item = rawPOResult[2].data[index];
                    if (index === 2) {
                        listOfTableHeader = _.pluck(item, 'text');
                    }
                }
                //console.log(listOfTableHeader);

                _.map(rawPOResult, (item) => {
                    if (item['extraction_method'] === 'lattice') {
                        _.map(item['data'], (itemInner) => {
                            let tempArray: Array<string> = [];
                            _.map(itemInner, (row) => {
                                if (row['text']) {
                                    const splitResult = row['text'].split('\r');
                                    tempArray = tempArray.concat(row['text']);
                                }
                            });
                            listOfTableRow.push(tempArray);
                        });
                    }
                })
            }
            //
            console.log
            
            
            (listOfTableRow);
            //console.log(this.getSoldToParty(listOfTableRow));
            const objPurchaseOrder = new BigBazaarPurchaseOrderDto();
            const listOfItems = new Array<IBigBazaarPurchaseOrderItemsDto>();
            _.map(myHelper.filterRawJsonListByLength(listOfTableRow, 10), (item: any) => {
                const obj = new BigBazaarPurchaseOrderItemsDto();
                obj.ArticleEAN = this.getArticleEAN(item[0]);
                obj.ArticleCode = this.getArticleCode(item[0]);
                obj.DescriptionOfGoods = this.getDescriptionOfGoods(item[0]);
                listOfItems.push(obj);
            });
            objPurchaseOrder.Items = listOfItems;
            return objPurchaseOrder;
        }
        catch (error) {
            throw new Error(`Error in processing Purchase Order - ${jsonFile}`);
        }
    }

    async getPurchaseOrders(): Promise<IBigBazaarPurchaseOrderDto[]> {
        try {
            return new Array<IBigBazaarPurchaseOrderDto>();
        } catch (error) {
            throw new Error("Error in processing your request");
        }
       
    }

    async getPurchaseOrderById(id: string): Promise<IBigBazaarPurchaseOrderDto> {
        return new BigBazaarPurchaseOrderDto();
    }

    private getProcessedDataByField(rawJsonlist: string[], fieldToMagnify: string, filterCount: number) {
        const filteredResult = myHelper.filterRawJsonListByLength(rawJsonlist, filterCount);
        const data = myHelper.filterRawJsonListBySearchTerm(filteredResult, fieldToMagnify);
        return data;
    }

    private getPurchaseOrderNumber(list: Array<string>): string | undefined {
        let poNumber = '0';
        const data = this.getProcessedDataByField(list, BBConstatnts.FIELDS_TO_MAGNIFY.PO_NUMBER, 1);
        if(data && data[0]) {
            const splitResult = myHelper.splitString(data[0], '\r');
            if(splitResult) {
                poNumber = splitResult[1];
            }
        }
        //console.log(poNumber);
        return poNumber;
    }

    private getSoldToParty(list: Array<string>): string {
        let soldToParty = '';
        const data = this.getProcessedDataByField(list, BBConstatnts.FIELDS_TO_MAGNIFY.SOLD_TO_PARTY, 1);
        if(data && data[0]) {
            const splitResult = myHelper.splitString(data[0], '\r');
            if(splitResult && splitResult.length > 0) {
                soldToParty = splitResult[0];
            }
        }
        return soldToParty;
    }

    private getShipToParty(list: Array<string>): string {
        let shipToParty = '';
        const data = this.getProcessedDataByField(list, BBConstatnts.FIELDS_TO_MAGNIFY.SHIP_TO_PARTY, 1);
        if(data && data[0]) {
            const splitResult = myHelper.splitString(data[0], '\r');
            if(splitResult && splitResult.length === 0) {
                shipToParty = splitResult[0];
            }
        }
        return shipToParty;
    }

    private getPurchaseOrderDate(list: Array<string>): string {
        let poDate = '';
        const data = this.getProcessedDataByField(list, BBConstatnts.FIELDS_TO_MAGNIFY.PO_DATE, 1);
        if(data && data[0]) {
            const splitResult = myHelper.splitString(data[0], '\r');
            if(splitResult && splitResult.length > 0 && splitResult.length <= 4) {
                poDate = splitResult[3];
            }
        }
        return poDate;
    }

    private getValidTo() {
        return "TBD";
    }

    private getSAPMaterialCode(): string {
        let materialCode = 'TBD';
        return materialCode;
    }

    private getArticleEAN(item: string): string {
        let articleEAN = '';
        if(item) {
            const splitResult = myHelper.splitString(item, '\r');
            if(splitResult && splitResult.length > 0) {
                articleEAN = splitResult[0];
            }
        }
        return articleEAN;
    }

    private getArticleCode(item: string): string {
        let articleCode = '';
        if(item) {
            const splitResult = myHelper.splitString(item, '\r');
            if(splitResult && splitResult.length > 0) {
                articleCode = splitResult[1];
            }
        }
        return articleCode;
    }

    private getDescriptionOfGoods(item: string): string {
        let description = '';
        if(item) {
            const splitResult = myHelper.splitString(item, '\r');
            if(splitResult && splitResult.length && splitResult.length > 2) {
                for (let i = 0; i < splitResult.length; i++) {
                    if(i >= 2) {
                        description = `${description} ${splitResult[i]}`;
                    }
                }
            }
        }
        return description;
    }

    private getQuantity(): string {
        let qty = '0';
        return qty;
    }

    private getTaxableAmount(): string {
        let taxableAmt = '0';
        return taxableAmt;
    }
   
}

export default new BigBazaarDAO();
