export interface Place {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  image: string;
  images?: string[];
  active: boolean;
  createdAt: string;
  updatedAt?: string;
  hours?: string;
  price?: string;
  transport?: string;
}

export interface Admin {
  username: string;
  token: string;
}
