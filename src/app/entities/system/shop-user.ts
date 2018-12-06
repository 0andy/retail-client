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
        return this.role === 1? '店铺管理员' : '收银员';
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
}


