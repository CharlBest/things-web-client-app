import { Component, OnInit } from '@angular/core';
import { Things, PostController } from 'api-typings/bundle';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.scss']
})
export class UserPostsComponent implements OnInit {

  thingId: number;
  posts: Things.Api.Models.Post.PostModel[];
  skip = 0;
  isProcessing = true;

  constructor(private postController: PostController,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.thingId = +params.get('id');
        this.skip = 0;
        this.getUserPosts();
      }
    });
  }

  getUserPosts() {
    this.isProcessing = true;

    const viewModel = new Things.Api.ViewModels.Post.GetThingPostsViewModel;
    viewModel.skip = this.skip;

    this.postController.getUserThingPosts(this.thingId, viewModel).subscribe(data => {
      this.isProcessing = false;
      this.posts = data;
    });
  }

  loadMore() {
    this.isProcessing = true;

    this.skip += 10;
    const viewModel = new Things.Api.ViewModels.Post.GetThingPostsViewModel;
    viewModel.skip = this.skip;

    this.postController.getUserThingPosts(this.thingId, viewModel).subscribe(data => {
      this.isProcessing = false;
      this.posts = this.posts.concat(data);
    });
  }
}
