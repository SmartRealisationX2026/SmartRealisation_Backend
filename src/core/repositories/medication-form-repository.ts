import { CreateMedicationFormDto, UpdateMedicationFormDto } from '../dtos';
import { MedicationForm } from '../entities';

export abstract class MedicationFormRepository {
  abstract findOne(id: string): Promise<MedicationForm | null>;
  abstract findByCode(code: string): Promise<MedicationForm | null>;
  abstract create(form: CreateMedicationFormDto): Promise<MedicationForm>;
  abstract update(
    id: string,
    form: UpdateMedicationFormDto,
  ): Promise<MedicationForm>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<MedicationForm[]>;
}

