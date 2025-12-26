import {
  validateFeaturedArticlesConfig,
  safeParseFeaturedArticlesConfig,
  isValidFeaturedArticleConfig,
  isValidVisualTheme,
} from '../featured';

describe('Featured Articles Types and Validation - Simple Tests', () => {
  
  // **Feature: featured-articles, Property 1: Configuration Loading Consistency**
  // **Validates: Requirements 1.2**
  describe('Property 1: Configuration Loading Consistency', () => {
    
    it('should consistently validate the same valid configuration data', () => {
      const validConfig = [
        {
          author: 'test-author',
          title: 'Test Article',
          visualTheme: {
            backgroundColor: '#ffffff',
            textColor: '#000000'
          }
        }
      ];

      // First validation
      const result1 = safeParseFeaturedArticlesConfig(validConfig);
      
      // Second validation with the same data
      const result2 = safeParseFeaturedArticlesConfig(validConfig);
      
      // Both results should be identical
      expect(result1.success).toBe(result2.success);
      expect(result1.success).toBe(true);
      
      if (result1.success && result2.success) {
        expect(result1.data).toEqual(result2.data);
      }
    });

    it('should consistently validate the same invalid configuration data', () => {
      const invalidConfig = [
        {
          author: '', // Invalid: empty author
          title: 'Test Article'
        }
      ];

      // First validation
      const result1 = safeParseFeaturedArticlesConfig(invalidConfig);
      
      // Second validation with the same data
      const result2 = safeParseFeaturedArticlesConfig(invalidConfig);
      
      // Both results should be identical
      expect(result1.success).toBe(result2.success);
      expect(result1.success).toBe(false);
    });

    it('should produce the same result when validating with different validation functions', () => {
      const validConfig = [
        {
          author: 'test-author',
          title: 'Test Article'
        }
      ];

      const safeParseResult = safeParseFeaturedArticlesConfig(validConfig);
      
      if (safeParseResult.success) {
        // If safe parse succeeds, validateFeaturedArticlesConfig should also succeed
        expect(() => validateFeaturedArticlesConfig(validConfig)).not.toThrow();
        const validateResult = validateFeaturedArticlesConfig(validConfig);
        expect(validateResult).toEqual(safeParseResult.data);
      }
    });

    it('should consistently validate individual config objects', () => {
      const config = {
        author: 'test-author',
        title: 'Test Article',
        visualTheme: {
          backgroundColor: '#ffffff'
        }
      };

      const isValid1 = isValidFeaturedArticleConfig(config);
      const isValid2 = isValidFeaturedArticleConfig(config);
      
      expect(isValid1).toBe(isValid2);
      expect(isValid1).toBe(true);
    });

    it('should consistently validate visual theme objects', () => {
      const theme = {
        backgroundColor: '#ffffff',
        textColor: 'rgb(0,0,0)',
        categoryBadgeColor: 'hsl(0,0%,50%)'
      };

      const isValid1 = isValidVisualTheme(theme);
      const isValid2 = isValidVisualTheme(theme);
      
      expect(isValid1).toBe(isValid2);
      expect(isValid1).toBe(true);
    });
  });

  // **Feature: featured-articles, Property 11: Runtime Data Validation**
  // **Validates: Requirements 4.5**
  describe('Property 11: Runtime Data Validation', () => {
    
    it('should reject invalid CSS color formats', () => {
      const invalidTheme = {
        backgroundColor: 'invalid-color',
        textColor: '#gggggg', // Invalid hex
        categoryBadgeColor: 'rgb(300,300,300)' // Invalid RGB values
      };

      const isValid = isValidVisualTheme(invalidTheme);
      expect(isValid).toBe(false);
    });

    it('should reject configurations with invalid author names', () => {
      const invalidConfigs = [
        { author: '' }, // Empty author
        { author: 'a'.repeat(51) }, // Too long author name
      ];

      invalidConfigs.forEach(config => {
        const result = safeParseFeaturedArticlesConfig([config]);
        expect(result.success).toBe(false);
      });
    });

    it('should reject configurations with invalid priority values', () => {
      const invalidConfigs = [
        { author: 'test', priority: 0 }, // Too low
        { author: 'test', priority: 7 }, // Too high
        { author: 'test', priority: -1 }, // Negative
      ];

      invalidConfigs.forEach(config => {
        const result = safeParseFeaturedArticlesConfig([config]);
        expect(result.success).toBe(false);
      });
    });

    it('should reject configurations with too many articles', () => {
      const tooManyConfigs = Array.from({ length: 7 }, (_, i) => ({
        author: `author-${i}`
      }));

      const result = safeParseFeaturedArticlesConfig(tooManyConfigs);
      expect(result.success).toBe(false);
    });

    it('should reject configurations with duplicate authors', () => {
      const duplicateAuthors = [
        { author: 'same-author', title: 'Article 1' },
        { author: 'same-author', title: 'Article 2' }
      ];

      const result = safeParseFeaturedArticlesConfig(duplicateAuthors);
      expect(result.success).toBe(false);
    });

    it('should reject configurations with duplicate priorities', () => {
      const duplicatePriorities = [
        { author: 'author1', priority: 1 },
        { author: 'author2', priority: 1 }
      ];

      const result = safeParseFeaturedArticlesConfig(duplicatePriorities);
      expect(result.success).toBe(false);
    });

    it('should validate correct CSS color formats', () => {
      const validColors = [
        '#fff',
        '#ffffff',
        'rgb(255,255,255)',
        'rgba(255,255,255,0.5)',
        'hsl(0,0%,100%)',
        'hsla(0,0%,100%,0.5)'
      ];

      validColors.forEach(color => {
        const theme = { backgroundColor: color };
        const isValid = isValidVisualTheme(theme);
        expect(isValid).toBe(true);
      });
    });

    it('should validate complete valid configuration', () => {
      const validConfig = [
        {
          author: 'author1',
          title: 'Article 1',
          permlink: 'article-1',
          category: 'politics',
          priority: 1,
          visualTheme: {
            backgroundColor: '#ffffff',
            textColor: 'rgb(0,0,0)',
            categoryBadgeColor: 'hsl(200,50%,50%)',
            categoryBadgeTextColor: '#ffffff'
          }
        },
        {
          author: 'author2',
          title: 'Article 2',
          priority: 2,
          visualTheme: {
            backgroundColor: 'rgba(255,0,0,0.1)'
          }
        }
      ];

      const result = safeParseFeaturedArticlesConfig(validConfig);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data).toHaveLength(2);
        expect(result.data[0].author).toBe('author1');
        expect(result.data[1].author).toBe('author2');
      }
    });
  });
});