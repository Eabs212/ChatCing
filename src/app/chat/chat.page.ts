import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/providers/auth.service';
import { User } from 'firebase';
import {IonContent, ModalController} from '@ionic/angular';
import { Profile } from 'src/models/profile/profile.interface';
import { DataService } from 'src/providers/data.service';
import { ChatService } from 'src/providers/chat.service';
import { Message } from 'src/models/messages/messages.interface';
import { ChatPhotoPage} from '../chat-photo/chat-photo.page';
import { take } from 'rxjs/operators';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy  {

  dataReturned: any;
  user = {} as Profile;
  message = '';
  messages: [];
  account: Profile;
  messages$: Subscription;
  @ViewChild(IonContent, {static: true}) contentArea: IonContent;
  constructor(private navParam: ActivatedRoute , private chat: ChatService,
              private auth: AuthService, private data: DataService,
              public modalController: ModalController, private view: PhotoViewer) {
    this.navParam.paramMap.subscribe((paramMap) => {
      console.log(paramMap.keys);
      this.user.uid = paramMap.get('uid');
      this.user.firstName = paramMap.get('firstName');
      this.user.lastName = paramMap.get('lastName');
      this.user.avatar = paramMap.get('avatar');
      this.data.getProfile(this.user).pipe(take(1)).subscribe(async (profile: Profile) => {
        this.user = profile;
      });
      console.log(this.user);
    });
    this.auth.getAuthUser().pipe(take(1)).subscribe((user: User) => {
      this.data.getProfile(user).pipe(take(1)).subscribe(async (profile: Profile) => {
        this.account = profile;
        this.messages$ = await this.chat.getMessages(this.account, this.user).subscribe(async res => {
          res.map(message =>  message.date = this.getDate(message.date));
          this.messages = await res;
          this.contentArea.scrollToBottom();
          console.log(this.messages);
    });
  });
});

  }
  ngOnInit() {
  }
  ionViewDidEnter() {
    this.contentArea.scrollToBottom();

  }
  async sendMessage() {
     const message: Message = {
       userToId: this.user.uid,
       userToProfile: {
         firstName: this.user.firstName,
         lastName: this.user.lastName,
         avatar: this.user.avatar ? this.user.avatar : '../../assets/shapes.svg'
       },
       userFromId: this.account.uid,
       userFromProfile: {
         firstName: this.account.firstName,
         lastName: this.account.lastName,
         avatar: this.account.avatar ? this.account.avatar : '../../assets/shapes.svg'
       },
       date: new Date().toString(),
       content: this.message,
       type: 1
     };
     if (this.message !== '') {
     await this.chat.sendMessages(message);
     this.message = '';
     this.contentArea.scrollToBottom();
     }

  }
  getDate(val) {
    const date = new Date(val);
    const prettyDate = date.toLocaleDateString([], {hour: '2-digit', minute: '2-digit'});
    return prettyDate;
  }

  async openModal() {
    const message = {
      userToId: this.user.uid,
      userToProfile: {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        avatar: this.user.avatar ? this.user.avatar : '../../assets/shapes.svg'
      },
      userFromId: this.account.uid,
      userFromProfile: {
        firstName: this.account.firstName,
        lastName: this.account.lastName,
        avatar: this.account.avatar ? this.account.avatar : '../../assets/shapes.svg'
      },
    };
    const modal = await this.modalController.create({
      component: ChatPhotoPage, componentProps: message
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        // alert('Modal Sent Data :'+ dataReturned);
      }
    });

    return await modal.present();
  }
  showPic(url) {
    this.view.show(url, 'Photo', {share: true});
  }
  ngOnDestroy(): void {
    this.messages$.unsubscribe();
  }
}
