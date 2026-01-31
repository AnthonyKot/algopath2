import { Card, CardActionArea, CardContent, Grid, Stack, Typography, Box } from '@mui/material';
import { RocketLaunch, Assessment, MenuBook } from '@mui/icons-material';
import { useAppContext } from '../../hooks/useAppContext';

const actions = [
  {
    title: 'Study Planner',
    description: 'Set your weekly goals',
    view: 'study',
    icon: <RocketLaunch color="primary" />
  },
  {
    title: 'Analytics',
    description: 'Track progress',
    view: 'analytics',
    icon: <Assessment color="secondary" />
  },
  {
    title: 'Company Research',
    description: '470+ companies',
    view: 'company',
    icon: <MenuBook color="warning" />
  }
] as const;

export function ActionCardRow() {
  const { dispatch } = useAppContext();

  return (
    <Grid container spacing={2}>
      {actions.map((action) => (
        <Grid size={{ xs: 12, md: 4 }} key={action.title}>
          <Card sx={{ borderRadius: 3, border: 'none', boxShadow: '0 12px 40px rgba(15,23,42,0.08)' }}>
            <CardActionArea onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: action.view })}>
              <CardContent>
                <Stack spacing={1}>
                  <Box sx={{ display: 'inline-flex', p: 1, borderRadius: 2, bgcolor: 'rgba(99,102,241,0.08)', width: 'fit-content' }}>
                    {action.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
