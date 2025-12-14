import { User } from './user.entity';
import { Medication } from './medication.entity';

export class Search {
  id: string;
  userId?: string | null;
  medicationId: string;
  latitude: number;
  longitude: number;
  radiusKm?: number | null;
  filtersApplied?: any | null; // JSON
  resultsFound: number;
  searchedAt: Date;

  // Relations
  user?: User | null;
  medication?: Medication;
}

