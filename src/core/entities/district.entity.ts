import { City } from './city.entity';
import { Address } from './address.entity';

export class District {
  id: string;
  cityId: string;
  nameFr: string;
  nameEn: string;

  // Relations
  city?: City;
  addresses?: Address[];
}

