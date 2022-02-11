import _ from "underscore";

class MyHelper {
    constructor() {

    }

    splitString(value: string, splitBy: string): Array<string> {
        let splitResult = new Array<string>();
        if(value && splitBy && value.length > 0) {
            splitResult = value.split(splitBy);
        }
        return splitResult;
    }

    filterRawJsonListByLength(rawJsonlist: Array<string>, length: number): Array<string> {
        // if(!rawJsonlist)
        //     throw new Error("Invalid input - rawJsonlist");

        // if(!length)
        //     throw new Error("Invalid input - length");
        const data = rawJsonlist.filter((item,i: number) => { 
           if(item && item.length === length) {
               return item;
           }
        });
        return data;
    }

    filterRawJsonListBySearchTerm(rawJsonlist: Array<string>, searchTerm: string, inputFieldName: string, outputFieldName: string): string {
        let result = '';
        _.map(rawJsonlist, (item: any,index: number) => {
            console.log(item);
            // if(outputFieldName.toLowerCase().trim() === 'purchase order number') {
            //    // if(item.includes(searchTerm)) {
            //     //     result = rawJsonlist[index + 1];
            //     // }
            // }
            // if(outputFieldName.toLowerCase().trim() === 'purchase order date') {
            //     // if(item.includes(searchTerm)) {
            //     //     result = rawJsonlist[index + 1];
            //     // }
            // }

            if(item.includes(searchTerm)) {
                if(!result)
                    result = rawJsonlist[index + 1];
            }
        });
        return result;
    }

    
}

export default new MyHelper();