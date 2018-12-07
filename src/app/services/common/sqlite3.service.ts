import { Injectable } from '@angular/core';
import { ResultDto } from 'app/entities';

@Injectable()
export class Sqlite3Service {

    sqlite3 = (<any>window).require('sqlite3').verbose();//调试模式
    //sqlite3 = (<any>window).require('sqlite3');
    db: any;
    databaseFile = `retail.db`;
    //tableName: any;
    //options: any;

    get database() {
        this.db = new this.sqlite3.cached.Database(this.databaseFile);
        return this.db;
    }

    constructor() {
        //this.databaseFile = options && options.databaseFile || `model/retail.db`;    // 数据库文件(文件路径+文件名)
        //this.tableName = options && options.tableName || `adsTable`;   // 表名
        //this.db = null;    // 打开的数据库对象
    }

    // 连接数据库(不存在就创建,存在则打开)
    connectDataBase() {
        let _self = this;
        return new Promise<ResultDto>((resolve, reject) => {
            _self.db = new this.sqlite3.cached.Database(_self.databaseFile, function (err) {
            //_self.db = new this.sqlite3.Database(_self.databaseFile, function (err) {
                if (err) {
                    console.log(err);
                    reject(new ResultDto({ code: -1, date: err }));
                } else {
                    resolve(new ResultDto({ code: 0 }));
                }
            });
        });
    }

    /**
     * 创建表
     * @param sentence    CREATE TABLE 语句
     * @used
      let sentence = `
       create table if not exists ${this.tableName}(
            begin_time varchar(255),
            create_time varchar(255),
            end_time varchar(255),
            play_id varchar(255),
            postion_id int(50),
            status int(50),
            task_id int(50)
        );`;
     this.createTable(sentence);
     */
    createTable(sentence) {
        let _self = this;
        return new Promise<ResultDto>((resolve, reject) => {
            _self.db.exec(sentence, function (err) {
                if (err) {
                    reject(new ResultDto({ code: -1, date: err }));
                } else {
                    resolve(new ResultDto({ code: 0, msg: '创建成功 或 已存在' }));
                }
            });
        });
    }

    /**
     * 执行 增  删  改  查(单个数据查询或者多个数据查询)
     * @param sql    sql语句
     * @param param     参数(可以是数组或者数字或者字符串,根据sql语句来定)
     * @param mode    执行模式, 默认run,执行sql,如果查询的话,则使用get(单个)all(多个)
     * @returns {Promise}
       @used
       增 : this.sql(`insert into ${this.tableName} (begin_time, create_time, end_time, play_id, postion_id, status, task_id) values(?, ?, ?, ?, ?, ?, ?)`,
                    [obj.begin_time, obj.create_time, obj.end_time, obj.play_id, obj.postion_id, obj.status, obj.task_id]);

       删 : this.sql(`delete from ${this.tableName} where id = ?`, id);

       改 : this.sql(`update ${this.tableName} set begin_time = ?, status = ? where postion_id = ?`, [begin_timeValue, statusValue, postion_idValue]);

       查 : this.sql(`select * from ${this.tableName} where id = ?`, id, 'get/all');
     */
    sql(sql: any, param: any, mode: 'all' | 'get' | 'run') {
        let _self = this;
        mode = mode == 'all' ? 'all' : mode == 'get' ? 'get' : 'run';
        return new Promise<ResultDto>((resolve, reject) => {
            _self.db[mode](sql, param,
                function (err, data) {    // data: Array, Object
                    if (err) {
                        reject(new ResultDto({ code: -1, date: err }));
                    } else {
                        if (data) {
                            resolve(new ResultDto({ code: 0, date: data}));    // 返回数据查询成功的结果
                        } else {
                            resolve(new ResultDto({ code: 0, msg: 'success'}));    // 提示 增 删 改 操作成功
                        };
                    };
                }
            );
        });
    }

    execSql(sql: any, param: any, mode: 'all' | 'get' | 'run'): Promise<ResultDto>{
        return new Promise<ResultDto>((resolve, reject) => {
            this.connectDataBase().then((res) => {
                if(res.code == 0){
                    this.sql(sql, param, mode).then((sqlres) => {
                        this.close();
                        if(sqlres.code === 0){
                            resolve(sqlres);
                        } else {
                            console.error('执行sql失败：' + sqlres.data);
                            reject(sqlres);
                        }
                    });
                } else{
                    console.error('连接失败：' + res.data);
                    reject(res);
                }
            }); 
        });
    }

    createShopUserTable() {
        //ShopUser
        // 创建表(如果不存在的话,则创建,存在的话, 不会创建的,但是还是会执行回调)
        let sentence = `
        create table if not exists shopUsers(
            id varchar(36) PRIMARY KEY not null,
            account nvarchar(50) not null,
            password varchar(200) not null,
            name varchar(50),
            role int not null,
            shopId varchar(36),
            isEnable int,
            creationTime datetime,
            creatorUserId varchar(36),
            lastModificationTime datetime,
            lastModifierUserId varchar(36)
        );`;
        return this.createTable(sentence);
    }

    close(){
        if(this.db){
            this.db.close();
        }
    }

}

