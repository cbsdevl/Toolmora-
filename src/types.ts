export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  category: string;
  path: string;
  icon: string;
  isPopular: boolean;
  faqs: FAQItem[];
}

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string; // e.g. blue, green, orange
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  tags: string[];
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  robotsTxt: string;
  sitemapXml: string;
}
