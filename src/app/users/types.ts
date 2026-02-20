export type User = {
  id: string;
  username: string;
  full_name: string | null;
  email: string | null;
  is_active: boolean;
  scopes: string[];
  created_at: string;
};

export type UserFormValues = {
  username: string;
  password: string;
  full_name: string;
  email: string;
  is_active: boolean;
};

export type UserUpdate = Partial<UserFormValues>;
