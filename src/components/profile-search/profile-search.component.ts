import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/providers/data.service';
import { Profile } from 'src/models/profile/profile.interface';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.scss'],
})
export class ProfileSearchComponent implements OnInit, OnDestroy {
  query: string;
  userProfile: Profile;
  profileList: Profile[];
  filter = false;
  listFilter: Profile[];
  list$: Subscription;
  constructor(private data: DataService, private router: Router, private storage: Storage) {}
  ngOnInit() {
      this.storage.get('account').then(profile => {
      this.userProfile = profile as Profile;
      });
      this.getAll();
  }

  search(query: string) {
    const trimQuery = query.trim();
    if (trimQuery === query) {
      if (!query) {
        this.filter = false;
        this.getAll();
      } else {
        this.filter = true;
        this.listFilter = this.profileList.filter(user =>  user.firstName.includes(query.toLowerCase())
        || user.email.includes(query.toLowerCase()) || user.lastName.includes(query.toLowerCase()) );
      }
  }
  }
  getAll() {
    this.list$ = this.data.searchUser().subscribe(profiles => {
      this.profileList = profiles;
    });
  }

  getUser(profile: Profile) {

    profile.email !== this.userProfile.email ? this.router.navigate([`/user`, profile]) : this.router.navigate([`/tabs/profile`]);
  }
  ngOnDestroy(): void {
    this.list$.unsubscribe();
  }
}
