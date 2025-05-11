export type Location = {
  lat: number;
  lng: number;
};

export type User = {
  id: string;
  color: string;
  isOnline: boolean;
  location: Location;
  currentScreen: string | null;
};

export type UpdateUser = (
  userId: string,
  data: Partial<User>
) => Promise<{ error: string | null; user: User | null }>;

export type GetOnlineUsersByScreen = (screen: string) => Promise<User[]>;
