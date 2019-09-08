import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { File } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  time = 0;

  constructor(private file: File) { }


  getBeautifiedDate = (creationTime) => {
const seconds = Math.floor((Date.now() - creationTime) / 1000);
// const date = new Date(creationTime);
if (seconds < 0) { return ''; }
if (seconds <= 10) { return 'a few seconds ago'; } else if (seconds < 60) { return seconds + ' seconds ago';
} else if (seconds < 3600) {
            const unit = Math.trunc(seconds / 60) === 1 ? ' minute ago' : ' minutes ago';
            return Math.trunc(seconds / 60) + unit;
        } else if (seconds < 86400) {
            const unit = Math.trunc(seconds / 3600) === 1 ? ' hour ago' : ' hours ago';
            return Math.trunc(seconds / 3600) + unit;
        // } else if (seconds < 172800) {
        } else {
          return 'delete';
/* let hours, suffix, minutes;
if (date.getHours() > 12) { hours = date.getHours() - 12; suffix = ' PM';
 } else { hours = date.getHours(); suffix = ' AM'; }
if (date.getMinutes() < 10) { minutes = '0' + date.getMinutes();
 } else { minutes = date.getMinutes(); }
if (hours === 0) { hours = 12; }
return 'Yesterday at ' + parseInt(hours, 10) + ':' + minutes + suffix;
} else {
let hours, suffix, minutes;
if (date.getHours() > 12) { hours = date.getHours() - 12; suffix = ' PM';
 } else { hours = date.getHours(); suffix = ' AM'; }
if (date.getMinutes() < 10) { minutes = '0' + date.getMinutes();
 } else { minutes = date.getMinutes(); }
if (hours === 0) { hours = 12; }
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
return months[date.getMonth()] + ' ' + date.getDate() + ' at ' + parseInt(hours, 10) + ':' + minutes + suffix;*/ }
 }
   // FILE STUFF
   makeFileIntoBlob(imagePath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      let fileName = '';
      this.file
        .resolveLocalFilesystemUrl(imagePath)
        .then(fileEntry => {
          const { name, nativeURL } = fileEntry;

          // get the path..
          const path = nativeURL.substring(0, nativeURL.lastIndexOf('/'));


          fileName = name;

          // we are provided the name, so now read the file into
          // a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          const imgBlob = new Blob([buffer], {
            type: 'image/jpeg'
          });
          console.log(imgBlob + `qweqweqz222`);
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => {reject(e); alert('teho'); } );
    });
  }
  async deletefile(ref) {
    await firebase.storage().refFromURL(ref).delete();
  }

  uploadToFirebase(imageBlobInfo) {
    return new Promise((resolve, reject) => {
      const route = Math.floor(Math.random() * 100000 ** 4).toString();

      const ref = `images/${route}/${imageBlobInfo.fileName}`;
      const fileRef = firebase.storage().ref(ref);
      alert(fileRef.toString());
      const uploadTask = fileRef.put(imageBlobInfo.imgBlob);
      uploadTask.on(
        'state_changed',
        (snapshot: any) => {
            this.time = (snapshot.bytesTransferred / snapshot.totalBytes);
          },
        error => {
          alert(error);
          reject(error);
        },
        async () => {
          // completion...
          const data = await fileRef.getDownloadURL().then(res => res);
          const time = await this.time;
          resolve({storageUrl: fileRef.toString(), url: data, time});
        }
      );
    });
  }

}

