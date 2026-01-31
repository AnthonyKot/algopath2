import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  CardContent,
  Chip,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { AccessTime as AccessTimeIcon, RocketLaunch as RocketLaunchIcon } from '@mui/icons-material';
import { AnimatedCard } from '../Common/AnimatedCard';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { learningPathService } from '../../services/learningPathService';
import type { CompanyLearningPath } from '../../types/learningPath';

export function LearningPathExplorer() {
  const [paths, setPaths] = useState<CompanyLearningPath[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await learningPathService.getLearningPaths();
        if (!mounted) return;
        setPaths(data);
        if (data.length) {
          setSelectedCompany(data[0].company);
        }
      } catch (error) {
        console.error('Failed to load learning paths', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedPath = useMemo(() => paths.find((path) => path.company === selectedCompany), [paths, selectedCompany]);

  return (
    <AnimatedCard id="learning-paths">
      <CardContent>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: 'Outfit, sans-serif' }}>
                Company Learning Paths
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Curated reps, checkpoints, and stories inspired by neetcode-style tracks.
              </Typography>
            </Box>
            <Chip
              icon={<RocketLaunchIcon fontSize="small" />}
              label="Experimental"
              color="secondary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <LoadingSpinner message="Drafting playbooks..." />
            </Box>
          ) : (
            <Stack spacing={3}>
              <TextField
                select
                fullWidth
                label="Target company"
                value={selectedCompany}
                onChange={(event) => setSelectedCompany(event.target.value)}
              >
                {paths.map((path) => (
                  <MenuItem key={path.company} value={path.company}>
                    {`${path.icon} ${path.company}`}
                  </MenuItem>
                ))}
              </TextField>

              {selectedPath && (
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {selectedPath.mission}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {selectedPath.summary}
                    </Typography>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={`${selectedPath.timelineWeeks} week sprint`}
                        color="primary"
                        variant="outlined"
                      />
                      <Chip label={`${selectedPath.level} focus`} variant="outlined" />
                      <Chip label={selectedPath.targetRole} variant="outlined" />
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Focus topics
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {selectedPath.focusTopics.map((topic) => (
                        <Chip key={topic} label={topic} size="small" color="secondary" variant="outlined" />
                      ))}
                    </Stack>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Signal boosters
                    </Typography>
                    <Stack spacing={1}>
                      {selectedPath.signalBoosters.map((tip) => (
                        <Box key={tip} sx={{ display: 'flex', gap: 1.5 }}>
                          <Box sx={{ width: 6, borderRadius: 6, bgcolor: 'primary.main' }} />
                          <Typography variant="body2">{tip}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <Divider />

                  <Stack spacing={2}>
                    {selectedPath.modules.map((module) => (
                      <Box
                        key={module.id}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          p: 2.5,
                          bgcolor: 'background.default'
                        }}
                      >
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {module.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {module.focus}
                            </Typography>
                          </Box>
                          <Chip label={`${module.durationWeeks} wk${module.durationWeeks > 1 ? 's' : ''}`} color="primary" size="small" />
                        </Stack>
                        <Stack spacing={1.5} sx={{ mt: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Checkpoints
                            </Typography>
                            <Stack component="ul" sx={{ pl: 2, m: 0 }} spacing={0.5}>
                              {module.checkpoints.map((checkpoint) => (
                                <Typography component="li" variant="body2" key={checkpoint}>
                                  {checkpoint}
                                </Typography>
                              ))}
                            </Stack>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Spotlight problems
                            </Typography>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                              {module.spotlightProblems.map((problem) => (
                                <Chip key={problem} label={problem} size="small" variant="outlined" />
                              ))}
                            </Stack>
                          </Box>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              )}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </AnimatedCard>
  );
}
