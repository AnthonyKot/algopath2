
import { useState, useEffect, useMemo } from 'react';
import { Stack, Grid } from '@mui/material';
import { PageTransition } from '../components/Layout/PageTransition';
import { TrendingProblemCard } from '../components/Overview';
import { companyService } from '../services/companyService';
import { LearningPathExplorer } from '../components/LearningPath';
import { CommunityLeaderboard } from '../components/Community';
import { ProgressPinCard } from '../components/Profile';
import { ProfileHero, ActionCardRow, BadgesCard } from '../components/Dashboard';
import type { CompanyData } from '../types/company';

export function OverviewPage() {
  const [companies, setCompanies] = useState<CompanyData[]>([]);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const companiesData = await companyService.getCompanyStats();
      setCompanies(companiesData);
    } catch (error) {
      console.error('Failed to load companies:', error);
    }
  };

  const difficultyTotals = useMemo(() => {
    return companies.reduce((acc, company) => {
      acc.easy += company.difficultyDistribution?.EASY ?? 0;
      acc.medium += company.difficultyDistribution?.MEDIUM ?? 0;
      acc.hard += company.difficultyDistribution?.HARD ?? 0;
      return acc;
    }, { easy: 0, medium: 0, hard: 0 });
  }, [companies]);

  return (
    <PageTransition>
      <Stack spacing={3}>
        <ProfileHero
          solvedCounts={difficultyTotals}
          streakDays={3}
        />

        <ActionCardRow />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <BadgesCard />
          </Grid>
          <Grid item xs={12} md={6}>
            <ProgressPinCard />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TrendingProblemCard />
          </Grid>
          <Grid item xs={12} md={6}>
            <CommunityLeaderboard />
          </Grid>
        </Grid>

        <LearningPathExplorer />
      </Stack>
    </PageTransition>
  );
}
