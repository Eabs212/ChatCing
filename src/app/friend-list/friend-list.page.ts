import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/models/profile/profile.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/providers/data.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.page.html',
  styleUrls: ['./friend-list.page.scss'],
})
export class FriendListPage implements OnInit {

  list = [];
  user = {} as Profile;
  constructor(private params: ActivatedRoute, private data: DataService, private router: Router) {
    this.params.paramMap.subscribe(paramMap => {
      this.user.uid = paramMap.get('uid');
      this.user.email = paramMap.get('email');
      this.user.firstName = paramMap.get('firstName');
      this.user.lastName = paramMap.get('lastName');
      this.data.friendList(this.user).subscribe(listF => {
        if (this.list.length !== listF.length) {
        listF.map(async elemt => {
          await this.data.getProfile(elemt).subscribe(async profile => {
            await this.list.push(profile);
          });
        });
      }
        console.log(listF);
      });
    });
   }

  ngOnInit() {
  }
  show(user) {
    this.router.navigate([`/user`, user]);
  }
  chat(user) {
    this.router.navigate([`/chat`, user]);
  }
}
