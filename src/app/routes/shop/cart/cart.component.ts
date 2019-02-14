import { Component, Injector, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { RetailProduct, selectGroup, OrderDetail, Member } from 'app/entities';
import { ProductService } from 'app/services/product';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MemberConfirmComponent } from 'app/routes/common/member-confirm/member-confirm.component';
import { MemberService } from 'app/services/member';
import { AltNumComponent } from '../alt-num/alt-num.component';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'shop-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less'],
  providers: [ProductService, MemberService]
})
export class CartComponent {
  @ViewChild('createModal') createModal: MemberConfirmComponent;
  @ViewChild('numModal') numModal: AltNumComponent;

  keyWord: string;
  dataList: OrderDetail[] = [];
  searchChange$ = new BehaviorSubject('');
  optionList: selectGroup[] = [];
  member: Member = new Member();
  isLoading = false;
  totalPrice: number = 0;
  pageType: string = 'cart';
  constructor(
    injector: Injector
    , private productService: ProductService
    , private router: Router
    , private message: NzMessageService
    , private actRouter: ActivatedRoute) {
    // super(injector);
  }

  ngOnInit() {
    this.searchChange$.pipe(
      debounceTime(300),
      distinctUntilChanged()).subscribe(term => {
        if (term && term.length >= 1) {
          this.getProductSelectGroup(term);
        }
      });
  }
  // resetSearch() {
  //   this.pageNumber = 1;
  //   this.keyWord = null;
  //   this.refresh();
  // }

  delete(index: number) {
    this.dataList.splice(index, 1);
    this.calculationPrice();
  }

  addTable(id: any) {
    if (id) {
      this.productService.getProuductCartById(id).then((res) => {
        if (res) {
          if (!this.existsProduct(id)) {
            if (!res.num || res.num === 0) {
              res.num = 1;
            }
            if (!res.sellPrice) {
              res.sellPrice = 0;
            }
            if (!res.num || res.num === 0) {
              res.num = res.num;
            }
            this.dataList.push(res);
            this.calculationPrice();
          }
        } else {
          this.message.error('没有获取到商品信息');
        }
      });
    }
  }

  getProductSelectGroup(term: string) {
    this.productService.getProductSelectGroup(term).then((res) => {
      this.isLoading = false;
      if (res) {
        res.forEach(v => {
          var temp: selectGroup = new selectGroup();
          temp.id = v.id;
          temp.text = `${v.name}(${v.barCode})`;
          this.optionList.push(temp);
        });
      } else {
        this.optionList = [];
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

  existsProduct(id: string): boolean {
    let bo = false;
    this.keyWord = null;
    this.dataList.forEach(v => {
      if (v.productId == id) {
        v.num++;
        bo = true;
        this.calculationPrice();
        return;
      }
    });
    return bo;
  }

  altNum(index: number) {
    this.numModal.show(this.dataList[index]);
  }

  calculationPrice() {
    this.totalPrice = 0;
    if (this.member.id) {
      this.dataList.forEach(v => {
        this.totalPrice += v.num * (v.isEnableMember == true ? (v.memberPrice == 0 ? v.sellPrice : v.memberPrice) : v.sellPrice);
      });
    } else {
      this.dataList.forEach(v => {
        this.totalPrice += v.num * v.sellPrice;
      });
    }
  }

  createMember() {
    this.createModal.show(true);
  }

  getMemberData = (data?: Member) => {
    if (data) {
      // this.member.id = 
      // this.member.name = data.name;
      // this.member.integral = data.integral;
      this.member = data;
      this.calculationPrice();
    }
  }

  getNumData = (data?: OrderDetail) => {
    if (data) {
      this.dataList.forEach(v => {
        if (data.productId == v.productId) {
          v.num = data.num;
        }
      });
    }
  }

  accounting() {
    alert('结账');
  }
}
