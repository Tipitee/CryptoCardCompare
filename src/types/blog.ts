export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_hero: string | null;
  tags: string[];
  meta_title: string;
  meta_description: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type BlogPostDraft = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;
