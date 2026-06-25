export interface SiteMedia {
  type: string;
  url: string;
  id: number | string;
}

// Define the shape of your website object
export interface WebsiteData {
  id: number;
  name: string;
  badgeText: string;
  media: SiteMedia[];
  tags: string[];
  siteURL: string;
}

export interface ReelsData {
  id: number;
  image: string;
  mediaUrl: string;
  label: string;
  likeCount: number;
  permalink: string;
}

export interface OurWork {
  id: string;
  fileUrl: string;
  title: string;
  type: string;
  description: string;
  year: string;
}
