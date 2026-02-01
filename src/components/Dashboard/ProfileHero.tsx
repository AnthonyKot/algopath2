import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  LinearProgress,
  Stack,
  Typography,
  Paper
} from '@mui/material';
import { Share as ShareIcon, Logout as LogoutIcon, LocalFireDepartment as FireIcon } from '@mui/icons-material';
import { useUserProfile } from '../../hooks/useUserProfile';
import { DIFFICULTY_COLORS, GRADIENTS } from '../../theme/colors';

interface ProfileHeroProps {
  solvedCounts?: {
    easy: number;
    medium: number;
    hard: number;
  };
  streakDays?: number;
}

export function ProfileHero({ solvedCounts, streakDays }: ProfileHeroProps) {
  const { profile, clearProfile } = useUserProfile();
  const alias = profile?.alias || 'Guest';
  const pin = profile?.pin || '----';
  const [copied, setCopied] = useState(false);

  const totalSolved = useMemo(() => (
    (solvedCounts?.easy || 0) +
    (solvedCounts?.medium || 0) +
    (solvedCounts?.hard || 0)
  ), [solvedCounts]);

  const level = useMemo(() => 1 + Math.floor(totalSolved / 50), [totalSolved]);
  const levelProgress = useMemo(() => {
    const currentLevelSolved = totalSolved % 50;
    return Math.min(100, Math.round((currentLevelSolved / 50) * 100));
  }, [totalSolved]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`AlgoPath PIN ${pin}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.warn('Clipboard disabled', error);
    }
  };

  const statBoxes = [
    { label: 'Total', value: totalSolved, color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' },
    { label: 'Easy', value: solvedCounts?.easy ?? 0, color: DIFFICULTY_COLORS.easy, bgColor: 'rgba(16, 185, 129, 0.1)' },
    { label: 'Medium', value: solvedCounts?.medium ?? 0, color: DIFFICULTY_COLORS.medium, bgColor: 'rgba(245, 158, 11, 0.1)' },
    { label: 'Hard', value: solvedCounts?.hard ?? 0, color: DIFFICULTY_COLORS.hard, bgColor: 'rgba(239, 68, 68, 0.1)' }
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        p: { xs: 3, md: 4 },
        background: 'linear-gradient(135deg, #f0f5ff 0%, #faf5ff 100%)',
        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.08)'
      }}
    >
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Stack direction="row" spacing={2} alignItems="center" flex={1}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: '#8b5cf6', color: 'white', fontSize: 24, fontWeight: 700 }}>
              {alias.slice(0, 2).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                {alias}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Chip label={`PIN ${pin}`} size="small" sx={{ bgcolor: 'white', fontWeight: 500 }} />
                <Chip
                  icon={<FireIcon fontSize="small" />}
                  label={`${streakDays ?? 0} day streak`}
                  size="small"
                  sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: DIFFICULTY_COLORS.medium, fontWeight: 500 }}
                />
              </Stack>
            </Box>
          </Stack>
          <Box sx={{ width: '100%', maxWidth: 320 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Level {level} · {levelProgress}% to next
            </Typography>
            <LinearProgress
              variant="determinate"
              value={levelProgress}
              sx={{
                mt: 0.5,
                mb: 1.5,
                height: 12,
                borderRadius: 6,
                bgcolor: 'rgba(139, 92, 246, 0.15)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 6,
                  background: GRADIENTS.xpBar,
                }
              }}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                variant="contained"
                size="small"
                startIcon={<ShareIcon />}
                onClick={handleShare}
              >
                {copied ? 'Copied!' : 'Share'}
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<LogoutIcon />}
                onClick={clearProfile}
              >
                Logout
              </Button>
            </Stack>
          </Box>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          {statBoxes.map((stat) => (
            <Box
              key={stat.label}
              sx={{
                flex: 1,
                p: 2.5,
                borderRadius: 3,
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                textAlign: 'center',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: stat.color, mb: 0.5 }}
              >
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

