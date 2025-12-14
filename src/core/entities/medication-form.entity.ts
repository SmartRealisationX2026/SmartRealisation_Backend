import { Medication } from './medication.entity';

export class MedicationForm {
  id: string;
  code: string;
  nameFr: string;
  nameEn: string;
  description?: string | null;

  // Relations
  medications?: Medication[];
}

