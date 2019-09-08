import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/providers/chat.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { DataService } from 'src/providers/data.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  list: any;
  account: any;
  constructor(private storage: Storage, private chat: ChatService,
              private router: Router, private data: DataService) { }

  ngOnInit() {
    this.chats();
  }
  ionViewWillEnter() {
    this.chats();
  }
  async chats() {
    await this.storage.keys().then( (p) => {
      console.log(p);
      this.storage.get('account').then((profile) => {
      this.account = profile;
      console.log(this.account);
      this.chat.getChats(this.account).subscribe((listF) => {
      listF.map(chat => {
        const time = new  Date(chat.date);
        console.log(time);
        console.log(chat);
        chat.date = time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        if (chat.content.length >= 20) {
          chat.content = chat.content.substring(0, 20) + '...';
        }
      });
      this.list = listF;
      console.log(this.list);
    });
  });
});
}
show(userId) {
  console.log(userId);
  const profile = {uid: this.account.uid === userId.userToId ? userId.userFromId : userId.userToId};
  this.data.getProfile(profile).pipe(take(1)).subscribe(res => {
    console.log(res);
    this.router.navigate([`/user`, res]); });
}
goChat(user) {
  const chat = {
    uid: this.account.uid === user.userToId ? user.userFromId : user.userToId,
    firstName: this.account.firstName === user.userToProfile.firstName ? user.userFromProfile.firstName : user.userToProfile.firstName,
    lastName: this.account.lastName === user.userToProfile.lastName ? user.userFromProfile.lastName : user.userToProfile.lastName,
    avatar: this.account.avatar === user.userToProfile.avatar ? user.userFromProfile.avatar : user.userToProfile.avatar,

  };
  this.router.navigate([`/chat`, chat]);
}
}
