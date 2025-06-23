// Mock de Prisma antes de importar Candidate
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockFindUnique = jest.fn();

// Mock Prisma error classes
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      candidate: {
        create: mockCreate,
        update: mockUpdate,
        findUnique: mockFindUnique,
      },
    })),
    Prisma: {
      PrismaClientInitializationError: class extends Error {
        constructor(message: string, clientVersion?: string) {
          super(message);
          this.name = 'PrismaClientInitializationError';
          (this as any).clientVersion = clientVersion;
        }
      }
    }
  };
});

import { Candidate } from '../../../domain/models/Candidate';
import { createMockCandidate } from '../../factories/candidateFactory';
import { Prisma } from '@prisma/client';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Candidate Model', () => {
  describe('save()', () => {
    it('should save a new candidate using prisma.candidate.create', async () => {
      const mockData = createMockCandidate();
      const expectedResult = { id: 1, ...mockData };
      mockCreate.mockResolvedValue(expectedResult);

      const candidate = new Candidate(mockData);
      const result = await candidate.save();
      expect(mockCreate).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should update an existing candidate using prisma.candidate.update', async () => {
      const mockData = { ...createMockCandidate(), id: 2 };
      const expectedResult = { ...mockData };
      mockUpdate.mockResolvedValue(expectedResult);

      const candidate = new Candidate(mockData);
      const result = await candidate.save();
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: mockData.id },
        data: expect.any(Object)
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should find a candidate by id', async () => {
      const candidateData = createMockCandidate();
      const mockCandidate = { ...candidateData, id: 1 };
      
      mockFindUnique.mockResolvedValue(mockCandidate);
      
      const result = await Candidate.findOne(1);
      
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(result).toBeInstanceOf(Candidate);
      expect(result?.id).toBe(1);
    });

    it('should return null when candidate not found', async () => {
      mockFindUnique.mockResolvedValue(null);
      
      const result = await Candidate.findOne(999);
      
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 999 }
      });
      expect(result).toBeNull();
    });

    it('should handle database errors during findOne', async () => {
      const dbError = new Error('Database connection failed');
      mockFindUnique.mockRejectedValue(dbError);
      
      await expect(Candidate.findOne(1)).rejects.toThrow('Database connection failed');
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors during save (create)', async () => {
      const candidateData = createMockCandidate();
      const candidate = new Candidate(candidateData);
      
      const dbError = new Error('Database connection failed');
      mockCreate.mockRejectedValue(dbError);
      
      await expect(candidate.save()).rejects.toThrow('Database connection failed');
      expect(mockCreate).toHaveBeenCalled();
    });

    it('should handle database errors during save (update)', async () => {
      const candidateData = createMockCandidate();
      const candidate = new Candidate({ ...candidateData, id: 1 });
      
      const dbError = new Error('Database connection failed');
      mockUpdate.mockRejectedValue(dbError);
      
      await expect(candidate.save()).rejects.toThrow('Database connection failed');
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.any(Object)
      });
    });

    it('should handle Prisma initialization errors during save', async () => {
      const candidateData = createMockCandidate();
      const candidate = new Candidate(candidateData);
      
      const prismaError = new Prisma.PrismaClientInitializationError('any message', 'test-version');
      mockCreate.mockRejectedValue(prismaError);
      
      await expect(candidate.save()).rejects.toThrow('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
    });

    it('should handle record not found errors during update', async () => {
      const candidateData = createMockCandidate();
      const candidate = new Candidate({ ...candidateData, id: 999 });
      
      const prismaError = new Error('Record not found');
      (prismaError as any).code = 'P2025';
      mockUpdate.mockRejectedValue(prismaError);
      
      await expect(candidate.save()).rejects.toThrow('No se pudo encontrar el registro del candidato con el ID proporcionado.');
    });
  });
}); 