export class OrderDetail {
    id: string;
    orderId: string;
    productId: string;
    barCode: string;
    sellPrice: number;
    memberPrice: number;
    price: number;
    num: number;
    creationTime: Date;
    productName: string;
    isEnableMember: boolean;
    selected: boolean;
    isRefund: boolean;
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
            this.orderId = data["orderId"];
            this.productId = data["productId"];
            this.barCode = data["barCode"];
            this.sellPrice = data["sellPrice"];
            this.memberPrice = data["memberPrice"];
            this.price = data["price"];
            this.num = data["num"];
            this.creationTime = data["creationTime"];
            this.productName = data["productName"];
            this.isEnableMember = data["isEnableMember"];
            this.isRefund = data["isRefund"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["orderId"] = this.orderId;
        data["productId"] = this.productId;
        data["barCode"] = this.barCode;
        data["sellPrice"] = this.sellPrice;
        data["memberPrice"] = this.memberPrice;
        data["price"] = this.price;
        data["num"] = this.num;
        data["creationTime"] = this.creationTime;
        data["productName"] = this.productName;
        data["isRefund"] = this.isRefund;
        return data;
    }
    static fromJS(data: any): OrderDetail {
        let result = new OrderDetail();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): OrderDetail[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new OrderDetail();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    // clone() {
    //     const json = this.toJSON();
    //     let result = new OrderDetail();
    //     result.init(json);
    //     return result;
    // }
}

export class CommPrice {
    totalPrice: number = 0;//实收金额
    orderPrice: number = 0; //订单金额
    offerPrice: number = 0; //优惠金额
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
            this.totalPrice = data["totalPrice"];
            this.orderPrice = data["orderPrice"];
            this.offerPrice = data["offerPrice"];
        }
    }

    static fromJS(data: any): CommPrice {
        let result = new CommPrice();
        result.init(data);
        return result;
    }
}