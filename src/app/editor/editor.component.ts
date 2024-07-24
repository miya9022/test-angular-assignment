import { AfterViewInit, Component } from '@angular/core';
import { ContentChange, QuillEditorComponent, QuillModule, QuillModules, SelectionChange } from 'ngx-quill';
import { ArticleModel } from '../models';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../services/article-service.service';
import { NgIf } from '@angular/common';
import Quill from 'quill';
import { ImageBlot } from '../custom-quill';

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
export class EditorComponent implements AfterViewInit {
  editorQuillConfig: QuillModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ size: ['small', 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
      ],
      handlers: {
        size: this.imageSizeHandler.bind(this),
      },
    }
  };
  // editor: QuillEditorComponent;

  article: ArticleModel = {
    title: '',
    contents: [],
  };
  editor: any;

  constructor(private articleService: ArticleService) {}
  
  ngAfterViewInit(): void {
    let btn = document.getElementById('plus-wrapper');
    btn!.onclick = () => {
      if (btn!.classList.contains('is-scaled')) {
        btn!.classList.remove('is-scaled');
      } else {
        btn!.classList.add('is-scaled');
      }
    }
  }

  onTextChange(ev: ContentChange): void {
    console.log('content change:', ev);
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
    btn!.style.top = bound.top + 'px';

    document.querySelectorAll('.image-container input').forEach((input: any) => {
      input.addEventListener('keydown', function(event: any) {
        if(event.key === 'Enter') {
          const imageBlot = input.closest('.image-container');
          if (imageBlot) {
            const caption = imageBlot.querySelector('small');
            if(caption) {
              caption.innerText = input.value;
            } else {
              const captionNew = document.createElement('small');
              captionNew.classList.add('img-caption')
              captionNew.innerText = input.value;
              imageBlot.appendChild(captionNew);
            }
          }
        }
      });
    });
  }

  onSelectChange(ev: SelectionChange): void {
    console.log('select change:', ev);
    let range = ev.editor.getSelection(true);
    // console.log('range:', range);
    // let length = ev.editor.getLength();
    let lines = ev.editor.getLines(range.index, 1);
    let currentFocusText = lines[0].domNode.innerText.trim();
    let currentFocusHtml = lines[0].domNode.innerHTML.trim();
    console.log('current lines:', currentFocusText, currentFocusHtml);

    let btn = document.getElementById('plus-wrapper');
    if (currentFocusText.length <= 0 && currentFocusHtml === '<br>') {
      btn!.classList.add('is-active');
    } else {
      btn!.classList.remove('is-active');
    }

    let bound = ev.editor.getBounds(range.index)!;
    btn!.style.top = bound.top + 'px';
  }

  onEditorCreated(editor: any) {
    this.editor = editor;
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
          quillEditor.insertEmbed(range!.index, 'imageBlot', reader.result, 'user');
        };
      }
    };
  }

  imageSizeHandler(value: string) {
    console.log('abd', value);
    const range = this.editor.getSelection();
    if (range) {
      const [leaf] = this.editor.getLeaf(range.index);
      console.log('select node:', leaf.domNode);
      if (leaf && leaf.domNode && (leaf.domNode.querySelector('img') !== null || leaf.domNode.tagName.toLowerCase() === 'img')) {
        if (leaf.domNode.querySelector('img')) {
          if (value === 'small') {
            leaf.domNode.querySelector('img').setAttribute('style', 'width: 200px');
          } else if (value === 'large') {
            leaf.domNode.querySelector('img').setAttribute('style', 'width: 400px');
          } else if (value === 'huge') {
            leaf.domNode.querySelector('img').setAttribute('style', 'width: 100%');
          }
        } else {
          if (value === 'small') {
            leaf.domNode.setAttribute('style', 'width: 200px');
          } else if (value === 'large') {
            leaf.domNode.setAttribute('style', 'width: 400px');
          } else if (value === 'huge') {
            leaf.domNode.setAttribute('style', 'width: 100%');
          }
        }
      }
    }
  }
}
