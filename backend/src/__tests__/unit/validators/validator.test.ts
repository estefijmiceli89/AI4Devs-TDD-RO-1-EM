import { validateCandidateData } from '../../../application/validator';
import { 
  createMockCandidate, 
  createMinimalMockCandidate, 
  createInvalidMockCandidate,
  createMockCandidateWithSpecialCharacters 
} from '../../factories/candidateFactory';

describe('Validator - Name Validation', () => {
  describe('Valid names', () => {
    test('should validate names with basic characters', () => {
      const data = createMinimalMockCandidate({
        firstName: 'John',
        lastName: 'Doe'
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate names with Spanish characters', () => {
      const data = createMockCandidateWithSpecialCharacters();
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate names with accents and ñ', () => {
      const data = createMinimalMockCandidate({
        firstName: 'José María',
        lastName: 'González-Ñoño'
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate names with minimum length (2 characters)', () => {
      const data = createMinimalMockCandidate({
        firstName: 'Jo',
        lastName: 'Do'
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate names with maximum length (100 characters)', () => {
      const longName = 'A'.repeat(100);
      const data = createMinimalMockCandidate({
        firstName: longName,
        lastName: longName
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });
  });

  describe('Invalid names', () => {
    test('should reject empty first name', () => {
      const data = createMinimalMockCandidate({
        firstName: ''
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid name');
    });

    test('should reject empty last name', () => {
      const data = createMinimalMockCandidate({
        lastName: ''
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid name');
    });

    test('should reject names with numbers', () => {
      const data = createMinimalMockCandidate({
        firstName: 'John123',
        lastName: 'Doe456'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid name');
    });

    test('should reject names with special characters (except allowed ones)', () => {
      const data = createMinimalMockCandidate({
        firstName: 'John@Doe',
        lastName: 'Smith#Jones'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid name');
    });

    test('should reject names shorter than 2 characters', () => {
      const data = createMinimalMockCandidate({
        firstName: 'J',
        lastName: 'D'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid name');
    });

    test('should reject names longer than 100 characters', () => {
      const tooLongName = 'A'.repeat(101);
      const data = createMinimalMockCandidate({
        firstName: tooLongName,
        lastName: tooLongName
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid name');
    });

    test('should reject names with only spaces', () => {
      const data = createMinimalMockCandidate({
        firstName: '   ',
        lastName: '   '
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid name');
    });
  });
});

describe('Validator - Email Validation', () => {
  describe('Valid emails', () => {
    test('should validate basic email format', () => {
      const data = createMinimalMockCandidate({
        email: 'john.doe@example.com'
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate email with subdomain', () => {
      const data = createMinimalMockCandidate({
        email: 'user@subdomain.example.com'
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate email with numbers', () => {
      const data = createMinimalMockCandidate({
        email: 'user123@example.com'
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate email with special characters in local part', () => {
      const data = createMinimalMockCandidate({
        email: 'user+tag@example.com'
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate email with dots in local part', () => {
      const data = createMinimalMockCandidate({
        email: 'user.name@example.com'
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate email with underscore', () => {
      const data = createMinimalMockCandidate({
        email: 'user_name@example.com'
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });
  });

  describe('Invalid emails', () => {
    test('should reject empty email', () => {
      const data = createMinimalMockCandidate({
        email: ''
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid email');
    });

    test('should reject email without @ symbol', () => {
      const data = createMinimalMockCandidate({
        email: 'invalidemail.com'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid email');
    });

    test('should reject email without domain', () => {
      const data = createMinimalMockCandidate({
        email: 'user@'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid email');
    });

    test('should reject email without local part', () => {
      const data = createMinimalMockCandidate({
        email: '@example.com'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid email');
    });

    test('should reject email with invalid domain format', () => {
      const data = createMinimalMockCandidate({
        email: 'user@example'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid email');
    });

    test('should reject email with spaces', () => {
      const data = createMinimalMockCandidate({
        email: 'user name@example.com'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid email');
    });

    test('should reject email with invalid characters', () => {
      const data = createMinimalMockCandidate({
        email: 'user<>@example.com'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid email');
    });
  });
});

describe('Validator - Phone Validation', () => {
  describe('Valid phone numbers', () => {
    test('should validate phone starting with 6', () => {
      const data = createMinimalMockCandidate({
        phone: '612345678'
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate phone starting with 7', () => {
      const data = createMinimalMockCandidate({
        phone: '712345678'
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate phone starting with 9', () => {
      const data = createMinimalMockCandidate({
        phone: '912345678'
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate phone with exactly 9 digits', () => {
      const data = createMinimalMockCandidate({
        phone: '612345678'
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should allow empty phone (optional field)', () => {
      const data = createMinimalMockCandidate({
        phone: undefined
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should allow null phone (optional field)', () => {
      const data = createMinimalMockCandidate({
        phone: null
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });
  });

  describe('Invalid phone numbers', () => {
    test('should reject phone starting with 1', () => {
      const data = createMinimalMockCandidate({
        phone: '112345678'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid phone');
    });

    test('should reject phone starting with 2', () => {
      const data = createMinimalMockCandidate({
        phone: '212345678'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid phone');
    });

    test('should reject phone starting with 3', () => {
      const data = createMinimalMockCandidate({
        phone: '312345678'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid phone');
    });

    test('should reject phone starting with 4', () => {
      const data = createMinimalMockCandidate({
        phone: '412345678'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid phone');
    });

    test('should reject phone starting with 5', () => {
      const data = createMinimalMockCandidate({
        phone: '512345678'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid phone');
    });

    test('should reject phone starting with 8', () => {
      const data = createMinimalMockCandidate({
        phone: '812345678'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid phone');
    });

    test('should reject phone with less than 9 digits', () => {
      const data = createMinimalMockCandidate({
        phone: '61234567'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid phone');
    });

    test('should reject phone with more than 9 digits', () => {
      const data = createMinimalMockCandidate({
        phone: '6123456789'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid phone');
    });

    test('should reject phone with letters', () => {
      const data = createMinimalMockCandidate({
        phone: '61234567a'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid phone');
    });

    test('should reject phone with special characters', () => {
      const data = createMinimalMockCandidate({
        phone: '612-345-678'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid phone');
    });

    test('should reject phone with spaces', () => {
      const data = createMinimalMockCandidate({
        phone: '612 345 678'
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid phone');
    });
  });
});

describe('Validator - Date Validation', () => {
  describe('Valid dates', () => {
    test('should validate correct date format YYYY-MM-DD', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2020-01-15',
          endDate: '2024-06-30'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate date with single digit month and day', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2020-01-01',
          endDate: '2024-12-31'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate date with double digit month and day', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2020-12-25',
          endDate: '2024-12-25'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should allow null end date (ongoing education)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2020-01-01',
          endDate: null
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should allow undefined end date (ongoing education)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2020-01-01',
          endDate: undefined
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });
  });

  describe('Invalid dates', () => {
    test('should reject empty start date', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '',
          endDate: '2024-06-30'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should reject date in wrong format (DD-MM-YYYY)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '15-01-2020',
          endDate: '30-06-2024'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should reject date in wrong format (MM/DD/YYYY)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '01/15/2020',
          endDate: '06/30/2024'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should reject date with invalid month (13)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2020-13-01',
          endDate: '2024-06-30'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should reject date with invalid day (32)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2020-01-32',
          endDate: '2024-06-30'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should reject date with letters', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2020-01-aa',
          endDate: '2024-06-30'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should reject date with special characters', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2020-01-15@',
          endDate: '2024-06-30'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should reject invalid end date format', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2020-01-01',
          endDate: '30-06-2024'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid end date');
    });
  });

  describe('Edge cases and boundary dates', () => {
    test('should validate February 29 in leap year (2024-02-29)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2024-02-29',
          endDate: '2024-02-29'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should reject February 29 in non-leap year (2023-02-29)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-02-29',
          endDate: '2023-02-29'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should validate February 28 in non-leap year (2023-02-28)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-02-28',
          endDate: '2023-02-28'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should reject February 30 (invalid day)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-02-30',
          endDate: '2023-02-30'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should validate April 30 (valid day)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-04-30',
          endDate: '2023-04-30'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should reject April 31 (invalid day)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-04-31',
          endDate: '2023-04-31'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should validate June 30 (valid day)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-06-30',
          endDate: '2023-06-30'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should reject June 31 (invalid day)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-06-31',
          endDate: '2023-06-31'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should validate September 30 (valid day)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-09-30',
          endDate: '2023-09-30'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should reject September 31 (invalid day)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-09-31',
          endDate: '2023-09-31'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should validate November 30 (valid day)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-11-30',
          endDate: '2023-11-30'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should reject November 31 (invalid day)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-11-31',
          endDate: '2023-11-31'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should validate January 31 (valid day)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-01-31',
          endDate: '2023-01-31'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate March 31 (valid day)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-03-31',
          endDate: '2023-03-31'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate May 31 (valid day)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-05-31',
          endDate: '2023-05-31'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate July 31 (valid day)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-07-31',
          endDate: '2023-07-31'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate August 31 (valid day)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-08-31',
          endDate: '2023-08-31'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate October 31 (valid day)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-10-31',
          endDate: '2023-10-31'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate December 31 (valid day)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2023-12-31',
          endDate: '2023-12-31'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should reject year 1899 (before 1900)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '1899-01-01',
          endDate: '1899-12-31'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should reject year 2101 (after 2100)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2101-01-01',
          endDate: '2101-12-31'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should validate year 1900 (boundary)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '1900-01-01',
          endDate: '1900-12-31'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate year 2100 (boundary)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2100-01-01',
          endDate: '2100-12-31'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should reject date with leading zeros in wrong places (01-01-2024)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '01-01-2024',
          endDate: '01-01-2024'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should reject date with trailing zeros (2024-01-01.0)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2024-01-01.0',
          endDate: '2024-01-01.0'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should reject date with time component (2024-01-01T00:00:00)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2024-01-01T00:00:00',
          endDate: '2024-01-01T00:00:00'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });

    test('should reject date with timezone (2024-01-01+00:00)', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Test',
          title: 'Test Title',
          startDate: '2024-01-01+00:00',
          endDate: '2024-01-01+00:00'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid date');
    });
  });
});

describe('Validator - Education Validation', () => {
  describe('Valid education data', () => {
    test('should validate complete education record', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Universidad Complutense de Madrid',
          title: 'Ingeniero Informático',
          startDate: '2018-09-01',
          endDate: '2022-06-30'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate education with maximum length fields', () => {
      const longInstitution = 'A'.repeat(100);
      const longTitle = 'A'.repeat(250);
      const data = createMockCandidate({
        educations: [{
          institution: longInstitution,
          title: longTitle,
          startDate: '2018-09-01',
          endDate: '2022-06-30'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate multiple education records', () => {
      const data = createMockCandidate({
        educations: [
          {
            institution: 'Universidad 1',
            title: 'Título 1',
            startDate: '2018-09-01',
            endDate: '2022-06-30'
          },
          {
            institution: 'Universidad 2',
            title: 'Título 2',
            startDate: '2022-09-01',
            endDate: null
          }
        ]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });
  });

  describe('Invalid education data', () => {
    test('should reject empty institution', () => {
      const data = createMockCandidate({
        educations: [{
          institution: '',
          title: 'Test Title',
          startDate: '2018-09-01',
          endDate: '2022-06-30'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid institution');
    });

    test('should reject institution longer than 100 characters', () => {
      const longInstitution = 'A'.repeat(101);
      const data = createMockCandidate({
        educations: [{
          institution: longInstitution,
          title: 'Test Title',
          startDate: '2018-09-01',
          endDate: '2022-06-30'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid institution');
    });

    test('should reject empty title', () => {
      const data = createMockCandidate({
        educations: [{
          institution: 'Test University',
          title: '',
          startDate: '2018-09-01',
          endDate: '2022-06-30'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid title');
    });

    test('should reject title longer than 250 characters', () => {
      const longTitle = 'A'.repeat(251);
      const data = createMockCandidate({
        educations: [{
          institution: 'Test University',
          title: longTitle,
          startDate: '2018-09-01',
          endDate: '2022-06-30'
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid title');
    });
  });
});

describe('Validator - Work Experience Validation', () => {
  describe('Valid work experience data', () => {
    test('should validate complete work experience record', () => {
      const data = createMockCandidate({
        workExperiences: [{
          company: 'TechCorp Solutions',
          position: 'Desarrollador Full Stack',
          description: 'Desarrollo de aplicaciones web con React y Node.js',
          startDate: '2022-07-01',
          endDate: null
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate work experience with maximum length fields', () => {
      const longCompany = 'A'.repeat(100);
      const longPosition = 'A'.repeat(100);
      const longDescription = 'A'.repeat(200);
      const data = createMockCandidate({
        workExperiences: [{
          company: longCompany,
          position: longPosition,
          description: longDescription,
          startDate: '2022-07-01',
          endDate: '2023-06-30'
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate work experience without description', () => {
      const data = createMockCandidate({
        workExperiences: [{
          company: 'TechCorp',
          position: 'Developer',
          description: undefined,
          startDate: '2022-07-01',
          endDate: null
        }]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate multiple work experience records', () => {
      const data = createMockCandidate({
        workExperiences: [
          {
            company: 'Company 1',
            position: 'Position 1',
            description: 'Description 1',
            startDate: '2020-01-01',
            endDate: '2022-06-30'
          },
          {
            company: 'Company 2',
            position: 'Position 2',
            description: 'Description 2',
            startDate: '2022-07-01',
            endDate: null
          }
        ]
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });
  });

  describe('Invalid work experience data', () => {
    test('should reject empty company', () => {
      const data = createMockCandidate({
        workExperiences: [{
          company: '',
          position: 'Test Position',
          description: 'Test Description',
          startDate: '2022-07-01',
          endDate: null
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid company');
    });

    test('should reject company longer than 100 characters', () => {
      const longCompany = 'A'.repeat(101);
      const data = createMockCandidate({
        workExperiences: [{
          company: longCompany,
          position: 'Test Position',
          description: 'Test Description',
          startDate: '2022-07-01',
          endDate: null
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid company');
    });

    test('should reject empty position', () => {
      const data = createMockCandidate({
        workExperiences: [{
          company: 'Test Company',
          position: '',
          description: 'Test Description',
          startDate: '2022-07-01',
          endDate: null
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid position');
    });

    test('should reject position longer than 100 characters', () => {
      const longPosition = 'A'.repeat(101);
      const data = createMockCandidate({
        workExperiences: [{
          company: 'Test Company',
          position: longPosition,
          description: 'Test Description',
          startDate: '2022-07-01',
          endDate: null
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid position');
    });

    test('should reject description longer than 200 characters', () => {
      const longDescription = 'A'.repeat(201);
      const data = createMockCandidate({
        workExperiences: [{
          company: 'Test Company',
          position: 'Test Position',
          description: longDescription,
          startDate: '2022-07-01',
          endDate: null
        }]
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid description');
    });
  });
});

describe('Validator - CV Validation', () => {
  describe('Valid CV data', () => {
    test('should validate complete CV data', () => {
      const data = createMockCandidate({
        cv: {
          filePath: '/uploads/cv_juan_perez.pdf',
          fileType: 'application/pdf'
        }
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate CV with different file types', () => {
      const data = createMockCandidate({
        cv: {
          filePath: '/uploads/cv_juan_perez.docx',
          fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should allow empty CV object', () => {
      const data = createMockCandidate({
        cv: {}
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should allow undefined CV', () => {
      const data = createMockCandidate({
        cv: undefined
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });
  });

  describe('Invalid CV data', () => {
    test('should reject CV without filePath', () => {
      const data = createMockCandidate({
        cv: {
          fileType: 'application/pdf'
        }
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid CV data');
    });

    test('should reject CV without fileType', () => {
      const data = createMockCandidate({
        cv: {
          filePath: '/uploads/cv.pdf'
        }
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid CV data');
    });

    test('should reject CV with non-string filePath', () => {
      const data = createMockCandidate({
        cv: {
          filePath: 123,
          fileType: 'application/pdf'
        }
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid CV data');
    });

    test('should reject CV with non-string fileType', () => {
      const data = createMockCandidate({
        cv: {
          filePath: '/uploads/cv.pdf',
          fileType: 456
        }
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid CV data');
    });

    test('should reject CV with null values', () => {
      const data = createMockCandidate({
        cv: {
          filePath: null,
          fileType: null
        }
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid CV data');
    });
  });
});

describe('Validator - Address Validation', () => {
  describe('Valid addresses', () => {
    test('should validate address with maximum length', () => {
      const longAddress = 'A'.repeat(100);
      const data = createMockCandidate({
        address: longAddress
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should allow empty address', () => {
      const data = createMockCandidate({
        address: ''
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should allow undefined address', () => {
      const data = createMockCandidate({
        address: undefined
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should allow null address', () => {
      const data = createMockCandidate({
        address: null
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });
  });

  describe('Invalid addresses', () => {
    test('should reject address longer than 100 characters', () => {
      const tooLongAddress = 'A'.repeat(101);
      const data = createMockCandidate({
        address: tooLongAddress
      });
      expect(() => validateCandidateData(data)).toThrow('Invalid address');
    });
  });
});

describe('Validator - Special Cases', () => {
  describe('Editing existing candidate (with ID)', () => {
    test('should skip validation when ID is provided (editing mode)', () => {
      const data = createInvalidMockCandidate({
        id: 1
      });
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should skip validation even with completely invalid data when ID is provided', () => {
      const data = {
        id: 1,
        firstName: '123', // Invalid
        lastName: '', // Invalid
        email: 'invalid-email', // Invalid
        phone: '123456789', // Invalid
        address: 'A'.repeat(101), // Invalid
        educations: [{
          institution: '', // Invalid
          title: 'A'.repeat(251), // Invalid
          startDate: 'invalid-date', // Invalid
          endDate: 'invalid-date' // Invalid
        }],
        workExperiences: [{
          company: '', // Invalid
          position: 'A'.repeat(101), // Invalid
          description: 'A'.repeat(201), // Invalid
          startDate: 'invalid-date', // Invalid
          endDate: 'invalid-date' // Invalid
        }],
        cv: {
          filePath: 123, // Invalid
          fileType: 456 // Invalid
        }
      };
      expect(() => validateCandidateData(data)).not.toThrow();
    });
  });

  describe('Complete candidate validation', () => {
    test('should validate complete candidate with all fields', () => {
      const data = createMockCandidate();
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should validate minimal candidate with only required fields', () => {
      const data = createMinimalMockCandidate();
      expect(() => validateCandidateData(data)).not.toThrow();
    });

    test('should reject candidate with all invalid fields', () => {
      const data = createInvalidMockCandidate();
      expect(() => validateCandidateData(data)).toThrow();
    });
  });
});

describe('Validator - Malicious Data Tests', () => {
  describe('XSS and Script Injection', () => {
    it('debería rechazar nombres con scripts XSS', () => {
      const maliciousData = createMockCandidate({
        firstName: '<script>alert("XSS")</script>',
        lastName: 'Test'
      });
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid name');
    });

    it('debería rechazar nombres con JavaScript malicioso', () => {
      const maliciousData = createMockCandidate({
        firstName: 'javascript:alert("XSS")',
        lastName: 'Test'
      });
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid name');
    });

    it('debería rechazar nombres con HTML entities maliciosas', () => {
      const maliciousData = createMockCandidate({
        firstName: '&#60;script&#62;alert("XSS")&#60;/script&#62;',
        lastName: 'Test'
      });
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid name');
    });

    it('debería rechazar emails con scripts', () => {
      const maliciousData = createMockCandidate({
        firstName: 'Test',
        lastName: 'User',
        email: 'test<script>alert("XSS")</script>@example.com'
      });
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid email');
    });

    it.skip('debería rechazar descripciones con scripts en experiencia laboral (VULN-001)', () => {
      const maliciousData = createMockCandidate({
        workExperiences: [{
          company: 'Test Company',
          position: 'Developer',
          description: '<script>alert("XSS")</script>Desarrollo web',
          startDate: '2022-01-01',
          endDate: '2023-01-01'
        }]
      });
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid description');
    });
  });

  describe('Path Traversal Attacks', () => {
    it.skip('debería rechazar filePath con path traversal en CV (VULN-002)', () => {
      const maliciousData = createMockCandidate({
        cv: {
          filePath: '../../../etc/passwd',
          fileType: 'pdf'
        }
      });
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid CV data');
    });

    it.skip('debería rechazar filePath con path traversal absoluto (VULN-002)', () => {
      const maliciousData = createMockCandidate({
        cv: {
          filePath: '/etc/passwd',
          fileType: 'pdf'
        }
      });
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid CV data');
    });

    it.skip('debería rechazar filePath con caracteres de control (VULN-002)', () => {
      const maliciousData = createMockCandidate({
        cv: {
          filePath: 'file\u0000name.pdf',
          fileType: 'pdf'
        }
      });
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid CV data');
    });
  });

  describe('SQL Injection Attempts', () => {
    it('debería rechazar nombres con SQL injection', () => {
      const maliciousData = createMockCandidate({
        firstName: "'; DROP TABLE candidates; --",
        lastName: 'Test'
      });
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid name');
    });

    it('debería rechazar emails con SQL injection', () => {
      const maliciousData = createMockCandidate({
        firstName: 'Test',
        lastName: 'User',
        email: "'; INSERT INTO users VALUES ('hacker', 'password'); --"
      });
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid email');
    });

    it.skip('debería rechazar instituciones con SQL injection (VULN-003)', () => {
      const maliciousData = createMockCandidate({
        educations: [{
          institution: "'; UPDATE candidates SET email = 'hacked@evil.com'; --",
          title: 'Test Title',
          startDate: '2020-01-01',
          endDate: '2024-01-01'
        }]
      });
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid institution');
    });
  });

  describe('Unicode and Special Characters', () => {
    it('debería rechazar nombres con caracteres Unicode maliciosos', () => {
      const maliciousData = createMockCandidate({
        firstName: 'Test\u2028User', // Line separator
        lastName: 'Name'
      });
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid name');
    });

    it('debería rechazar nombres con emojis maliciosos', () => {
      const maliciousData = createMockCandidate({
        firstName: 'Test👨‍💻User', // Emoji con ZWJ
        lastName: 'Name'
      });
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid name');
    });

    it('debería rechazar nombres con caracteres de control', () => {
      const maliciousData = createMockCandidate({
        firstName: 'Test\u0000User', // Null character
        lastName: 'Name'
      });
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid name');
    });
  });

  describe('Buffer Overflow Attempts', () => {
    it('debería rechazar nombres extremadamente largos', () => {
      const maliciousData = createMockCandidate({
        firstName: 'A'.repeat(1000), // Más del límite de 100
        lastName: 'Test'
      });
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid name');
    });

    it.skip('debería rechazar emails extremadamente largos (VULN-004)', () => {
      const maliciousData = createMockCandidate({
        firstName: 'Test',
        lastName: 'User',
        email: 'a'.repeat(300) + '@example.com' // Más del límite RFC
      });
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid email');
    });

    it('debería rechazar descripciones extremadamente largas', () => {
      const maliciousData = createMockCandidate({
        workExperiences: [{
          company: 'Test Company',
          position: 'Developer',
          description: 'A'.repeat(1000), // Más del límite de 200
          startDate: '2022-01-01',
          endDate: '2023-01-01'
        }]
      });
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid description');
    });
  });

  describe('Data Type Attacks', () => {
    it('debería rechazar nombres con tipos de datos incorrectos', () => {
      const maliciousData = createMockCandidate({
        firstName: 123, // Número en lugar de string
        lastName: 'Test'
      } as any);
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid name');
    });

    it('debería rechazar emails con tipos de datos incorrectos', () => {
      const maliciousData = createMockCandidate({
        firstName: 'Test',
        lastName: 'User',
        email: null // Null en lugar de string
      } as any);
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid email');
    });

    it('debería rechazar CV con tipos de datos incorrectos', () => {
      const maliciousData = createMockCandidate({
        cv: {
          filePath: 123, // Número en lugar de string
          fileType: 'pdf'
        }
      } as any);
      expect(() => validateCandidateData(maliciousData)).toThrow('Invalid CV data');
    });
  });

  describe('Extreme Unicode Cases', () => {
    it.skip('debería manejar nombres con emojis complejos (VULN-007)', () => {
      const unicodeData = createMockCandidate({
        firstName: 'María👨‍👩‍👧‍👦José',
        lastName: 'García🎉'
      });
      expect(() => validateCandidateData(unicodeData)).not.toThrow();
    });

    it.skip('debería manejar nombres con caracteres Unicode extremos (VULN-007)', () => {
      const unicodeData = createMockCandidate({
        firstName: 'José\u0301', // José con acento agudo combinado
        lastName: 'Muñoz\u0303' // Muñoz con tilde combinada
      });
      expect(() => validateCandidateData(unicodeData)).not.toThrow();
    });

    it.skip('debería manejar nombres con caracteres de idiomas no latinos (VULN-007)', () => {
      const unicodeData = createMockCandidate({
        firstName: '李小明', // Chino
        lastName: '김철수' // Coreano
      });
      expect(() => validateCandidateData(unicodeData)).not.toThrow();
    });

    it.skip('debería manejar nombres con caracteres árabes (VULN-007)', () => {
      const unicodeData = createMockCandidate({
        firstName: 'أحمد',
        lastName: 'محمد'
      });
      expect(() => validateCandidateData(unicodeData)).not.toThrow();
    });

    it.skip('debería manejar nombres con caracteres cirílicos (VULN-007)', () => {
      const unicodeData = createMockCandidate({
        firstName: 'Иван',
        lastName: 'Петров'
      });
      expect(() => validateCandidateData(unicodeData)).not.toThrow();
    });

    it('debería manejar nombres con caracteres de control Unicode', () => {
      const unicodeData = createMockCandidate({
        firstName: 'Test\u200BUser', // Zero-width space
        lastName: 'Name\u200C' // Zero-width non-joiner
      });
      expect(() => validateCandidateData(unicodeData)).toThrow('Invalid name');
    });

    it('debería manejar nombres con caracteres de formato Unicode', () => {
      const unicodeData = createMockCandidate({
        firstName: 'Test\u2060User', // Word joiner
        lastName: 'Name\u2061' // Function application
      });
      expect(() => validateCandidateData(unicodeData)).toThrow('Invalid name');
    });

    it('debería manejar nombres con caracteres de dirección Unicode', () => {
      const unicodeData = createMockCandidate({
        firstName: 'Test\u202AUser', // Left-to-right embedding
        lastName: 'Name\u202B' // Right-to-left embedding
      });
      expect(() => validateCandidateData(unicodeData)).toThrow('Invalid name');
    });

    it('debería manejar nombres con caracteres de separación Unicode', () => {
      const unicodeData = createMockCandidate({
        firstName: 'Test\u2028User', // Line separator
        lastName: 'Name\u2029' // Paragraph separator
      });
      expect(() => validateCandidateData(unicodeData)).toThrow('Invalid name');
    });

    it('debería manejar nombres con caracteres de sustituto Unicode', () => {
      const unicodeData = createMockCandidate({
        firstName: 'Test\uD800User', // High surrogate
        lastName: 'Name\uDFFF' // Low surrogate
      });
      expect(() => validateCandidateData(unicodeData)).toThrow('Invalid name');
    });

    it.skip('debería manejar emails con caracteres Unicode (VULN-007)', () => {
      const unicodeData = createMockCandidate({
        firstName: 'Test',
        lastName: 'User',
        email: 'test.üser@exámple.com'
      });
      expect(() => validateCandidateData(unicodeData)).not.toThrow();
    });

    it('debería manejar descripciones con caracteres Unicode complejos', () => {
      const unicodeData = createMockCandidate({
        workExperiences: [{
          company: 'Test Company',
          position: 'Developer',
          description: 'Desarrollo web con tecnologías modernas 🚀 y frameworks avanzados 💻',
          startDate: '2022-01-01',
          endDate: '2023-01-01'
        }]
      });
      expect(() => validateCandidateData(unicodeData)).not.toThrow();
    });

    it('debería manejar instituciones educativas con caracteres Unicode', () => {
      const unicodeData = createMockCandidate({
        educations: [{
          institution: 'Universidad Nacional Autónoma de México (UNAM)',
          title: 'Ingeniería en Sistemas Computacionales',
          startDate: '2020-01-01',
          endDate: '2024-01-01'
        }]
      });
      expect(() => validateCandidateData(unicodeData)).not.toThrow();
    });

    it('debería manejar direcciones con caracteres Unicode', () => {
      const unicodeData = createMockCandidate({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        address: 'Calle Juárez #123, Col. Centro, México D.F. 🇲🇽'
      });
      expect(() => validateCandidateData(unicodeData)).not.toThrow();
    });

    it('debería rechazar nombres con caracteres Unicode maliciosos', () => {
      const unicodeData = createMockCandidate({
        firstName: 'Test\u0000User', // Null character
        lastName: 'Name'
      });
      expect(() => validateCandidateData(unicodeData)).toThrow('Invalid name');
    });

    it('debería rechazar nombres con caracteres Unicode de control', () => {
      const unicodeData = createMockCandidate({
        firstName: 'Test\u001FUser', // Unit separator
        lastName: 'Name'
      });
      expect(() => validateCandidateData(unicodeData)).toThrow('Invalid name');
    });

    it.skip('debería manejar nombres con caracteres Unicode de espacio (VULN-007)', () => {
      const unicodeData = createMockCandidate({
        firstName: 'Test\u00A0User', // Non-breaking space
        lastName: 'Name'
      });
      expect(() => validateCandidateData(unicodeData)).not.toThrow();
    });

    it('debería rechazar nombres con caracteres Unicode de espacio de control', () => {
      const unicodeData = createMockCandidate({
        firstName: 'Test\u2000User', // En quad
        lastName: 'Name'
      });
      expect(() => validateCandidateData(unicodeData)).toThrow('Invalid name');
    });
  });
}); 