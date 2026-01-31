import { useMemo } from 'react';
import { Card, CardContent, Grid, Typography, Stack, Chip } from '@mui/material';
import type { StudyPlan } from '../../types';

interface QuickPlanRowProps {
  plans: StudyPlan[];
  onSelect: (plan: StudyPlan) => void;
}

export function QuickPlanRow({ plans, onSelect }: QuickPlanRowProps) {
  const featured = useMemo(() => plans.slice(0, 3), [plans]);

  if (featured.length === 0) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      {featured.map((plan) => (
        <Grid item xs={12} md={4} key={plan.id}>
          <Card variant="outlined" sx={{ borderRadius: 3 }} onClick={() => onSelect(plan)}>
            <CardContent>
              <Stack spacing={1}>
                <Chip label={`${plan.duration} weeks`} size="small" variant="outlined" />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {plan.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {plan.focusAreas?.length || 0} topics · {plan.dailyGoal} problems/day
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
