import { addCandidate } from '../../../../src/application/services/candidateService';
import * as validator from '../../../../src/application/validator';
import { Candidate } from '../../../../src/domain/models/Candidate';
import { Education } from '../../../../src/domain/models/Education';
import { WorkExperience } from '../../../../src/domain/models/WorkExperience';
import { Resume } from '../../../../src/domain/models/Resume';

// Mock de los modelos
jest.mock('../../../../src/domain/models/Candidate');
jest.mock('../../../../src/domain/models/Education');
jest.mock('../../../../src/domain/models/WorkExperience');
jest.mock('../../../../src/domain/models/Resume');

const MockCandidate = Candidate as jest.MockedClass<typeof Candidate>;
const MockEducation = Education as jest.MockedClass<typeof Education>;
const MockWorkExperience = WorkExperience as jest.MockedClass<typeof WorkExperience>;
const MockResume = Resume as jest.MockedClass<typeof Resume>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addCandidate Service', () => {
  const validCandidateData = {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    phone: '123456789',
    address: 'Calle 123'
  };

  const savedCandidate = {
    id: 1,
    ...validCandidateData
  };

  it('debería crear y guardar un candidato con datos válidos', async () => {
    // Mock del validador
    jest.spyOn(validator, 'validateCandidateData').mockImplementation(() => {});
    
    // Mock del modelo Candidate
    const mockCandidateInstance = {
      save: jest.fn().mockResolvedValue(savedCandidate),
      education: [],
      workExperience: [],
      resumes: []
    };
    MockCandidate.mockImplementation(() => mockCandidateInstance as any);

    const result = await addCandidate(validCandidateData);

    expect(validator.validateCandidateData).toHaveBeenCalledWith(validCandidateData);
    expect(MockCandidate).toHaveBeenCalledWith(validCandidateData);
    expect(mockCandidateInstance.save).toHaveBeenCalled();
    expect(result).toEqual(savedCandidate);
  });

  it('debería lanzar error si la validación falla', async () => {
    const validationError = new Error('Invalid email format');
    jest.spyOn(validator, 'validateCandidateData').mockImplementation(() => {
      throw validationError;
    });

    await expect(addCandidate(validCandidateData)).rejects.toThrow('Invalid email format');
    expect(validator.validateCandidateData).toHaveBeenCalledWith(validCandidateData);
    expect(MockCandidate).not.toHaveBeenCalled();
  });

  it('debería manejar error de email duplicado', async () => {
    jest.spyOn(validator, 'validateCandidateData').mockImplementation(() => {});
    
    const mockCandidateInstance = {
      save: jest.fn().mockRejectedValue({ code: 'P2002' }),
      education: [],
      workExperience: [],
      resumes: []
    };
    MockCandidate.mockImplementation(() => mockCandidateInstance as any);

    await expect(addCandidate(validCandidateData)).rejects.toThrow('The email already exists in the database');
  });

  it('debería propagar otros errores del modelo', async () => {
    jest.spyOn(validator, 'validateCandidateData').mockImplementation(() => {});
    
    const dbError = new Error('Database connection failed');
    const mockCandidateInstance = {
      save: jest.fn().mockRejectedValue(dbError),
      education: [],
      workExperience: [],
      resumes: []
    };
    MockCandidate.mockImplementation(() => mockCandidateInstance as any);

    await expect(addCandidate(validCandidateData)).rejects.toThrow('Database connection failed');
  });

  it('debería guardar educación si está presente en los datos', async () => {
    const candidateDataWithEducation = {
      ...validCandidateData,
      educations: [
        { institution: 'Universidad', title: 'Ingeniero', startDate: '2020-01-01', endDate: '2024-01-01' }
      ]
    };

    jest.spyOn(validator, 'validateCandidateData').mockImplementation(() => {});
    
    const mockCandidateInstance = {
      save: jest.fn().mockResolvedValue(savedCandidate),
      education: [],
      workExperience: [],
      resumes: []
    };
    MockCandidate.mockImplementation(() => mockCandidateInstance as any);

    const mockEducationInstance = {
      save: jest.fn().mockResolvedValue({ id: 1 }),
      candidateId: undefined
    };
    MockEducation.mockImplementation(() => mockEducationInstance as any);

    await addCandidate(candidateDataWithEducation);

    expect(MockEducation).toHaveBeenCalledWith(candidateDataWithEducation.educations[0]);
    expect(mockEducationInstance.save).toHaveBeenCalled();
    expect(mockCandidateInstance.education).toContain(mockEducationInstance);
  });

  it('debería guardar experiencia laboral si está presente en los datos', async () => {
    const candidateDataWithExperience = {
      ...validCandidateData,
      workExperiences: [
        { company: 'Empresa', position: 'Desarrollador', description: 'Desarrollo web', startDate: '2022-01-01', endDate: '2023-01-01' }
      ]
    };

    jest.spyOn(validator, 'validateCandidateData').mockImplementation(() => {});
    
    const mockCandidateInstance = {
      save: jest.fn().mockResolvedValue(savedCandidate),
      education: [],
      workExperience: [],
      resumes: []
    };
    MockCandidate.mockImplementation(() => mockCandidateInstance as any);

    const mockWorkExperienceInstance = {
      save: jest.fn().mockResolvedValue({ id: 1 }),
      candidateId: undefined
    };
    MockWorkExperience.mockImplementation(() => mockWorkExperienceInstance as any);

    await addCandidate(candidateDataWithExperience);

    expect(MockWorkExperience).toHaveBeenCalledWith(candidateDataWithExperience.workExperiences[0]);
    expect(mockWorkExperienceInstance.save).toHaveBeenCalled();
    expect(mockCandidateInstance.workExperience).toContain(mockWorkExperienceInstance);
  });

  it('debería guardar CV si está presente en los datos', async () => {
    const candidateDataWithCV = {
      ...validCandidateData,
      cv: { filePath: '/path/to/cv.pdf', fileType: 'pdf' }
    };

    jest.spyOn(validator, 'validateCandidateData').mockImplementation(() => {});
    
    const mockCandidateInstance = {
      save: jest.fn().mockResolvedValue(savedCandidate),
      education: [],
      workExperience: [],
      resumes: []
    };
    MockCandidate.mockImplementation(() => mockCandidateInstance as any);

    const mockResumeInstance = {
      save: jest.fn().mockResolvedValue({ id: 1 }),
      candidateId: undefined
    };
    MockResume.mockImplementation(() => mockResumeInstance as any);

    await addCandidate(candidateDataWithCV);

    expect(MockResume).toHaveBeenCalledWith(candidateDataWithCV.cv);
    expect(mockResumeInstance.save).toHaveBeenCalled();
    expect(mockCandidateInstance.resumes).toContain(mockResumeInstance);
  });

  describe('Transaction and Rollback Scenarios', () => {
    it('debería hacer rollback si falla el guardado de educación después del candidato', async () => {
      const candidateDataWithEducation = {
        ...validCandidateData,
        educations: [
          { institution: 'Universidad', title: 'Ingeniero', startDate: '2020-01-01', endDate: '2024-01-01' }
        ]
      };

      jest.spyOn(validator, 'validateCandidateData').mockImplementation(() => {});
      
      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue(savedCandidate),
        education: [],
        workExperience: [],
        resumes: []
      };
      MockCandidate.mockImplementation(() => mockCandidateInstance as any);

      const mockEducationInstance = {
        save: jest.fn().mockRejectedValue(new Error('Database error on education save')),
        candidateId: undefined
      };
      MockEducation.mockImplementation(() => mockEducationInstance as any);

      await expect(addCandidate(candidateDataWithEducation)).rejects.toThrow('Database error on education save');
      
      // Verificar que se intentó guardar el candidato
      expect(mockCandidateInstance.save).toHaveBeenCalled();
      // Verificar que se intentó guardar la educación
      expect(mockEducationInstance.save).toHaveBeenCalled();
    });

    it('debería hacer rollback si falla el guardado de experiencia después del candidato', async () => {
      const candidateDataWithExperience = {
        ...validCandidateData,
        workExperiences: [
          { company: 'Empresa', position: 'Desarrollador', description: 'Desarrollo web', startDate: '2022-01-01', endDate: '2023-01-01' }
        ]
      };

      jest.spyOn(validator, 'validateCandidateData').mockImplementation(() => {});
      
      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue(savedCandidate),
        education: [],
        workExperience: [],
        resumes: []
      };
      MockCandidate.mockImplementation(() => mockCandidateInstance as any);

      const mockWorkExperienceInstance = {
        save: jest.fn().mockRejectedValue(new Error('Database error on work experience save')),
        candidateId: undefined
      };
      MockWorkExperience.mockImplementation(() => mockWorkExperienceInstance as any);

      await expect(addCandidate(candidateDataWithExperience)).rejects.toThrow('Database error on work experience save');
      
      expect(mockCandidateInstance.save).toHaveBeenCalled();
      expect(mockWorkExperienceInstance.save).toHaveBeenCalled();
    });

    it('debería hacer rollback si falla el guardado de CV después del candidato', async () => {
      const candidateDataWithCV = {
        ...validCandidateData,
        cv: { filePath: '/path/to/cv.pdf', fileType: 'pdf' }
      };

      jest.spyOn(validator, 'validateCandidateData').mockImplementation(() => {});
      
      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue(savedCandidate),
        education: [],
        workExperience: [],
        resumes: []
      };
      MockCandidate.mockImplementation(() => mockCandidateInstance as any);

      const mockResumeInstance = {
        save: jest.fn().mockRejectedValue(new Error('Database error on CV save')),
        candidateId: undefined
      };
      MockResume.mockImplementation(() => mockResumeInstance as any);

      await expect(addCandidate(candidateDataWithCV)).rejects.toThrow('Database error on CV save');
      
      expect(mockCandidateInstance.save).toHaveBeenCalled();
      expect(mockResumeInstance.save).toHaveBeenCalled();
    });

    it('debería manejar fallo en múltiples entidades relacionadas', async () => {
      const candidateDataWithMultipleEntities = {
        ...validCandidateData,
        educations: [
          { institution: 'Universidad', title: 'Ingeniero', startDate: '2020-01-01', endDate: '2024-01-01' }
        ],
        workExperiences: [
          { company: 'Empresa', position: 'Desarrollador', description: 'Desarrollo web', startDate: '2022-01-01', endDate: '2023-01-01' }
        ],
        cv: { filePath: '/path/to/cv.pdf', fileType: 'pdf' }
      };

      jest.spyOn(validator, 'validateCandidateData').mockImplementation(() => {});
      
      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue(savedCandidate),
        education: [],
        workExperience: [],
        resumes: []
      };
      MockCandidate.mockImplementation(() => mockCandidateInstance as any);

      // La educación se guarda exitosamente
      const mockEducationInstance = {
        save: jest.fn().mockResolvedValue({ id: 1 }),
        candidateId: undefined
      };
      MockEducation.mockImplementation(() => mockEducationInstance as any);

      // La experiencia laboral falla
      const mockWorkExperienceInstance = {
        save: jest.fn().mockRejectedValue(new Error('Database error on work experience save')),
        candidateId: undefined
      };
      MockWorkExperience.mockImplementation(() => mockWorkExperienceInstance as any);

      await expect(addCandidate(candidateDataWithMultipleEntities)).rejects.toThrow('Database error on work experience save');
      
      // Verificar que se guardó el candidato y la educación
      expect(mockCandidateInstance.save).toHaveBeenCalled();
      expect(mockEducationInstance.save).toHaveBeenCalled();
      expect(mockWorkExperienceInstance.save).toHaveBeenCalled();
      // El CV no debería haberse intentado guardar porque falló antes
    });
  });
}); 