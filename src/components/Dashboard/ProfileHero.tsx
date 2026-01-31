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
import { Share as ShareIcon, Logout as LogoutIcon, FireHydrantAlt as FireIcon } from '@mui/icons-material';
import { useUserProfile } from '../../hooks/useUserProfile';

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
    { label: 'Easy', value: solvedCounts?.easy ?? 0, color: '#c4f5d5' },
    { label: 'Medium', value: solvedCounts?.medium ?? 0, color: '#ffecc2' },
    { label: 'Hard', value: solvedCounts?.hard ?? 0, color: '#ffd6d9' }
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        p: { xs: 3, md: 4 },
        background: 'linear-gradient(120deg, #f0d8ff, #fde5f5)',
        boxShadow: '0 20px 60px rgba(99, 102, 241, 0.12)'
      }}
    >
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Stack direction="row" spacing={2} alignItems="center" flex={1}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: 'rgba(255,255,255,0.6)', color: 'primary.main', fontSize: 32, fontWeight: 700 }}>
              {alias.slice(0, 2).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                {alias}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Chip label={`PIN ${pin}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.8)' }} />
                <Chip icon={<FireIcon fontSize="small" />} label={`${streakDays ?? 0} day streak`} size="small" color="warning" />
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Level {level} · {levelProgress}% to next level
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ width: '100%', maxWidth: 360 }}>
            <Typography variant="caption" color="text.secondary">
              XP Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={levelProgress}
              sx={{ mt: 0.5, mb: 1.5, height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.4)', '& .MuiLinearProgress-bar': { borderRadius: 5 } }}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                variant="contained"
                startIcon={<ShareIcon />}
                onClick={handleShare}
              >
                {copied ? 'Copied!' : 'Share progress'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={clearProfile}
              >
                Logout
              </Button>
            </Stack>
          </Box>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          {statBoxes.map((stat) => (
            <Box
              key={stat.label}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 3,
                bgcolor: stat.color,
                textAlign: 'center'
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
