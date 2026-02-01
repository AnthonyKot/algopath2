import { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Paper,
  Stack,
  Button
} from '@mui/material';
import { Business as BusinessIcon, Refresh as RefreshIcon, ArrowBack } from '@mui/icons-material';
import {
  CompanyList,
  CompanyFilters,
  CompanyDetail
} from '../components/Company';
import { CompanyComparisonChart } from '../components/Analytics/CompanyComparisonChart';
import { ExportMenu } from '../components/Common/ExportMenu';
import { PageTransition } from '../components/Layout/PageTransition';
import { LoadingSpinner } from '../components/Common'; // Fixed import
import { useCompanyData, useCompanyDetails } from '../hooks/useCompanyData';
import { analyticsService } from '../services/analyticsService';
import type { CompanyFilterCriteria } from '../types/company';
import type { CompanyComparison } from '../types/analytics';

export function CompanyResearchPage() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [comparingCompanies, setComparingCompanies] = useState<string[] | null>(null);
  const [comparisonData, setComparisonData] = useState<CompanyComparison | null>(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  const {
    filteredCompanies,
    stats,
    loading,
    error,
    refetch,
    applyFilters,
    clearFilters,
    currentFilters
  } = useCompanyData();

  const {
    company: companyDetails,
    loading: detailsLoading,
    error: detailsError,
    refetch: refetchDetails
  } = useCompanyDetails(selectedCompany);

  const handleCompanyClick = (companyName: string) => {
    setSelectedCompany(companyName);
  };

  const handleBackToList = () => {
    setSelectedCompany(null);
    setComparingCompanies(null);
    setComparisonData(null);
  };

  const handleFiltersChange = (filters: CompanyFilterCriteria) => {
    applyFilters(filters);
  };

  const handleCompare = async (companies: string[]) => {
    if (companies.length < 2) return;

    try {
      setComparingCompanies(companies);
      setComparisonLoading(true);
      const data = await analyticsService.compareCompanies(companies);
      setComparisonData(data);
    } catch (err) {
      console.error('Comparison failed:', err);
    } finally {
      setComparisonLoading(false);
    }
  };

  // Show company detail view
  if (selectedCompany) {
    return (
      <PageTransition>
        <CompanyDetail
          company={companyDetails}
          loading={detailsLoading}
          error={detailsError}
          onBack={handleBackToList}
          onRetry={refetchDetails}
        />
      </PageTransition>
    );
  }

  // Show comparison view
  if (comparingCompanies) {
    return (
      <PageTransition>
        <Stack spacing={3}>
          <Box>
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBackToList}
              sx={{ mb: 2 }}
            >
              Back to List
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Company Comparison
            </Typography>
          </Box>

          {comparisonLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <LoadingSpinner message="Analyzing companies..." size={60} />
            </Box>
          ) : comparisonData ? (
            <CompanyComparisonChart comparison={comparisonData} />
          ) : (
            <Alert severity="error">Failed to load comparison data.</Alert>
          )}
        </Stack>
      </PageTransition>
    );
  }

  // Show company list view
  return (
    <PageTransition>
      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: { xs: 2, md: 4 },
            background: 'linear-gradient(120deg, #e0ecff, #f5e8ff)',
            boxShadow: '0 20px 60px rgba(15,23,42,0.08)'
          }}
        >
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BusinessIcon color="primary" />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Company Research
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Analyze interview patterns and problem stats across {stats.totalCompanies.toLocaleString()} companies.
                </Typography>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={refetch}
                  disabled={loading}
                >
                  Refresh
                </Button>
                <ExportMenu
                  data={filteredCompanies}
                  dataType="companies"
                  buttonText="Export list"
                  disabled={loading || filteredCompanies.length === 0}
                />
              </Stack>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <StatPill label="Companies" value={stats.totalCompanies} accent="#d9e7ff" />
              <StatPill label="Problems tracked" value={stats.totalProblems} accent="#ffe6f0" />
              <StatPill label="Avg per company" value={stats.avgProblemsPerCompany} accent="#e9f9f3" />
            </Stack>
          </Stack>
        </Paper>

        {/* API Status Alert */}
        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>API Notice:</strong> {error}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              The company endpoints may be experiencing issues. Some features might be limited.
            </Typography>
          </Alert>
        )}

        {/* Filters */}
        <CompanyFilters
          filters={currentFilters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={clearFilters}
          totalCompanies={stats.totalCompanies}
          filteredCount={filteredCompanies.length}
        />

        {/* Company List */}
        <CompanyList
          companies={filteredCompanies}
          loading={loading}
          error={error}
          onCompanyClick={handleCompanyClick}
          onRetry={refetch}
          onCompare={handleCompare}
        />
      </Stack>
    </PageTransition>
  );
}

interface StatPillProps {
  label: string;
  value: number;
  accent: string;
}

function StatPill({ label, value, accent }: StatPillProps) {
  return (
    <Box
      sx={{
        flex: 1,
        p: 2,
        borderRadius: 3,
        bgcolor: accent,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Typography>
    </Box>
  );
}
