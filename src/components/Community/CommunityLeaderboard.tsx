import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { EmojiEvents as EmojiEventsIcon, Groups as GroupsIcon, Send as SendIcon } from '@mui/icons-material';
import { AnimatedCard } from '../Common/AnimatedCard';
import { useUserProfile } from '../../hooks/useUserProfile';
import { communityService } from '../../services/communityService';
import type { LeaderboardEntry } from '../../services/communityService';

export function CommunityLeaderboard() {
  const { profile } = useUserProfile();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ companyFocus: '', timezone: '', completion: 60 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await communityService.getLeaderboard();
      setEntries(data);
    };
    load();
  }, []);

  const leaderboard = useMemo(() => entries.slice(0, 5), [entries]);

  const handleSubmit = async () => {
    if (!profile?.pin) {
      setOpen(false);
      return;
    }
    try {
      setSubmitting(true);
      await communityService.submitEntry({
        name: profile.alias || `Pin ${profile.pin}`,
        companyFocus: form.companyFocus || profile.focus || 'Exploring',
        timezone: form.timezone || 'UTC',
        streak: Math.floor(Math.random() * 15) + 1,
        completion: form.completion,
        pin: profile.pin
      } as LeaderboardEntry);
      const data = await communityService.getLeaderboard();
      setEntries(data);
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatedCard>
      <CardContent>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEventsIcon fontSize="small" />
                Community Momentum Board
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lightweight leaderboard prototype — streaks reset every Monday.
              </Typography>
            </Box>
            <Chip
              icon={<GroupsIcon fontSize="small" />}
              label="Private beta"
              size="small"
              variant="outlined"
              color="secondary"
            />
          </Box>

          <Stack spacing={2}>
            {leaderboard.map((entry) => (
              <Box
                key={entry.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 2,
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 2,
                  alignItems: { xs: 'flex-start', md: 'center' }
                }}
              >
                <Box sx={{ minWidth: 160 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {entry.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {entry.companyFocus}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
                  <Chip label={`🔥 ${entry.streak}-day streak`} color="warning" size="small" />
                  <Chip label={entry.timezone} size="small" variant="outlined" />
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">
                      Weekly mastery
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={entry.completion}
                      sx={{ height: 8, borderRadius: 5, mt: 0.5 }}
                    />
                  </Box>
                  <Typography variant="subtitle2" sx={{ minWidth: 48, textAlign: 'right' }}>
                    {entry.completion}%
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>

          <Button
            variant="outlined"
            startIcon={<SendIcon />}
            onClick={() => setOpen(true)}
            disabled={!profile?.pin}
          >
            {profile?.pin ? 'Share my streak' : 'Generate a pin to share'}
          </Button>
        </Stack>
      </CardContent>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Share your progress</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Company focus"
              value={form.companyFocus}
              onChange={(event) => setForm({ ...form, companyFocus: event.target.value })}
            />
            <TextField
              label="Timezone"
              value={form.timezone}
              onChange={(event) => setForm({ ...form, timezone: event.target.value })}
            />
            <TextField
              label="Weekly completion %"
              type="number"
              value={form.completion}
              onChange={(event) => setForm({ ...form, completion: Number(event.target.value) })}
              inputProps={{ min: 0, max: 100 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting || !profile?.pin}>
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </AnimatedCard>
  );
}
