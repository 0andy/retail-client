import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'shop-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less'],
})
export class CartComponent implements OnInit {

  systeminfo: any;
  tssysteminfo: any;

  constructor(
    private http: _HttpClient
  ) {
  }

  ngOnInit() {
    var os = (<any>window).require('os');
    this.tssysteminfo = os.platform();
  }

  opennw() {
    nw.Window.open('https://www.mi.com/', {}, function (new_win) {
      // do something with the newly created window
    });
  }

  getSqlitdate() {
    var sqlite3 = (<any>window).require('sqlite3').verbose();
    var db = new sqlite3.Database(':memory:');

    db.serialize(function () {
      db.run("CREATE TABLE lorem (info TEXT)");

      var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
      for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
      }
      stmt.finalize();

      db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
        console.log(row.id + ": " + row.info);
      });
    });

    db.close();
  }

}
