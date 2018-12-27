export class ResultDto {
    code: number;
    msg: string;
    data: any;

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
            this.code = data["code"];
            this.msg = data["msg"];
            this.data = data["data"];
        }
    }

    static fromJS(data: any): ResultDto {
        let result = new ResultDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["code"] = this.code;
        data["msg"] = this.msg;
        data["data"] = this.data;
        return data;
    }

    clone() {
        const json = this.toJSON();
        let result = new ResultDto();
        result.init(json);
        return result;
    }
}

export class ResultEntity<T> {
    code: number;
    msg: string;
    data: T;
}

export class PagedResultDto<T> {
    totalCount: number;
    items: T[];
}

export class ResultListDto {
    code: number;
    msg: string;
    data: any[];

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
            this.code = data["code"];
            this.msg = data["msg"];
            this.data = data["data"];
        }
    }
}