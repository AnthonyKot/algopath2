import { Paper, Stack, Typography, Box, Tooltip } from '@mui/material';
import {
  LocalFireDepartment,
  EmojiEvents,
  Star,
  FitnessCenter,
  CheckCircle,
  Lock,
  Help,
  CalendarToday
} from '@mui/icons-material';
import { DIFFICULTY_COLORS } from '../../theme/colors';

// Badge definitions
interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  isSecret?: boolean;
  // For dynamic badges
  tiers?: { target: number; label: string }[];
}

const BADGES: BadgeDefinition[] = [
  {
    id: 'streak',
    name: '7-Day Streak',
    description: 'Solve problems 7 days in a row',
    icon: <LocalFireDepartment />,
    color: '#f59e0b',
  },
  {
    id: 'topic-master',
    name: 'Topic Master',
    description: 'Complete 30% of any topic',
    icon: <CheckCircle />,
    color: '#8b5cf6',
  },
  {
    id: 'grinder',
    name: 'Problem Grinder',
    description: 'Solve 50 problems total',
    icon: <FitnessCenter />,
    color: '#3b82f6',
    tiers: [
      { target: 50, label: '50 Problems' },
      { target: 100, label: '100 Problems' },
      { target: 150, label: '150 Problems' },
      { target: 200, label: '200 Master' },
    ],
  },
  {
    id: 'easy-crusher',
    name: 'Easy Crusher',
    description: 'Solve 25 Easy problems',
    icon: <Star />,
    color: DIFFICULTY_COLORS.easy,
  },
  {
    id: 'medium-warrior',
    name: 'Medium Warrior',
    description: 'Solve 25 Medium problems',
    icon: <Star />,
    color: DIFFICULTY_COLORS.medium,
  },
  {
    id: 'hard-conqueror',
    name: 'Hard Conqueror',
    description: 'Solve 10 Hard problems',
    icon: <Star />,
    color: DIFFICULTY_COLORS.hard,
  },
  {
    id: 'daily-challenger',
    name: 'Daily Challenger',
    description: 'Complete 5 daily challenges',
    icon: <CalendarToday />,
    color: '#06b6d4',
  },
  // Secret badge - only shows when earned
  {
    id: 'pioneer',
    name: 'Pioneer',
    description: 'One of the first 10 users!',
    icon: <EmojiEvents />,
    color: '#ffd700',
    isSecret: true,
  },
];

import { useBadges } from '../../hooks/useBadges';

// ... (Badge definitions kept)

// Helper function updated to handle missing properties gracefully
function getBadgeStatus(badge: BadgeDefinition, progress: ReturnType<typeof useBadges>) {
  const stats = {
    ...progress,
    dailyChallengesCompleted: 0, // TODO: Implement daily challenge tracking
    isPioneer: false // TODO: Implement pioneer check
  };

  switch (badge.id) {
    case 'streak':
      return { achieved: stats.streakDays >= 7, current: stats.streakDays, target: 7 };
    case 'topic-master':
      return { achieved: stats.topicsCompleted >= 1, current: stats.topicsCompleted, target: 1 };
    case 'grinder':
      // Find current tier
      const tiers = badge.tiers || [];
      const currentTier = tiers.find(t => stats.totalSolved < t.target) || tiers[tiers.length - 1];
      return { achieved: stats.totalSolved >= 50, current: stats.totalSolved, target: currentTier?.target || 50 };
    case 'easy-crusher':
      return { achieved: stats.easySolved >= 25, current: stats.easySolved, target: 25 };
    case 'medium-warrior':
      return { achieved: stats.mediumSolved >= 25, current: stats.mediumSolved, target: 25 };
    case 'hard-conqueror':
      return { achieved: stats.hardSolved >= 10, current: stats.hardSolved, target: 10 };
    case 'daily-challenger':
      return { achieved: stats.dailyChallengesCompleted >= 5, current: stats.dailyChallengesCompleted, target: 5 };
    case 'pioneer':
      return { achieved: stats.isPioneer, current: 0, target: 0 };
    default:
      return { achieved: false, current: 0, target: 0 };
  }
}

export function BadgesCard() {
  const progress = useBadges();

  // Filter: show visible badges + only show secret badges if achieved
  const visibleBadges = BADGES.filter(badge => {
    if (badge.isSecret) {
      const status = getBadgeStatus(badge, progress);
      return status.achieved;
    }
    return true;
  }).slice(0, 7); // Show max 7 badges

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
        <Stack direction="row" alignItems="center" spacing={1}>
          <EmojiEvents sx={{ color: '#f59e0b', fontSize: 22 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Your Badges
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: 2,
          }}
        >
          {visibleBadges.map((badge) => {
            const status = getBadgeStatus(badge, progress);
            const isLocked = !status.achieved;

            return (
              <Tooltip
                key={badge.id}
                title={
                  <Box>
                    <Typography variant="subtitle2">{badge.name}</Typography>
                    <Typography variant="caption">{badge.description}</Typography>
                    {isLocked && status.target > 0 && (
                      <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.8 }}>
                        Progress: {status.current}/{status.target}
                      </Typography>
                    )}
                  </Box>
                }
                arrow
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: isLocked ? 'rgba(0,0,0,0.03)' : `${badge.color}15`,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      bgcolor: isLocked ? 'rgba(0,0,0,0.06)' : `${badge.color}25`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isLocked ? 'rgba(0,0,0,0.08)' : badge.color,
                      color: isLocked ? 'rgba(0,0,0,0.25)' : 'white',
                      mb: 1,
                      position: 'relative',
                    }}
                  >
                    {isLocked ? <Lock fontSize="small" /> : badge.icon}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      color: isLocked ? 'text.disabled' : 'text.primary',
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}
                  >
                    {badge.name}
                  </Typography>
                  {isLocked && status.target > 0 && (
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.disabled', fontSize: '0.65rem' }}
                    >
                      {status.current}/{status.target}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            );
          })}

          {/* Secret badge hint */}
          <Tooltip title="Secret badges are hidden until you earn them!" arrow>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 1.5,
                borderRadius: 3,
                bgcolor: 'rgba(0,0,0,0.02)',
                cursor: 'help',
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.05)',
                  color: 'rgba(0,0,0,0.2)',
                  mb: 1,
                }}
              >
                <Help fontSize="small" />
              </Box>
              <Typography
                variant="caption"
                sx={{ color: 'text.disabled', textAlign: 'center' }}
              >
                + Secret
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </Stack>
    </Paper>
  );
}

