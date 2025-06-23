// Mock de Prisma ANTES de cualquier import
const mockCreate = jest.fn();
const mockFindUnique = jest.fn();

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      candidate: {
        create: mockCreate,
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

import request from 'supertest';
import { app } from '../../index';
import { PrismaClient } from '@prisma/client';

// Mock de Prisma
const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Candidate Integration Tests', () => {
  const validCandidateData = {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    phone: '612345678',
    address: 'Calle 123'
  };

  const savedCandidate = {
    id: 1,
    ...validCandidateData,
    phone: validCandidateData.phone,
    address: validCandidateData.address
  };

  describe('POST /candidates', () => {
    it('debería crear un candidato exitosamente', async () => {
      mockCreate.mockResolvedValue(savedCandidate);

      const response = await request(app)
        .post('/candidates')
        .send(validCandidateData)
        .expect(201);

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          firstName: validCandidateData.firstName,
          lastName: validCandidateData.lastName,
          email: validCandidateData.email,
          phone: validCandidateData.phone,
          address: validCandidateData.address
        }
      });

      expect(response.body).toEqual(savedCandidate);
    });

    it('debería rechazar datos inválidos (email inválido)', async () => {
      const invalidData = {
        ...validCandidateData,
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/candidates')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Invalid email');
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('debería rechazar datos inválidos (nombre vacío)', async () => {
      const invalidData = {
        ...validCandidateData,
        firstName: ''
      };

      const response = await request(app)
        .post('/candidates')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Invalid name');
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('debería manejar error de email duplicado', async () => {
      const prismaError = new Error('Unique constraint failed');
      (prismaError as any).code = 'P2002';
      mockCreate.mockRejectedValue(prismaError);

      const response = await request(app)
        .post('/candidates')
        .send(validCandidateData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('The email already exists in the database');
    });

    it('debería manejar errores de base de datos', async () => {
      const dbError = new Error('Database connection failed');
      mockCreate.mockRejectedValue(dbError);

      const response = await request(app)
        .post('/candidates')
        .send(validCandidateData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Database connection failed');
    });

    it('debería manejar errores de inicialización de Prisma', async () => {
      const prismaError = new (require('@prisma/client').Prisma.PrismaClientInitializationError)('Connection failed', 'test-version');
      mockCreate.mockRejectedValue(prismaError);

      const response = await request(app)
        .post('/candidates')
        .send(validCandidateData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
    });

    it('debería aceptar candidato sin campos opcionales', async () => {
      const minimalData = {
        firstName: 'Ana',
        lastName: 'García',
        email: 'ana@example.com'
      };

      const savedMinimalCandidate = {
        id: 2,
        ...minimalData,
        phone: null,
        address: null
      };

      mockCreate.mockResolvedValue(savedMinimalCandidate);

      const response = await request(app)
        .post('/candidates')
        .send(minimalData)
        .expect(201);

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          firstName: minimalData.firstName,
          lastName: minimalData.lastName,
          email: minimalData.email
        }
      });

      expect(response.body).toEqual(savedMinimalCandidate);
    });

    it('debería rechazar datos completamente vacíos', async () => {
      const emptyData = {};

      const response = await request(app)
        .post('/candidates')
        .send(emptyData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Invalid name');
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe('Concurrency Tests', () => {
    it('debería manejar requests simultáneos con el mismo email', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'concurrent@example.com',
        phone: '612345678'
      };

      // Primer request - éxito
      mockCreate.mockResolvedValueOnce({ id: 1, ...candidateData });
      
      // Segundo request - error de email duplicado
      const duplicateError = new Error('Unique constraint failed');
      (duplicateError as any).code = 'P2002';
      mockCreate.mockRejectedValueOnce(duplicateError);

      // Ejecutar requests simultáneos
      const [response1, response2] = await Promise.all([
        request(app).post('/candidates').send(candidateData),
        request(app).post('/candidates').send(candidateData)
      ]);

      // Uno debería tener éxito y otro fallar
      expect(response1.status).toBe(201);
      expect(response2.status).toBe(400);
      expect(response2.body.message).toBe('The email already exists in the database');
    });

    it('debería manejar múltiples requests simultáneos con emails diferentes', async () => {
      const candidates = [
        { firstName: 'Ana', lastName: 'García', email: 'ana@example.com', phone: '612345678' },
        { firstName: 'Carlos', lastName: 'López', email: 'carlos@example.com', phone: '712345678' },
        { firstName: 'María', lastName: 'Rodríguez', email: 'maria@example.com', phone: '912345678' }
      ];

      // Mock exitoso para todos
      candidates.forEach((candidate, index) => {
        mockCreate.mockResolvedValueOnce({ id: index + 1, ...candidate });
      });

      // Ejecutar requests simultáneos
      const responses = await Promise.all(
        candidates.map(candidate => 
          request(app).post('/candidates').send(candidate)
        )
      );

      // Todos deberían tener éxito
      responses.forEach(response => {
        expect(response.status).toBe(201);
      });

      // Verificar que se llamó a create para cada candidato
      expect(mockCreate).toHaveBeenCalledTimes(3);
    });

    it('debería manejar timeout en requests simultáneos', async () => {
      const candidateData = {
        firstName: 'Timeout',
        lastName: 'Test',
        email: 'timeout@example.com',
        phone: '612345678'
      };

      // Simular timeout en el primer request
      mockCreate.mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 100)
        )
      );

      // Segundo request exitoso
      mockCreate.mockResolvedValueOnce({ id: 2, ...candidateData });

      const [response1, response2] = await Promise.all([
        request(app).post('/candidates').send(candidateData),
        request(app).post('/candidates').send(candidateData)
      ]);

      // El primer request debería fallar por timeout
      expect(response1.status).toBe(400);
      expect(response1.body.message).toBe('Database timeout');
      
      // El segundo debería tener éxito
      expect(response2.status).toBe(201);
    });

    it('debería manejar race condition en validación', async () => {
      const invalidData = {
        firstName: 'Race',
        lastName: 'Condition',
        email: 'invalid-email', // Email inválido
        phone: '612345678'
      };

      const validData = {
        firstName: 'Race',
        lastName: 'Condition',
        email: 'valid@example.com',
        phone: '612345678'
      };

      // Mock exitoso para el segundo request
      mockCreate.mockResolvedValueOnce({ id: 1, ...validData });

      const [response1, response2] = await Promise.all([
        request(app).post('/candidates').send(invalidData),
        request(app).post('/candidates').send(validData)
      ]);

      // El primer request debería fallar por validación
      expect(response1.status).toBe(400);
      expect(response1.body.message).toContain('Invalid email');
      
      // El segundo debería tener éxito
      expect(response2.status).toBe(201);
      
      // Solo se debería haber llamado a create una vez (para el válido)
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET / (health check)', () => {
    it('debería responder con mensaje de bienvenida', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toBe('Hola LTI!');
    });
  });

  describe('Anomalías en Requests HTTP', () => {
    it.skip('debería rechazar requests con headers maliciosos (VULN-005)', async () => {
      const maliciousHeaders = {
        'X-Forwarded-For': '192.168.1.1',
        'X-Real-IP': '10.0.0.1',
        'X-Forwarded-Host': 'evil.com',
        'X-Forwarded-Proto': 'https',
        'X-Original-URL': '/admin',
        'X-Rewrite-URL': '/admin',
        'X-Custom-IP-Authorization': '192.168.1.1',
        'X-Originating-IP': '192.168.1.1',
        'X-Remote-IP': '192.168.1.1',
        'X-Remote-Addr': '192.168.1.1',
        'X-Client-IP': '192.168.1.1',
        'X-Host': 'evil.com',
        'X-Forwarded-Server': 'evil.com',
        'X-HTTP-Host-Override': 'evil.com',
        'Forwarded': 'for=192.168.1.1;by=192.168.1.1;host=evil.com'
      };

      const response = await request(app)
        .post('/api/candidates')
        .set(maliciousHeaders)
        .send(validCandidateData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it.skip('debería rechazar requests con Content-Type incorrecto (VULN-005)', async () => {
      const response = await request(app)
        .post('/api/candidates')
        .set('Content-Type', 'text/plain')
        .send(JSON.stringify(validCandidateData));

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Content-Type');
    });

    it.skip('debería rechazar requests con encoding malicioso (VULN-005)', async () => {
      const response = await request(app)
        .post('/api/candidates')
        .set('Content-Type', 'application/json; charset=utf-7')
        .send(validCandidateData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it.skip('debería rechazar requests con cookies maliciosas (VULN-005)', async () => {
      const maliciousCookies = [
        'session=eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaXNBZG1pbiI6dHJ1ZX0=',
        'admin=true',
        'role=admin',
        'authenticated=true',
        'user=admin',
        'auth=1',
        'login=admin',
        'userid=1',
        'username=admin',
        'password=admin'
      ];

      const response = await request(app)
        .post('/api/candidates')
        .set('Cookie', maliciousCookies.join('; '))
        .send(validCandidateData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it.skip('debería rechazar requests con User-Agent malicioso (VULN-005)', async () => {
      const maliciousUserAgents = [
        'sqlmap/1.0',
        'nmap/7.80',
        'nikto/2.1.6',
        'dirb/2.22',
        'gobuster/3.0.1',
        'wfuzz/3.0.0',
        'burp suite',
        'owasp zap',
        'metasploit',
        'nuclei/2.0.0',
        'sqlmap',
        'xsser',
        'w3af',
        'arachni',
        'wpscan',
        'joomscan',
        'droopescan',
        'plecost',
        'wpscan',
        'joomscan'
      ];

      for (const userAgent of maliciousUserAgents) {
        const response = await request(app)
          .post('/api/candidates')
          .set('User-Agent', userAgent)
          .send(validCandidateData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      }
    });

    it.skip('debería rechazar requests con referer malicioso (VULN-005)', async () => {
      const maliciousReferers = [
        'http://evil.com',
        'https://malicious-site.com',
        'http://192.168.1.1',
        'http://10.0.0.1',
        'http://localhost:8080/admin',
        'http://127.0.0.1:8080/admin',
        'http://0.0.0.0:8080/admin',
        'http://[::1]:8080/admin',
        'http://evil.com/admin',
        'http://malicious.com/phpmyadmin',
        'http://evil.com/wp-admin',
        'http://malicious.com/cpanel',
        'http://evil.com/administrator',
        'http://malicious.com/manager',
        'http://evil.com/admin.php',
        'http://malicious.com/admin.asp',
        'http://evil.com/admin.aspx',
        'http://malicious.com/admin.jsp',
        'http://evil.com/admin.cfm',
        'http://malicious.com/admin.pl'
      ];

      for (const referer of maliciousReferers) {
        const response = await request(app)
          .post('/api/candidates')
          .set('Referer', referer)
          .send(validCandidateData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      }
    });

    it.skip('debería rechazar requests con Accept-Language malicioso (VULN-005)', async () => {
      const maliciousAcceptLanguages = [
        'en-US,en;q=0.9,../;q=0.8',
        'en-US,en;q=0.9,../../;q=0.8',
        'en-US,en;q=0.9,../../../;q=0.8',
        'en-US,en;q=0.9,../../../../;q=0.8',
        'en-US,en;q=0.9,../../../../../;q=0.8',
        'en-US,en;q=0.9,../../../../../../;q=0.8',
        'en-US,en;q=0.9,../../../../../../../;q=0.8',
        'en-US,en;q=0.9,../../../../../../../../;q=0.8',
        'en-US,en;q=0.9,../../../../../../../../../;q=0.8',
        'en-US,en;q=0.9,../../../../../../../../../../;q=0.8'
      ];

      for (const acceptLanguage of maliciousAcceptLanguages) {
        const response = await request(app)
          .post('/api/candidates')
          .set('Accept-Language', acceptLanguage)
          .send(validCandidateData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      }
    });

    it.skip('debería rechazar requests con Accept-Encoding malicioso (VULN-005)', async () => {
      const maliciousAcceptEncodings = [
        'gzip, deflate, ../../',
        'gzip, deflate, ../../../',
        'gzip, deflate, ../../../../',
        'gzip, deflate, ../../../../../',
        'gzip, deflate, ../../../../../../',
        'gzip, deflate, ../../../../../../../',
        'gzip, deflate, ../../../../../../../../',
        'gzip, deflate, ../../../../../../../../../',
        'gzip, deflate, ../../../../../../../../../../',
        'gzip, deflate, ../../../../../../../../../../../'
      ];

      for (const acceptEncoding of maliciousAcceptEncodings) {
        const response = await request(app)
          .post('/api/candidates')
          .set('Accept-Encoding', acceptEncoding)
          .send(validCandidateData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      }
    });

    it.skip('debería rechazar requests con Accept malicioso (VULN-005)', async () => {
      const maliciousAccepts = [
        'text/html,application/xhtml+xml,application/xml;q=0.9,../../;q=0.8',
        'text/html,application/xhtml+xml,application/xml;q=0.9,../../../;q=0.8',
        'text/html,application/xhtml+xml,application/xml;q=0.9,../../../../;q=0.8',
        'text/html,application/xhtml+xml,application/xml;q=0.9,../../../../../;q=0.8',
        'text/html,application/xhtml+xml,application/xml;q=0.9,../../../../../../;q=0.8',
        'text/html,application/xhtml+xml,application/xml;q=0.9,../../../../../../../;q=0.8',
        'text/html,application/xhtml+xml,application/xml;q=0.9,../../../../../../../../;q=0.8',
        'text/html,application/xhtml+xml,application/xml;q=0.9,../../../../../../../../../;q=0.8',
        'text/html,application/xhtml+xml,application/xml;q=0.9,../../../../../../../../../../;q=0.8',
        'text/html,application/xhtml+xml,application/xml;q=0.9,../../../../../../../../../../../;q=0.8'
      ];

      for (const accept of maliciousAccepts) {
        const response = await request(app)
          .post('/api/candidates')
          .set('Accept', accept)
          .send(validCandidateData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      }
    });

    it.skip('debería rechazar requests con Connection malicioso (VULN-005)', async () => {
      const maliciousConnections = [
        'close, ../../',
        'close, ../../../',
        'close, ../../../../',
        'close, ../../../../../',
        'close, ../../../../../../',
        'close, ../../../../../../../',
        'close, ../../../../../../../../',
        'close, ../../../../../../../../../',
        'close, ../../../../../../../../../../',
        'close, ../../../../../../../../../../../'
      ];

      for (const connection of maliciousConnections) {
        const response = await request(app)
          .post('/api/candidates')
          .set('Connection', connection)
          .send(validCandidateData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      }
    });

    it.skip('debería rechazar requests con múltiples headers maliciosos (VULN-005)', async () => {
      const maliciousHeaders = {
        'X-Forwarded-For': '192.168.1.1',
        'X-Real-IP': '10.0.0.1',
        'X-Forwarded-Host': 'evil.com',
        'User-Agent': 'sqlmap/1.0',
        'Referer': 'http://evil.com/admin',
        'Accept-Language': 'en-US,en;q=0.9,../;q=0.8',
        'Accept-Encoding': 'gzip, deflate, ../../',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,../../;q=0.8',
        'Connection': 'close, ../../',
        'Cookie': 'session=eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaXNBZG1pbiI6dHJ1ZX0='
      };

      const response = await request(app)
        .post('/api/candidates')
        .set(maliciousHeaders)
        .send(validCandidateData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Vulnerabilidades de Seguridad', () => {
    it.skip('debería rechazar requests con headers maliciosos (VULN-005)', async () => {/* ... */});
    it.skip('debería rechazar requests con Content-Type incorrecto (VULN-005)', async () => {/* ... */});
    it.skip('debería rechazar requests con encoding malicioso (VULN-005)', async () => {/* ... */});
    it.skip('debería rechazar requests con cookies maliciosas (VULN-005)', async () => {/* ... */});
    it.skip('debería rechazar requests con User-Agent malicioso (VULN-005)', async () => {/* ... */});
    it.skip('debería rechazar requests con referer malicioso (VULN-005)', async () => {/* ... */});
    it.skip('debería rechazar requests con Accept-Language malicioso (VULN-005)', async () => {/* ... */});
    it.skip('debería rechazar requests con Accept-Encoding malicioso (VULN-005)', async () => {/* ... */});
    it.skip('debería rechazar requests con Accept malicioso (VULN-005)', async () => {/* ... */});
    it.skip('debería rechazar requests con Connection malicioso (VULN-005)', async () => {/* ... */});
    it.skip('debería rechazar requests con múltiples headers maliciosos (VULN-005)', async () => {/* ... */});
    it.skip('debería manejar errores de memoria insuficiente (VULN-006)', async () => {/* ... */});
    it.skip('debería manejar errores de disco lleno (VULN-006)', async () => {/* ... */});
    it.skip('debería manejar errores de red (VULN-006)', async () => {/* ... */});
    it.skip('debería manejar errores de permisos de archivo (VULN-006)', async () => {/* ... */});
    it.skip('debería manejar errores de timeout del sistema (VULN-006)', async () => {/* ... */});
    it.skip('debería manejar errores de recursos agotados (VULN-006)', async () => {/* ... */});
    it.skip('debería manejar errores de base de datos corrupta (VULN-006)', async () => {/* ... */});
    it.skip('debería manejar errores de configuración del sistema (VULN-006)', async () => {/* ... */});
    it.skip('debería manejar errores de dependencias no disponibles (VULN-006)', async () => {/* ... */});
    it.skip('debería manejar errores de proceso interrumpido (VULN-006)', async () => {/* ... */});
    it.skip('debería manejar errores de múltiples recursos agotados simultáneamente (VULN-006)', async () => {/* ... */});
  });
}); 