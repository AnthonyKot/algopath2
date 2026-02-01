import { Card, CardActionArea, CardContent, Grid, Stack, Typography, Box } from '@mui/material';
import { RocketLaunch, CompareArrows, Business, ArrowForward } from '@mui/icons-material';
import { useAppContext } from '../../hooks/useAppContext';

const actions = [
  {
    title: 'Study Planner',
    description: 'Set weekly goals and track progress',
    view: 'study',
    icon: RocketLaunch,
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
  },
  {
    title: 'Compare Companies',
    description: 'Side-by-side FAANG analysis',
    view: 'company',
    icon: CompareArrows,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
  },
  {
    title: 'Company Research',
    description: 'Explore 470+ company patterns',
    view: 'company',
    icon: Business,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
  }
] as const;

export function ActionCardRow() {
  const { dispatch } = useAppContext();

  return (
    <Grid container spacing={2}>
      {actions.map((action) => {
        const IconComponent = action.icon;
        return (
          <Grid size={{ xs: 12, md: 4 }} key={action.title}>
            <Card
              sx={{
                borderRadius: 4,
                border: 'none',
                boxShadow: '0 4px 20px rgba(15,23,42,0.06)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(15,23,42,0.12)',
                },
              }}
            >
              <CardActionArea
                onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: action.view })}
                sx={{ p: 0.5 }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor: action.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComponent sx={{ fontSize: 28, color: action.color }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </Box>
                    <ArrowForward sx={{ color: 'text.disabled', fontSize: 20 }} />
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

