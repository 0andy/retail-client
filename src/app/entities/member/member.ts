export class Member {
    id: string;
    phone: string;
    name: string;
    sex: number;
    nickName: string;
    openId: string;
    headImgUrl: string;
    userType: number;
    bindStatus: number;
    bindTime: Date;
    unBindTime: Date;
    integral: number;
    bindStatusName: string;
    userTypeName: string;
    creationTime: Date;
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
            this.name = data["name"];
            this.sex = data["sex"];
            this.phone = data["phone"];
            this.nickName = data["nickName"];
            this.openId = data["openId"];
            this.headImgUrl = data["headImgUrl"];
            this.userType = data["userType"];
            this.bindStatus = data["bindStatus"];
            this.bindTime = data["bindTime"];
            this.unBindTime = data["unBindTime"];
            this.integral = data["integral"];
            this.bindStatusName = data["bindStatusName"];
            this.userTypeName = data["userTypeName"];
            this.creationTime = data["creationTime"];
        }
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["sex"] = this.sex;
        data["phone"] = this.phone;
        data["nickName"] = this.nickName;
        data["openId"] = this.openId;
        data["headImgUrl"] = this.headImgUrl;
        data["userType"] = this.userType;
        data["bindStatus"] = this.bindStatus;
        data["bindTime"] = this.bindTime;
        data["unBindTime"] = this.unBindTime;
        data["integral"] = this.integral;
        data["creationTime"] = this.creationTime;
        return data;
    }

    static fromJS(data: any): Member {
        let result = new Member();
        result.init(data);
        return result;
    }

    // static fromJSArray(dataArray: any[]): Member[] {
    //     let array = [];
    //     dataArray.forEach(result => {
    //         let item = new Member();
    //         item.init(result);
    //         array.push(item);
    //     });
    //     return array;
    // }

    // clone() {
    //     const json = this.toJSON();
    //     let result = new Member();
    //     result.init(json);
    //     return result;
    // }
}

export class PagedResultDtoOfMember {
    totalCount: number;
    items: Member[];

    constructor(data?: PagedResultDtoOfMember) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.totalCount = data["totalCount"];
            if (data["items"] && data["items"].constructor === Array) {
                this.items = [];
                for (let item of data["items"])
                    this.items.push(Member.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PagedResultDtoOfMember {
        let result = new PagedResultDtoOfMember();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["totalCount"] = this.totalCount;
        if (this.items && this.items.constructor === Array) {
            data["items"] = [];
            for (let item of this.items)
                data["items"].push(item.toJSON());
        }
        return data;
    }
}