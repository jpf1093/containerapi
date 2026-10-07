export interface CollectionPoint {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CollectionPointData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  accuracy?: number | null;
}