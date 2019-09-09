import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { State } from '../models/state/state.interface';
import { UtilsService } from 'src/app/utils.service';
@Injectable({
  providedIn: 'root'
})
export class PhotoService {


  constructor(private database: AngularFireDatabase, private utils: UtilsService) { }
  async deleteState(state) {
    try {
      await this.utils.deletefile(state.storageUrl);
      this.database.database.ref(`/photos-timeline/${state.id}`).remove();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }

  }
  async changeProfilePhoto(profile, url) {
    await this.database.database.ref(`/profiles/${profile.uid}`).child('avatar').set(url);
  }
  async upPhotoToTl(state) {
    await this.database.database.ref(`/photos-timeline/${state.id}`).set(state);
  }

   getTimeLine(): Observable<State[]> {
    const data = this.database.list(`photos-timeline`, res =>
    res.orderByChild('date')).valueChanges();
    return data as unknown as Observable<State[]>;
  }
}
