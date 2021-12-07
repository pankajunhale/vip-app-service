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
        const data = _.filter(rawJsonlist, (item) => item.length === length);
        return data;
    }

    filterRawJsonListBySearchTerm(rawJsonlist: Array<string>, searchTerm: string): string {
        let result = '';
        _.map(rawJsonlist, (item: any,index: number) => {
            console.log(item);
            if(item.includes(searchTerm)) {
                result = rawJsonlist[index + 1];
            }
        });
        return result;
    }

    
}

export default new MyHelper();