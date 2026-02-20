export interface UserRead {
  id: number;
  username: string;
  full_name: string | null;
  email: string | null;
  is_active: boolean;
  scopes: string[] | Record<string, any>;
  created_at: string;
}

export interface UserPublic extends Omit<UserRead, "created_at" | "scopes"> {
  scopes: string[];
}

export interface UserCreate {
  username: string;
  password: string;
  full_name?: string | null;
  email?: string | null;
  is_active?: boolean;
  scopes?: string[];
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface UserScopesUpdate {
  scopes: string[];
}
