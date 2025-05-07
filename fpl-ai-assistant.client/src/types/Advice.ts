export interface Advice {
  transfers?: { out: string; in: string }[];
  captain?: string;
  chips?: {
    chip: string;
    explanation: string;
  }[];
  notes?: string;
}
