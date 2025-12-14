import { CreateMedicationDto, UpdateMedicationDto } from '../dtos';
import { Medication } from '../entities';

export abstract class MedicationRepository {
  abstract findOne(id: string): Promise<Medication | null>;
  abstract create(medication: CreateMedicationDto): Promise<Medication>;
  abstract update(
    id: string,
    medication: UpdateMedicationDto,
  ): Promise<Medication>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<Medication[]>;
  abstract findByCommercialName(name: string): Promise<Medication[]>;
  abstract findByDciName(dciName: string): Promise<Medication[]>;
  abstract searchMedications(query: string): Promise<Medication[]>;
  abstract findByCategory(categoryId: string): Promise<Medication[]>;
  abstract findByForm(formId: string): Promise<Medication[]>;
  abstract findRequiringPrescription(): Promise<Medication[]>;
}

