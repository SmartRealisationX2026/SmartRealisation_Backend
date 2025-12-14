import { Medication } from './medication.entity';

export class Category {
  id: string;
  code: string;
  nameFr: string;
  nameEn: string;
  description?: string | null;
  level: number;
  parentId?: string | null;

  // Relations
  parent?: Category | null;
  children?: Category[];
  medications?: Medication[];
}

