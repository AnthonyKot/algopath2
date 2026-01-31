import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {
  RocketLaunch as RocketLaunchIcon,
  EmojiEvents as EmojiEventsIcon,
  Whatshot as WhatshotIcon,
  Star as StarIcon,
  Leaderboard as LeaderboardIcon,
  Key as KeyIcon
} from '@mui/icons-material';
import { useUserProfile } from '../../hooks/useUserProfile';

const PIN_REGEX = /^\d{4}$/;
type Step = 'welcome' | 'create' | 'import';

export function PinWelcomeModal() {
  const { profile, generatePin, saveProfile } = useUserProfile();
  const [dismissed, setDismissed] = useState(false);
  const [step, setStep] = useState<Step>('welcome');
  const [pinInput, setPinInput] = useState('');
  const [aliasInput, setAliasInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setDismissed(true);
    setError(null);
    setPinInput('');
    setAliasInput('');
    setStep('welcome');
  };

  const handleSubmitPin = () => {
    if (!PIN_REGEX.test(pinInput)) {
      setError('PIN must be exactly 4 digits');
      return;
    }
    saveProfile({ pin: pinInput });
    handleClose();
  };

  const handleCreateProfile = () => {
    if (!aliasInput.trim()) {
      setError('Please add a call sign or nickname');
      return;
    }
    generatePin({ alias: aliasInput.trim() });
    handleClose();
  };

  const open = !profile && !dismissed;
  const showWelcome = step === 'welcome';
  const showCreate = step === 'create';
  const showImport = step === 'import';

  const helperText = useMemo(() => {
    if (showImport) return error || 'We only use this to restore your streaks';
    if (showCreate) return 'You will receive a four-digit PIN to recover progress.';
    return null;
  }, [showImport, showCreate, error]);

  if (!open) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4 } }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(15,23,42,0.45)'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Stack spacing={2} alignItems="center">
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RocketLaunchIcon color="primary" fontSize="large" />
          </Box>
          <Typography variant="h5" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
            Welcome to AlgoPath!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track progress, earn XP, and compete with a simple four-digit PIN. No accounts required.
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="center" sx={{ mb: 3 }}>
          <Chip icon={<EmojiEventsIcon />} label="Badges" variant="outlined" />
          <Chip icon={<WhatshotIcon />} label="Streaks" variant="outlined" />
          <Chip icon={<StarIcon />} label="XP System" variant="outlined" />
          <Chip icon={<LeaderboardIcon />} label="Leaderboard" variant="outlined" />
        </Stack>
        {showWelcome && (
          <Stack spacing={2}>
            <Button
              variant="contained"
              size="large"
              startIcon={<RocketLaunchIcon />}
              sx={{ py: 1.5 }}
              onClick={() => {
                setStep('create');
                setAliasInput('');
                setError(null);
              }}
            >
              Start fresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<KeyIcon />}
              sx={{ py: 1.5 }}
              onClick={() => {
                setStep('import');
                setError(null);
              }}
            >
              I have a PIN code
            </Button>
            <Button variant="text" onClick={handleClose}>
              Continue without PIN
            </Button>
          </Stack>
        )}
        {showCreate && (
          <Stack spacing={2}>
            <Typography variant="h6" textAlign="center">
              Create Your Profile
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Choose a call sign to get started. A unique 4-digit PIN will unlock your progress anywhere.
            </Typography>
            <TextField
              autoFocus
              label="Enter username"
              value={aliasInput}
              onChange={(event) => {
                setAliasInput(event.target.value);
                setError(null);
              }}
              helperText={helperText}
              error={Boolean(error)}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button fullWidth variant="outlined" onClick={() => setStep('welcome')}>
                Back
              </Button>
              <Button fullWidth variant="contained" onClick={handleCreateProfile}>
                Create account
              </Button>
            </Stack>
          </Stack>
        )}
        {showImport && (
          <Stack spacing={2} alignItems="center">
            <TextField
              autoFocus
              label="Enter your PIN"
              value={pinInput}
              onChange={(event) => {
                setPinInput(event.target.value);
                setError(null);
              }}
              inputProps={{ maxLength: 4, inputMode: 'numeric', pattern: '[0-9]*' }}
              helperText={helperText}
              error={Boolean(error)}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
              <Button fullWidth variant="outlined" onClick={() => setStep('welcome')}>
                Back
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmitPin}
                startIcon={<KeyIcon />}
              >
                Unlock with PIN
              </Button>
            </Stack>
          </Stack>
        )}
      </DialogContent>
      {!showCreate && !showImport && (
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleClose} color="inherit">
            Maybe later
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
