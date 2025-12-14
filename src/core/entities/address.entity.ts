import { City } from './city.entity';
import { District } from './district.entity';
import { Pharmacy } from './pharmacy.entity';

export class Address {
  id: string;
  cityId: string;
  districtId?: string | null;
  streetAddress: string;
  landmark?: string | null;
  postalCode?: string | null;
  latitude: number;
  longitude: number;

  // Relations
  city?: City;
  district?: District | null;
  pharmacy?: Pharmacy | null;
}

