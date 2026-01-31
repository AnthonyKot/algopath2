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

  return (
    <Grid container spacing={2}>
      {topics.slice(0, 4).map((topic) => (
        <Grid item xs={12} sm={6} md={3} key={topic.topic}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {topic.topic}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {topic.description || 'Key interview focus area'}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={topic.totalFrequency || 0}
                  sx={{ height: 6, borderRadius: 3 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="success.main">{topic.easyCount || 0} Easy</Typography>
                  <Typography variant="caption" color="warning.main">{topic.mediumCount || 0} Medium</Typography>
                  <Typography variant="caption" color="error.main">{topic.hardCount || 0} Hard</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
