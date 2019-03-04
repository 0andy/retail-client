export class InventoryDetail {
    id: string;
    inventoryId: string;
    productId: string;
    barCode: string;
    currentNum: number;
    num: number;
    remark: string;
    creationTime: Date;
    productName: string;
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
            this.inventoryId = data["inventoryId"];
            this.productId = data["productId"];
            this.barCode = data["barCode"];
            this.currentNum = data["currentNum"];
            this.num = data["num"];
            this.remark = data["remark"];
            this.creationTime = data["creationTime"];
            this.productName = data["productName"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["inventoryId"] = this.inventoryId;
        data["productId"] = this.productId;
        data["barCode"] = this.barCode;
        data["currentNum"] = this.currentNum;
        data["num"] = this.num;
        data["remark"] = this.remark;
        data["creationTime"] = this.creationTime;
        data["productName"] = this.productName;
        return data;
    }
    static fromJS(data: any): InventoryDetail {
        let result = new InventoryDetail();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): InventoryDetail[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new InventoryDetail();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new InventoryDetail();
        result.init(json);
        return result;
    }
}