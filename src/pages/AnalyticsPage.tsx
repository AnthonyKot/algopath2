import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  type SelectChangeEvent
} from '@mui/material';
import {
  TrendingUp,
  Compare,
  Insights,
  Refresh
} from '@mui/icons-material';
import { analyticsService } from '../services/analyticsService';
import { 
  AnalyticsInsightsPanel,
  CompanyComparisonChart,
  CorrelationMatrix,
  FaangAnalytics
} from '../components/Analytics';
import type {
  AnalyticsSummary,
  AnalyticsInsightsResponse,
  CompanyComparison,
  AnalyticsCorrelationResponse
} from '../types/analytics';
import { MAJOR_TECH_COMPANIES } from '../types/analytics';
import { PageTransition } from '../components/Layout/PageTransition';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Analytics data state
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [insights, setInsights] = useState<AnalyticsInsightsResponse | null>(null);
  const [comparison, setComparison] = useState<CompanyComparison | null>(null);
  const [correlations, setCorrelations] = useState<AnalyticsCorrelationResponse | null>(null);
  
  // Selected companies for custom analysis
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(['Google', 'Amazon', 'Microsoft']);
  const [customLoading, setCustomLoading] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCompanyChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedCompanies(typeof value === 'string' ? value.split(',') : value);
  };

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load general analytics overview
      const [summaryData, insightsData] = await Promise.all([
        analyticsService.getAnalyticsSummary(),
        analyticsService.getAnalyticsInsights(undefined, 10)
      ]);

      setSummary(summaryData);
      setInsights(insightsData);
    } catch (err) {
      console.error('Failed to load analytics overview:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomAnalysis = useCallback(async () => {
    if (selectedCompanies.length < 2) {
      return;
    }

    try {
      setCustomLoading(true);
      setError(null);

      const [comparisonData, correlationData] = await Promise.all([
        analyticsService.compareCompanies(selectedCompanies),
        selectedCompanies.length <= 10 
          ? analyticsService.getCorrelationAnalysis(selectedCompanies)
          : Promise.resolve(null)
      ]);

      setComparison(comparisonData);
      setCorrelations(correlationData);
    } catch (err) {
      console.error('Failed to load custom analysis:', err);
      setError('Failed to load comparison data. Please try again.');
    } finally {
      setCustomLoading(false);
    }
  }, [selectedCompanies]);

  const handleRefresh = () => {
    analyticsService.clearCache();
    loadOverviewData();
    if (selectedCompanies.length >= 2) {
      loadCustomAnalysis();
    }
  };

  useEffect(() => {
    loadOverviewData();
  }, []);

  useEffect(() => {
    if (selectedCompanies.length >= 2) {
      loadCustomAnalysis();
    }
  }, [selectedCompanies, loadCustomAnalysis]);

  if (loading) {
    return (
      <PageTransition>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Stack spacing={3}>
        {/* Header */}
        <Card sx={{ borderRadius: 4, background: 'linear-gradient(120deg, #e0f2ff, #f3e8ff)', p: { xs: 1, md: 2 } }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Analytics Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Advanced insights across {summary?.totalCompanies || 470}+ companies
                </Typography>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleRefresh}
                  disabled={loading || customLoading}
                >
                  Refresh
                </Button>
              </Stack>
            </Stack>
            {summary && (
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 3 }}>
                <StatsPill label="Total companies" value={summary.totalCompanies} />
                <StatsPill label="Active topics" value={summary.totalTopics} />
                <StatsPill label="Problems analyzed" value={summary.totalProblems} />
              </Stack>
            )}
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="analytics tabs">
          <Tab 
            icon={<TrendingUp />} 
            label="Overview" 
            id="analytics-tab-0"
            aria-controls="analytics-tabpanel-0"
          />
          <Tab 
            icon={<Compare />} 
            label="Company Comparison" 
            id="analytics-tab-1"
            aria-controls="analytics-tabpanel-1"
          />
          <Tab 
            icon={<Insights />} 
            label="Major Tech Analysis" 
            id="analytics-tab-2"
            aria-controls="analytics-tabpanel-2"
          />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={activeTab} index={0}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Insights and Quick Stats */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, 
            gap: 3 
          }}>
            {/* Insights Panel */}
            {insights && (
              <AnalyticsInsightsPanel insights={insights} />
            )}

            {/* Quick Stats */}
            {summary && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Stats
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Dataset Coverage
                      </Typography>
                      <Typography variant="h6">
                        {summary.totalCompanies} Companies
                      </Typography>
                      <Typography variant="body2">
                        {summary.totalProblems.toLocaleString()} Problems
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Top Topics
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                        {summary.topTopics.slice(0, 5).map((topic) => (
                          <Chip 
                            key={topic.topic} 
                            label={topic.topic} 
                            size="small" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
        </TabPanel>

      {/* Company Comparison Tab */}
        <TabPanel value={activeTab} index={1}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Company Selection */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Custom Company Analysis
              </Typography>
              <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <FormControl sx={{ minWidth: 300 }}>
                  <InputLabel>Select Companies</InputLabel>
                  <Select
                    multiple
                    value={selectedCompanies}
                    onChange={handleCompanyChange}
                    label="Select Companies"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {MAJOR_TECH_COMPANIES.map((company) => (
                      <MenuItem key={company} value={company}>
                        {company}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {customLoading && <CircularProgress size={24} />}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Select 2-10 companies for comparison and correlation analysis
              </Typography>
            </CardContent>
          </Card>

          {/* Comparison Results */}
          {comparison && (
            <CompanyComparisonChart comparison={comparison} />
          )}

          {/* Correlation Matrix */}
          {correlations && (
            <CorrelationMatrix correlations={correlations} />
          )}
        </Box>
        </TabPanel>

      {/* Major Tech Analysis Tab */}
        <TabPanel value={activeTab} index={2}>
          <FaangAnalytics />
        </TabPanel>
      </Stack>
    </PageTransition>
  );
};

function StatsPill({ label, value }: { label: string; value: number | string }) {
  return (
    <Box sx={{ flex: 1, p: 2, borderRadius: 3, bgcolor: 'rgba(15,23,42,0.04)' }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>{value}</Typography>
    </Box>
  );
}
