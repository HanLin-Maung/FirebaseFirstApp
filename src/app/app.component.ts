import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { TitleStrategy } from '@angular/router';
import { PostsService } from './service/posts.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;

  selectedFile: File | null = null;

  private errorSub: Subscription;

  constructor(
    private http: HttpClient,
    private postsservice: PostsService, 
    ) {}

  ngOnInit() {

    this.errorSub = this.postsservice.error.subscribe(errorMessage => {
      this.error = errorMessage;
    });
    this.isFetching = true;
    this.postsservice.fetchPosts().subscribe(posts =>{
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.error = error.message;
    }
    );
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.postsservice.createAndStorePost(postData.title,postData.content)
  }

  onFetchPosts() {
    // Send Http request
    this.postsservice.fetchPosts().subscribe(posts =>{
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.error = error.message;
    });
  }

  onClearPosts(): void {
    this.postsservice.clearPost().subscribe( () =>{
      this.loadedPosts = [] ;
    });
  }

  
ngOnDestroy(): void {
  this.errorSub.unsubscribe();
}

onFileSelected(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  this.selectedFile = inputElement.files?.[0] || null;
}

uploadImage() {
  if (!this.selectedFile) {
    return;
  }

  this.postsservice.uploadImage(this.selectedFile).subscribe(
    (snapshot) => {

      console.log('Upload successful!', snapshot);
    },
    (error) => {

      console.error('Upload failed:', error);
    }
  );
}

}