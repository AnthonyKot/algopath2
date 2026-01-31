import { Box } from '@mui/material';
import {
  StarRounded,
  StarHalfRounded,
  StarOutlineRounded
} from '@mui/icons-material';

interface FrequencyStarsProps {
  rating: number;
  color?: string;
  size?: 'small' | 'medium';
}

/**
 * Renders a row of star icons (with half-star support) for frequency ratings.
 */
export function FrequencyStars({ rating, color, size = 'medium' }: FrequencyStarsProps) {
  const iconSize = size === 'small' ? 16 : 20;

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.1,
        color
      }}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const position = index + 1;

        if (rating >= position) {
          return <StarRounded key={position} sx={{ fontSize: iconSize }} />;
        }

        if (rating >= position - 0.5) {
          return <StarHalfRounded key={position} sx={{ fontSize: iconSize }} />;
        }

        return <StarOutlineRounded key={position} sx={{ fontSize: iconSize }} />;
      })}
    </Box>
  );
}
