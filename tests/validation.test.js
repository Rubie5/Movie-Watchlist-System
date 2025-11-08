import { validateTopic, validateId } from '@/libs/validation';

describe('Validation Functions', () => {
  describe('validateTopic', () => {
    it('should validate correct data', () => {
      const validData = { 
        title: 'Test Title', 
        description: 'Test Description' 
      };
      expect(() => validateTopic(validData)).not.toThrow();
    });

    it('should throw error for missing title', () => {
      const invalidData = { 
        title: '', 
        description: 'Test Description' 
      };
      expect(() => validateTopic(invalidData)).toThrow('Title is required');
    });

    it('should throw error for title too long', () => {
      const longTitle = 'A'.repeat(101);
      const invalidData = { 
        title: longTitle, 
        description: 'Some description' 
      };
      expect(() => validateTopic(invalidData)).toThrow('Title must be under 100 characters');
    });

    it('should throw error for missing description', () => {
      const invalidData = { 
        title: 'Test Title', 
        description: '' 
      };
      expect(() => validateTopic(invalidData)).toThrow('Description is required');
    });

    it('should throw error for description too long', () => {
      const longDescription = 'A'.repeat(501);
      const invalidData = { 
        title: 'Test Title', 
        description: longDescription 
      };
      expect(() => validateTopic(invalidData)).toThrow('Description must be under 500 characters');
    });
  });

  describe('validateId', () => {
    it('should validate correct MongoDB ObjectId', () => {
      const validId = '690c5f9b8c7388941280cead'; // your provided ID
      expect(() => validateId(validId)).not.toThrow();
    });

    it('should throw error for empty ID', () => {
      expect(() => validateId('')).toThrow('ID is required');
    });

    it('should throw error for invalid ID format', () => {
      const invalidId = 'invalid-id-format';
      expect(() => validateId(invalidId)).toThrow('Invalid ID format');
    });

    it('should throw error for ID that is too short', () => {
      const shortId = '123';
      expect(() => validateId(shortId)).toThrow('Invalid ID format');
    });
  });
});
