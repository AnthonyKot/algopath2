import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Button,
    Skeleton,
    IconButton,
    Divider
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    Refresh as RefreshIcon,
    OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { staticDataService } from '../../services/staticDataService';
import { getFrequencyStars, renderStars, getFrequencyColor } from '../../utils/frequencyRating';

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
 * Displays two random trending problems (5-star and 4-star)
 */
export function TrendingProblemCard() {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);

    const loadRandomProblems = async () => {
        try {
            setLoading(true);
            const allProblems = await staticDataService.loadAllProblems();

            // Tiered frequency thresholds:
            // Easy: 5+ stars (>=89.6), Medium: 4+ stars (>=70), Hard: 3+ stars (>=56.4)
            const easyPool = allProblems.filter(p =>
                p.difficulty === 'EASY' && (p.frequency || 0) >= 89.6
            );
            const mediumPool = allProblems.filter(p =>
                p.difficulty === 'MEDIUM' && (p.frequency || 0) >= 70
            );
            const hardPool = allProblems.filter(p =>
                p.difficulty === 'HARD' && (p.frequency || 0) >= 56.4
            );

            const pickRandom = (pool: typeof allProblems) => {
                if (pool.length === 0) return null;
                return pool[Math.floor(Math.random() * pool.length)] as Problem;
            };

            const selected: Problem[] = [];
            const easy = pickRandom(easyPool);
            const medium = pickRandom(mediumPool);
            const hard = pickRandom(hardPool);

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
            console.error('Failed to load trending problems:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRandomProblems();
    }, []);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'EASY': return 'success';
            case 'MEDIUM': return 'warning';
            case 'HARD': return 'error';
            default: return 'default';
        }
    };

    const ProblemRow = ({ problem }: { problem: Problem }) => {
        const { stars } = problem.frequency
            ? getFrequencyStars(problem.frequency)
            : { stars: 0 };

        return (
            <Box sx={{ py: 1.5 }}>
                {/* Title + Difficulty */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, flex: 1 }}
                    >
                        {problem.title}
                    </Typography>
                    <Chip
                        label={problem.difficulty}
                        size="small"
                        color={getDifficultyColor(problem.difficulty) as any}
                    />
                </Box>

                {/* Stars + Topics */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    {stars > 0 && (
                        <Typography
                            variant="body2"
                            sx={{ color: getFrequencyColor(stars), letterSpacing: 1 }}
                        >
                            {renderStars(stars)}
                        </Typography>
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
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Skeleton variant="text" width="40%" height={32} />
                    <Skeleton variant="text" width="80%" height={28} sx={{ my: 1 }} />
                    <Skeleton variant="text" width="60%" height={20} />
                    <Divider sx={{ my: 1.5 }} />
                    <Skeleton variant="text" width="80%" height={28} />
                    <Skeleton variant="text" width="60%" height={20} />
                </CardContent>
            </Card>
        );
    }

    if (problems.length === 0) return null;

    return (
        <Card
            sx={{
                height: '100%',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(20, 184, 166, 0.08) 100%)',
                border: '1px solid',
                borderColor: 'primary.main',
                borderRadius: 3,
            }}
        >
            <CardContent sx={{ py: 2 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUpIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 600 }}>
                            Trending Problems
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={loadRandomProblems} color="primary">
                        <RefreshIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Problem 1 */}
                <ProblemRow problem={problems[0]} />

                {/* Divider + Problem 2 */}
                {problems.length > 1 && (
                    <>
                        <Divider sx={{ my: 0.5 }} />
                        <ProblemRow problem={problems[1]} />
                    </>
                )}

                {/* Divider + Problem 3 */}
                {problems.length > 2 && (
                    <>
                        <Divider sx={{ my: 0.5 }} />
                        <ProblemRow problem={problems[2]} />
                    </>
                )}
            </CardContent>
        </Card>
    );
}
