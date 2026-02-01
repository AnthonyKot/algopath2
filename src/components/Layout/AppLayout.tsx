import React from 'react';
import { Box, AppBar, Toolbar, Typography, Stack } from '@mui/material';
import { Circle, Bolt, LocalFireDepartment, People } from '@mui/icons-material';
import { Navigation } from './Navigation';
import { PageContainer } from './PageContainer';

interface AppLayoutProps {
  children: React.ReactNode;
}

// Live stats data - could be connected to real data later
const liveStats = [
  { icon: Circle, label: 'Online Now', value: '193', color: '#10b981' },
  { icon: Bolt, label: 'Solved Today', value: '569', color: '#f59e0b' },
  { icon: LocalFireDepartment, label: 'Active Streaks', value: '392', color: '#ef4444' },
  { icon: People, label: 'Total Users', value: '2,861', color: '#a78bfa' },
];

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header with gradient */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Toolbar sx={{ py: 1.5, px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: '1rem',
              }}
            >
              {'</>'}
            </Box>
            <Box>
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                }}
              >
                AlgoPath
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}
              >
                Interview Prep Dashboard
              </Typography>
            </Box>
          </Box>

          {/* Live Stats */}
          <Stack
            direction="row"
            spacing={{ xs: 1.5, md: 3 }}
            sx={{ ml: 'auto', display: { xs: 'none', sm: 'flex' } }}
          >
            {liveStats.map((stat) => (
              <Box
                key={stat.label}
                sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
              >
                <stat.icon sx={{ fontSize: 14, color: stat.color }} />
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(255,255,255,0.6)', display: { xs: 'none', lg: 'block' } }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Navigation */}
      <Navigation />

      {/* Main Content Area */}
      <Box sx={{ flex: 1, py: 4 }}>
        <PageContainer component="main" role="main">
          {children}
        </PageContainer>
      </Box>
    </Box>
  );
}

