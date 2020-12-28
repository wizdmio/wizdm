import { Injectable } from '@angular/core';
import {DatabaseCollection, DatabaseGroup, QueryDocumentSnapshot} from '@wizdm/connect/database/collection';
import { DatabaseService, Timestamp  } from '@wizdm/connect/database';
import { DatabaseDocument } from '@wizdm/connect/database/document';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {PostData} from 'app/pages/explore/feed/feed-types';
import { UserProfile, UserData } from 'app/utils/user';


@Injectable({
    providedIn: 'root'
})
export class AddPostService extends DatabaseCollection<PostData>{

    public data$: Observable<QueryDocumentSnapshot<PostData>>;
    public data: PostData;
    get me(): string{return this.user.uid}

    constructor(db: DatabaseService, private user: UserProfile){
        super(db)
    }

    public savePost(data: PostData) {

        const userCol = this.db.collection('users')
        const userColId = userCol.document(this.user.uid);
        const feedEndpoint = userColId.collection('feed');
        feedEndpoint.add({...data}).then(value => console.log(value.get()))
    }

    // public uploadImage(file) {}

    // savePostWitImage(data) {}
}
