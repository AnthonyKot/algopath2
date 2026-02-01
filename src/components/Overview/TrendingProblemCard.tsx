import { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Paper,
    Typography,
    Chip,
    Button,
    Skeleton,
    Divider,
    Stack
} from '@mui/material';
import {
    CalendarToday as CalendarIcon,
    OpenInNew as OpenInNewIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { staticDataService } from '../../services/staticDataService';
import { getFrequencyStars, getFrequencyColor } from '../../utils/frequencyRating';
import { FrequencyStars } from '../Common/FrequencyStars';
import { DIFFICULTY_COLORS } from '../../theme/colors';

interface Problem {
    title: string;
    difficulty: string;
    frequency?: number;
    acceptanceRate?: number;
    link?: string;
    topics: string[];
    companies: string[];
    companyCount?: number;
}

/**
 * Seeded random number generator for consistent daily challenges
 * All users will see the same problems on the same day
 */
function seededRandom(seed: number): () => number {
    return function () {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
    };
}

/**
 * Get today's date as a seed (YYYYMMDD format)
 */
function getTodaySeed(): number {
    const now = new Date();
    return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

/**
 * Displays daily challenge problems - same for all users on the same day
 */
export function TrendingProblemCard() {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);

    // Get today's date string for display
    const todayString = useMemo(() => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
    }, []);

    const loadDailyChallenges = async () => {
        try {
            setLoading(true);
            const allProblems = await staticDataService.loadAllProblems();

            // Create seeded random for today
            const seed = getTodaySeed();
            const random = seededRandom(seed);

            // Tiered frequency thresholds
            const easyPool = allProblems.filter(p =>
                p.difficulty === 'EASY' && (p.frequency || 0) >= 89.6
            );
            const mediumPool = allProblems.filter(p =>
                p.difficulty === 'MEDIUM' && (p.frequency || 0) >= 70
            );
            const hardPool = allProblems.filter(p =>
                p.difficulty === 'HARD' && (p.frequency || 0) >= 56.4
            );

            const pickSeeded = (pool: typeof allProblems) => {
                if (pool.length === 0) return null;
                const index = Math.floor(random() * pool.length);
                return pool[index] as Problem;
            };

            const selected: Problem[] = [];
            const easy = pickSeeded(easyPool);
            const medium = pickSeeded(mediumPool);
            const hard = pickSeeded(hardPool);

            if (easy) selected.push(easy);
            if (medium) selected.push(medium);
            if (hard) selected.push(hard);

            // Fallback if empty
            if (selected.length === 0) {
                const sorted = allProblems
                    .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
                    .slice(0, 3);
                setProblems(sorted as Problem[]);
            } else {
                setProblems(selected);
            }
        } catch (error) {
            console.error('Failed to load daily challenges:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDailyChallenges();
    }, []);

    const getDifficultyChipColor = (difficulty: string) => {
        switch (difficulty) {
            case 'EASY': return { bg: DIFFICULTY_COLORS.easy, text: 'white' };
            case 'MEDIUM': return { bg: DIFFICULTY_COLORS.medium, text: 'white' };
            case 'HARD': return { bg: DIFFICULTY_COLORS.hard, text: 'white' };
            default: return { bg: '#888', text: 'white' };
        }
    };

    const ProblemRow = ({ problem }: { problem: Problem }) => {
        const { stars } = problem.frequency
            ? getFrequencyStars(problem.frequency)
            : { stars: 0 };
        const colors = getDifficultyChipColor(problem.difficulty);

        return (
            <Box sx={{ py: 1.5 }}>
                {/* Title + Difficulty */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, flex: 1, lineHeight: 1.3 }}
                    >
                        {problem.title}
                    </Typography>
                    <Chip
                        label={problem.difficulty}
                        size="small"
                        sx={{
                            bgcolor: colors.bg,
                            color: colors.text,
                            fontWeight: 600,
                            fontSize: '0.7rem',
                        }}
                    />
                </Box>

                {/* Stars + Topics */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    {stars > 0 && (
                        <FrequencyStars
                            rating={stars}
                            color={getFrequencyColor(stars)}
                            size="small"
                        />
                    )}
                    {problem.topics.slice(0, 2).map((topic) => (
                        <Chip key={topic} label={topic} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                    ))}
                </Box>

                {/* Companies + LeetCode Link */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">
                        Asked by <strong>{problem.companyCount || problem.companies.length}</strong> companies
                    </Typography>
                    {problem.link && (
                        <Button
                            size="small"
                            endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                            href={problem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ fontSize: '0.75rem', py: 0, textTransform: 'none' }}
                        >
                            LeetCode
                        </Button>
                    )}
                </Box>
            </Box>
        );
    };

    if (loading) {
        return (
            <Paper elevation={0} sx={{ borderRadius: 4, p: 3, bgcolor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                <Skeleton variant="text" width="40%" height={32} />
                <Skeleton variant="text" width="80%" height={28} sx={{ my: 1 }} />
                <Skeleton variant="text" width="60%" height={20} />
            </Paper>
        );
    }

    if (problems.length === 0) return null;

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                p: 3,
                bgcolor: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                border: '1px solid',
                borderColor: 'rgba(139, 92, 246, 0.2)',
            }}
        >
            <Stack spacing={2}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarIcon sx={{ color: '#8b5cf6', fontSize: 22 }} />
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                Daily Challenge
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {todayString}
                            </Typography>
                        </Box>
                    </Stack>
                    <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                        label="Same for all"
                        size="small"
                        sx={{
                            bgcolor: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            fontWeight: 500,
                            '& .MuiChip-icon': { color: '#10b981' }
                        }}
                    />
                </Box>

                {/* Problems */}
                <ProblemRow problem={problems[0]} />

                {problems.length > 1 && (
                    <>
                        <Divider />
                        <ProblemRow problem={problems[1]} />
                    </>
                )}

                {problems.length > 2 && (
                    <>
                        <Divider />
                        <ProblemRow problem={problems[2]} />
                    </>
                )}
            </Stack>
        </Paper>
    );
}
