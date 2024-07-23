import { Routes } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { PreviewComponent } from './preview/preview.component';

export const routes: Routes = [
  {
    title: 'Home',
    path: '',
    redirectTo: 'article/editor',
    pathMatch: 'full',
  },
  {
    title: 'Editor',
    path: 'article/editor',
    component: EditorComponent,
    pathMatch: 'prefix',
  },
  {
    title: 'Preview',
    path: 'article/preview',
    component: PreviewComponent,
    pathMatch: 'prefix',
  }
];
