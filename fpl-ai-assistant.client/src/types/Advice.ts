export interface Advice {
  transfers?: { out: string; in: string }[];
  captain?: string;
  chips?: string | string[];
  notes?: string;
}
