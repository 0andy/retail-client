import { Component, Injector } from '@angular/core';
import { FormComponentBase } from '@shared/component-base/form-component-base';
import { InventoryDetail, Inventory, selectGroup, EditInventoryCache } from 'app/entities';
import { BehaviorSubject } from 'rxjs';
import { putFormService, putDetailService } from 'app/services/warehouse';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'app/services/product';
import { Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    moduleId: module.id,
    selector: 'inventory-detail',
    templateUrl: 'inventory-detail.component.html',
    styleUrls: ['inventory-detail.component.less'],
    providers: [ProductService]
})
export class InventoryDetailComponent extends FormComponentBase<Inventory> {
    id: string;
    status: string;
    keyWord: string;
    inventory: Inventory = new Inventory();
    dataList: InventoryDetail[] = [];
    editCache: EditInventoryCache[] = [];
    searchChange$ = new BehaviorSubject('');
    optionList: selectGroup[] = [];
    isLoading = false;

    constructor(
        injector: Injector
        , private putFormService: putFormService
        , private putDetailService: putDetailService
        , private router: Router
        , private actRouter: ActivatedRoute
        , private productService: ProductService
    ) {
        super(injector);
        this.id = this.actRouter.snapshot.params['id'];
    }

    ngOnInit() {
        this.validateForm = this.formBuilder.group({
            formNo: ['', [Validators.required, Validators.maxLength(50)]],
            remark: ['', [Validators.maxLength(200)]],
            userAccount: [''],
            creationTime: [''],
        });
        this.getInventory();
        this.searchChange$.pipe(
            debounceTime(300),
            distinctUntilChanged()).subscribe(term => {
                if (term && term.length >= 1) {
                    this.getProductSelectGroup(term);
                }
            });
    }

    onSearch(keyWord: string): void {
        this.optionList = [];
        if (keyWord && keyWord.length >= 1) {
            this.isLoading = true;
            this.searchChange$.next(keyWord);
        }
    }

    getProductSelectGroup(term: string) {
        this.productService.getProductSelectGroup(term).then((res) => {
            this.isLoading = false;
            if (res) {
                res.forEach(v => {
                    var temp: selectGroup = new selectGroup();
                    temp.id = v.id;
                    temp.text = `${v.name}(${v.barCode})(${v.sellPrice}元/${v.unit})`;
                    this.optionList.push(temp);
                });
            } else {
                this.optionList = [];
            }
        });
    }

    addTable(id: any) {
        if (id) {
            this.productService.getProuductStockById(id).then((res) => {
                if (res) {
                    if (!this.existsProduct(id)) {
                        if (!res.num) {
                            res.num = 0;
                        }
                        res.num = res.currentNum;
                        this.dataList.push(res);
                        this.syncEditCache();
                    }
                } else {
                    this.message.error('没有获取到商品信息');
                }
            });
        }
    }

    existsProduct(id: string): boolean {
        let bo = false;
        this.keyWord = null;
        this.dataList.forEach(v => {
            if (v.productId == id) {
                bo = true;
                return;
            }
        });
        return bo;
    }

    deleteProduct(id: string) {
        let i = 0;
        this.dataList.forEach(v => {
            if (v.productId == id) {
                this.dataList.splice(i, 1);
                this.syncEditCache();
                return;
            }
            i++;
        });
    }

    startEdit(key: any): void {
        this.editCache[key].edit = true
    }

    cancelEdit(key: string): void {
        this.editCache[key].edit = false;
    }

    saveEdit(key: any, id: string): void {
        console.log(this.editCache[key].data);
        console.log(this.dataList[key]);
        Object.assign(this.dataList[key], this.editCache[key].data);
        this.editCache[key].edit = false;
    }

    syncEditCache() {
        this.editCache = [];
        this.dataList.forEach(v => {
            var temp: EditInventoryCache = new EditInventoryCache();
            temp.edit = false;
            temp.data = v.clone();
            this.editCache.push(temp);
        });
    }

    getInventoryDetail() {
        if (this.id) {
            this.putDetailService.getInventoryDetailNoPage(this.id).then((res) => {
                if (res) {
                    this.dataList = res;
                    this.syncEditCache();
                } else {
                    this.message.error('没有获取到订单详情');
                }
            })
        }
    }

    getInventory(): void {
        this.validateForm.get('formNo').disable();
        this.validateForm.get('userAccount').disable();
        this.validateForm.get('creationTime').disable();
        if (this.id) {
            this.putFormService.getInventory(this.id).then((res) => {
                if (res) {
                    this.inventory = res;
                    this.validateForm.get('remark').disable();
                    this.setFormValues(this.inventory);
                } else {
                    this.message.error('没有获取到订单信息');
                }
            });
            this.getInventoryDetail();
        }
        else {
            var date = new Date();
            var year = date.getFullYear().toString(); //获取当前年份
            var mon = (date.getMonth() + 1); //获取当前月份
            var da = date.getDate(); //获取当前日
            var h = date.getHours(); //获取小时
            var m = date.getMinutes(); //获取分钟
            var s = date.getSeconds(); //获取秒
            var formNo = year
                + (mon > 9 ? mon : '0' + mon).toString()
                + (da > 9 ? da : '0' + da).toString()
                + (h > 9 ? h : '0' + h).toString()
                + (m > 9 ? m : '0' + m).toString()
                + (s > 9 ? s : '0' + s).toString();
            var newFormNo = 'PD' + formNo;
            this.setControlVal('formNo', newFormNo);
            this.setControlVal('userAccount', this.settings.user['name']);
        }
    }

    protected setFormValues(entity: Inventory): void {
        this.setControlVal('formNo', entity.formNo);
        this.setControlVal('remark', entity.remark);
    }

    protected getFormValues(): void {
        this.inventory.formNo = this.getControlVal('formNo');
        this.inventory.remark = this.getControlVal('remark');
    }

    protected submitExecute(finisheCallback: Function): void {
        if (this.validateForm.valid) {
            let otherInfo: any = {};
            otherInfo.userId = this.settings.user['id'];
            otherInfo.account = this.settings.user['account'];
            otherInfo.shopId = this.settings.user['shopId'];
            this.modalService.confirm({
                nzTitle: '确定要盘点当前订单吗?',
                nzContent: `<b>盘点单号[${this.inventory.formNo}]</b>`,
                nzOnOk: () => {
                    this.putFormService.saveInventory(this.inventory, this.dataList, otherInfo).then((res) => {
                        finisheCallback();
                        if (res.code == 0) {
                            this.message.success('商品库存修改成功');
                            this.return();
                        } else {
                            this.message.error('商品库存修改失败');
                        }
                    });
                }
            });
            // this.putFormService.saveInventory(this.inventory, this.dataList, otherInfo).then((res) => {
            //     finisheCallback();
            //     if (res.code == 0) {
            //         this.message.success('保存数据成功');
            //         this.return();
            //     } else {
            //         this.message.error('保存数据失败');
            //         console.log(res.data);
            //     }
            // });
        }
    }

    return() {
        this.router.navigate(['warehouse/inventory']);
    }

}
