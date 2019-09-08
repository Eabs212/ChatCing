import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Account } from '../../models/account/account.interface';
import { AuthService } from 'src/providers/auth.service';
import { LoginResponse } from 'src/models/login/login-response.interface';
@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit {
  account = {} as Account;
  @Output() registerStatus: EventEmitter<LoginResponse>;

  constructor(private auth: AuthService) {
    this.registerStatus = new EventEmitter<LoginResponse>();
   }
  ngOnInit() {}
  value() {
    console.log(this.account);
  }
  async register() {
    try {
    const result = await this.auth.createUser(this.account);
    this.registerStatus.emit(result);
    } catch (e) {
      console.log(e);
      this.registerStatus.emit(e);
    }
  }
}
