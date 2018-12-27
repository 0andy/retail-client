export class PutForm {
    id: string;
    shopId: string;
    formNo: string;
    type: PutFormType;
    deliverer: string;
    putTime: Date;
    refOrderNo: string;
    remark: string;
    userAccount: string;
    creationTime: Date;
    creatorUserId: string;
    status: number;
    approvalUserId: string;
    approvalTime: Date;
    approvalName: string;

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
            this.formNo = data["formNo"];
            this.type = data["type"];
            this.deliverer = data["deliverer"];
            this.putTime = data["putTime"];
            this.refOrderNo = data["refOrderNo"];
            this.remark = data["remark"];
            this.userAccount = data["userAccount"];
            this.creationTime = data["creationTime"];
            this.creatorUserId = data["creatorUserId"];
            this.status = data["status"];
            this.approvalUserId = data["approvalUserId"];
            this.approvalTime = data["approvalTime"];
            this.approvalName = data["approvalName"];
        }
    }
    // toJSON(data?: any) {
    //     data = typeof data === 'object' ? data : {};
    //     data["id"] = this.id;
    //     data["shopId"] = this.shopId;
    //     data["formNo"] = this.formNo;
    //     data["type"] = this.type;
    //     data["deliverer"] = this.deliverer;
    //     data["putTime"] = this.putTime;
    //     data["refOrderNo"] = this.refOrderNo;
    //     data["remark"] = this.remark;
    //     data["userAccount"] = this.userAccount;
    //     data["creationTime"] = this.creationTime;
    //     data["creatorUserId"] = this.creatorUserId;
    //     data["status"] = this.status;
    //     data["approvalUserId"] = this.approvalUserId;
    //     data["approvalTime"] = this.approvalTime;
    //     return data;
    // }
    static fromJS(data: any): PutForm {
        let result = new PutForm();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): PutForm[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new PutForm();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    // clone() {
    //     const json = this.toJSON();
    //     let result = new PutForm();
    //     result.init(json);
    //     return result;
    // }
}
// export class PutFormType {

// }
enum PutFormType {
    采购入库 = 1,
}


export class PutFormToProduct {
    putFormId: string;
    productId: string;
    barCode: string;
    pPrice: number;
    pNum: number;
    rPrice: number;
    rNum: number;
    lastModificationTime: Date;
    lastModifierUserId: string;

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
            this.putFormId = data["putFormId"];
            this.productId = data["productId"];
            this.barCode = data["barCode"];
            this.pPrice = data["pPrice"];
            this.pNum = data["pNum"];
            this.rPrice = data["rPrice"];
            this.rNum = data["rNum"];
            this.lastModificationTime = data["lastModificationTime"];
            this.lastModifierUserId = data["lastModifierUserId"];
        }
    }

    static fromJSArray(dataArray: any[]): PutFormToProduct[] {
        console.log(dataArray);
        let array = [];
        dataArray.forEach(result => {
            let item = new PutFormToProduct();
            item.init(result);
            array.push(item);
        });
        return array;
    }
}