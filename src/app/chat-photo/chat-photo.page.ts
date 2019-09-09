import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UtilsService } from '../utils.service';
import { Message } from 'src/models/messages/messages.interface';
import { ChatService } from 'src/providers/chat.service';

@Component({
  selector: 'app-chat-photo',
  templateUrl: './chat-photo.page.html',
  styleUrls: ['./chat-photo.page.scss'],
})
export class ChatPhotoPage implements OnInit {
  time = 0;
  photoUrl: string;
  constructor( private camera: Camera, private utils: UtilsService,
               private modalController: ModalController, private chat: ChatService,
               private navParams: NavParams) { }

  ngOnInit() {
    console.log(this.navParams);

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
      this.photoUrl = uploadInfo.url;
      const message: Message = {
        userToId: this.navParams.data.userToId,
        userToProfile: this.navParams.data.userToProfile,
        userFromId: this.navParams.data.userFromId,
        userFromProfile: this.navParams.data.userFromProfile,
        date: new Date().toString(),
        content: uploadInfo.url,
        type: 2,
      };
      await this.chat.sendMessages(message);
      this.closeModal();
    }
    } catch (e) {
      alert(e.message);
      alert('File Upload Error ' + e.message);
    }

  }

  async closeModal() {
    const onClosedData = 'Wrapped Up!';
    await this.modalController.dismiss(onClosedData);
  }
}
