import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../services/article-service.service';
import { QuillModule } from 'ngx-quill';
import { ContentQuillConfiguration } from '../utils';
import { ArticleModel } from '../models';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [
    QuillModule,
    NgIf,
  ],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.css'
})
export class PreviewComponent implements OnInit {
  contentQuillConfig = ContentQuillConfiguration;

  article: ArticleModel = {
    title: '',
    contents: [],
  };

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    const currentArticle = this.articleService.getCurrentArticle();
    console.log('present article:', currentArticle);
    this.article = currentArticle ?? {
      title: '',
      contents: [],
    };
  }
}
