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
        const result = _.filter(rawJsonlist, (item: any) => {
            console.log(item);
            if(item[0].includes(searchTerm)) {
                return item[0];
            }
        });
        return result[0];
    }

    
}

export default new MyHelper();