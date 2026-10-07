export type ContainerStatus =
  | "EM_USO"
  | "EM_TRANSITO"
  | "ESVAZIANDO"
  | "DISPONIVEL"
  | "MANUTENCAO"
  | "INATIVO";

export type FillStatus =
  | "VAZIO"
  | "BAIXO"
  | "MEDIO"
  | "ALTO"
  | "CHEIO";

export interface Container {
  id: number;
  code: string;
  status: ContainerStatus;
  fill_level: number | null;
  fill_status: FillStatus | null;
  last_reading_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateContainerData {
  code: string;
  status?: ContainerStatus;
}

export interface UpdateContainerData {
  code: string;
  status: ContainerStatus;
}

export interface UpdateFillLevelData {
  fill_level: number;
}