import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { User } from 'firebase/app';
import { Profile } from '../models/profile/profile.interface';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  profileObject: AngularFireObject<Profile>;
  profileList: AngularFireList<Profile>;
  constructor(private database: AngularFireDatabase) { }

   addFriend(user1: Profile, user2: Profile) {
      console.log(user2);
      try {
      this.database.database.ref(`/friends/${user1.uid}/friends`).push(user2);
      this.database.database.ref(`/friends/${user2.uid}/friends`).push(user1);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  deleteFriend(user1: Profile, user2: Profile) {
    try {
      this.database.list(`/friends/${user1.uid}/friends`, res =>
      res.orderByChild('email').equalTo(user2.email)).remove();
      this.database.list(`/friends/${user2.uid}/friends`, res =>
      res.orderByChild('email').equalTo(user1.email)).remove();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  isFriend(user1: Profile, user2: Profile) {
    try {
      const isFriend = this.database.list(`/friends/${user1.uid}/friends`, res =>
      res.orderByChild('email').equalTo(user2.email)).valueChanges();
      return isFriend;
    } catch (e) {
      console.log(e);
    }
  }

  friendList(user: Profile) {
    try {
      console.log(user);
      const list = this.database.list(`/friends/${user.uid}/friends`).valueChanges();
      return list;
    } catch (e) {
      console.log(e);
    }
  }

  searchUser() {
    this.profileList = this.database.list('profiles');
    return     this.profileList.valueChanges();
  }

  getProfile(user) {
    console.log(user);
    this.profileObject = this.database.object(`/profiles/${user.uid}`);
    return  this.profileObject.valueChanges();
  }

  async saveProfile(user: User, profile: Profile) {
    this.profileObject = this.database.object(`/profiles/${user.uid}`);
    try {
      await this.profileObject.set(profile);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
