import debug from 'debug';
import fs from 'fs';
import _, { map } from 'underscore';
import { IBigBazaarPurchaseOrderDto } from '../dto/interface/big-bazaar.purchase.order.dto';
import myHelper from '../../common/my-helper';
import { IBigBazaarPurchaseOrderItemsDto } from '../dto/interface/big-bazaar.purchase.order.items.dto';
import { BigBazaarPurchaseOrderItemsDto } from '../dto/big-bazaar.purchase.order.items.dto';
import { IBigBazaarPurchaseOrderItemsHeader } from '../dto/interface/big-bazaar.purchase.order.items.header';
import { BigBazaarPurchaseOrderItemsHeader } from '../dto/big-bazaar.purchase.order.items.header.dto';
import { PurchaseOrderDb } from '../../services/purchase.order';
import { TemplateMapperInfoDto } from '../dto/template-mapper-dto';

const log: debug.IDebugger = debug('app:in-memory-dao');

class BigBazaarDAO {

    private db = new PurchaseOrderDb();
    constructor() {
        log('Created new instance of BigBazaarDAO');
    }

    async processAndCreatePO(objPurchaseOrder: IBigBazaarPurchaseOrderDto): Promise<IBigBazaarPurchaseOrderDto> {
        try {
            let listOfTableHeader: any = null;
            let listOfTableRow: any = [];
            const fileBuffer: any = fs.readFileSync(objPurchaseOrder.JsonFilePath);
            const rawPOResult = JSON.parse(fileBuffer);
            //console.log(rawPOResult);
            if (fileBuffer && rawPOResult.length >= 2) {
                // header
                for (let index = 0; index < rawPOResult[2].data.length; index++) {
                    const item = rawPOResult[2].data[index];
                    if (index === 2) {
                        listOfTableHeader = _.pluck(item, 'text');
                    }
                }
                console.log(listOfTableHeader);
                _.map(rawPOResult, (item,) => {
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
            //const objPurchaseOrder = new BigBazaarPurchaseOrderDto();
            const tempTableHeaders = listOfTableRow.filter(((item:any)=> {
                if(objPurchaseOrder.TemplateItemLabel.length > 0){
                    return (item.length === objPurchaseOrder.TemplateItemLabel[0].OrderItemTableCount)
                }
            }));
            if(tempTableHeaders && tempTableHeaders.length > 0) {
                objPurchaseOrder.ItemsHeader = tempTableHeaders;
            }
            //objPurchaseOrder.ItemColumnHeaders = this.getPOHeaders(listOfTableHeader);
            // this.getHeaderIndexByName(listOfTableHeader, 'Article EAN');
            this.setPurchaseOrderHeader(objPurchaseOrder, rawPOResult);
            const purchaseOrderItemValues: Array<any> = this.getPurchaseOrderItems(objPurchaseOrder, listOfTableRow);
            const listOfItems = new Array<IBigBazaarPurchaseOrderItemsDto>();
            _.map(purchaseOrderItemValues, (item: any) => {
                const obj = new BigBazaarPurchaseOrderItemsDto();
                _.map(item, (itemInner: any) => {
                    if (itemInner.label === 'EAN') {
                        obj.ArticleEAN = itemInner.value;
                    }
                    if (itemInner.label === 'SKU') {
                        obj.ArticleCode = itemInner.value;
                    }
                    if (itemInner.label === 'Description') {
                        obj.DescriptionOfGoods = itemInner.value;
                    }
                    if (itemInner.label === 'HSN') {
                        obj.HSN = itemInner.value;
                    }
                    if (itemInner.label === 'MRP') {
                        obj.MRP = itemInner.value;
                    }
                    if (itemInner.label === 'Quantity') {
                        obj.Quantity = itemInner.value;
                    }
                    if (itemInner.label === 'UoM') {
                        obj.UnitOfMeasure = itemInner.value;
                    }
                    if (itemInner.label === 'Basic Cost') {
                        obj.BasicCost = itemInner.value;
                    }

                    if (itemInner.label === 'Taxable Value') {
                        obj.TaxableAmount = itemInner.value;
                    }
                    //state-gst
                    if (itemInner.label === 'SGST Amount') {
                        obj.SGST_Amount = itemInner.value;
                    }
                    if (itemInner.label === 'SGST Rate') {
                        obj.SGST_Rate = itemInner.value;
                    }
                    //central-gst
                    if (itemInner.label === 'CGST Amount') {
                        obj.CGST_Amount = itemInner.value;
                    }
                    if (itemInner.label === 'CGST Rate') {
                        obj.CGST_Rate = itemInner.value;
                    }
                    //total amount
                    if (itemInner.label === 'Total Amount') {
                        obj.TotalAmount = itemInner.value;
                    }
                });
                listOfItems.push(obj);
            });
            // TBD - Handle missing data e.x. description
            objPurchaseOrder.Items = listOfItems;
            // update database
            // TBD -  && objPurchaseOrder.PurchaseOrderNumber !== ''
            // if item length is zero, do not update
            if (objPurchaseOrder.Id) {
                this.db.updatePurchaseOrderMaster(objPurchaseOrder);
            }
            //
            console.log(objPurchaseOrder);
            return objPurchaseOrder;
        }
        catch (error) {
            const { message } = error as unknown as any;
            console.log(`Error in processing Purchase Order - ${objPurchaseOrder.JsonFile} - ${message}`);
            throw new Error(`Error in processing Purchase Order - ${objPurchaseOrder.JsonFile} - ${message}`);
        }
    }

    async getPurchaseOrderMaster(): Promise<any> {
        try {
            return this.db.getAllPurchaseOrderMaster();
        } catch (error) {
            throw new Error("Error in processing your request");
        }

    }

    async getPurchaseOrderDetailsById(id: number): Promise<any> {
        try {
            return this.db.getAllPurchaseOrderDetailsById(id)
        } catch (error) {
            throw new Error("Error in processing your request");
        }
    }

    async getPurchaseOrderMaterByDate(page: string) {
        return this.db.getMultiple(page);
    }

    private setPurchaseOrderHeader(objHeader: IBigBazaarPurchaseOrderDto, rawPOResult: string[]) {
        const headerList = objHeader.TemplateHeaderLabel; //this.getPurchaseOrderHeaderLabelList();
        const result: any = [];
        map(headerList, (item: TemplateMapperInfoDto) => {
            const matchedText = this.newMappgingLogic(rawPOResult, this.getPdfMapperByOutputFieldName(item.OutputFieldName, headerList));
            const matchedValue = this.getPurchaseOrderHeaderValue(matchedText, item);
            // TBD - All comparision by lower/upper case for both LHS & RHS
            if (item.OutputFieldName.toLowerCase().trim() === 'purchase order number'.trim()) {
                objHeader.PurchaseOrderNumber = matchedValue;
            }
            if (item.OutputFieldName.toLowerCase().trim() === 'purchase order date'.trim()) {
                objHeader.PurchaseOrderDate = matchedValue;
            }
            if (item.OutputFieldName.toLowerCase().trim() === 'sold to party'.trim()) {
                objHeader.SoldToParty = matchedText; // TBD - entire text
            }
            if (item.OutputFieldName.toLowerCase().trim() === 'ship to party'.trim()) {
                objHeader.ShipToParty = matchedText; // TBD - entire text
            }
        });
    }

    public getPurchaseOrderItems(obj: IBigBazaarPurchaseOrderDto, listOfTableRow: string[]): Array<any> {
        const itemDetailsList = obj.TemplateItemLabel; //this.getPurchaseOrderDetailsLabelList();
        //tbd use group prop
        console.log(itemDetailsList[0].OrderItemTableCount);
        let orderItemTableColumnCount = itemDetailsList[0].OrderItemTableCount;
        // handle exception
        const finalResult: any = [];
        const uniqueItemData = [...new Set(itemDetailsList.map(item => item.ColumnIndex))];
        const rawTableInfo = myHelper.filterRawJsonListByLength(listOfTableRow, orderItemTableColumnCount);
        console.log('Imp:',rawTableInfo);
        _.map(rawTableInfo, (item: any, i: number) => {
            const isHeader = this.isOrderItemContainTableHeader(obj.ItemsHeader, item);
            if (!isHeader) {
                const result: any = [];
                _.map(itemDetailsList, (itemDetails: TemplateMapperInfoDto, j: number) => {

                    const filteredLabelList = this.getItemDetailsByColumnIndexNew(itemDetails.ColumnIndex, itemDetailsList);
                    if (filteredLabelList && _.isArray(filteredLabelList) && filteredLabelList.length > 0) {
                        _.map(filteredLabelList, (labelItem: TemplateMapperInfoDto, k: number) => {
                            const obj = {
                                labelInfo: labelItem,
                                value: '',
                                label: ''
                            };
                            // labelItem.TotalFieldCount
                            //if(labelItem.GroupName !== 'Group-1') {
                            if (labelItem.FieldCount !== 1) {
                                const splitResult = myHelper.splitString(item[labelItem.ColumnIndex], '\r');
                                if (splitResult && splitResult.length > 0) {
                                    obj.value = splitResult[k];
                                    obj.label = labelItem.OutputFieldName;
                                }
                                // TBD
                                if (obj.label === 'Description') {
                                    obj.value = '';
                                    for (let i = 0; i < splitResult.length; i++) {
                                        if (i >= 2) {
                                            obj.value = `${obj.value} ${splitResult[i]}`;
                                        }
                                    }
                                }
                            }
                            //if(labelItem.GroupName === 'Group-1') {
                            if (labelItem.FieldCount === 1) {
                                const splitResult = myHelper.splitString(item[labelItem.ColumnIndex], '\r');
                                if (splitResult && splitResult.length > 0) {
                                    for (let i = 0; i < splitResult.length; i++) {
                                        obj.value = `${obj.value} ${splitResult[i]}`;
                                    }
                                    obj.label = labelItem.OutputFieldName;
                                }
                            }
                            result.push(obj);
                        });
                    }
                });
                finalResult.push(result);
            }
        });
        console.log(finalResult.length);
        return finalResult;
    }

    private getItemDetailsByColumnIndexNew(columnIndex: number, itemDetailsList: Array<any>) {
        const result = itemDetailsList.filter((item: any, index: number) => {
            if (item.ColumnIndex === columnIndex) {
                return item;
            }
        });
        return result;
    }

    private getPOHeaders(headers: Array<string>): Array<IBigBazaarPurchaseOrderItemsHeader> {
        const list = Array<BigBazaarPurchaseOrderItemsHeader>();
        const splitBy = '\r';
        headers.map((item, index) => {
            const splitResult = myHelper.splitString(item, splitBy);

            if (splitResult && splitResult.length > 1) {

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

    private getPurchaseOrderHeaderValue(matchedData: string, model: TemplateMapperInfoDto): string {
        let result = '';
        if (matchedData) {
            const splitResult = myHelper.splitString(matchedData, model.SeparatedBy);
            //TBD why > 1?
            if (splitResult && splitResult.length > 1) {
                result = myHelper.filterRawJsonListBySearchTerm(splitResult, model.SearchTerm, model.InputFieldName, model.OutputFieldName);
                //result = result.replace(':',''); 
            }
        }
        return result;
    }

    private getPdfMapperByOutputFieldName(fieldName: string, list: Array<any>) {
        const mapperObject = list.find((item) => {
            return (item.OutputFieldName.toLowerCase() === fieldName.toLowerCase());
        });
        return mapperObject;
    }

    private newMappgingLogic(rawPOResult: any, mapper: any) {
        let matchedValue = '';
        let index_i: number;
        let index_j: number;
        let index_k: number;
        if (mapper) {
            const splitResult = myHelper.splitString(mapper.MapperIndex, '-');
            if (splitResult && splitResult.length === 3) { //TBD
                index_i = parseInt(splitResult[0]);
                index_j = parseInt(splitResult[1]);
                index_k = parseInt(splitResult[2]);
                _.map(rawPOResult, (item, i: number) => {
                    if (item['extraction_method'] === 'lattice') {
                        _.map(item['data'], (itemInner, j: number) => {
                            _.map(itemInner, (row, k: number) => {
                                if (row['text']) {
                                    if (i === index_i && j === index_j && k === index_k) {
                                        matchedValue = row['text'];
                                        console.log(`${i}-${j}-${k}-${matchedValue}`);
                                    }
                                    else {
                                        //console.log('not matching')
                                    }
                                }
                            });
                        });
                    }
                });
            }
        }
        return matchedValue;
    }

    isOrderItemContainTableHeader(listOfHeader: Array<string>, orderItem: Array<string>): boolean {
        let isTableHeader = false;
        orderItem.map((item, i) => {
            if (item) {
                if (item.includes(listOfHeader[0])) {
                    isTableHeader = true;
                    return isTableHeader;
                }
            }
        });
        console.log(isTableHeader);
        return isTableHeader;
    }
}

export default new BigBazaarDAO();
