import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideQuillConfig } from 'ngx-quill/config';
import { provideHttpClient } from '@angular/common/http';
import Scroll from 'quill/blots/scroll';
import Emitter from 'quill/core/emitter';
import Quill from 'quill';

class DraggableScroll extends Scroll {
  constructor(registry: any, domNode: HTMLDivElement, { emitter }: {
    emitter: Emitter;
  }) {
    super(registry, domNode, { emitter });
    this.domNode.addEventListener('drop', (e) => this.handleDrop(e), true);
  }

  handleDrop(e: any) {
    if (e.dataTransfer.files.length == 0)
      e.stopImmediatePropagation();
  }

  override handleDragStart(_event: DragEvent): void {}
};

Quill.register(DraggableScroll);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideQuillConfig({
      theme: 'bubble',
      modules: {
        syntax: true,
        toolbar: true,
      },
    })
  ]
};
