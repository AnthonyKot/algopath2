import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
  LinearProgress,
  Stack
} from '@mui/material';
import type { CompanyComparison } from '../../types/analytics';

interface CompanyComparisonChartProps {
  comparison: CompanyComparison;
}

export const CompanyComparisonChart: React.FC<CompanyComparisonChartProps> = ({ comparison }) => {
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Company Comparison Analysis
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Comparing {comparison.companies.length} companies across multiple metrics
        </Typography>

        <Stack spacing={2}>
          {comparison.companies.map((company, index) => (
            <Card key={company} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Chip
                    label={company}
                    sx={{
                      width: 'fit-content',
                      bgcolor: `${COLORS[index % COLORS.length]}20`,
                      color: COLORS[index % COLORS.length]
                    }}
                  />
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
                    <MetricPill label="Total problems" value={comparison.metrics.totalProblems[company] || 0} />
                    <MetricPill label="Unique" value={comparison.metrics.uniqueProblems[company] || 0} />
                    <MetricPill label="Avg frequency" value={(comparison.metrics.avgFrequency[company] || 0).toFixed(2)} />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, (comparison.metrics.totalProblems[company] || 0) / 10)}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Recommendations */}
        {comparison.recommendations && comparison.recommendations.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recommendations
            </Typography>
            {comparison.recommendations.map((rec, index) => (
              <Alert key={index} severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {rec.company}
                </Typography>
                <Typography variant="body2" paragraph>
                  {rec.recommendation}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {rec.reasoning}
                </Typography>
              </Alert>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

function MetricPill({ label, value }: { label: string; value: number | string }) {
  return (
    <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(15,23,42,0.04)' }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>{value}</Typography>
    </Box>
  );
}
