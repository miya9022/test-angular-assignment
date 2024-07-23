import { Injectable } from '@angular/core';
import { ArticleModel } from '../models';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private articles: string[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  saveImageToDatabase(image: Blob): void {
    const form = new FormData();
    form.append('file', image);
    // return result
    this.http.post('/image/upload', image).subscribe(res => {
      throw new Error();
    });
  }

  addNewArticle(article: ArticleModel): void {
    const articleJson = JSON.stringify(article);
    this.articles.push(articleJson);

    const articleBlob = new Blob([articleJson], {type: 'text/plain'});
    // save
    const form = new FormData();
    form.append('file', articleBlob);
    let headers = new HttpHeaders({'Content-Type': 'application/multipart-formdata'});

    this.http.post('/article/upload', form, {headers}).subscribe(res => {
      throw new Error();
    });

    this.router.navigateByUrl('/article/preview');
  }

  getCurrentArticle(): ArticleModel | null {
    if (this.articles[this.articles.length - 1]) {
      return JSON.parse(this.articles[this.articles.length - 1]);
    }
    return null;
  }
}
