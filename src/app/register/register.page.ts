import { Component, OnInit } from '@angular/core';
import { LoginResponse } from 'src/models/login/login-response.interface';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private toast: ToastController, private router: Router) { }

  ngOnInit() {
  }
  register(event: LoginResponse) {
    if (!event.error) {
      this.toast.create({
        message: `Account Created: ${event.result.email}`,
        duration: 3000
      }).then((data) => {
        data.present();
      });
      this.router.navigate([`/edit-profile`]);
    } else {
      this.toast.create({
        message: `Account Not Created: ${event.error.message}`,
        duration: 3000
      }).then((data) => {
        data.present();
      });
    }
  }
}
