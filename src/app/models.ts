export interface ArticleModel {
  title: string;
  contents: ContentModel[],
}

export interface ContentModel {
  content: string;
  type: 'text'|'image'|'video'|'link';
  caption?: string;
}