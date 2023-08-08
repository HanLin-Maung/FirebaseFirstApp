import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Post } from '../post.model';
import { catchError, map } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostsService {


  error = new Subject<string>();

  constructor(private http: HttpClient, private storage: AngularFireStorage) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http
      .post<{ name: String }>(
        'https://ng-complete-guide-a7918-default-rtdb.firebaseio.com/post.json',
        postData
      )
      .subscribe((ResponseData) => {
        console.log(ResponseData);
      },
      error => {
        this.error.next(error.message);
      });
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>('https://ng-complete-guide-a7918-default-rtdb.firebaseio.com/post.json')
      .pipe(
        map((responseData) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
        );
  }
  clearPost(){
    return this.http.delete('https://ng-complete-guide-a7918-default-rtdb.firebaseio.com/post.json')};

  uploadImage(file: File) {
    const filePath = `images/${file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return uploadTask.snapshotChanges().pipe(
      finalize(() => {
        const downloadURL = storageRef.getDownloadURL();
      })
    );
  }  

}