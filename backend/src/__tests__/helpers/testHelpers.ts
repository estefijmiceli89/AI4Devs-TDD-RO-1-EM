import { Request, Response } from 'express';

// Mock Express Request
export const createMockRequest = (body: any = {}, params: any = {}, query: any = {}): Partial<Request> => ({
  body,
  params,
  query,
  headers: {},
  method: 'POST',
  url: '/api/candidates'
});

// Mock Express Response
export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

// Mock Prisma operations
export const mockPrismaOperations = {
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
  }
};

// Helper para resetear todos los mocks
export const resetAllMocks = () => {
  jest.clearAllMocks();
  Object.values(mockPrismaOperations).forEach(operations => {
    Object.values(operations).forEach(mock => {
      if (typeof mock === 'function') {
        mock.mockReset();
      }
    });
  });
};

// Helper para verificar que se llamó a una función específica
export const expectFunctionToHaveBeenCalledWith = (mockFn: jest.Mock, expectedData: any) => {
  expect(mockFn).toHaveBeenCalledWith(expectedData);
};

// Helper para verificar que se llamó a una función exactamente una vez
export const expectFunctionToHaveBeenCalledOnce = (mockFn: jest.Mock) => {
  expect(mockFn).toHaveBeenCalledTimes(1);
};

// Helper para verificar respuestas HTTP
export const expectHttpResponse = (response: any, statusCode: number, expectedData: any) => {
  expect(response.status).toHaveBeenCalledWith(statusCode);
  expect(response.json).toHaveBeenCalledWith(expectedData);
};

// Helper para verificar errores HTTP
export const expectHttpError = (response: any, statusCode: number, errorMessage: string) => {
  expect(response.status).toHaveBeenCalledWith(statusCode);
  expect(response.json).toHaveBeenCalledWith({
    message: 'Error adding candidate',
    error: errorMessage
  });
}; 