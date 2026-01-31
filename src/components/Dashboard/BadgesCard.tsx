import { Card, CardContent, Stack, Typography, Box } from '@mui/material';

const badges = [
  { label: 'Consistency', description: 'Complete 3 days in a row' },
  { label: 'Company scout', description: 'Review 2 company profiles' }
];

export function BadgesCard() {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Your badges
        </Typography>
        <Stack direction="row" spacing={2}>
          {badges.map((badge) => (
            <Box
              key={badge.label}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 3,
                bgcolor: 'rgba(99,102,241,0.05)'
              }}
            >
              <Typography variant="subtitle2">{badge.label}</Typography>
              <Typography variant="caption" color="text.secondary">
                {badge.description}
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
