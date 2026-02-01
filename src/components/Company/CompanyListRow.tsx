import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Checkbox
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import type { CompanyData } from '../../types/company';
import { DIFFICULTY_COLORS } from '../../theme/colors';

interface CompanyListRowProps {
  company: CompanyData;
  selected?: boolean;
  onSelect?: (companyName: string, selected: boolean) => void;
  onClick?: (companyName: string) => void;
}

export function CompanyListRow({
  company,
  selected = false,
  onSelect,
  onClick
}: CompanyListRowProps) {
  const difficulty = company.difficultyDistribution || { EASY: 0, MEDIUM: 0, HARD: 0 };

  const handleRowClick = () => {
    onClick?.(company.company);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(company.company, !selected);
  };

  return (
    <Paper
      variant="outlined"
      onClick={handleRowClick}
      sx={{
        borderRadius: 2,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        border: selected ? '1px solid #8b5cf6' : '1px solid rgba(0,0,0,0.08)',
        bgcolor: selected ? 'rgba(139, 92, 246, 0.02)' : 'white',
        '&:hover': {
          borderColor: selected ? '#8b5cf6' : 'rgba(0,0,0,0.2)',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }
      }}
    >
      <Grid container alignItems="center" sx={{ p: 2 }}>
        {/* Checkbox & Company Info */}
        <Grid size={{ xs: 12, sm: 4 }} display="flex" alignItems="center" gap={2}>
          <Checkbox
            checked={selected}
            onClick={handleCheckboxClick}
            size="small"
            sx={{
              color: 'rgba(0,0,0,0.2)',
              '&.Mui-checked': { color: '#8b5cf6' }
            }}
          />
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: 'rgba(99,102,241,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
            flexShrink: 0
          }}>
            <BusinessIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {company.company}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {company.totalProblems} problems
            </Typography>
          </Box>
        </Grid>

        {/* Stats Columns */}
        <Grid size={{ xs: 4, sm: 2 }}>
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>Easy</Typography>
          <Typography variant="body2" sx={{ color: DIFFICULTY_COLORS.easy, fontWeight: 600 }}>
            {difficulty.EASY}
          </Typography>
        </Grid>

        <Grid size={{ xs: 4, sm: 2 }}>
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>Medium</Typography>
          <Typography variant="body2" sx={{ color: DIFFICULTY_COLORS.medium, fontWeight: 600 }}>
            {difficulty.MEDIUM}
          </Typography>
        </Grid>

        <Grid size={{ xs: 4, sm: 2 }}>
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>Hard</Typography>
          <Typography variant="body2" sx={{ color: DIFFICULTY_COLORS.hard, fontWeight: 600 }}>
            {difficulty.HARD}
          </Typography>
        </Grid>

        {/* Action */}
        <Grid size={{ xs: 12, sm: 2 }} display="flex" justifyContent="flex-end">
          <IconButton size="small" sx={{ color: 'text.disabled' }}>
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
}

