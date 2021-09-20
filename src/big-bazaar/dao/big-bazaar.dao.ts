import debug from 'debug';
import fs from 'fs';
import _ from 'underscore';
import { IBigBazaarPurchaseOrderDto } from '../dto/interface/big-bazaar.purchase.order.dto';
import { BigBazaarPurchaseOrderDto } from '../dto/big-bazaar.purcahse.order.dto';
const log: debug.IDebugger = debug('app:in-memory-dao');
import myHelper from '../../common/my-helper';

class BigBazaarDAO {

    constructor() {
        log('Created new instance of BigBazaarDAO');
    }

    async processAndCreatePO(jsonFile: string) {
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
            console.log(listOfTableRow);
            console.log(this.getPurchaseOrderNumber(listOfTableRow))
            return listOfTableRow;
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

    private getPurchaseOrderNumber(list: Array<string>): string | undefined {
        let poNumber = '0';
        const term = 'P. O. Number';
        const filteredResult = myHelper.filterRawJsonListByLength(list, 1);
        const data = myHelper.filterRawJsonListBySearchTerm(filteredResult, term);
        if(data && data[0]) {
            const splitResult = myHelper.splitString(data[0], '\r');
            if(splitResult) {

                poNumber = splitResult[1];
            }
        }
        console.log(poNumber);
        return poNumber;
    }

    private getPurchaseOrderNumberFromRawJSON(rawJsonlist: Array<string>): string | undefined {
        const term = 'PO';
        const data = _.filter(rawJsonlist,(item) => item.length == 1);
        const result = _.filter(data, (item: any) => {
            if(item[0].includes(term)) {
                return item[0]
            }
        });
        console.log(result.length, result[0][0]);
        return result[0];
    }

    //
    private getSoldToParty(): string {
        let soldToParty = '';
        return soldToParty;
    }

    private getShipToParty(): string {
        let shipToParty = '';
        return shipToParty;
    }

    private getPurchaseOrderDate(): string {
        let poDate = '';
        return poDate;
    }

    private getValidTo() {
        return "TBD";
    }

    private getSAPMaterialCode(): string {
        let materialCode = 'TBD';
        return materialCode;
    }

    private getArticleEAN(): string {
        let articleEAN = '';
        return articleEAN;
    }

    private getArticleCode(): string {
        let articleCode = '';
        return articleCode;
    }

    private getDescriptOfGoods(): string {
        let description = '';
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

    private getTableHeader(rawPOResult: any): Array<string> {
        let listOfTableRow: any = [];
        _.map(rawPOResult, (item) => {
            if (item['extraction_method'] === 'lattice') {
                _.map(item['data'], (itemInner) => {
                    _.map(itemInner, (row) => {
                        if (row['text']) {
                            const splitResult = row['text'].split('\r');
                            listOfTableRow = listOfTableRow.concat(splitResult);
                        }
                    });
                });
            }
        })
        return listOfTableRow;
    }

    private getTableRow(rawPOResult: Array<string>): Array<string> {
        return rawPOResult.filter((item) => {
            return (item.length >= 10)
        })
    }
}

export default new BigBazaarDAO();
