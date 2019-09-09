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

   follow(user1: Profile, user2: Profile) {
      console.log(user2);
      try {
      this.database.database.ref(`/follows/${user1.uid}/follow`).push(user2);
      this.database.database.ref(`/followers/${user2.uid}/follow`).push(user1);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  block(user1: Profile, user2: Profile) {
    console.log(user2);
    try {
    this.unFollow(user1, user2);
    this.database.database.ref(`/blocks/${user1.uid}/block`).push(user2);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

disBlock(user1: Profile, user2: Profile) {
  try {
    this.database.list(`/blocks/${user1.uid}/block`, res =>
    res.orderByChild('uid').equalTo(user2.uid)).remove();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
  unFollow(user1: Profile, user2: Profile) {
    try {
      this.database.list(`/follows/${user1.uid}/follow`, res =>
      res.orderByChild('uid').equalTo(user2.uid)).remove();
      this.database.list(`/followers/${user2.uid}/follow`, res =>
      res.orderByChild('uid').equalTo(user1.uid)).remove();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  isFollow(user1: Profile, user2: Profile) {
    try {
      console.log(user1);
      console.log(user2);

      const isFriend = this.database.list(`/follows/${user1.uid}/follow`, res =>
      res.orderByChild('uid').equalTo(user2.uid)).valueChanges();
      return isFriend;
    } catch (e) {
      console.log(e);
    }
  }
  isBlock(user1: Profile, user2: Profile) {
    try {
      console.log(user1);
      console.log(user2);

      const isFriend = this.database.list(`/blocks/${user1.uid}/block`, res =>
      res.orderByChild('uid').equalTo(user2.uid)).valueChanges();
      return isFriend;
    } catch (e) {
      console.log(e);
    }
  }
  iamBlock(user1: Profile, user2: Profile) {
    try {
      console.log(user1);
      console.log(user2);

      const isFriend = this.database.list(`/blocks/${user2.uid}/block`, res =>
      res.orderByChild('uid').equalTo(user1.uid)).valueChanges();
      return isFriend;
    } catch (e) {
      console.log(e);
    }
  }
  listFollows(user: Profile) {
    try {
      console.log(11);

      console.log(user);
      const list = this.database.list(`/follows/${user.uid}/follow`).valueChanges();
      return list;
    } catch (e) {
      console.log(e);
    }
  }
  listFollowers(user: Profile) {
    try {
      console.log(1);
      console.log(user);
      const list = this.database.list(`/followers/${user.uid}/follow`).valueChanges();
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
