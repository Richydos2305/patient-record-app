import { BaseRepository } from './BaseRepository';
import { CustomField, CustomFieldDocument } from '../models/CustomField';

export class CustomFieldRepository extends BaseRepository<CustomFieldDocument> {
  constructor() {
    super(CustomField);
  }
}
