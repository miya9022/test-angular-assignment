import { BlockEmbed } from "quill/blots/block";

export class ImageBlot extends BlockEmbed {
    static override create(value: any) {
      let node = super.create();
      // console.log('add image:', value);
      let image = document.createElement('img');
      image.setAttribute('src', value);
      node.appendChild(image);
  
      let input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('placeholder', 'Enter caption...');
      input.value = value.caption || '';
  
      node.appendChild(input);
      return node;
    }
  
    static override value(node: any) {
      let image = node.querySelector('img');
      let input = node.querySelector('input');
      return {
        url: image.getAttribute('src'),
        caption: input.value
      };
    }
  }