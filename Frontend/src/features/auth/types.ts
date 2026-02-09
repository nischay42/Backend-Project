type User = {
  _id: string;
  username: String
  email: string;
  fullname: string;
  avatar?: string;
  coverImage?: String
  watchHistory?: String
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string;
};

export type UserLogin = {
    email: string,
    password: string
}

export type UserSignup = {
    fullname: string,
    username: string,
    email: string,
    password: string
    // avatar: File | null,
    // coverImage: File | null,
}