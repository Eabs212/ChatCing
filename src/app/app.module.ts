import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { FIREBASE_CONFIG } from './app.firebase.config';

import { AuthService } from '../providers/auth.service';
import { DataService } from '../providers/data.service';
import { ChatService } from '../providers/chat.service';
import { Camera } from '@ionic-native/camera/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { File } from '@ionic-native/file/ngx';
import { ChatPhotoPageModule } from './chat-photo/chat-photo.module';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), IonicStorageModule.forRoot(),
    AppRoutingModule, ChatPhotoPageModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG), AngularFireAuthModule,
    FormsModule, AngularFireDatabaseModule, AngularFireStorageModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService,
    DataService,
    ChatService,
    Camera,
    SpinnerDialog,
    File,
    PhotoViewer
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
