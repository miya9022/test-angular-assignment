import { Component } from '@angular/core';
import { ContentChange, QuillEditorComponent, QuillModule, SelectionChange } from 'ngx-quill';
import { ContentQuillConfiguration, TitleQuillConfiguration, MediaOnlyConfiguration } from '../utils';
import { ArticleModel } from '../models';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../services/article-service.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    QuillModule,
    FormsModule,
    NgIf,
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {
  titleQuillConfig = TitleQuillConfiguration;
  contentQuillConfig = ContentQuillConfiguration;
  mediaOnlyQuillConfig = MediaOnlyConfiguration;

  article: ArticleModel = {
    title: '',
    contents: [],
  };

  constructor(private articleService: ArticleService) {}

  onTextChange(ev: ContentChange): void {
    // console.log('content change:', ev);
    let lines = ev.editor.getLines();

    if (lines.length === 1) {
      let line = lines[0];
      // console.log('line:', line.domNode.tagName);
      if (line.domNode.tagName === 'H1') {
        return;
      }

      ev.editor.formatLine(0, 1, { header: 1 });
    }

    const editor = ev.editor;
    let { index } = editor.getSelection()!;
    // console.log('selection index:', index);
    let bound = editor.getBounds(index)!;
    // console.log('editor bound:', bound);

    if (document.getElementById('plus-wrapper') === null) {
      return;
    }

    let currentLine = editor.getLines(index, 1)[0];
    let currentFocusText = currentLine.domNode.innerText.trim();
    console.log('current lines:', currentFocusText);

    let btn = document.getElementById('plus-wrapper');
    if (currentFocusText.length <= 0) {
      btn!.classList.add('is-active');
    } else {
      btn!.classList.remove('is-active');
    }

    btn!.onclick = () => {
      if (btn!.classList.contains('is-scaled')) {
        btn!.classList.remove('is-scaled');
      } else {
        btn!.classList.add('is-scaled');
      }
    }

    btn!.style.top = bound.top + 'px';
  }

  onSelectChange(ev: SelectionChange): void {
    console.log('select change:', ev);
    let range = ev.editor.getSelection(true);
    // console.log('range:', range);
    // let length = ev.editor.getLength();
    let lines = ev.editor.getLines(range.index, 1);
    let currentFocusText = lines[0].domNode.innerText.trim();
    console.log('current lines:', currentFocusText);

    let btn = document.getElementById('plus-wrapper');
    if (currentFocusText.length <= 0) {
      btn!.classList.add('is-active');
    } else {
      btn!.classList.remove('is-active');
    }

    let bound = ev.editor.getBounds(range.index)!;
    btn!.style.top = bound.top + 'px';
  }

  publish(): void {
    this.articleService.addNewArticle(this.article);
  }

  uploadMedia(editor: QuillEditorComponent): void {
    console.log('media change event:', editor);
    let { quillEditor } = editor;

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files ? input.files[0] : null;
      let data = null;
      const formData = new FormData();

      const range = quillEditor.getSelection();

      if (file) {
        this.articleService.saveImageToDatabase(file);

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          console.log(reader.result);
          quillEditor.insertEmbed(range!.index, 'image', reader.result, 'user');
        };
      }
    };
  }
}
