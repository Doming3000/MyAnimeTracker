export interface APIAnime {
  pagination: Pagination;
  data: Anime[];
}

export interface MyAnime {
  id: number,
  title: string,
  type: string;
  url: string;
  status: string;
  images: { [key: string]: Image },
  total_episodes: number | null,
  watched_episodes: number,
  markedAsViewed: boolean;
  isModalOpen: boolean;
}

export interface Anime {
  mal_id: number;
  url: string;
  images: { [key: string]: Image };
  trailer: Trailer;
  title: string;
  title_english: null | string;
  title_japanese: string;
  title_synonyms: string[];
  type: string;
  source: Source;
  episodes: number | null;
  status: Status;
  airing: boolean;
  aired: Aired;
  duration: string;
  rating: Rating;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: null | string;
  season: null | string;
  year: number | null;
  broadcast: Broadcast;
  producers: Demographic[];
  licensors: Demographic[];
  studios: Demographic[];
  genres: Demographic[];
  explicit_genres: any[];
  themes: Demographic[];
  demographics: Demographic[];
}

export interface Aired {
  from: Date;
  to: Date | null;
  prop: Prop;
  string: string;
}

export interface Prop {
  from: From;
  to: From;
}

export interface From {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface Broadcast {
  day: null | string;
  time: null | string;
  timezone: null | string;
  string: null | string;
}

export interface Demographic {
  mal_id: number;
  type: Type;
  name: string;
  url: string;
}

export enum Type {
  Anime = 'anime',
}

export interface Image {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export enum Rating {
  GAllAges = 'G - All Ages',
  PG13Teens13OrOlder = 'PG-13 - Teens 13 or older',
}

export enum Source {
  Game = 'Game',
  Manga = 'Manga',
  Original = 'Original',
  Other = 'Other',
}

export enum Status {
  CurrentlyAiring = 'Currently Airing',
  FinishedAiring = 'Finished Airing',
}

export interface Trailer {
  youtube_id: null | string;
  url: null | string;
  embed_url: null | string;
  images: Images;
}

export interface Images {
  image_url: null | string;
  small_image_url: null | string;
  medium_image_url: null | string;
  large_image_url: null | string;
  maximum_image_url: null | string;
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: Items;
}

export interface Items {
  count: number;
  total: number;
  per_page: number;
}