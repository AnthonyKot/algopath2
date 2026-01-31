import { useState, useMemo, type ReactNode } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material';
import type { ChipProps } from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  SkipNext as SkipIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Launch as LaunchIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon,
  Dashboard as DashboardIcon,
  Schedule as ScheduleIcon,
  Article as ArticleIcon,
  Download as DownloadIcon,
  CalendarMonth as CalendarIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import type { StudyPlan, StudySession, StudyProblem, ProblemData, StudyPlanMetrics } from '../../types';
import { studyPlanService } from '../../services/studyPlanService';
import { ExportService } from '../../services/exportService';
import { StudyProgressDashboard } from './StudyProgressDashboard';
import { ProblemPreviewDrawer } from '../Common/ProblemPreviewDrawer';

interface StudyPlanViewProps {
  studyPlan: StudyPlan;
  onUpdate: (updatedPlan: StudyPlan) => void;
  onDelete: (planId: string) => void;
}

export function StudyPlanView({ studyPlan, onUpdate, onDelete }: StudyPlanViewProps) {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [noteDialog, setNoteDialog] = useState<{
    open: boolean;
    sessionId: string;
    problemTitle: string;
    currentNotes: string;
  }>({
    open: false,
    sessionId: '',
    problemTitle: '',
    currentNotes: ''
  });
  const [previewProblem, setPreviewProblem] = useState<ProblemData | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const progress = studyPlan.progress;

  const handlePrintPlan = () => window.print();

  const handleExportJson = () => {
    const exportData = JSON.stringify({
      exportDate: new Date().toISOString(),
      version: '1.0',
      studyPlans: [studyPlan]
    }, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-plan-${studyPlan.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const metrics = useMemo<StudyPlanMetrics>(() => {
    const allProblems = studyPlan.schedule.flatMap(session => session.problems);
    const bookmarkedProblems = allProblems.filter(problem => problem.notes?.includes('[BOOKMARK]'));
    const completedProblems = allProblems.filter(problem => problem.status === 'completed');

    const last7DaysSessions = studyPlan.schedule
      .filter(session => {
        const sessionDate = new Date(session.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return sessionDate >= weekAgo && session.completed;
      })
      .length;

    const recentCompletions = completedProblems.filter(problem => {
      if (!problem.completedAt) return false;
      const completedDate = new Date(problem.completedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return completedDate >= weekAgo;
    }).length;

    const velocityRaw = recentCompletions / 7;
    const velocity = Number.isFinite(velocityRaw) ? parseFloat(velocityRaw.toFixed(1)) : 0;
    const remainingProblems = progress.totalProblems - progress.completedProblems;
    const estimatedDaysToComplete = velocity > 0 ? Math.ceil(remainingProblems / velocity) : null;

    return {
      bookmarkedCount: bookmarkedProblems.length,
      bookmarkedProblems,
      last7DaysSessions,
      velocity,
      estimatedDaysToComplete
    };
  }, [studyPlan, progress]);

  const handleProblemStatusChange = (
    sessionId: string,
    problemTitle: string,
    newStatus: StudyProblem['status']
  ) => {
    studyPlanService.updateProblemStatus(
      studyPlan.id,
      sessionId,
      problemTitle,
      newStatus
    );
    
    // Reload the updated plan
    const updatedPlan = studyPlanService.getStudyPlan(studyPlan.id);
    if (updatedPlan) {
      onUpdate(updatedPlan);
    }
  };

  const handleAddNote = (sessionId: string, problemTitle: string, currentNotes: string = '') => {
    setNoteDialog({
      open: true,
      sessionId,
      problemTitle,
      currentNotes
    });
  };

  const handleSaveNote = () => {
    const { sessionId, problemTitle, currentNotes } = noteDialog;
    
    studyPlanService.updateProblemStatus(
      studyPlan.id,
      sessionId,
      problemTitle,
      'in_progress', // Keep current status, just update notes
      currentNotes
    );

    const updatedPlan = studyPlanService.getStudyPlan(studyPlan.id);
    if (updatedPlan) {
      onUpdate(updatedPlan);
    }

    setNoteDialog({ open: false, sessionId: '', problemTitle: '', currentNotes: '' });
  };

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
      newNotes
    );

    const updatedPlan = studyPlanService.getStudyPlan(studyPlan.id);
    if (updatedPlan) {
      onUpdate(updatedPlan);
    }
  };

  const getStatusIcon = (status: StudyProblem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'skipped':
        return <SkipIcon color="warning" />;
      case 'in_progress':
        return <RadioButtonUncheckedIcon color="primary" />;
      default:
        return <RadioButtonUncheckedIcon color="disabled" />;
    }
  };

  const getDifficultyColor = (difficulty: string): ChipProps['color'] => {
    switch (difficulty) {
      case 'EASY':
        return 'success';
      case 'MEDIUM':
        return 'warning';
      case 'HARD':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const isSessionOverdue = (session: StudySession) => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    sessionDate.setHours(0, 0, 0, 0);
    
    return sessionDate < today && !session.completed;
  };

  const getSessionStatus = (session: StudySession) => {
    if (session.completed) return 'completed';
    if (isSessionOverdue(session)) return 'overdue';
    
    const today = new Date().toISOString().split('T')[0];
    if (session.date === today) return 'today';
    if (session.date > today) return 'upcoming';
    
    return 'pending';
  };

  const extractSlugFromLink = (link?: string) => {
    if (!link) {
      return null;
    }
    const match = link.match(/leetcode\.com\/problems\/([\w-]+)/i);
    return match ? match[1].toLowerCase() : null;
  };

  const generateSlugFromTitle = (title: string) => {
    return title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const mapStudyProblemToPreview = (problem: StudyProblem): ProblemData => {
    const slugFromLink = extractSlugFromLink(problem.link);
    return {
      title: problem.title,
      titleSlug: slugFromLink || generateSlugFromTitle(problem.title),
      difficulty: problem.difficulty,
      topics: problem.topics,
      company: problem.company,
      link: problem.link,
      acceptanceRate: problem.acceptanceRate,
      likes: problem.likes,
      dislikes: problem.dislikes,
      originalityScore: problem.originalityScore,
      totalVotes: problem.totalVotes,
    };
  };

  const handleOpenPreview = (problem: StudyProblem) => {
    setPreviewProblem(mapStudyProblemToPreview(problem));
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewProblem(null);
  };

  return (
    <Box>
      {/* Study Plan Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', lg: 'stretch' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom>
                {studyPlan.name}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
                {studyPlan.targetCompanies.map(company => (
                  <Chip key={company} label={company} size="small" />
                ))}
              </Stack>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Overall Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress.completionRate}
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {progress.completedProblems} of {progress.totalProblems} problems completed ({progress.completionRate.toFixed(1)}%)
                  </Typography>
                </Box>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Duration:</strong> {studyPlan.duration} weeks
                  </Typography>
                  <Typography variant="body2">
                    <strong>Daily goal:</strong> {studyPlan.dailyGoal} problems/day
                  </Typography>
                  <Typography variant="body2">
                    <strong>Focus areas:</strong> {studyPlan.focusAreas?.slice(0, 2).join(', ') || '—'}
                  </Typography>
                </Stack>
              </Box>
            </Box>

            <Stack spacing={2} sx={{ minWidth: { lg: 320 }, width: { lg: 320 }, flexShrink: 0 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} flexWrap="wrap" className="no-print">
                <Button size="small" variant="outlined" startIcon={<PrintIcon />} onClick={handlePrintPlan}>
                  Print
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  startIcon={<CalendarIcon />}
                  onClick={() => ExportService.exportStudyPlanToICS(studyPlan)}
                >
                  Add to Calendar
                </Button>
                <Button size="small" variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportJson}>
                  Export JSON
                </Button>
                <Tooltip title="Plan editing coming soon">
                  <span>
                    <Button size="small" variant="outlined" startIcon={<EditIcon />} disabled>
                      Edit Plan
                    </Button>
                  </span>
                </Tooltip>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => onDelete(studyPlan.id)}
                >
                  Delete
                </Button>
              </Stack>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Plan Snapshot
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 1.5
                  }}
                >
                  <HeroMetric
                    label="Current Streak"
                    value={`${progress.currentStreak} days`}
                    helper={`Best: ${progress.longestStreak} days`}
                  />
                  <HeroMetric
                    label="Velocity"
                    value={`${metrics.velocity.toFixed(1)} /day`}
                    helper={metrics.estimatedDaysToComplete
                      ? `ETA ${metrics.estimatedDaysToComplete} days`
                      : `Target: ${studyPlan.dailyGoal}/day`}
                  />
                  <HeroMetric label="Bookmarked" value={metrics.bookmarkedCount} helper="Problems to review" />
                  <HeroMetric
                    label="Avg per Day"
                    value={`${progress.averageProblemsPerDay.toFixed(1)}`}
                    helper={`${metrics.last7DaysSessions} sessions this week`}
                  />
                </Box>
              </Paper>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Tabs for Dashboard and Schedule */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab 
            icon={<DashboardIcon />} 
            label="Progress Dashboard" 
            iconPosition="start"
          />
          <Tab 
            icon={<ScheduleIcon />} 
            label="Study Schedule" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <StudyProgressDashboard 
          studyPlan={studyPlan} 
          metrics={metrics}
          onUpdate={onUpdate}
        />
      )}

      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Study Schedule
            </Typography>
          
          {studyPlan.schedule.map((session, index) => {
            const sessionStatus = getSessionStatus(session);
            const completedProblems = session.problems.filter(p => p.status === 'completed').length;
            
            return (
              <Accordion
                key={session.id}
                expanded={selectedSession === session.id}
                onChange={(_, isExpanded) => setSelectedSession(isExpanded ? session.id : null)}
                sx={{
                  mb: 1,
                  '&:before': { display: 'none' },
                  border: sessionStatus === 'overdue' ? '1px solid' : 'none',
                  borderColor: 'error.main',
                  bgcolor: sessionStatus === 'today' ? 'action.hover' : 'background.paper'
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1">
                        Day {index + 1} - {formatDate(session.date)}
                        {sessionStatus === 'today' && (
                          <Chip label="Today" size="small" color="primary" sx={{ ml: 1 }} />
                        )}
                        {sessionStatus === 'overdue' && (
                          <Chip label="Overdue" size="small" color="error" sx={{ ml: 1 }} />
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {completedProblems}/{session.problems.length} problems completed
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(completedProblems / session.problems.length) * 100}
                        sx={{ width: 100, height: 6, borderRadius: 3 }}
                      />
                      {session.completed && <CheckCircleIcon color="success" />}
                    </Box>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails>
                  <List dense>
                    {session.problems.map((problem, problemIndex) => (
                      <ListItem key={problemIndex} divider>
                        <ListItemText
                          disableTypography
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1">
                                {problem.title}
                              </Typography>
                              <Chip
                                label={problem.difficulty}
                                size="small"
                                color={getDifficultyColor(problem.difficulty)}
                              />
                              <Chip
                                label={problem.company}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Topics: {problem.topics.join(', ')}
                              </Typography>
                              
                              {/* Quality Metrics Display */}
                              {problem.qualityScore && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                                  <Chip
                                    label={`Quality: ${(problem.qualityScore * 100).toFixed(0)}%`}
                                    size="small"
                                    color={problem.qualityScore >= 0.8 ? 'success' : problem.qualityScore >= 0.6 ? 'primary' : 'default'}
                                    variant="outlined"
                                  />
                                  
                                  {problem.qualityTier && problem.qualityTier !== 'Unknown' && (
                                    <Chip
                                      label={problem.qualityTier}
                                      size="small"
                                      color={
                                        problem.qualityTier === 'Premium' ? 'success' :
                                        problem.qualityTier === 'High' ? 'primary' :
                                        problem.qualityTier === 'Good' ? 'secondary' : 'default'
                                      }
                                      variant="outlined"
                                    />
                                  )}
                                  
                                  {problem.isInterviewClassic && (
                                    <Chip
                                      label="Interview Classic"
                                      size="small"
                                      color="warning"
                                      variant="outlined"
                                    />
                                  )}
                                  
                                  {problem.isHiddenGem && (
                                    <Chip
                                      label="Hidden Gem"
                                      size="small"
                                      color="success"
                                      variant="outlined"
                                    />
                                  )}
                                  
                                  {problem.likes && problem.likes > 0 && (
                                    <Typography variant="caption" color="text.secondary">
                                      👍 {problem.likes.toLocaleString()}
                                    </Typography>
                                  )}
                                  
                                  {problem.acceptanceRate && (
                                    <Typography variant="caption" color="text.secondary">
                                      Acceptance: {(problem.acceptanceRate * 100).toFixed(1)}%
                                    </Typography>
                                  )}
                                </Box>
                              )}
                              
                              {problem.recommendationReason && (
                                <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: 'block' }}>
                                  💡 {problem.recommendationReason}
                                </Typography>
                              )}
                              
                              {problem.notes && (
                                <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                                  Notes: {problem.notes}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Tooltip title={problem.notes?.includes('[BOOKMARK]') ? 'Remove bookmark' : 'Add bookmark'}>
                              <IconButton
                                size="small"
                                onClick={() => handleToggleBookmark(session.id, problem.title, problem.notes)}
                                color={problem.notes?.includes('[BOOKMARK]') ? 'secondary' : 'default'}
                              >
                                {problem.notes?.includes('[BOOKMARK]') ? 
                                  <BookmarkedIcon fontSize="small" /> : 
                                  <BookmarkIcon fontSize="small" />
                                }
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Preview problem">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenPreview(problem)}
                              >
                                <ArticleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Add notes">
                              <IconButton
                                size="small"
                                onClick={() => handleAddNote(session.id, problem.title, problem.notes)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title={problem.link ? 'Open problem' : 'Problem link unavailable'}>
                              <span>
                                {problem.link ? (
                                  <IconButton
                                    size="small"
                                    component="a"
                                    href={problem.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <LaunchIcon fontSize="small" />
                                  </IconButton>
                                ) : (
                                  <IconButton size="small" disabled>
                                    <LaunchIcon fontSize="small" />
                                  </IconButton>
                                )}
                              </span>
                            </Tooltip>
                            
                            <Tooltip title="Mark as completed">
                              <Checkbox
                                checked={problem.status === 'completed'}
                                onChange={(e) => 
                                  handleProblemStatusChange(
                                    session.id,
                                    problem.title,
                                    e.target.checked ? 'completed' : 'not_started'
                                  )
                                }
                                icon={getStatusIcon(problem.status)}
                                checkedIcon={<CheckCircleIcon color="success" />}
                              />
                            </Tooltip>
                            
                            <Button
                              size="small"
                              variant="outlined"
                              color="warning"
                              onClick={() => 
                                handleProblemStatusChange(session.id, problem.title, 'skipped')
                              }
                              disabled={problem.status === 'skipped'}
                            >
                              Skip
                            </Button>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </CardContent>
      </Card>
      )}

      {/* Notes Dialog */}
      <Dialog
        open={noteDialog.open}
        onClose={() => setNoteDialog({ ...noteDialog, open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Notes</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Notes"
            value={noteDialog.currentNotes}
            onChange={(e) => setNoteDialog({ ...noteDialog, currentNotes: e.target.value })}
            placeholder="Add your thoughts, approach, or key learnings..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialog({ ...noteDialog, open: false })}>
            Cancel
          </Button>
          <Button onClick={handleSaveNote} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ProblemPreviewDrawer
        open={previewOpen}
        problem={previewProblem}
        onClose={handleClosePreview}
      />
    </Box>
  );
}

function HeroMetric({ label, value, helper }: { label: string; value: ReactNode; helper?: ReactNode }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ mt: 0.5 }}>
        {value}
      </Typography>
      {helper && (
        <Typography variant="body2" color="text.secondary">
          {helper}
        </Typography>
      )}
    </Box>
  );
}
