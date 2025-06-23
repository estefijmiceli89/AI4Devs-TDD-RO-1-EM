import { addCandidateController } from '../../../../src/presentation/controllers/candidateController';
import * as candidateService from '../../../../src/application/services/candidateService';

// Mocks de Express
let mockJson: jest.Mock;
let mockStatus: jest.Mock;
let mockRes: any;

beforeEach(() => {
  mockJson = jest.fn();
  mockStatus = jest.fn(() => ({ json: mockJson }));
  mockRes = { status: mockStatus };
  jest.clearAllMocks();
});

describe('addCandidateController', () => {
  it('debería responder 201 y el candidato creado si todo sale bien', async () => {
    const mockCandidate = { id: 1, firstName: 'Juan', lastName: 'Pérez', email: 'juan@mail.com', phone: null, address: null };
    jest.spyOn(candidateService, 'addCandidate').mockResolvedValue(mockCandidate);
    const req = { body: { firstName: 'Juan', lastName: 'Pérez', email: 'juan@mail.com' } } as any;

    await addCandidateController(req, mockRes);

    expect(candidateService.addCandidate).toHaveBeenCalledWith(req.body);
    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Candidate added successfully', data: mockCandidate });
  });

  it('debería responder 400 y el mensaje de error si el servicio lanza un error', async () => {
    jest.spyOn(candidateService, 'addCandidate').mockRejectedValue(new Error('Validation error'));
    const req = { body: { firstName: 'Juan' } } as any;

    await addCandidateController(req, mockRes);

    expect(candidateService.addCandidate).toHaveBeenCalledWith(req.body);
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Error adding candidate', error: 'Validation error' });
  });

  it('debería responder 400 y error desconocido si el error no es instancia de Error', async () => {
    jest.spyOn(candidateService, 'addCandidate').mockImplementation(() => { throw 'algo raro'; });
    const req = { body: { firstName: 'Juan' } } as any;

    await addCandidateController(req, mockRes);

    expect(candidateService.addCandidate).toHaveBeenCalledWith(req.body);
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Error adding candidate', error: 'Unknown error' });
  });
}); 