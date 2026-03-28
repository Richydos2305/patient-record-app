import { AuthService } from '../services/auth/index';
import { PatientService } from '../services/patient/index';
import { CustomFieldService } from '../services/customField/index';
import { FileService } from '../services/file/index';
import { UserRepository } from '../repositories/UserRepository';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { PatientRepository } from '../repositories/PatientRepository';
import { CustomFieldRepository } from '../repositories/CustomFieldRepository';
import { FileRepository } from '../repositories/FileRepository';

export class ServiceFactory {
    static createAuthService(): AuthService {
        return new AuthService(new UserRepository(), new RefreshTokenRepository());
    }

    static createPatientService(): PatientService {
        return new PatientService(new PatientRepository());
    }

    static createCustomFieldService(): CustomFieldService {
        return new CustomFieldService(new CustomFieldRepository());
    }

    static createFileService(): FileService {
        return new FileService(new FileRepository());
    }
}
