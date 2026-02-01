import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { Dashboard, Business, MenuBook } from '@mui/icons-material';
import { useAppContext } from '../../hooks/useAppContext';
import { PageContainer } from './PageContainer';

const navigationTabs = [
  { value: 'overview', label: 'Dashboard', icon: Dashboard },
  { value: 'company', label: 'Companies', icon: Business },
  { value: 'study', label: 'Planner', icon: MenuBook },
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
    <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      <PageContainer>
        <Tabs
          value={state.currentView}
          onChange={handleTabChange}
          aria-label="navigation tabs"
          sx={{
            minHeight: 48,
            '& .MuiTab-root': {
              minHeight: 48,
              fontSize: '0.9rem',
              fontWeight: 500,
              textTransform: 'none',
              color: 'text.secondary',
              px: 2,
              gap: 1,
              '&.Mui-selected': {
                color: 'text.primary',
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              height: 2,
              backgroundColor: 'primary.main',
            }
          }}
        >
          {navigationTabs.map((tab) => (
            <Tab
              key={tab.value}
              icon={<tab.icon sx={{ fontSize: 18 }} />}
              iconPosition="start"
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

