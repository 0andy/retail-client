export class Order {
    id: string;
    shopId: string;
    number: string;
    memberId: string;
    phone: string;
    amount: number;
    discountAmount: number;
    payAmount: number;
    status: number;
    orderId: string;
    paymentType: number;
    isPrint: boolean;
    remark: string;
    submitTime: Date;
    submitUserId: string;
    submitUserAccount: string;
    creationTime: Date;
    creatorUserId: string;
    userName: string;

    get paymentTypeName() {
        if (this.paymentType === 1) {
            return '支付宝';
        } else if (this.paymentType === 2) {
            return '微信';
        } else if (this.paymentType === 3) {
            return '银行卡';
        } else if (this.paymentType === 4) {
            return '现金';
        } else {
            return '其他';
        }
    }

    get statusType() {
        if (this.status === 1) {
            return '待支付';
        } else if (this.status === 2) {
            return '已完成';
        } else if (this.status === 9) {
            return '已退款';
        } else {
            return '其他';
        }
    }

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
            this.number = data["number"];
            this.memberId = data["memberId"];
            this.phone = data["phone"];
            this.amount = data["amount"];
            this.discountAmount = data["discountAmount"];
            this.payAmount = data["payAmount"];
            this.status = data["status"];
            this.orderId = data["orderId"];
            this.paymentType = data["paymentType"];
            this.isPrint = data["isPrint"];
            this.remark = data["remark"];
            this.submitTime = data["submitTime"];
            this.submitUserId = data["submitUserId"];
            this.submitUserAccount = data["submitUserAccount"];
            this.creationTime = data["creationTime"];
            this.creatorUserId = data["creatorUserId"];
            this.userName = data["userName"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["shopId"] = this.shopId;
        data["number"] = this.number;
        data["memberId"] = this.memberId;
        data["phone"] = this.phone;
        data["amount"] = this.amount;
        data["discountAmount"] = this.discountAmount;
        data["payAmount"] = this.payAmount;
        data["status"] = this.status;
        data["orderId"] = this.orderId;
        data["paymentType"] = this.paymentType;
        data["isPrint"] = this.isPrint;
        data["remark"] = this.remark;
        data["submitTime"] = this.submitTime;
        data["submitUserId"] = this.submitUserId;
        data["submitUserAccount"] = this.submitUserAccount;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        return data;
    }
    static fromJS(data: any): Order {
        let result = new Order();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): Order[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new Order();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new Order();
        result.init(json);
        return result;
    }
}