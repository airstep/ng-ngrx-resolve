import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { IAppState } from './app.state';
import * as profileActions from './profile/profile.actions'
import { IProfileData } from './profile/profile.model';
import { ApiService } from './api.service';

@Injectable()
export class ProfileResolver implements Resolve<IProfileData> {
  constructor(private apiService: ApiService, private store: Store<IAppState>) { }

  resolve(): Observable<IProfileData> {

    this.store.take(1).subscribe(store => {
      if (!store.profile.profileData) {
        this.apiService.getProfileData().toPromise().then(data => {
          this.store.dispatch(new profileActions.UpdateAction(data));
        });
      }
    });

    return this.store.select('profile')
      .filter(profile => !!profile.profileData)
      .map(store => store.profileData)
      .take(1);
  }
}
