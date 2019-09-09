import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PhotoService } from 'src/providers/photo.service';
import { Storage } from '@ionic/storage';
import { UtilsService } from '../utils.service';


@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.page.html',
  styleUrls: ['./time-line.page.scss'],
})
export class TimeLinePage implements OnInit {

  selectedPic;
  time = 0;
  profile;
  constructor( private camera: Camera, private utils: UtilsService,
               private storage: Storage, private media: PhotoService) {
                }
ngOnInit()  {
  this.storage.get('account').then(data => this.profile = data );

  }
ionViewWillEnter() {
    this.storage.get('account').then(data => this.profile = data );
  }

  async pickImage(op: number) {
    const options: CameraOptions = {
      allowEdit: true,
      sourceType: op,
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
      this.time = 0;
      if (cameraInfo) {
      const blobInfo = await this.utils.makeFileIntoBlob(cameraInfo);
      const uploadInfo: any = await this.utils.uploadToFirebase(blobInfo);
      this.time = uploadInfo.time;
      const state = {
          date: new Date().getTime(),
          url: uploadInfo.url,
          storageUrl: uploadInfo.storageUrl,
          profile: this.profile,
          id: Math.floor(Math.random() * 100000 ** 4).toString()
        };
      this.media.upPhotoToTl(state);
      alert('File Upload Success ' + uploadInfo.storageUrl);
      }
    } catch (e) {
      alert(e.message);
      alert('File Upload Error ' + e.message);
    }

  }

}
