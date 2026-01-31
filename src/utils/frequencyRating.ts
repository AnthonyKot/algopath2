/**
 * Frequency star rating utility with half-star support
 * Based on decile analysis of 1923 problems:
 * - D1 (10%): 36.4  → 0.5 stars
 * - D2 (20%): 43.5  → 1 star
 * - D3 (30%): 48.9  → 1.5 stars
 * - D4 (40%): 56.4  → 2 stars
 * - D5 (50%): 63.1  → 2.5 stars
 * - D6 (60%): 70    → 3 stars
 * - D7 (70%): 78.8  → 3.5 stars
 * - D8 (80%): 89.6  → 4 stars
 * - D9 (90%): 100   → 4.5 stars
 * - 100%: ≥100      → 5 stars
 */

export interface FrequencyRating {
    stars: number; // Can be 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, or 5
    label: string;
}

export const getFrequencyStars = (frequency: number): FrequencyRating => {
    if (frequency >= 100) return { stars: 5, label: 'Legendary' };
    if (frequency >= 89.6) return { stars: 4.5, label: 'Very Hot' };
    if (frequency >= 78.8) return { stars: 4, label: 'Hot' };
    if (frequency >= 70) return { stars: 3.5, label: 'Popular' };
    if (frequency >= 63.1) return { stars: 3, label: 'Warm' };
    if (frequency >= 56.4) return { stars: 2.5, label: 'Common' };
    if (frequency >= 48.9) return { stars: 2, label: 'Moderate' };
    if (frequency >= 43.5) return { stars: 1.5, label: 'Occasional' };
    if (frequency >= 36.4) return { stars: 1, label: 'Uncommon' };
    return { stars: 0.5, label: 'Rare' };
};

export const getFrequencyColor = (stars: number): string => {
    if (stars >= 4.5) return '#ef4444'; // red - legendary/very hot
    if (stars >= 3.5) return '#f97316'; // orange - hot/popular
    if (stars >= 2.5) return '#fbbf24'; // yellow - warm/common
    if (stars >= 1.5) return '#84cc16'; // lime - moderate/occasional
    return '#9ca3af'; // gray - uncommon/rare
};
