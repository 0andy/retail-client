export class WarehouseWater {
    id: string;
    shopId: string;
    productId: string;
    barCode: string;
    type: number;
    refNo: string;
    initial: number;
    stock: number;
    final: number;
    desc: string;
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
            this.shopId = data["shopId"];
            this.productId = data["productId"];
            this.barCode = data["barCode"];
            this.type = data["type"];
            this.refNo = data["refNo"];
            this.initial = data["initial"];
            this.stock = data["stock"];
            this.final = data["final"];
            this.desc = data["desc"];
            this.creationTime = data["creationTime"];
            this.productName = data["productName"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["shopId"] = this.shopId;
        data["productId"] = this.productId;
        data["barCode"] = this.barCode;
        data["type"] = this.type;
        data["refNo"] = this.refNo;
        data["initial"] = this.initial;
        data["stock"] = this.stock;
        data["final"] = this.final;
        data["desc"] = this.desc;
        data["creationTime"] = this.creationTime;
        return data;
    }
    static fromJS(data: any): WarehouseWater {
        let result = new WarehouseWater();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): WarehouseWater[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new WarehouseWater();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new WarehouseWater();
        result.init(json);
        return result;
    }
}