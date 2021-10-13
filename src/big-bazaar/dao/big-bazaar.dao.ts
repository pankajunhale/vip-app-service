import debug from 'debug';
import fs from 'fs';
import _ from 'underscore';
import { IBigBazaarPurchaseOrderDto } from '../dto/interface/big-bazaar.purchase.order.dto';
import { BigBazaarPurchaseOrderDto } from '../dto/big-bazaar.purcahse.order.dto';
import myHelper from '../../common/my-helper';
import BBConstatnts from '../../common/big-bazaar.constants';
import { IBigBazaarPurchaseOrderItemsDto } from '../dto/interface/big-bazaar.purchase.order.items.dto';
import { BigBazaarPurchaseOrderItemsDto } from '../dto/big-bazaar.purchase.order.items.dto';
import { IBigBazaarPurchaseOrderItemsHeader } from '../dto/interface/big-bazaar.purchase.order.items.header';
import { BigBazaarPurchaseOrderItemsHeader } from '../dto/big-bazaar.purchase.order.items.header.dto';
import { PurchaseOrderDb } from '../../services/purchase.order';

const log: debug.IDebugger = debug('app:in-memory-dao');

class BigBazaarDAO {

    constructor() {
        log('Created new instance of BigBazaarDAO');
    }

    async processAndCreatePO(jsonFile: string): Promise<IBigBazaarPurchaseOrderDto>{
        const fileName = `${__dirname}/${jsonFile}`;
        //db.query()
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
            //console.log(bigBazarConfig);
            const objPurchaseOrder = new BigBazaarPurchaseOrderDto();
            objPurchaseOrder.ItemsHeader =  listOfTableHeader;
            objPurchaseOrder.ItemColumnHeaders = this.getPOHeaders(listOfTableHeader);
           // this.getHeaderIndexByName(listOfTableHeader, 'Article EAN');
            this.setPurchaseOrderHeader(objPurchaseOrder,listOfTableRow);
            const listOfItems = new Array<IBigBazaarPurchaseOrderItemsDto>();
            _.map(myHelper.filterRawJsonListByLength(listOfTableRow, 10), (item: any) => {
                const obj = new BigBazaarPurchaseOrderItemsDto();
                obj.ArticleEAN = this.getArticleEAN(item[0]);
                obj.ArticleCode = this.getArticleCode(item[0]);
                obj.DescriptionOfGoods = this.getDescriptionOfGoods(item[0]);
                obj.HSN = this.getHSN(item[1]);
                obj.MRP = this.getMRP(item[2]);
                obj.Quantity = this.getQuantity(item[3]);
                obj.UnitOfMeasure = this.getUoM(item[4]);
                obj.BasicCost = this.getBasicCost(item[5]);
                obj.TaxableAmount = this.getTaxableAmount(item[6]);
                //state-gst
                obj.SGST_Amount = this.getSGST_Amount(item[7]);
                obj.SGST_Rate = this.getSGST_Rate(item[7]);
                //central-gst
                obj.CGST_Amount = this.getSGST_Amount(item[8]);
                obj.CGST_Rate = this.getSGST_Rate(item[8]);
                obj.TotalAmount = this.getTotalAmount(item[9]);

                listOfItems.push(obj);
            });
            // TBD - Handle missing data e.x. description
            objPurchaseOrder.Items = listOfItems;
            //
            new PurchaseOrderDb().updatePurchaseOrderMaster(objPurchaseOrder);
            //
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

    async getPurchaseOrderMaterByDate(page: string) {
        return new PurchaseOrderDb().getMultiple(page);
    }

    private setPurchaseOrderHeader(objHeader: IBigBazaarPurchaseOrderDto, rawJsonlist: string[]) {
        objHeader.PurchaseOrderNumber = this.getPurchaseOrderNumber(rawJsonlist);
        objHeader.PurchaseOrderDate = this.getPurchaseOrderDate(rawJsonlist);
        objHeader.SoldToParty = this.getProcessedDataByField(rawJsonlist,BBConstatnts.FIELDS_TO_MAGNIFY.SOLD_TO_PARTY,1)
        objHeader.ShipToParty = this.getProcessedDataByField(rawJsonlist,BBConstatnts.FIELDS_TO_MAGNIFY.SHIP_TO_PARTY,1)
    }


    private getPOHeaders(headers: Array<string>): Array<IBigBazaarPurchaseOrderItemsHeader> {
        const list = Array<BigBazaarPurchaseOrderItemsHeader>();
        const splitBy = '\r';
        headers.map((item, index) => {
            const splitResult = myHelper.splitString(item, splitBy);

            if(splitResult && splitResult.length > 1) {

                splitResult.map((colItem, colIndex) => {
                    const obj = new BigBazaarPurchaseOrderItemsHeader(splitBy);    
                    obj.hasSeparator = true;
                    obj.index = index;
                    obj.name = colItem;
                    //obj.columnIndex = obj.findColumnIndex(name,splitResult);                
                    list.push(obj);
                });

            }
            else {

                const obj = new BigBazaarPurchaseOrderItemsHeader(splitBy);
                obj.index = index;
                obj.name = item;
                obj.columnIndex = index;
                list.push(obj);

            }
        });
        return list;
    }

    private getProcessedDataByField(rawJsonlist: string[], fieldToMagnify: string, filterCount: number) {
        const filteredResult = myHelper.filterRawJsonListByLength(rawJsonlist, filterCount);
        const data = myHelper.filterRawJsonListBySearchTerm(filteredResult, fieldToMagnify);
        return data;
    }

    private getPurchaseOrderNumber(list: Array<string>): string  {
        let poNumber = '0';
        const data = this.getProcessedDataByField(list, BBConstatnts.FIELDS_TO_MAGNIFY.PO_NUMBER, 1);
        if(data && data[0]) {
            const splitResult = myHelper.splitString(data[0], '\r');
            if(splitResult && splitResult.length > 0) {
                poNumber = splitResult[1].replace(':','');
            }
        }
        return poNumber;
    }

    private getPurchaseOrderDate(list: Array<string>): string {
        let poDate = '';
        const data = this.getProcessedDataByField(list, BBConstatnts.FIELDS_TO_MAGNIFY.PO_DATE, 1);
        if(data && data[0]) {
            const splitResult = myHelper.splitString(data[0], '\r');
            if(splitResult && splitResult.length > 0 && splitResult.length <= 4) {
                poDate = splitResult[3].replace(':','');
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

    private getHSN(item: string): string {
        let hsn = '';
        if(item) {
            const splitResult = myHelper.splitString(item, '\r');
            if(splitResult && splitResult.length > 0) {
                for (let i = 0; i < splitResult.length; i++) {
                    hsn = `${hsn}${splitResult[i]}`;
                }
            }
        }
        return hsn;
    }  
    
    private getMRP(item: string): string {
        let mrp = '0';
        if(item) {
            mrp = item;
        }
        return mrp;
    }

    private getQuantity(item: string): string {
        let qty = '0';
        if(item) {
            qty = item;
        }
        return qty;
    }

    private getUoM(item: string): string {
        let uom = '';
        if(item) {
            uom = item;
        }
        return uom;
    }

    private getBasicCost(item: string): string {
        let badicCost = '0';
        if(item) {
            badicCost = item;
        }
        return badicCost;
    }


    private getTaxableAmount(item: string): string {
        let taxableAmt = '0';
        if(item) {
            taxableAmt = item;
        }
        return taxableAmt;
    }

    private getSGST_Rate(item: string): string {
        let sgst_Rate = '0';
        if(item) {
            const splitResult = myHelper.splitString(item, '\r');
            if(splitResult && splitResult.length > 0) {
                sgst_Rate = splitResult[0];
            }
        }
        return sgst_Rate;
    }

    private getSGST_Amount(item: string): string {
        let sgst_Amount = '0';
        if(item) {
            const splitResult = myHelper.splitString(item, '\r');
            if(splitResult && splitResult.length > 0) {
                sgst_Amount = splitResult[1];
            }
        }
        return sgst_Amount;
    }

    private getCGST_Rate(item: string): string {
        let cgst_Rate = '0';
        if(item) {
            const splitResult = myHelper.splitString(item, '\r');
            if(splitResult && splitResult.length > 0) {
                cgst_Rate = splitResult[0];
            }
        }
        return cgst_Rate;
    }

    private getCGST_Amount(item: string): string {
        let cgst_Amount = '0';
        if(item) {
            const splitResult = myHelper.splitString(item, '\r');
            if(splitResult && splitResult.length > 0) {
                cgst_Amount = splitResult[1];
            }
        }
        return cgst_Amount;
    }

    private getTotalAmount(item: string): string {
        let totalAmount = '0';
        if(item) {
            totalAmount = item;
        }
        return totalAmount;
    }

   
}

export default new BigBazaarDAO();
