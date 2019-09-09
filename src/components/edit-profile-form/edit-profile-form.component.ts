import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Profile } from '../../models/profile/profile.interface';
import { User } from 'firebase/app';
import { Subscription } from 'rxjs';
import { AuthService } from '../../providers/auth.service';
import { DataService } from '../../providers/data.service';
import { Account } from 'src/models/account/account.interface';
import { Storage } from '@ionic/storage';
import { UtilsService } from 'src/app/utils.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PhotoService } from 'src/providers/photo.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-edit-profile-form',
  templateUrl: './edit-profile-form.component.html',
  styleUrls: ['./edit-profile-form.component.scss'],
})
export class EditProfileFormComponent implements OnInit, OnDestroy {

  @Output() saveProfile = new EventEmitter<boolean>();
  @Input() profile: Profile;
  @Input() more: boolean;
  account = {} as Account;
  changeP = false;
  newPassword = '';
  newEmail: string;
  text = 'Change Password';
  private authenticatedUser$: Subscription;
  private authenticatedUser: User;
  time = 0;
  changePhoto = false;
  constructor(private auth: AuthService, private data: DataService, private storage: Storage,
              private camera: Camera, private utils: UtilsService, private media: PhotoService) {
    this.authenticatedUser$ = this.auth.getAuthUser().pipe(take(1)).subscribe((user: User) => {
      this.authenticatedUser = user;
      this.account.email = user.email;
      this.newEmail = user.email;
    });
   }

  ngOnInit() {
    if (!this.profile) {
      this.profile = {} as Profile;
    }
    console.log(this.profile);
  }

  async changeProfile() {
    if (this.more) {
      if (!this.changeP) {
        const result = await this.auth.changeEmail(this.account, this.newEmail);
        console.log(result);
        this.Save();
      } else {
        const result = await this.auth.changePassword(this.account, this.newPassword);
        this.saveProfile.emit(result);
      }
    } else {
      this.Save();
    }
  }

  change() {
    if (!this.changeP) {
      this.changeP = true;
      this.text = 'Change Email';
    } else {
      this.changeP = false;
      this.text = 'Change Password';
    }
  }

  async Save() {
    if (this.authenticatedUser) {
      !this.more ? this.profile.email = this.authenticatedUser.email : this.profile.email = this.newEmail;
      this.profile.firstName = this.profile.firstName.toLowerCase();
      this.profile.lastName = this.profile.lastName.toLowerCase();
      this.profile.uid = this.authenticatedUser.uid;
      const result = await this.data.saveProfile(this.authenticatedUser, this.profile);
      this.saveProfile.emit(result);
      result ? this.storage.set('account', this.profile) : console.log(result);
    }
  }
  ngOnDestroy(): void {
    this.authenticatedUser$.unsubscribe();
  }
  async pickImage() {
    const options: CameraOptions = {
      allowEdit: true,
      sourceType: 2,
      quality: 100,
      targetHeight: 200,
      targetWidth: 250,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    const cameraInfo = await this.camera.getPicture(options);

    try {
      this.changePhoto = true;
      this.time = 0;
      if (cameraInfo) {
      const blobInfo = await this.utils.makeFileIntoBlob(cameraInfo);
      const uploadInfo: any = await this.utils.uploadToFirebase(blobInfo);
      this.time = uploadInfo.time;
      console.log(uploadInfo);
      this.profile.avatar = uploadInfo.url;
      this.media.changeProfilePhoto(this.authenticatedUser, this.profile.avatar).then(
        res => console.log(res));
      this.storage.set('account', this.profile);
      alert('File Upload Success ' + uploadInfo.url);
      }
    } catch (e) {
      alert(e.message);
      alert('File Upload Error ' + e.message);
    }
  }
}
