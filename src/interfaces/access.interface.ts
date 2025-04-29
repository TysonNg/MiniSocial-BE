export interface SignUpInterface {
  user: {
    name: string;
    email: string;
    id: string;
  };
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

export interface SignInInterface {
  user: {
    id: string;
    email: string;
    name: string;
  };
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}
