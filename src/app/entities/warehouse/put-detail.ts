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
    productName: string;
    // edit: boolean;

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
            this.productName = data["productName"];
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
        data["productName"] = this.productName;
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

export class EditCache {
    data: PutDetail;
    edit: boolean = false;

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
            this.data = data["data"];
            this.edit = data["edit"];
        }
    }
}

export class selectGroup {
    id: string;
    text: string;
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
            this.text = data["text"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["text"] = this.text;
        return data;
    }
    static fromJS(data: any): selectGroup {
        let result = new selectGroup();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): selectGroup[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new selectGroup();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new selectGroup();
        result.init(json);
        return result;
    }
}