export class Category {
    id: string;
    name: string;
    seq: number;
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
            this.seq = data["seq"];
            this.creationTime = data["creationTime"];
        }
    }

    static fromJS(data: any): Category {
        let result = new Category();
        result.init(data);
        return result;
    }
}

export class TreeNode {
    title: string;
    key: string;
    expanded: boolean;
    children: TreeNode[];
    isLeaf: boolean = true;
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
            this.title = data["title"];
            this.key = data["key"];
            this.expanded = data["expanded"];
            this.children = data["children"];
            this.isLeaf = true;
        }
    }

    // static fromJS(data: any): TreeNode {
    //     let result = new TreeNode();
    //     result.init(data);
    //     return result;
    // }

    static fromJSArray(dataArray: any[]): TreeNode[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new TreeNode();
            item.init(result);
            array.push(item);
        });
        return array;
    }
}

export class SelectGroup {
    text: string;
    value: number;
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
            this.text = data["text"];
            this.value = data["value"];
        }
    }

    // static fromJS(data: any): SelectGroup {
    //     let result = new SelectGroup();
    //     result.init(data);
    //     return result;
    // }

    static fromJSArray(dataArray: any[]): SelectGroup[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new SelectGroup();
            item.init(result);
            array.push(item);
        });
        return array;
    }
}