import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private router: Router, private storage: Storage) {
   }
  ngOnInit() {
  }
  navigate() {
   this.storage.keys().then(p => {
     console.log(p);
     this.storage.get('account').then( profile => {
     this.router.navigate([`/friend-list`, profile]);
   });
  });
}
}
