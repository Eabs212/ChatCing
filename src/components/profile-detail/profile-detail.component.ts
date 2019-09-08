import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from 'src/providers/auth.service';
import { DataService } from 'src/providers/data.service';
import { Profile } from 'src/models/profile/profile.interface';
import { User } from 'firebase';
import { NavController} from '@ionic/angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { Storage } from '@ionic/storage';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss'],
})
export class ProfileDetailComponent implements OnInit {
  userProfile: Profile;
  accountProfile: Profile;
  followingUser = false;
  list = [];
  @Output() existingProfile: EventEmitter<Profile>;
  @Output() Operation;
  @Input() profile: Profile;
  constructor(private auth: AuthService, private data: DataService,
              private nav: NavController, private spinner: SpinnerDialog, private storage: Storage,
              private view: PhotoViewer) {
                this.existingProfile = new EventEmitter<Profile>();
                this.Operation = new EventEmitter<any>();
               }

  ngOnInit() {
    this.spinner.show('Profile', 'Wait please...');
    if (this.profile) {
      this.userProfile = this.profile;
      this.storage.get('account').then( profile => {
          this.accountProfile = profile;
          this.data.isFriend(this.accountProfile, this.userProfile).subscribe((data) => {
          data.length ? this.followingUser = true : this.followingUser = false;
          this.friendList();
          this.spinner.hide();
        });
      });
    } else {
      this.auth.getAuthUser().subscribe((user: User) => {
        this.data.getProfile(user).subscribe((profile: Profile) => {
          this.spinner.hide();
          this.userProfile = profile as Profile;
          this.existingProfile.emit(this.userProfile);
          this.friendList();
        });
      });
    }
  }



  addFriend() {
      const result = this.data.addFriend(this.accountProfile, this.userProfile);
      console.log(result);
      const data = { res: result, op: 'added' };
      this.Operation.emit(data);
  }

  friendList() {
     this.data.friendList(this.userProfile).subscribe((listF) => {
       this.list = listF;
       console.log(this.list);
     });
  }
  deleteFriend() {
    const result = this.data.deleteFriend(this.accountProfile, this.userProfile);
    const data = { res: result, op: 'dismiss' };
    this.Operation.emit(data);
  }

  logout() {
    this.storage.remove('account').then(res => console.log(res));
    this.auth.logout();
    this.nav.navigateRoot([`/login`]);
  }

  navigate() {
    const user = this.userProfile;
    this.nav.navigateForward([`/friend-list`, user]);
  }
  showPic(url) {
    this.view.show(url, 'Photo', {share: true});
  }
  ready() {
    console.log('ready');
    this.spinner.hide();
  }
}
