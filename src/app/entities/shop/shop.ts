export class Shop {
    id: string;
    name: string;
    retailId: string;
    retailName: string;
    licenseKey: string;
    authorizationCode: string;
    aaddress: string;
    qRCode: string;
    longitude: number;
    latitude: number;
    creationTime: Date;
    creatorUserId: string;
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
            this.id = data["id"];
            this.name = data["name"];
            this.retailId = data["retailId"];
            this.retailName = data["retailName"];
            this.licenseKey = data["licenseKey"];
            this.authorizationCode = data["authorizationCode"];
            this.aaddress = data["aaddress"];
            this.qRCode = data["qRCode"];
            this.longitude = data["longitude"];
            this.latitude = data["latitude"];
            this.creationTime = data["creationTime"];
            this.creatorUserId = data["creatorUserId"];
            this.lastModificationTime = data["lastModificationTime"];
            this.lastModifierUserId = data["lastModifierUserId"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["retailId"] = this.retailId;
        data["retailName"] = this.retailName;
        data["licenseKey"] = this.licenseKey;
        data["authorizationCode"] = this.authorizationCode;
        data["aaddress"] = this.aaddress;
        data["qRCode"] = this.qRCode;
        data["longitude"] = this.longitude;
        data["latitude"] = this.latitude;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        data["lastModificationTime"] = this.lastModificationTime;
        data["lastModifierUserId"] = this.lastModifierUserId;
        return data;
    }
    static fromJS(data: any): Shop {
        let result = new Shop();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): Shop[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new Shop();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new Shop();
        result.init(json);
        return result;
    }
}