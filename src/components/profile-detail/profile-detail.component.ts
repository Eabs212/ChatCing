import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { AuthService } from 'src/providers/auth.service';
import { DataService } from 'src/providers/data.service';
import { Profile } from 'src/models/profile/profile.interface';
import { User } from 'firebase';
import { NavController} from '@ionic/angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { Storage } from '@ionic/storage';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss'],
})
export class ProfileDetailComponent implements OnInit, OnDestroy {

  userProfile: Profile;
  accountProfile: Profile;
  followingUser = false;
  list = [];
  @Output() existingProfile: EventEmitter<Profile>;
  @Output() Operation;
  @Input() profile: Profile;
  private checkBlock$: Subscription;
  private checkIamBlock$: Subscription;
  private checkIsFollow$: Subscription;

  listF = [];
  block = false ;
  iamblock = false;
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
          this.checkIamBlock$ = this.data.iamBlock(this.accountProfile, this.userProfile).subscribe((data) => {
            console.log(data);
            data.length ? this.iamblock = true : this.iamblock = false;
            this.spinner.hide();
            console.log('iamblock' + this.iamblock);

          });
          this.checkBlock$ = this.data.isBlock(this.accountProfile, this.userProfile).subscribe((data) => {
            console.log(data);
            data.length ? this.block = true : this.block = false;
            this.spinner.hide();
            console.log('block' + this.block);

          });
          this.checkIsFollow$ = this.data.isFollow(this.accountProfile, this.userProfile).subscribe((data) => {
          console.log(data);
          data.length ? this.followingUser = true : this.followingUser = false;
          this.listFollows();
          this.listFollowers();
          this.spinner.hide();
          console.log('fo' + this.followingUser);

        });
      });

    } else {
      this.auth.getAuthUser().subscribe((user: User) => {
        this.data.getProfile(user).subscribe((profile: Profile) => {
          this.spinner.hide();
          this.userProfile = profile as Profile;
          this.existingProfile.emit(this.userProfile);
          this.listFollows();
          this.listFollowers();

        });
      });
    }
  }



  follow() {
      const result = this.data.follow(this.accountProfile, this.userProfile);
      console.log(result);
      const data = { res: result, op: 'Follow' };
      this.Operation.emit(data);
  }

  listFollows() {
     this.data.listFollows(this.userProfile).subscribe((list) => {
       this.list = list;
       console.log(this.list);
     });
  }
  listFollowers() {
    this.data.listFollowers(this.userProfile).subscribe((listF) => {
      this.listF = listF;
      console.log(this.list);
    });
 }
  unFollow() {
    const result = this.data.unFollow(this.accountProfile, this.userProfile);
    const data = { res: result, op: 'Unfollow ' };
    this.Operation.emit(data);
  }

  logout() {
    this.storage.remove('account').then(res => console.log(res));
    this.auth.logout();
    this.nav.navigateRoot([`/login`]);
  }

  navigate(val) {
    const user = {uid: this.userProfile.uid , email: this.userProfile.email , op: val};
    this.nav.navigateForward([`/friend-list`, user]);
  }
  showPic(url) {
    this.view.show(url, 'Photo', {share: true});
  }
  ready() {
    console.log('ready');
    this.spinner.hide();
  }
  blockUser() {
    const result = this.data.block(this.accountProfile, this.userProfile);
    console.log(result);
    const data = { res: result, op: 'Block' };
    this.Operation.emit(data);
  }
  disBlock() {
    const result = this.data.disBlock(this.accountProfile, this.userProfile);
    console.log(result);
    const data = { res: result, op: 'Disblock' };
    this.Operation.emit(data);
  }
  ngOnDestroy(): void {
    this.checkBlock$.unsubscribe();
    this.checkIamBlock$.unsubscribe();
    this.checkIsFollow$.unsubscribe();
  }
}
