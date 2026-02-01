/**
 * Centralized color constants for AlgoPath
 * Aligned with reference design (algopath3.lovable.app)
 */

// Difficulty colors - consistent across all components
export const DIFFICULTY_COLORS = {
    easy: '#10b981',      // Emerald 500
    medium: '#f59e0b',    // Amber 500
    hard: '#ef4444',      // Red 500
} as const;

// Gradient definitions for reuse
export const GRADIENTS = {
    header: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
    primary: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    purple: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
    xpBar: 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%)',
} as const;

// UI colors
export const UI_COLORS = {
    headerBg: '#3b82f6',
    cardBorder: 'rgba(226, 232, 240, 0.8)',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    bgDefault: '#f8fafc',
    bgPaper: '#ffffff',
} as const;

// Stats colors (for large stat numbers)
export const STAT_COLORS = {
    companies: '#8b5cf6',  // Purple for total counts
    topics: '#8b5cf6',
    easy: DIFFICULTY_COLORS.easy,
    medium: DIFFICULTY_COLORS.medium,
    hard: DIFFICULTY_COLORS.hard,
} as const;
