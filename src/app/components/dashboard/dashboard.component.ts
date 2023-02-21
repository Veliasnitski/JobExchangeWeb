import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public users: any = [];
  public fullName: string = "";
  public role: string = "";

  constructor(private auth: AuthService, private api: ApiService, private userStore: UserStoreService) { }

  ngOnInit() {
    this.api.getUsers()
      .subscribe(res => {
        this.users = res;
      });

    this.userStore.getFullNameFromStore()
      .subscribe(val => {
        let fullNameFromToken = this.auth.getFullNameFromToken();
        this.fullName = val || fullNameFromToken;
      });

    this.userStore.getRoleFromStore()
      .subscribe(val => {
        let roleFromToken = this.auth.getRoleNameFromToken();
        this.role = val || roleFromToken;
      });
  }

  logout() {
    this.auth.signOut();
  }
}
