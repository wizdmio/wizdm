export type UnplashType = 'curated' | 'featured';
export type UnspashOrder = 'latest' | 'oldest' | 'popular';
export type UnsplashOrientation = 'landscape' | 'portrait' | 'squarish';

export interface UnsplashCollectionsParams {
  page?: number,
  perPage?: number
}

export interface UnsplashPhotosParams extends UnsplashCollectionsParams {
  orderBy?: UnspashOrder
}

export interface UnsplashUserParams {
  w?: number,
  h?: number
}

export interface UnsplashPhotoParams extends UnsplashUserParams {
  rect?: UnsplashPhotoRect
}

export interface UnsplashPhotoRect {
  x: number,
  y: number,
  width: number,
  height: number
}

export interface UnsplashSearchCollectionsParams extends UnsplashCollectionsParams {
  query?: string
}

export interface UnsplashSearchPhotosParams extends UnsplashSearchCollectionsParams {
  collections?: string,
  orientation?: UnsplashOrientation
}

export type UnsplashSearchUsersParams = UnsplashSearchCollectionsParams;

export interface UnsplashRandomPhotosParams {
  query?: string,
  username?: string,
  featured?: boolean,
  collections?: string,
  orientation?: UnsplashOrientation,
  w?: number,
  h?: number,
  count?: number
}
