import { map, filter, distinctUntilChanged, delay } from 'rxjs/operators';
import { UserFormComponent } from './user-form/user-form.component'
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { UserProfile, UserData } from 'app/auth/user-profile';
import { User } from '@wizdm/connect/auth';
import { DialogRef } from '@wizdm/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'wm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent /*implements OnDestroy*/ {

  @ViewChild(UserFormComponent) form: UserFormComponent;

  private newProfile: UserData;
  //private sub: Subscription;

  constructor(readonly user: UserProfile, router: Router) {
/*
    // Detects the user's preferred language changes
    this.sub = this.user.data$.pipe(
      // Gets the language
      map( profile => profile && profile.lang ),  
      // Filters for changes only
      distinctUntilChanged(),
      // Filters uneccessary changes..
      filter( lang => {    
        // ...undefined values (user logged out or language preferences undefined)
        if(!lang) { return false; }
        // Debug
        console.log('Profile language:', lang);
        // Catches the current locale from the route
        const locale = router.url.match(/^\/(\w{2})/)?.[1];
        // Go on in case the user language differs from the current locale
        return lang !== locale;
      }),
      // Waits 1s before redirecting. This llikely ensures the page view updated, so, canLeave dialog will agree
      delay(1000)
      // Redirects to the current url with the new language
    ).subscribe( lang => router.navigateByUrl( router.url.replace(/^\/\w{2}/, `/${lang}`) ) );*/
  }

  // Disposes of the observable
  //ngOnDestroy() { this.sub.unsubscribe(); }

  public get userId(): string { return this.user.uid; }

  public get profileData(): UserData { return this.user.data; }

  public get profilePhoto(): string { return this.profileData.photo || ''; }

  public get User(): User { return this.user.auth.user || {} as User };

  public get created(): string { return moment(this.User.metadata?.creationTime).format('ll'); }

  public get emailVerified(): boolean { return this.User.emailVerified || false; }

  public get providers(): string[] {
    return this.user ? this.User.providerData.map( data => data.providerId ) : [];
  }

  public get usePassword(): boolean {
    return this.providers.some( id => id === 'password' );
  }

  public set profileData(user: UserData) { 
    
    this.newProfile = user;
  }

  public updateProfile() {

    if(!this.newProfile) { return; }

    return this.user.update(this.newProfile)
      .then(() => this.form.markAsPristine() );
  }

  public updateProfileAndLeave(ref: DialogRef<boolean>) {

    this.updateProfile()
      .then( () => ref.close(true) );
  }

  public updatePhoto(photo: string) {

    this.user.update( { photo } );
  }

  public deletePhoto() {

    this.user.update({ photo: '' });
  }
}
