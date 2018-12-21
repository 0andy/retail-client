export class PutDetail {
    id: string;
    putFormId: string;
    productId: string;
    barCode: string;
    purchasePrice: number;
    orderNum: number;
    num: number;
    remark: string;
    creationTime: Date;
    constructor(data?: any) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.putFormId = data["putFormId"];
            this.productId = data["productId"];
            this.barCode = data["barCode"];
            this.purchasePrice = data["purchasePrice"];
            this.orderNum = data["orderNum"];
            this.num = data["num"];
            this.remark = data["remark"];
            this.creationTime = data["creationTime"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["putFormId"] = this.putFormId;
        data["productId"] = this.productId;
        data["barCode"] = this.barCode;
        data["purchasePrice"] = this.purchasePrice;
        data["orderNum"] = this.orderNum;
        data["num"] = this.num;
        data["remark"] = this.remark;
        data["creationTime"] = this.creationTime;
        return data;
    }
    static fromJS(data: any): PutDetail {
        let result = new PutDetail();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): PutDetail[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new PutDetail();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new PutDetail();
        result.init(json);
        return result;
    }
}   