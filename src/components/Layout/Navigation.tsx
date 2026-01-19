import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useAppContext } from '../../hooks/useAppContext';
import { PageContainer } from './PageContainer';

const navigationTabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'company', label: 'Company Research' },
  { value: 'study', label: 'Study Planner' },
] as const;

export function Navigation() {
  const { state, dispatch } = useAppContext();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    dispatch({
      type: 'SET_CURRENT_VIEW',
      payload: newValue as typeof state.currentView,
    });
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', pt: 1 }}>
      <PageContainer>
        <Tabs
          value={state.currentView}
          onChange={handleTabChange}
          aria-label="navigation tabs"
          sx={{
            minHeight: 56,
            '& .MuiTab-root': {
              minHeight: 56,
              fontSize: '0.95rem',
              fontWeight: 600,
              textTransform: 'none',
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: 3,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: 'linear-gradient(90deg, #6366f1 0%, #14b8a6 100%)',
            }
          }}
        >
          {navigationTabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
              disableRipple
            />
          ))}
        </Tabs>
      </PageContainer>
    </Box>
  );
}
