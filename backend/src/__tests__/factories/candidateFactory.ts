export interface MockCandidateData {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  educations?: any[];
  workExperiences?: any[];
  cv?: any;
}

export const createMockCandidate = (overrides: Partial<MockCandidateData> = {}): MockCandidateData => ({
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@example.com',
  phone: '612345678',
  address: 'Calle Mayor 123, Madrid',
  educations: [{
    institution: 'Universidad Complutense de Madrid',
    title: 'Ingeniero Informático',
    startDate: '2018-09-01',
    endDate: '2022-06-30'
  }],
  workExperiences: [{
    company: 'TechCorp Solutions',
    position: 'Desarrollador Full Stack',
    description: 'Desarrollo de aplicaciones web con React y Node.js',
    startDate: '2022-07-01',
    endDate: null
  }],
  cv: {
    filePath: '/uploads/cv_juan_perez.pdf',
    fileType: 'application/pdf'
  },
  ...overrides
});

export const createMinimalMockCandidate = (overrides: Partial<MockCandidateData> = {}): MockCandidateData => ({
  firstName: 'María',
  lastName: 'García',
  email: 'maria.garcia@example.com',
  ...overrides
});

export const createInvalidMockCandidate = (overrides: Partial<MockCandidateData> = {}): MockCandidateData => ({
  firstName: '123', // Invalid: contains numbers
  lastName: '', // Invalid: empty
  email: 'invalid-email', // Invalid: wrong format
  phone: '123456789', // Invalid: wrong format
  ...overrides
});

export const createMockCandidateWithSpecialCharacters = (overrides: Partial<MockCandidateData> = {}): MockCandidateData => ({
  firstName: 'José María',
  lastName: 'González-Ñoño',
  email: 'jose.gonzalez@example.com',
  phone: '612345678',
  address: 'Calle de la Ópera, 15',
  ...overrides
});

export const createMockCandidateWithMultipleEducation = (overrides: Partial<MockCandidateData> = {}): MockCandidateData => ({
  ...createMockCandidate(),
  educations: [
    {
      institution: 'Universidad Politécnica de Madrid',
      title: 'Ingeniero Informático',
      startDate: '2018-09-01',
      endDate: '2022-06-30'
    },
    {
      institution: 'Escuela de Negocios IE',
      title: 'Máster en Business Analytics',
      startDate: '2022-09-01',
      endDate: '2023-06-30'
    }
  ],
  ...overrides
});

export const createMockCandidateWithMultipleExperience = (overrides: Partial<MockCandidateData> = {}): MockCandidateData => ({
  ...createMockCandidate(),
  workExperiences: [
    {
      company: 'TechCorp Solutions',
      position: 'Desarrollador Junior',
      description: 'Desarrollo frontend con React',
      startDate: '2022-07-01',
      endDate: '2023-06-30'
    },
    {
      company: 'Innovation Labs',
      position: 'Desarrollador Full Stack',
      description: 'Desarrollo completo de aplicaciones web',
      startDate: '2023-07-01',
      endDate: null
    }
  ],
  ...overrides
}); 