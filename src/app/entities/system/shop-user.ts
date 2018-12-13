export class ShopUser {
    id: string;
    account: string;
    password: string;
    name: string;
    role: 1 | 2;
    shopId: string;
    isEnable: 0 | 1;
    creationTime: Date;
    creatorUserId: string;
    lastModificationTime: Date;
    lastModifierUserId: string;

    get roleName() {
        return this.role === 1 ? '店铺管理员' : '收银员';
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
            this.account = data["account"];
            this.password = data["password"];
            this.name = data["name"];
            this.role = data["role"];
            this.shopId = data["shopId"];
            this.isEnable = data["isEnable"];
            this.creationTime = data["creationTime"];
            this.creatorUserId = data["creatorUserId"];
            this.lastModificationTime = data["lastModificationTime"];
            this.lastModifierUserId = data["lastModifierUserId"];
        }
    }

    static fromJS(data: any): ShopUser {
        let result = new ShopUser();
        result.init(data);
        return result;
    }

    static fromJSArray(dataArray: any[]): ShopUser[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new ShopUser();
            item.init(result);
            array.push(item);
        });

        return array;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["account"] = this.account;
        data["password"] = this.password;
        data["role"] = this.role;
        data["shopId"] = this.shopId;
        data["isEnable"] = this.isEnable;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        data["lastModificationTime"] = this.lastModificationTime;
        data["lastModifierUserId"] = this.lastModifierUserId;
        return data;
    }

    clone() {
        const json = this.toJSON();
        let result = new ShopUser();
        result.init(json);
        return result;
    }
}

export class ChangePasswordDto {
    orgPassword: string;
    newPassword: string;
    checkPassword: string;
    constructor(data?) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.orgPassword = data["orgPassword"];
            this.newPassword = data["newPassword"];
            this.checkPassword = data["checkPassword"];
        }
    }

    static fromJS(data: any): ChangePasswordDto {
        let result = new ChangePasswordDto();
        result.init(data);
        return result;
    }

}