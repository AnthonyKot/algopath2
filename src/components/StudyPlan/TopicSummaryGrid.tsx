import { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Stack, Typography, LinearProgress, Box } from '@mui/material';
import { topicService } from '../../services/topicService';
import type { TopicFrequency } from '../../types/topic';

export function TopicSummaryGrid() {
  const [topics, setTopics] = useState<TopicFrequency[]>([]);

  useEffect(() => {
    topicService.getTopicFrequency(12).then(setTopics).catch(() => setTopics([]));
  }, []);

  if (topics.length === 0) {
    return null;
  }

  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
      Recommended Focus Areas
    </Typography>
    <Grid container spacing={2}>
      {topics.slice(0, 4).map((topic) => {
        const extra = (topic.additionalData || {}) as any;
        return (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={topic.topic}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {topic.topic}
                    </Typography>
                    <Typography variant="caption" sx={{ bgcolor: 'primary.50', color: 'primary.main', px: 1, py: 0.5, borderRadius: 1 }}>
                      {topic.frequency || 0} hits
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
                    {extra.description || 'Key interview focus area'}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, (topic.frequency || 0))}
                    sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.05)' }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                    <Typography variant="caption" color="success.main">{extra.easyCount || extra.easy_count || 0} Easy</Typography>
                    <Typography variant="caption" color="warning.main">{extra.mediumCount || extra.medium_count || 0} Med</Typography>
                    <Typography variant="caption" color="error.main">{extra.hardCount || extra.hard_count || 0} Hard</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  </Box>
}
