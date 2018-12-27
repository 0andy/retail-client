import { Component, ViewChild, Injector } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { CategoryService, ProductService } from 'app/services/product';
import { RetailProduct } from 'app/entities';
import { NzTreeNode, NzDropdownContextComponent, NzTreeComponent, NzFormatEmitEvent, NzDropdownService } from 'ng-zorro-antd';
import { PagedRequestDto, PagedListingComponentBase } from '@shared/component-base/paged-listing-component-base';
import { Router, ActivatedRoute } from '@angular/router';
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
  tempNode: string = 'root';
  keyWord: string;
  pageType: string;
  hTitle: string;
  smallTitle: string;

  constructor(
    injector: Injector
    , private categoryService: CategoryService
    , private productService: ProductService
    , private router: Router
    , private actRouter: ActivatedRoute
  ) {
    super(injector);
    this.pageType = this.actRouter.snapshot.params['pageType'];
  }

  ngOnInit() {
    if (this.pageType) {
      this.hTitle = '实时库存';
      this.smallTitle = '仓库商品实时库存查询';
    } else {
      this.hTitle = '商品管理';
      this.smallTitle = '商品入库管理';
    }
    this.getTreeAsync();
  }

  updateStatus(item: RetailProduct): void {
    this.modalService.confirm({
      nzTitle: item.isEnable ? '确定要禁用该商品吗?' : '确定要启用该商品吗?',
      nzContent: `<b>商品名称[${item.name}]</b>`,
      nzOnOk: () => {
        this.productService.updateStatus(item.id, !item.isEnable, this.settings.user['id']).then((res) => {
          if (res.code == 0) {
            this.message.success('操作成功');
            this.refresh();
          } else {
            this.message.error('操作失败');
          }
        });
      }
    });
  }

  protected fetchData(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    if (this.pageType) {
      this.productService.getAllWithStatus(this.tempNode, this.keyWord, request.skipCount, request.maxResultCount).finally(() => {
        finishedCallback();
      }).then((res) => {
        if (res) {
          this.dataList = res.items;
          this.totalItems = res.totalCount;
        } else {
          this.dataList = [];
          this.totalItems = 0;
        }
      });
    }
    else {
      this.productService.getAll(this.tempNode, this.keyWord, request.skipCount, request.maxResultCount).finally(() => {
        finishedCallback();
      }).then((res) => {
        if (res) {
          this.dataList = res.items;
          this.totalItems = res.totalCount;
        } else {
          this.dataList = [];
          this.totalItems = 0;
        }
      });
    }
  }

  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  refreshData() {
    // this.keyWord = null;
    this.pageNumber = 1;
    this.refresh();
  }

  protected delete(entity: RetailProduct): void {
  }

  createProduct() {
    this.createModal.show();
  }

  goDetail(id: string) {
    this.router.navigate(['product/product-detail', id]);
  }

  goWaterDetail(barCode: string) {
    this.router.navigate(['warehouse/water', barCode]);
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
    this.keyWord = null;
    this.refreshData();
  }

  // changeProductStatus(status:boolean,id:string){
  //   this.productService.changeProductStatus()
  // }
}
