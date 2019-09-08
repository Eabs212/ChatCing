import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Profile } from 'src/models/profile/profile.interface';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  user = {} as Profile;
  constructor(private params: ActivatedRoute, private toast: ToastController) {
    this.params.paramMap.subscribe(paramMap => {
      console.log(paramMap.keys);
      console.log(paramMap.get('firstName') + ' ' + paramMap.get('lastName') );
      this.user.firstName = paramMap.get('firstName');
      this.user.lastName = paramMap.get('lastName');
      this.user.dateOfBirth = new Date(paramMap.get('dateOfBirth')).toISOString() as unknown as Date;
      this.user.uid = paramMap.get('uid');
      this.user.email = paramMap.get('email');
      this.user.avatar = paramMap.get('avatar');
      console.log(this.user);
    });
   }

  ngOnInit() {
  }
  addFriend(event) {
    if (event.res) {
      this.toast.create({
        message: `Friend ${event.op}`,
        duration: 2000
      }).then((data) => {
        data.present();
      });
      } else {
      this.toast.create({
        message: `Error`,
        duration: 2000
      }).then((data) => {
        data.present();
      });
    }
  }
}
