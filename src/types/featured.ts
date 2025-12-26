import { z } from 'zod';
import { ProcessedArticle } from './steemit';

/**
 * Visual theme configuration for featured articles
 * Supports CSS color formats: hex (#ffffff), rgb(255,255,255), hsl(0,0%,100%)
 */
export interface VisualTheme {
  /** Card background color in CSS format */
  backgroundColor?: string;
  /** Title and content text color in CSS format */
  textColor?: string;
  /** Category badge background color in CSS format */
  categoryBadgeColor?: string;
  /** Category badge text color in CSS format */
  categoryBadgeTextColor?: string;
}

/**
 * Configuration for a single featured article
 * Used to specify which articles should be prominently displayed
 */
export interface FeaturedArticleConfig {
  /** Steemit username of the article author */
  author: string;
  /** Optional: specific article title to match */
  title?: string;
  /** Optional: specific article permlink for exact identification */
  permlink?: string;
  /** Optional: category override for display purposes */
  category?: string;
  /** Optional: visual styling configuration */
  visualTheme?: VisualTheme;
  /** Optional: display priority (1-6, lower numbers = higher priority) */
  priority?: number;
}

/**
 * Extended ProcessedArticle with featured article metadata
 * Includes visual theme and featured status information
 */
export interface ProcessedArticleWithTheme extends ProcessedArticle {
  /** Visual theme settings applied to this article */
  visualTheme?: VisualTheme;
  /** Whether this article is marked as featured */
  isFeatured: boolean;
  /** Priority level for featured articles (1-6) */
  featuredPriority?: number;
}

// Zod schemas for runtime validation

/**
 * CSS color format validation regex
 * Supports: hex (#fff, #ffffff), rgb(r,g,b), rgba(r,g,b,a), hsl(h,s%,l%), hsla(h,s%,l%,a)
 */
const cssColorRegex = /^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[01]?\.?\d*\s*\)|hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)|hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[01]?\.?\d*\s*\))$/;

/**
 * Zod schema for VisualTheme validation
 */
export const VisualThemeSchema = z.object({
  backgroundColor: z.string().regex(cssColorRegex, 'Invalid CSS color format').optional(),
  textColor: z.string().regex(cssColorRegex, 'Invalid CSS color format').optional(),
  categoryBadgeColor: z.string().regex(cssColorRegex, 'Invalid CSS color format').optional(),
  categoryBadgeTextColor: z.string().regex(cssColorRegex, 'Invalid CSS color format').optional(),
}).strict();

/**
 * Zod schema for FeaturedArticleConfig validation
 */
export const FeaturedArticleConfigSchema = z.object({
  author: z.string().min(1, 'Author name is required').max(50, 'Author name too long'),
  title: z.string().min(1, 'Title cannot be empty').max(200, 'Title too long').optional(),
  permlink: z.string().min(1, 'Permlink cannot be empty').max(100, 'Permlink too long').optional(),
  category: z.string().min(1, 'Category cannot be empty').max(50, 'Category too long').optional(),
  visualTheme: VisualThemeSchema.optional(),
  priority: z.number().int().min(1).max(6).optional(),
}).strict();

/**
 * Zod schema for the complete featured articles configuration array
 * Enforces maximum of 6 featured articles
 */
export const FeaturedArticlesConfigSchema = z.array(FeaturedArticleConfigSchema)
  .max(6, 'Maximum 6 featured articles allowed')
  .refine(
    (configs) => {
      // Check for duplicate authors
      const authors = configs.map(config => config.author);
      return new Set(authors).size === authors.length;
    },
    { message: 'Duplicate authors are not allowed' }
  )
  .refine(
    (configs) => {
      // Check for duplicate priorities if specified
      const priorities = configs
        .map(config => config.priority)
        .filter((priority): priority is number => priority !== undefined);
      return new Set(priorities).size === priorities.length;
    },
    { message: 'Duplicate priority values are not allowed' }
  );

/**
 * Type guard to check if an object is a valid VisualTheme
 */
export function isValidVisualTheme(obj: unknown): obj is VisualTheme {
  try {
    VisualThemeSchema.parse(obj);
    return true;
  } catch {
    return false;
  }
}

/**
 * Type guard to check if an object is a valid FeaturedArticleConfig
 */
export function isValidFeaturedArticleConfig(obj: unknown): obj is FeaturedArticleConfig {
  try {
    FeaturedArticleConfigSchema.parse(obj);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates and parses featured articles configuration
 * @param data - Raw configuration data to validate
 * @returns Parsed and validated configuration array
 * @throws ZodError if validation fails
 */
export function validateFeaturedArticlesConfig(data: unknown): FeaturedArticleConfig[] {
  return FeaturedArticlesConfigSchema.parse(data);
}

/**
 * Safe validation that returns success/error result instead of throwing
 * @param data - Raw configuration data to validate
 * @returns Object with success flag and either data or error
 */
export function safeParseFeaturedArticlesConfig(data: unknown): {
  success: true;
  data: FeaturedArticleConfig[];
} | {
  success: false;
  error: z.ZodError;
} {
  const result = FeaturedArticlesConfigSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}