export interface UnsplashPhoto {
  id: string;
  created_at: string;
  updated_at: string;
  width: number;
  height: number;
  color: string;
  downloads: number;
  likes: number;
  liked_by_user: boolean;
  description: string;
  exif: UnsplashExif;
  location: UnsplashLocation;
  current_user_collections: UnsplashCollection[];
  urls: UnsplashUrls;
  categories: any[];
  links: UnsplashPhotoLinks;
  user: UnsplashUser;
}

export interface UnsplashUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
}

export interface UnsplashPhotoLinks {
  self: string;
  html: string;
  download: string;
  download_location: string;
}

export interface UnsplashCollection {
  id: number;
  title: string;
  description: string;
  published_at: string;
  updated_at: string;
  curated: boolean;
  total_photos: number;
  private: boolean;
  share_key: string;
  cover_photo: UnsplashPhoto;
  user: UnsplashUser;
  links: UnsplashCollectionLinks;
}

export interface UnsplashCollectionLinks {
  self: string;
  html: string;
  photos: string;
  related: string;
}

export interface UnsplashLocation {
  city: string;
  country: string;
  position: UnsplashPosition;
}

export interface UnsplashPosition {
  latitude: number;
  longitude: number;
}

export interface UnsplashExif {
  make: string;
  model: string;
  exposure_time: string;
  aperture: string;
  focal_length: string;
  iso: number;
}

export interface UnsplashUser {
  id: string;
  updated_at: string;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  instagram_username: string;
  twitter_username: string;
  portfolio_url?: any;
  bio: string;
  location: string;
  total_likes: number;
  total_photos: number;
  total_collections: number;
  followed_by_user: boolean;
  followers_count: number;
  following_count: number;
  downloads: number;
  profile_image: UnsplashUserImage;
  badge: UnsplashUserBadge;
  links: UnsplashUserLinks;
}

export interface UnsplashUserLinks {
  self: string;
  html: string;
  photos: string;
  likes: string;
  portfolio: string;
}

export interface UnsplashUserBadge {
  title: string;
  primary: boolean;
  slug: string;
  link: string;
}

export interface UnsplashUserImage {
  small: string;
  medium: string;
  large: string;
}