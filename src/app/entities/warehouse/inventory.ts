export class Inventory {
    id: string;
    shopId: string;
    formNo: string;
    remark: string;
    userAccount: string;
    creationTime: Date;
    creatorUserId: string;
    userName: string;
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
            this.remark = data["remark"];
            this.userAccount = data["userAccount"];
            this.creationTime = data["creationTime"];
            this.creatorUserId = data["creatorUserId"];
            this.userName = data["userName"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["shopId"] = this.shopId;
        data["formNo"] = this.formNo;
        data["remark"] = this.remark;
        data["userAccount"] = this.userAccount;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        return data;
    }
    static fromJS(data: any): Inventory {
        let result = new Inventory();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): Inventory[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new Inventory();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new Inventory();
        result.init(json);
        return result;
    }
}