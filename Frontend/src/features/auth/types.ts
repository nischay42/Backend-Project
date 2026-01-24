export type User = {
  _id: string;
  fullname: string;
  email: string;
  avatar?: string;
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