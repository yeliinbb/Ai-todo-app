export type LocationData = {
  placeName?: string;
  address?: string;
  roadAddress?: string;
  coord: Coord;
};

export type Coord = {
  lat: number;
  lng: number;
};

export type Place = {
  id: string;
  placeName?: string;
  address?: string;
  roadAddress?: string;
  coord: Coord;
  phone?: string;
};
