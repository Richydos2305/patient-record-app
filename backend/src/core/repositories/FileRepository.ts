import { BaseRepository } from './BaseRepository';
import { File, FileDocument } from '../models/File';

export class FileRepository extends BaseRepository<FileDocument> {
  constructor() {
    super(File);
  }
}
