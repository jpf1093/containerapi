export interface ContainerAllocation {
  id: number;

  container_id: number;
  container_code: string;

  collection_point_id: number;
  collection_point_name: string;

  start_at: string;
  end_at: string | null;

  created_at?: string;
}

export interface CreateAllocationData {
  container_id: number;
  collection_point_id: number;
  start_at?: string;
  end_at?: string | null;
}

export interface UpdateAllocationData {
  container_id: number;
  collection_point_id: number;
  start_at: string;
  end_at?: string | null;
}