import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../../models/account/account.interface';
import { LoginResponse } from '../../models/login/login-response.interface';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  account = {} as Account;
  @Output() loginStatus: EventEmitter<LoginResponse>;
  constructor(private router: Router, private auth: AuthService) {
                this.loginStatus = new EventEmitter<LoginResponse>();
               }

  ngOnInit() {}
  value() {
    console.log(this.account);
  }
  async login() {
      const loginResponse = await this.auth.singIn(this.account);
      this.loginStatus.emit(loginResponse);
  }
  navigate(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
