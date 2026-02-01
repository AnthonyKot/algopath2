import { Box, Paper, Stack, Typography, Avatar } from '@mui/material';
import { EmojiEvents, MilitaryTech } from '@mui/icons-material';
import { useUserProfile } from '../../hooks/useUserProfile';
import { DIFFICULTY_COLORS } from '../../theme/colors';

// Mock leaderboard data - will be replaced with Firebase fetch
// Structure designed for easy Firebase integration
interface LeaderboardEntry {
    id: string;
    username: string;
    level: number;
    problemsSolved: number;
    xp: number;
    streakDays: number;
}

// TODO: Replace with Firebase fetch
const mockLeaderboardData: LeaderboardEntry[] = [
    { id: '1', username: 'AlgoNinja', level: 15, problemsSolved: 205, xp: 5078, streakDays: 34 },
    { id: '2', username: 'CodeWizard', level: 13, problemsSolved: 193, xp: 4633, streakDays: 31 },
    { id: '3', username: 'ByteMaster', level: 12, problemsSolved: 174, xp: 4241, streakDays: 27 },
    { id: '4', username: 'StackHero', level: 11, problemsSolved: 164, xp: 3830, streakDays: 26 },
    { id: '5', username: 'RecursiveRex', level: 10, problemsSolved: 143, xp: 3429, streakDays: 25 },
];

// Rank colors for top 3
const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze

export function Leaderboard() {
    const { profile } = useUserProfile();
    const currentUserName = profile?.alias || 'Guest';

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                p: 3,
                bgcolor: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}
        >
            <Stack spacing={2}>
                {/* Header */}
                <Stack direction="row" alignItems="center" spacing={1}>
                    <EmojiEvents sx={{ color: '#f59e0b', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Leaderboard
                    </Typography>
                </Stack>

                {/* Leaderboard entries */}
                <Stack spacing={1}>
                    {mockLeaderboardData.map((entry, index) => (
                        <Box
                            key={entry.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: index < 3 ? `${rankColors[index]}10` : 'transparent',
                                transition: 'background-color 0.2s',
                                '&:hover': {
                                    bgcolor: 'rgba(139, 92, 246, 0.05)',
                                },
                            }}
                        >
                            {/* Rank */}
                            <Box sx={{ width: 28, textAlign: 'center' }}>
                                {index < 3 ? (
                                    <MilitaryTech sx={{ color: rankColors[index], fontSize: 22 }} />
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                        {index + 1}
                                    </Typography>
                                )}
                            </Box>

                            {/* Avatar */}
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    bgcolor: index === 0 ? '#8b5cf6' : index === 1 ? '#3b82f6' : '#10b981',
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                            >
                                {entry.username.slice(0, 2).toUpperCase()}
                            </Avatar>

                            {/* User info */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                    {entry.username}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Level {entry.level} • {entry.problemsSolved} solved
                                </Typography>
                            </Box>

                            {/* XP */}
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 700, color: DIFFICULTY_COLORS.medium }}
                                >
                                    {entry.xp.toLocaleString()} XP
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    🔥 {entry.streakDays}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Stack>

                {/* Current user */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: 'rgba(139, 92, 246, 0.08)',
                        borderLeft: '3px solid #8b5cf6',
                    }}
                >
                    <Box sx={{ width: 28, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            —
                        </Typography>
                    </Box>
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            bgcolor: '#8b5cf6',
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                    >
                        {currentUserName.slice(0, 2).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {currentUserName} <Typography component="span" color="text.secondary">(You)</Typography>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Level 1 • 0 solved
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
                            0 XP
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Keep going!
                        </Typography>
                    </Box>
                </Box>
            </Stack>
        </Paper>
    );
}
