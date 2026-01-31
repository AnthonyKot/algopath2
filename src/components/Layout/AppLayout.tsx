import React from 'react';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import { Navigation } from './Navigation';
import { HealthIndicator } from './HealthIndicator';
import { PageContainer } from './PageContainer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          // Glassmorphism is handled in theme.ts overrides, 
          // but we ensure it's sticky and top-aligned here.
        }}
      >
        <Toolbar sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                letterSpacing: '-0.02em'
              }}
            >
              AlgoPath
            </Typography>
            <HealthIndicator />
          </Box>
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
