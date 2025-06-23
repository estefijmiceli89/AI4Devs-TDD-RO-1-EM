import { PrismaClient } from '@prisma/client';

// Mock global de Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    candidate: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn()
    },
    education: {
      create: jest.fn()
    },
    workExperience: {
      create: jest.fn()
    },
    resume: {
      create: jest.fn()
    },
    $connect: jest.fn(),
    $disconnect: jest.fn()
  })),
  Prisma: {
    PrismaClientInitializationError: class PrismaClientInitializationError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'PrismaClientInitializationError';
      }
    }
  }
}));

// Configuración global de tests
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.resetAllMocks();
});

// Configuración global de console para tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}; 