export class RetailProduct {
    id: string;
    shopId: string;
    barCode: string;
    name: string;
    categoryId: number;
    grade: number;
    retailPrice: number;
    purchasePrice: number;
    sellPrice: number;
    isEnableMember: boolean;
    memberPrice: number;
    unit: string;
    pinYinCode: string;
    lable: string;
    stock: number;
    isEnable: boolean;
    desc: string;
    creationTime: Date;
    creatorUserId: string;
    lastModificationTime: Date;
    lastModifierUserId: string;
    categoryName: string;
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
            this.barCode = data["barCode"];
            this.name = data["name"];
            this.categoryId = data["categoryId"];
            this.grade = data["grade"];
            this.retailPrice = data["retailPrice"];
            this.purchasePrice = data["purchasePrice"];
            this.sellPrice = data["sellPrice"];
            this.isEnableMember = data["isEnableMember"];
            this.memberPrice = data["memberPrice"];
            this.unit = data["unit"];
            this.pinYinCode = data["pinYinCode"];
            this.lable = data["lable"];
            this.stock = data["stock"];
            this.isEnable = data["isEnable"];
            this.desc = data["desc"];
            this.creationTime = data["creationTime"];
            this.creatorUserId = data["creatorUserId"];
            this.lastModificationTime = data["lastModificationTime"];
            this.lastModifierUserId = data["lastModifierUserId"];
            this.categoryName = data["categoryName"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["shopId"] = this.shopId;
        data["barCode"] = this.barCode;
        data["name"] = this.name;
        data["categoryId"] = this.categoryId;
        data["grade"] = this.grade;
        data["retailPrice"] = this.retailPrice;
        data["purchasePrice"] = this.purchasePrice;
        data["sellPrice"] = this.sellPrice;
        data["isEnableMember"] = this.isEnableMember;
        data["memberPrice"] = this.memberPrice;
        data["unit"] = this.unit;
        data["pinYinCode"] = this.pinYinCode;
        data["lable"] = this.lable;
        data["stock"] = this.stock;
        data["isEnable"] = this.isEnable;
        data["desc"] = this.desc;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        data["lastModificationTime"] = this.lastModificationTime;
        data["lastModifierUserId"] = this.lastModifierUserId;
        return data;
    }

    static fromJS(data: any): RetailProduct {
        let result = new RetailProduct();
        result.init(data);
        return result;
    }

    static fromJSArray(dataArray: any[]): RetailProduct[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new RetailProduct();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    // clone() {
    //     const json = this.toJSON();
    //     let result = new RetailProduct();
    //     result.init(json);
    //     return result;
    // }
}


export class SelectProduct {
    id: string;
    barCode: string;
    name: string;
    sellPrice: number;
    unit: string;
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
            this.barCode = data["barCode"];
            this.name = data["name"];
            this.sellPrice = data["sellPrice"];
            this.unit = data["unit"];
        }
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["barCode"] = this.barCode;
        data["name"] = this.name;
        return data;
    }

    static fromJSArray(dataArray: any[]): SelectProduct[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new SelectProduct();
            item.init(result);
            array.push(item);
        });
        return array;
    }
}

export class SelectResultDto<T, E> {
    entity: T[];
    dto: E[];
}