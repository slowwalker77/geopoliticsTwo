import fc from 'fast-check';
import {
  validateFeaturedArticlesConfig,
  safeParseFeaturedArticlesConfig,
  isValidFeaturedArticleConfig,
  isValidVisualTheme,
  FeaturedArticleConfigSchema,
  VisualThemeSchema
} from '../featured';

describe('Featured Articles Types and Validation', () => {
  
  // Generator for valid CSS colors
  const validCssColorArb = fc.oneof(
    // Hex colors (3 digits)
    fc.string({ minLength: 3, maxLength: 3 })
      .filter(s => /^[0-9a-fA-F]{3}$/.test(s))
      .map(s => `#${s}`),
    // Hex colors (6 digits)
    fc.string({ minLength: 6, maxLength: 6 })
      .filter(s => /^[0-9a-fA-F]{6}$/.test(s))
      .map(s => `#${s}`),
    // RGB colors
    fc.tuple(fc.integer({ min: 0, max: 255 }), fc.integer({ min: 0, max: 255 }), fc.integer({ min: 0, max: 255 }))
      .map(([r, g, b]) => `rgb(${r},${g},${b})`),
    // RGBA colors with constrained alpha to avoid scientific notation
    fc.tuple(
      fc.integer({ min: 0, max: 255 }), 
      fc.integer({ min: 0, max: 255 }), 
      fc.integer({ min: 0, max: 255 }), 
      fc.float({ min: 0, max: 1, noDefaultInfinity: true, noNaN: true }).map(a => Math.round(a * 100) / 100)
    ).map(([r, g, b, a]) => `rgba(${r},${g},${b},${a})`),
    // HSL colors
    fc.tuple(fc.integer({ min: 0, max: 360 }), fc.integer({ min: 0, max: 100 }), fc.integer({ min: 0, max: 100 }))
      .map(([h, s, l]) => `hsl(${h},${s}%,${l}%)`),
    // HSLA colors with constrained alpha to avoid scientific notation
    fc.tuple(
      fc.integer({ min: 0, max: 360 }), 
      fc.integer({ min: 0, max: 100 }), 
      fc.integer({ min: 0, max: 100 }), 
      fc.float({ min: 0, max: 1, noDefaultInfinity: true, noNaN: true }).map(a => Math.round(a * 100) / 100)
    ).map(([h, s, l, a]) => `hsla(${h},${s}%,${l}%,${a})`)
  );

  // Generator for valid VisualTheme
  const visualThemeArb = fc.record({
    backgroundColor: fc.option(validCssColorArb, { nil: undefined }),
    textColor: fc.option(validCssColorArb, { nil: undefined }),
    categoryBadgeColor: fc.option(validCssColorArb, { nil: undefined }),
    categoryBadgeTextColor: fc.option(validCssColorArb, { nil: undefined }),
  }, { requiredKeys: [] });

  // Generator for valid FeaturedArticleConfig
  const featuredArticleConfigArb = fc.record({
    author: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
    title: fc.option(fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0), { nil: undefined }),
    permlink: fc.option(fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0), { nil: undefined }),
    category: fc.option(fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0), { nil: undefined }),
    visualTheme: fc.option(visualThemeArb, { nil: undefined }),
    priority: fc.option(fc.integer({ min: 1, max: 6 }), { nil: undefined }),
  });

  // Generator for valid configuration arrays (max 6 items, unique authors and priorities)
  const featuredArticlesConfigArb = fc.array(featuredArticleConfigArb, { minLength: 0, maxLength: 6 })
    .chain(configs => {
      // Ensure unique authors
      const uniqueAuthors = Array.from(new Set(configs.map(c => c.author)));
      const uniqueConfigs = uniqueAuthors.map(author => 
        configs.find(c => c.author === author)!
      );
      
      // Ensure unique priorities if specified
      const withPriorities = uniqueConfigs.filter(c => c.priority !== undefined);
      const uniquePriorities = Array.from(new Set(withPriorities.map(c => c.priority)));
      
      if (withPriorities.length !== uniquePriorities.length) {
        // Remove duplicate priorities by setting them to undefined
        const seenPriorities = new Set<number>();
        return fc.constant(uniqueConfigs.map(config => {
          if (config.priority !== undefined) {
            if (seenPriorities.has(config.priority)) {
              return { ...config, priority: undefined };
            }
            seenPriorities.add(config.priority);
          }
          return config;
        }));
      }
      
      return fc.constant(uniqueConfigs);
    });

  // **Feature: featured-articles, Property 1: Configuration Loading Consistency**
  // **Validates: Requirements 1.2**
  describe('Property 1: Configuration Loading Consistency', () => {
    
    it('should consistently validate the same configuration data', () => {
      fc.assert(
        fc.property(featuredArticlesConfigArb, (configData) => {
          // First validation
          const result1 = safeParseFeaturedArticlesConfig(configData);
          
          // Second validation with the same data
          const result2 = safeParseFeaturedArticlesConfig(configData);
          
          // Both results should be identical
          expect(result1.success).toBe(result2.success);
          
          if (result1.success && result2.success) {
            expect(result1.data).toEqual(result2.data);
          } else if (!result1.success && !result2.success) {
            // Both failed - compare error messages
            expect(result1.error.message).toBe(result2.error.message);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should produce the same result when validating with different validation functions', () => {
      fc.assert(
        fc.property(featuredArticlesConfigArb, (configData) => {
          const safeParseResult = safeParseFeaturedArticlesConfig(configData);
          
          if (safeParseResult.success) {
            // If safe parse succeeds, validateFeaturedArticlesConfig should also succeed
            expect(() => validateFeaturedArticlesConfig(configData)).not.toThrow();
            const validateResult = validateFeaturedArticlesConfig(configData);
            expect(validateResult).toEqual(safeParseResult.data);
          } else {
            // If safe parse fails, validateFeaturedArticlesConfig should throw
            expect(() => validateFeaturedArticlesConfig(configData)).toThrow();
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should consistently validate individual config objects', () => {
      fc.assert(
        fc.property(featuredArticleConfigArb, (config) => {
          const isValid1 = isValidFeaturedArticleConfig(config);
          const isValid2 = isValidFeaturedArticleConfig(config);
          
          expect(isValid1).toBe(isValid2);
          
          // Cross-check with schema validation
          const schemaResult = FeaturedArticleConfigSchema.safeParse(config);
          expect(isValid1).toBe(schemaResult.success);
        }),
        { numRuns: 100 }
      );
    });

    it('should consistently validate visual theme objects', () => {
      fc.assert(
        fc.property(visualThemeArb, (theme) => {
          const isValid1 = isValidVisualTheme(theme);
          const isValid2 = isValidVisualTheme(theme);
          
          expect(isValid1).toBe(isValid2);
          
          // Cross-check with schema validation
          const schemaResult = VisualThemeSchema.safeParse(theme);
          expect(isValid1).toBe(schemaResult.success);
        }),
        { numRuns: 100 }
      );
    });
  });

  // **Feature: featured-articles, Property 8: Display Order Preservation**
  // **Validates: Requirements 3.5**
  describe('Property 8: Display Order Preservation', () => {
    
    // Generator for valid configuration arrays with explicit ordering
    const orderedFeaturedArticlesConfigArb = fc.array(featuredArticleConfigArb, { minLength: 1, maxLength: 6 })
      .chain(configs => {
        // Ensure unique authors
        const uniqueAuthors = Array.from(new Set(configs.map(c => c.author)));
        const uniqueConfigs = uniqueAuthors.map((author, index) => ({
          ...configs.find(c => c.author === author)!,
          author: `author-${index}`, // Ensure truly unique authors
          priority: index + 1 // Assign sequential priorities
        }));
        
        return fc.constant(uniqueConfigs);
      });

    it('should preserve the array order in the final configuration', () => {
      fc.assert(
        fc.property(orderedFeaturedArticlesConfigArb, (configArray) => {
          // Validate the configuration
          const result = safeParseFeaturedArticlesConfig(configArray);
          
          if (result.success) {
            // The order in the result should match the input order
            const inputAuthors = configArray.map(config => config.author);
            const outputAuthors = result.data.map(config => config.author);
            
            expect(outputAuthors).toEqual(inputAuthors);
            
            // Priorities should also be preserved if they exist
            for (let i = 0; i < configArray.length; i++) {
              if (configArray[i].priority !== undefined) {
                expect(result.data[i].priority).toBe(configArray[i].priority);
              }
            }
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should maintain order regardless of priority values', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              author: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
              priority: fc.option(fc.integer({ min: 1, max: 6 })),
            }),
            { minLength: 1, maxLength: 6 }
          ).chain(configs => {
            // Ensure unique authors and priorities
            const uniqueAuthors = Array.from(new Set(configs.map(c => c.author)));
            const uniqueConfigs = uniqueAuthors.map((author, index) => ({
              ...configs.find(c => c.author === author)!,
              author: `author-${index}`, // Ensure truly unique authors
            }));
            
            // Assign random but unique priorities if they exist
            const withPriorities = uniqueConfigs.filter(c => c.priority !== undefined);
            if (withPriorities.length > 0) {
              const availablePriorities = Array.from({ length: 6 }, (_, i) => i + 1);
              const shuffledPriorities = availablePriorities.sort(() => Math.random() - 0.5);
              
              let priorityIndex = 0;
              return fc.constant(uniqueConfigs.map(config => {
                if (config.priority !== undefined && priorityIndex < shuffledPriorities.length) {
                  return { ...config, priority: shuffledPriorities[priorityIndex++] };
                }
                return config;
              }));
            }
            
            return fc.constant(uniqueConfigs);
          }),
          (configArray) => {
            const result = safeParseFeaturedArticlesConfig(configArray);
            
            if (result.success) {
              // The array order should be preserved regardless of priority values
              const inputAuthors = configArray.map(config => config.author);
              const outputAuthors = result.data.map(config => config.author);
              
              expect(outputAuthors).toEqual(inputAuthors);
              
              // Each item should maintain its original position in the array
              for (let i = 0; i < configArray.length; i++) {
                expect(result.data[i].author).toBe(configArray[i].author);
                if (configArray[i].priority !== undefined) {
                  expect(result.data[i].priority).toBe(configArray[i].priority);
                }
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve order when processing configuration sequentially vs in parallel', () => {
      fc.assert(
        fc.property(orderedFeaturedArticlesConfigArb, (configArray) => {
          // Sequential processing simulation
          const sequentialResult = safeParseFeaturedArticlesConfig(configArray);
          
          // Parallel processing simulation (same function, but conceptually different)
          const parallelResult = safeParseFeaturedArticlesConfig([...configArray]);
          
          if (sequentialResult.success && parallelResult.success) {
            // Both should produce the same order
            expect(sequentialResult.data.map(c => c.author))
              .toEqual(parallelResult.data.map(c => c.author));
            
            // All properties should be identical
            expect(sequentialResult.data).toEqual(parallelResult.data);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // **Feature: featured-articles, Property 9: Configuration Limit Enforcement**
  // **Validates: Requirements 1.5**
  describe('Property 9: Configuration Limit Enforcement', () => {
    
    // Generator for configuration arrays that exceed the limit
    const oversizedConfigArb = fc.array(featuredArticleConfigArb, { minLength: 7, maxLength: 10 })
      .chain(configs => {
        // Ensure unique authors to avoid validation failures for other reasons
        const uniqueConfigs = configs.map((config, index) => ({
          ...config,
          author: `author-${index}`, // Ensure truly unique authors
          priority: undefined // Remove priorities to avoid conflicts
        }));
        
        return fc.constant(uniqueConfigs);
      });

    // Generator for configuration arrays within the limit
    const validSizedConfigArb = fc.array(featuredArticleConfigArb, { minLength: 0, maxLength: 6 })
      .chain(configs => {
        // Ensure unique authors
        const uniqueConfigs = configs.map((config, index) => ({
          ...config,
          author: `author-${index}`, // Ensure truly unique authors
          priority: index < 6 ? index + 1 : undefined // Assign valid priorities
        }));
        
        return fc.constant(uniqueConfigs);
      });

    it('should reject configurations with more than 6 articles', () => {
      fc.assert(
        fc.property(oversizedConfigArb, (configArray) => {
          // Configuration should be rejected due to size limit
          const result = safeParseFeaturedArticlesConfig(configArray);
          
          expect(result.success).toBe(false);
          
          if (!result.success) {
            // Error message should mention the limit
            const errorMessage = result.error.message;
            expect(errorMessage).toContain('Maximum 6 featured articles allowed');
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should accept configurations with 6 or fewer articles', () => {
      fc.assert(
        fc.property(validSizedConfigArb, (configArray) => {
          // Configuration should be accepted
          const result = safeParseFeaturedArticlesConfig(configArray);
          
          expect(result.success).toBe(true);
          
          if (result.success) {
            // Result should have the same number of items as input
            expect(result.data).toHaveLength(configArray.length);
            
            // Should not exceed 6 items
            expect(result.data.length).toBeLessThanOrEqual(6);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should enforce the limit regardless of configuration content', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 7, max: 15 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          (arraySize, authorPrefix) => {
            // Create an array that exceeds the limit with minimal valid configs
            const oversizedConfig = Array.from({ length: arraySize }, (_, index) => ({
              author: `${authorPrefix}-${index}`
            }));
            
            const result = safeParseFeaturedArticlesConfig(oversizedConfig);
            
            // Should always be rejected regardless of content
            expect(result.success).toBe(false);
            
            if (!result.success) {
              expect(result.error.message).toContain('Maximum 6 featured articles allowed');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle edge case of exactly 6 articles', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              author: fc.string({ minLength: 1, maxLength: 20 }),
              title: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
            }),
            { minLength: 6, maxLength: 6 }
          ).chain(configs => {
            // Ensure exactly 6 unique authors
            const uniqueConfigs = configs.map((config, index) => ({
              ...config,
              author: `author-${index}`, // Ensure truly unique authors
            }));
            
            return fc.constant(uniqueConfigs);
          }),
          (configArray) => {
            // Exactly 6 articles should be accepted
            const result = safeParseFeaturedArticlesConfig(configArray);
            
            expect(result.success).toBe(true);
            
            if (result.success) {
              expect(result.data).toHaveLength(6);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle empty configuration arrays', () => {
      const emptyConfig: any[] = [];
      const result = safeParseFeaturedArticlesConfig(emptyConfig);
      
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data).toHaveLength(0);
      }
    });

    it('should process only the first 6 items when limit is exceeded', () => {
      // This test verifies the conceptual behavior - in practice, validation rejects oversized arrays
      // But if we were to implement truncation instead of rejection, this is how it should work
      
      const oversizedConfig = Array.from({ length: 8 }, (_, index) => ({
        author: `author-${index}`,
        title: `Article ${index + 1}`
      }));
      
      // Current implementation rejects oversized configs
      const result = safeParseFeaturedArticlesConfig(oversizedConfig);
      expect(result.success).toBe(false);
      
      // If we were to implement truncation behavior:
      // const truncatedConfig = oversizedConfig.slice(0, 6);
      // const truncatedResult = safeParseFeaturedArticlesConfig(truncatedConfig);
      // expect(truncatedResult.success).toBe(true);
      // if (truncatedResult.success) {
      //   expect(truncatedResult.data).toHaveLength(6);
      // }
    });
  });
});