import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Profile } from '../../models/profile/profile.interface';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  profile = {} as Profile;
  more = false;
  new = true;
  constructor(private router: NavController, private params: ActivatedRoute) {
    this.params.paramMap.subscribe(paramMap => {
      console.log(paramMap.keys);
      this.new = !paramMap.has('firstName');
      this.profile.avatar = paramMap.get('avatar');
      this.profile.firstName = paramMap.get('firstName');
      this.profile.lastName = paramMap.get('lastName');
    });
   }

  ngOnInit() {
  }
  saveProfile(event: boolean) {
    event ? this.router.navigateRoot(['/tabs']) : console.log('error');
  }
}
