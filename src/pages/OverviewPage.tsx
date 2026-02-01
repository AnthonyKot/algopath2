
import { useState, useEffect, useMemo } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import { PageTransition } from '../components/Layout/PageTransition';
import { TrendingProblemCard } from '../components/Overview';
import { companyService } from '../services/companyService';
import { ProgressPinCard } from '../components/Profile';
import { ProfileHero, ActionCardRow, BadgesCard, Leaderboard } from '../components/Dashboard';
import { LoadingSpinner } from '../components/Common';
import type { CompanyData } from '../types/company';

export function OverviewPage() {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const companiesData = await companyService.getCompanyStats();
      setCompanies(companiesData);
    } catch (error) {
      console.error('Failed to load companies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals - must be before any early returns to respect React hooks rules
  const difficultyTotals = useMemo(() => {
    return companies.reduce((acc, company) => {
      acc.easy += company.difficultyDistribution?.EASY ?? 0;
      acc.medium += company.difficultyDistribution?.MEDIUM ?? 0;
      acc.hard += company.difficultyDistribution?.HARD ?? 0;
      return acc;
    }, { easy: 0, medium: 0, hard: 0 });
  }, [companies]);

  if (loading) {
    return (
      <PageTransition>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <LoadingSpinner message="Loading dashboard..." />
        </Box>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Grid container spacing={3}>
        {/* Left column: Profile + Badges + Progress Pin */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={3}>
            <ProfileHero
              solvedCounts={difficultyTotals}
              streakDays={3}
            />
            <BadgesCard />
            <ProgressPinCard />
          </Stack>
        </Grid>

        {/* Right column: Action cards + Trending + Leaderboard */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Stack spacing={3}>
            <ActionCardRow />
            <TrendingProblemCard />
            <Leaderboard />
          </Stack>
        </Grid>
      </Grid>
    </PageTransition>
  );
}


