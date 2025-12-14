import { Address } from './address.entity';
import { District } from './district.entity';

export class City {
  id: string;
  nameFr: string;
  nameEn: string;
  region: string;

  // Relations
  addresses?: Address[];
  districts?: District[];
}

