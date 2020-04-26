import { StorageService } from '@wizdm/connect/storage';
import { UserProfile, dbUser } from 'app/auth';
import { User } from '@wizdm/connect/auth';
import { DialogRef } from '@wizdm/dialog';
import { Component } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'wm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  private newProfile: dbUser;

  constructor(private user: UserProfile, private storage: StorageService) {}

  public get profileData(): dbUser { return this.user.data; }

  public get profilePhoto(): string { return this.profileData.photo || ''; }

  public get User(): User { return this.user.auth.user || {} as User };

  public get created(): string { return moment(!!this.User ? this.User.metadata.creationTime : null).format('ll'); }

  public get emailVerified(): boolean { return this.User.emailVerified || false; }

  public set profileData(user: dbUser) { 
    
    this.newProfile = user;
  }

  public updateProfile() {

    return this.user.update(this.newProfile);
  }

  public updateProfileAndLeave(ref: DialogRef<boolean>) {

    this.updateProfile()
      .then( () => ref.close(true) );
  }

  public updatePhoto(file: File) {

    if(!file) { return; }

    const folder = this.storage.ref(`${this.user.uid}/${file.name}`);

    folder.put(file)
      .then( snap => snap.ref.getDownloadURL() )
      .then( photo => this.user.update( { photo } ));
  }

  public deletePhoto() {

    if(!this.profilePhoto) { return; }

    const ref = this.storage.refFromURL(this.profilePhoto);

    this.user.update({ photo: '' })
      .then( () => ref.delete() );
  }
}