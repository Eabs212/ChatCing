import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { mergeMap, first } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { Message } from 'src/models/messages/messages.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private db: AngularFireDatabase) { }

    getMessages(profile , user) {
      console.log(profile);
      console.log(user);
      return this.db.list(`/user-messages/${profile.uid}/${user.uid}`).snapshotChanges()
      .pipe(mergeMap(chats => {
          return forkJoin(chats.map( chat => this.db.object(`/messages/${chat.key}`).valueChanges()
          .pipe(first())),
          (...vals) => vals );
      }));

  }
  async sendMessages(message) {
   console.log(message);
   await this.db.list(`/messages/`).push(message);
  }
  getChats(profile): Observable<Message[]> {
    console.log(profile);
    const t = this.db.list(`/last-messages/${profile.uid}`).valueChanges()
    .pipe(mergeMap(chats => {
        return forkJoin(chats.map( chat => this.db.object(`/messages/${chat}`).valueChanges()
        .pipe(first())),
        (...vals) => vals );
    }));
    return t;  }
}
