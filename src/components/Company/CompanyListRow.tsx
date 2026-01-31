import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  IconButton
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import type { CompanyData } from '../../types/company';

interface CompanyListRowProps {
  company: CompanyData;
  onClick?: (companyName: string) => void;
}

export function CompanyListRow({ company, onClick }: CompanyListRowProps) {
  const difficulty = company.difficultyDistribution || { EASY: 0, MEDIUM: 0, HARD: 0 };

  const handleClick = () => {
    onClick?.(company.company);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        px: 3,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: 'rgba(99,102,241,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <BusinessIcon color="primary" />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {company.company}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {company.totalProblems.toLocaleString()} problems · Updated recently
          </Typography>
        </Box>
      </Stack>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Chip label={`${difficulty.EASY} Easy`} size="small" sx={{ bgcolor: 'rgba(34,197,94,0.15)', color: '#15803d' }} />
        <Chip label={`${difficulty.MEDIUM} Medium`} size="small" sx={{ bgcolor: 'rgba(251,191,36,0.15)', color: '#b45309' }} />
        <Chip label={`${difficulty.HARD} Hard`} size="small" sx={{ bgcolor: 'rgba(248,113,113,0.15)', color: '#b91c1c' }} />
      </Stack>
      <IconButton onClick={handleClick}>
        <ArrowForwardIcon />
      </IconButton>
    </Paper>
  );
}
