import {Component, OnInit} from '@angular/core';
import {UserService} from './user.service';
import {Model} from './model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public user: any;

  model: Model[] = [];

  constructor(public _userService: UserService) { }

  ngOnInit() {
    this.user = {
      username: '',
      password: '',
      grant_type: ''
    };
  }
  getData(token: string ){
    return this._userService.getData(token)
  }
  login() {
    this._userService.login({'username': this.user.username, 'password': this.user.password, grant_type: 'password'});
  }

  refreshToken() {
    this._userService.refreshToken();
  }

  logout() {
    this._userService.logout();
  }
}
