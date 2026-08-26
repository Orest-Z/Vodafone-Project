export interface Prize {
  label: string;
  sponsor: string;
  code: string;
}

export interface DropResult {
  won: boolean;
  prize: Prize | null;
}