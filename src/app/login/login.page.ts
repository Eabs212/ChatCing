import { Component, OnInit } from '@angular/core';
import { LoginResponse } from '../../models/login/login-response.interface';
import { ToastController, NavController } from '@ionic/angular';
import { DataService } from 'src/providers/data.service';
import { User } from 'firebase/app';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router: NavController, private toast: ToastController,
              private data: DataService, private storage: Storage) { }

  ngOnInit() {
  }
  async login(event: LoginResponse) {
    if (!event.error) {
      this.toast.create({
        message: `Welcome, ${event.result.email}`,
        duration: 3000
      }).then((data) => {
        data.present();
      });
      await this.data.getProfile(event.result as User).subscribe(async profile => {
        await this.storage.set('account', profile).then(() => {
      });
        this.router.navigateRoot(['/tabs']);

    });
    } else {
      this.toast.create({
        message: event.error.message,
        duration: 3000
      }).then((data) => {
        data.present();
      });
    }
  }
}
