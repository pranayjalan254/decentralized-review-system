export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  createdAt: Date;
  helpful: number;
}

export interface PlaceDetails {
  id: string;
  totalRating: number;
  reviewCount: number;
  reviews: Review[];
}
