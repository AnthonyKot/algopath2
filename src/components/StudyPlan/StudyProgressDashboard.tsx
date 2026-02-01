import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Tooltip,
  IconButton
} from '@mui/material';
import type { ChipProps } from '@mui/material';
import {
  Bookmark as BookmarkedIcon,
  CheckCircle as CompletedIcon,
  SkipNext as SkippedIcon,
  Schedule as PendingIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import type { StudyPlan, StudyPlanMetrics } from '../../types';
import { studyPlanService } from '../../services/studyPlanService';
import { useUserProfile } from '../../hooks/useUserProfile';

interface StudyProgressDashboardProps {
  studyPlan: StudyPlan;
  metrics: StudyPlanMetrics;
  onUpdate: (updatedPlan: StudyPlan) => void;
}

export function StudyProgressDashboard({ studyPlan, metrics, onUpdate }: StudyProgressDashboardProps) {
  const [detailsDialog, setDetailsDialog] = useState<{
    open: boolean;
    type: 'streak' | 'difficulty' | 'topics' | 'companies' | null;
  }>({ open: false, type: null });

  const { profile } = useUserProfile();
  const userId = profile?.pin;

  const progress = studyPlan.progress;

  // Get feedback and recommendations
  const feedback = useMemo(() => studyPlanService.generateFeedback(studyPlan), [studyPlan]);
  const adaptiveRecs = useMemo(() => studyPlanService.getAdaptiveRecommendations(studyPlan), [studyPlan]);

  const handleToggleBookmark = (sessionId: string, problemTitle: string, currentNotes: string = '') => {
    const isBookmarked = currentNotes.includes('[BOOKMARK]');
    const newNotes = isBookmarked
      ? currentNotes.replace('[BOOKMARK]', '').trim()
      : `[BOOKMARK] ${currentNotes}`.trim();

    studyPlanService.updateProblemStatus(
      studyPlan.id,
      sessionId,
      problemTitle,
      'in_progress', // Keep current status
      newNotes,
      userId
    );

    const updatedPlan = studyPlanService.getStudyPlan(studyPlan.id, userId);
    if (updatedPlan) {
      onUpdate(updatedPlan);
    }
  };

  const exportProgressReport = () => {
    const report = {
      studyPlan: {
        name: studyPlan.name,
        targetCompanies: studyPlan.targetCompanies,
        duration: studyPlan.duration,
        dailyGoal: studyPlan.dailyGoal
      },
      progress: progress,
      metrics: metrics,
      exportDate: new Date().toISOString(),
      summary: {
        completionRate: `${progress.completionRate.toFixed(1)}%`,
        problemsCompleted: `${progress.completedProblems}/${progress.totalProblems}`,
        currentStreak: `${progress.currentStreak} days`,
        longestStreak: `${progress.longestStreak} days`,
        averagePerDay: `${progress.averageProblemsPerDay.toFixed(1)} problems`,
        bookmarked: metrics.bookmarkedCount,
        velocity: `${metrics.velocity.toFixed(1)} problems/day (last 7 days)`
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress-report-${studyPlan.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Progress Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={exportProgressReport}
        >
          Export Report
        </Button>
      </Box>

      {/* Detailed Breakdowns */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        {/* Difficulty Progress */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Progress by Difficulty</Typography>
              <Button
                size="small"
                onClick={() => setDetailsDialog({ open: true, type: 'difficulty' })}
              >
                View Details
              </Button>
            </Box>

            <Stack spacing={2}>
              {Object.entries(progress.difficultyBreakdown).map(([difficulty, stats]) => {
                const percentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
                const color: ChipProps['color'] = difficulty === 'EASY'
                  ? 'success'
                  : difficulty === 'MEDIUM'
                    ? 'warning'
                    : 'error';

                return (
                  <Box key={difficulty}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip label={difficulty} color={color} size="small" />
                      <Typography variant="body2">
                        {stats.completed}/{stats.total} ({percentage.toFixed(0)}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      color={color}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                );
              })}
            </Stack>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Sessions completed (last 7 days)
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {metrics.last7DaysSessions}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Average problems per day
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {progress.averageProblemsPerDay.toFixed(1)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Problems skipped
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {progress.skippedProblems}
                </Typography>
              </Box>

              {progress.currentStreak > 0 && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    🔥 You're on a {progress.currentStreak}-day streak! Keep it up!
                  </Typography>
                </Alert>
              )}

              {progress.currentStreak === 0 && progress.longestStreak > 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    💪 Your best streak was {progress.longestStreak} days. You can beat it!
                  </Typography>
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Bookmarked Problems */}
      {metrics.bookmarkedCount > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bookmarked Problems ({metrics.bookmarkedCount})
            </Typography>

            <List dense>
              {metrics.bookmarkedProblems.slice(0, 5).map((problem, index) => {
                const session = studyPlan.schedule.find(s =>
                  s.problems.some(p => p.title === problem.title)
                );

                return (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      {problem.status === 'completed' && <CompletedIcon color="success" />}
                      {problem.status === 'skipped' && <SkippedIcon color="warning" />}
                      {problem.status === 'not_started' && <PendingIcon color="disabled" />}
                      {problem.status === 'in_progress' && <PendingIcon color="primary" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={problem.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {problem.company} • {problem.difficulty} • {problem.topics.join(', ')}
                          </Typography>
                          {problem.notes && (
                            <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                              {problem.notes.replace('[BOOKMARK]', '').trim()}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <Tooltip title="Remove bookmark">
                      <IconButton
                        size="small"
                        onClick={() => session && handleToggleBookmark(session.id, problem.title, problem.notes)}
                      >
                        <BookmarkedIcon color="secondary" />
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                );
              })}
            </List>

            {metrics.bookmarkedCount > 5 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                ... and {metrics.bookmarkedCount - 5} more bookmarked problems
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {/* Feedback and Recommendations */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Personalized Feedback & Recommendations
          </Typography>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 3
          }}>
            {/* Feedback */}
            <Box>
              <Typography variant="subtitle2" gutterBottom color="primary">
                📊 Performance Feedback
              </Typography>
              <Stack spacing={1}>
                {feedback.feedback.map((item, index) => (
                  <Alert key={index} severity="info" sx={{ py: 0.5 }}>
                    <Typography variant="body2">{item}</Typography>
                  </Alert>
                ))}
              </Stack>
            </Box>

            {/* Recommendations */}
            <Box>
              <Typography variant="subtitle2" gutterBottom color="warning.main">
                💡 Recommendations
              </Typography>
              <Stack spacing={1}>
                {feedback.recommendations.map((item, index) => (
                  <Alert key={index} severity="warning" sx={{ py: 0.5 }}>
                    <Typography variant="body2">{item}</Typography>
                  </Alert>
                ))}
              </Stack>
            </Box>

            {/* Insights */}
            <Box>
              <Typography variant="subtitle2" gutterBottom color="success.main">
                🎯 Key Insights
              </Typography>
              <Stack spacing={1}>
                {feedback.insights.map((item, index) => (
                  <Alert key={index} severity="success" sx={{ py: 0.5 }}>
                    <Typography variant="body2">{item}</Typography>
                  </Alert>
                ))}
              </Stack>
            </Box>
          </Box>

          {/* Adaptive Recommendations */}
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle2" gutterBottom>
            🤖 AI-Powered Next Steps
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="medium">
              {adaptiveRecs.reasoning}
            </Typography>
          </Alert>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Suggested Difficulty
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {adaptiveRecs.suggestedDifficulty.map(diff => (
                  <Chip
                    key={diff}
                    label={diff}
                    size="small"
                    color={diff === 'EASY' ? 'success' : diff === 'MEDIUM' ? 'warning' : 'error'}
                  />
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Focus Topics
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {adaptiveRecs.suggestedTopics.slice(0, 3).map(topic => (
                  <Chip key={topic} label={topic} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Priority Companies
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {adaptiveRecs.suggestedCompanies.map(company => (
                  <Chip key={company} label={company} size="small" color="primary" />
                ))}
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog
        open={detailsDialog.open}
        onClose={() => setDetailsDialog({ open: false, type: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {detailsDialog.type === 'difficulty' && 'Difficulty Breakdown'}
          {detailsDialog.type === 'topics' && 'Topic Progress'}
          {detailsDialog.type === 'companies' && 'Company Progress'}
          {detailsDialog.type === 'streak' && 'Streak Details'}
        </DialogTitle>
        <DialogContent>
          {detailsDialog.type === 'difficulty' && (
            <Stack spacing={2}>
              {Object.entries(progress.difficultyBreakdown).map(([difficulty, stats]) => (
                <Box key={difficulty}>
                  <Typography variant="subtitle1" gutterBottom>
                    {difficulty} Problems
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Completed: {stats.completed}</Typography>
                    <Typography variant="body2">Total: {stats.total}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog({ open: false, type: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
