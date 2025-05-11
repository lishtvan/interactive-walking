export type Location = {
  lat: number;
  lng: number;
};

export type User = {
  id: string;
  color: string;
  location: Location;
};

export type UserLocations = { [key: string]: Location };
