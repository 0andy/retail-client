import { Injectable } from '@angular/core';
import { ResultDto, PagedResultDto, ResultEntity, Category, TreeNode, SelectGroup } from 'app/entities';
import { NodeCommonService } from '../common/node-common.service';
import { Sqlite3Service } from '../common/sqlite3.service';
import { Observable } from "rxjs";

@Injectable()
export class CategoryService {
    tableName = 'category';
    constructor(private nodeComService: NodeCommonService, private sqlite3Service: Sqlite3Service) {
    }

    getCategoryTree(): Promise<TreeNode[]> {
        return new Promise<TreeNode[]>((resolve, reject) => {
            this.sqlite3Service.execSql(`select name title, id key from ${this.tableName} order by seq`, [], 'all').then((res) => {
                if (res.code == 0) {
                    let resList: TreeNode[] = [];
                    let result: TreeNode = new TreeNode();
                    result.title = '全部';
                    result.key = 'root';
                    result.expanded = true;
                    result.isLeaf = false;
                    result.children = [];
                    if (res.data) {
                        result.children = TreeNode.fromJSArray(res.data);
                    }
                    resList.push(result);
                    resolve(resList);
                } else {
                    reject(null);
                }
            });
        });
    }

    getCategorySelectGroup(): Promise<SelectGroup[]> {
        return new Promise<SelectGroup[]>((resolve, reject) => {
            this.sqlite3Service.execSql(`select name text, id value from ${this.tableName} order by seq`, [], 'all').then((res) => {
                if (res.code == 0) {
                    let resList: SelectGroup[] = [];
                    if (res.data) {
                        resList = SelectGroup.fromJSArray(res.data);
                        resolve(resList);
                    } else {
                        reject(null);
                    }
                } else {
                    reject(null);
                }
            });
        });
    }
}


