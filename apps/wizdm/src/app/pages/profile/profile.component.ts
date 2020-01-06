import { Component } from '@angular/core';
import { User } from '@wizdm/connect/auth';
import { StorageService } from '@wizdm/connect/storage';
import { Member, wmMember } from 'app/core/member';
import { DialogRef } from '@wizdm/elements/dialog';
import moment from 'moment';

@Component({
  selector: 'wm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  host: { 'class': 'padding-top-toolbar' }
})
export class ProfileComponent {

  private newProfile: wmMember;

  constructor(private member: Member, private storage: StorageService) {}

  public get profileData(): wmMember { return this.member.data; }

  public get profilePhoto(): string { return this.profileData.photo || ''; }

  public get authUser(): User { return this.member.auth.user || {} as User };

  public get created(): string { return moment(!!this.authUser ? this.authUser.metadata.creationTime : null).format('ll'); }

  public get emailVerified(): boolean { return this.authUser.emailVerified || false; }

  public set profileData(user: wmMember) { 
    
    this.newProfile = user;
  }

  public updateProfile() {

    return this.member.update(this.newProfile);
  }

  public updateProfileAndLeave(ref: DialogRef<boolean>) {

    this.updateProfile()
      .then( () => ref.close(true) );
  }

  public updatePhoto(file: File) {

    if(!file) { return; }

    const folder = this.storage.ref(`${this.member.uid}/${file.name}`);

    folder.put(file)
      .then( snap => snap.ref.getDownloadURL() )
      .then( photo => this.member.update( { photo } ));
  }

  public deletePhoto() {

    if(!this.profilePhoto) { return; }

    const ref = this.storage.refFromURL(this.profilePhoto);

    this.member.update({ photo: '' })
      .then( () => ref.delete() );
  }
}