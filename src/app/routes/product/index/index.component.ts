import { Component, ViewChild, Injector } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { CategoryService, ProductService } from 'app/services/product';
import { RetailProduct } from 'app/entities';
import { NzTreeNode, NzDropdownContextComponent, NzTreeComponent, NzFormatEmitEvent, NzDropdownService } from 'ng-zorro-antd';
import { PagedRequestDto, PagedListingComponentBase } from '@shared/component-base/paged-listing-component-base';
import { Router } from '@angular/router';
import { ProductConfirmComponent } from './product-confirm/product-confirm.component';

@Component({
  selector: 'app-product-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less'],
})
export class ProductComponent extends PagedListingComponentBase<RetailProduct>{
  @ViewChild('treeCom') treeCom: NzTreeComponent;
  @ViewChild('createModal') createModal: ProductConfirmComponent;
  nodes = [];
  dropdown: NzDropdownContextComponent;
  activedNode: NzTreeNode;
  search: any = {};
  tempNode: string = 'root';
  constructor(
    injector: Injector
    , private categoryService: CategoryService
    , private productService: ProductService
    , private router: Router
  ) {
    super(injector);
  }

  ngOnInit() {
    this.getTreeAsync();
  }

  createTable() {
    this.categoryService.createTable();
  }

  protected fetchData(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.productService.getAll(this.tempNode, request.skipCount, request.maxResultCount).finally(() => {
      finishedCallback();
    }).then((res) => {
      console.log(res);
      if (res) {
        this.dataList = res.items;
        this.totalItems = res.totalCount;
      } else {
        this.dataList = [];
        this.totalItems = 0;
      }
    });
  }

  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  refreshData() {
    this.pageNumber = 1;
    this.refresh();
  }

  protected delete(entity: RetailProduct): void {
    // this.modalService.confirm({
    //   nzTitle: '确定要删除该用户吗？',
    //   nzContent: `<b>用户账号[${entity.account}]</b>`,
    //   nzOnOk: () => {
    //     this.shopUserService.delete(entity.id).then((res) => {
    //       if (res.code == 0) {
    //         this.message.success('删除成功');
    //         this.refreshData();
    //       } else {
    //         this.message.error('删除失败');
    //       }
    //     });
    //   }
    // });
  }

  createProduct() {
    this.createModal.show();
  }

  createProduct2() {
    this.router.navigate(['/product/product-detail'])
  }

  goDetail(id: string) {
    // this.router.navigate(['routes/product/product-detail', id])
    this.router.navigate(['product/product-detail'])
  }

  /*商品类型数*/
  getTreeAsync() {
    this.categoryService.getCategoryTree().finally(() => {
    }).then((res) => {
      if (res) {
        this.nodes = res;
      } else {
        this.nodes = [];
      }
    }).then(() => {
      this.refreshData();
    });
  }

  openFolder(data: NzTreeNode | NzFormatEmitEvent): void {
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      data.node.isExpanded = !data.node.isExpanded;
    }
  }

  activeNode(data: NzFormatEmitEvent): void {
    if (this.activedNode) {
      this.treeCom.nzTreeService.setSelectedNodeList(this.activedNode);
    }
    data.node.isSelected = true;
    this.activedNode = data.node;
    this.tempNode = data.node.key;
    this.treeCom.nzTreeService.setSelectedNodeList(this.activedNode);
    this.refreshData();
  }

  // changeProductStatus(status:boolean,id:string){
  //   this.productService.changeProductStatus()
  // }
}
