export class Handover {
    id: string;
    shopId: string;
    userId: string;
    loginTime: Date;
    handoverTime: Date;
    orderCount: number;
    orderAmount: number;
    refundCount: number;
    refundAmount: number;
    bottomGold: number;
    creationTime: Date;
    creatorUserId: string;
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
            this.userId = data["userId"];
            this.loginTime = data["loginTime"];
            this.handoverTime = data["handoverTime"];
            this.orderCount = data["orderCount"];
            this.orderAmount = data["orderAmount"];
            this.refundCount = data["refundCount"];
            this.refundAmount = data["refundAmount"];
            this.bottomGold = data["bottomGold"];
            this.creationTime = data["creationTime"];
            this.creatorUserId = data["creatorUserId"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["shopId"] = this.shopId;
        data["userId"] = this.userId;
        data["loginTime"] = this.loginTime;
        data["handoverTime"] = this.handoverTime;
        data["orderCount"] = this.orderCount;
        data["orderAmount"] = this.orderAmount;
        data["refundCount"] = this.refundCount;
        data["refundAmount"] = this.refundAmount;
        data["bottomGold"] = this.bottomGold;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        return data;
    }
    static fromJS(data: any): Handover {
        let result = new Handover();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): Handover[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new Handover();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new Handover();
        result.init(json);
        return result;
    }
}