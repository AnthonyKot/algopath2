import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CardContent,
  Chip,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import {
  Key as KeyIcon,
  ContentCopy as ContentCopyIcon,
  Autorenew as AutorenewIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { AnimatedCard } from '../Common/AnimatedCard';
import { useUserProfile } from '../../hooks/useUserProfile';

export function ProgressPinCard() {
  const { profile, generatePin, saveProfile, clearProfile } = useUserProfile();
  const [alias, setAlias] = useState('');
  const [focus, setFocus] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setAlias(profile?.alias ?? '');
    setFocus(profile?.focus ?? '');
  }, [profile?.alias, profile?.focus]);

  const handleGenerate = () => {
    generatePin({ alias, focus });
  };

  const handleCopy = async () => {
    if (!profile?.pin) return;
    try {
      await navigator.clipboard.writeText(profile.pin);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.warn('Failed to copy pin', error);
    }
  };

  const handleSaveMeta = () => {
    if (!profile?.pin) return;
    saveProfile({ alias: alias.trim() || undefined, focus: focus.trim() || undefined });
  };

  const handleReset = () => {
    clearProfile();
    setAlias('');
    setFocus('');
  };

  const hasPin = Boolean(profile?.pin);

  return (
    <AnimatedCard>
      <CardContent>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <KeyIcon color="primary" />
              <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif' }}>
                Lightweight Progress Pin
              </Typography>
            </Box>
            <Chip label="Lives on this device" size="small" variant="outlined" />
          </Box>

          <Typography variant="body2" color="text.secondary">
            No accounts, no SSO. Generate a four-digit pin to keep your streaks + learning paths synced locally today,
            then copy it if you ever want to import into Firebase later.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Call sign (optional)"
              placeholder="e.g. Systems sprinter"
              value={alias}
              onChange={(event) => setAlias(event.target.value)}
              onBlur={handleSaveMeta}
              fullWidth
            />
            <TextField
              label="Current focus"
              placeholder="Google L4, Airbnb infra, etc"
              value={focus}
              onChange={(event) => setFocus(event.target.value)}
              onBlur={handleSaveMeta}
              fullWidth
            />
          </Stack>

          {hasPin ? (
            <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 3, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Your pin
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, letterSpacing: 4 }}>
                  {profile?.pin}
                </Typography>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Tooltip title={copied ? 'Copied' : 'Copy pin'}>
                  <span>
                    <Button variant="contained" startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />} onClick={handleCopy}>
                      {copied ? 'Copied' : 'Copy pin'}
                    </Button>
                  </span>
                </Tooltip>
                <Button variant="outlined" startIcon={<AutorenewIcon />} onClick={handleReset}>
                  Reset
                </Button>
              </Stack>
            </Box>
          ) : (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                Tap the button to mint your pin. We only store it locally, so stash it somewhere safe if you want to
                reuse it across devices.
              </Typography>
              <Button variant="contained" size="large" onClick={handleGenerate}>
                Generate my pin
              </Button>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </AnimatedCard>
  );
}
