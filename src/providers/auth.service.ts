import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Account } from '../models/account/account.interface';
import { LoginResponse } from 'src/models/login/login-response.interface';
import { auth } from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private authd: AngularFireAuth) { }

  getAuthUser() {
    return this.authd.authState;
  }

  logout() {
    this.authd.auth.signOut();
  }

  reauth(account: Account) {
      const result = this.authd.auth.currentUser
      .reauthenticateWithCredential(auth.EmailAuthProvider
        .credential(account.email, account.password));
      return result;
  }

  changePassword(account: Account, newP: string ) {
    try {
      this.reauth(account).then(() => {
      this.authd.auth.currentUser.updatePassword(newP)
      .then((data) => {
        console.log(data);
        account.password = newP;
        this.singIn(account);
      });
    });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  changeEmail(account: Account, newE: string ) {
    try {
      console.log(account);
      this.reauth(account).then(() => {
        this.authd.auth.currentUser.updateEmail(newE)
        .then((data) => {
        console.log(data);
        account.email = newE;
        this.singIn(account);
      });
    });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  async createUser(account: Account) {
    try {
      console.log(account.email, account.password);
      const data =  await this.authd.auth.createUserWithEmailAndPassword(account.email, account.password);
      return {
       result: {email: data.user.email, uid: data.user.uid
       }
      } as LoginResponse;
      } catch (e) {
        return {
          error: { code: e.code, message: e.message}
        } as LoginResponse;
      }
  }
  async singIn(account: Account) {
    try {
      console.log(account.email, account.password);
      const data =  await this.authd.auth.signInWithEmailAndPassword(account.email, account.password);
      return {
       result: {email: data.user.email, uid: data.user.uid
       }
      } as LoginResponse;
      } catch (e) {
        return {
          error: { code: e.code, message: e.message}
        } as LoginResponse;
      }
  }
}
