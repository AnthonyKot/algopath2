import React, { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  Button,
  Slide,
  AppBar,
  Toolbar,
  Container
} from '@mui/material';
import { CompareArrows, Close, ClearAll } from '@mui/icons-material';
import { CompanyListRow } from './CompanyListRow';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { ErrorMessage } from '../Common/ErrorMessage';
import type { CompanyData } from '../../types/company';

interface CompanyListProps {
  companies: CompanyData[];
  loading: boolean;
  error: string | null;
  onCompanyClick?: (companyName: string) => void;
  onRetry?: () => void;
  onCompare?: (companies: string[]) => void;
}

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48, 96];

export function CompanyList({
  companies,
  loading,
  error,
  onCompanyClick,
  onRetry,
  onCompare
}: CompanyListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  // Calculate pagination
  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = companies.slice(startIndex, endIndex);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (event: any) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const handleSelectCompany = (companyName: string, selected: boolean) => {
    if (selected) {
      if (selectedCompanies.length >= 10) return;
      setSelectedCompanies(prev => [...prev, companyName]);
    } else {
      setSelectedCompanies(prev => prev.filter(c => c !== companyName));
    }
  };

  const handleClearSelection = () => {
    setSelectedCompanies([]);
  };

  // Loading state
  if (loading && companies.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <LoadingSpinner message="Loading company data..." size={60} />
      </Box>
    );
  }

  // Error state
  if (error && companies.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <ErrorMessage
          title="Failed to Load Companies"
          message={error}
          onRetry={onRetry}
          variant="card"
        />
      </Box>
    );
  }

  // No companies found
  if (!loading && companies.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Companies Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search criteria or filters to find companies.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ pb: 8 }}>
      {/* Error banner for partial failures */}
      {error && companies.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Some company data may be incomplete due to API issues: {error}
          </Typography>
        </Alert>
      )}

      {/* Pagination Controls - Top */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="body1" color="text.secondary">
          Showing {startIndex + 1}-{Math.min(endIndex, companies.length)} of {companies.length} companies
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Per Page</InputLabel>
            <Select
              value={itemsPerPage}
              label="Per Page"
              onChange={handleItemsPerPageChange}
            >
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="small"
            />
          )}
        </Box>
      </Box>

      {/* Company Grid */}
      <Stack spacing={2}>
        {currentCompanies.map((company) => (
          <CompanyListRow
            key={company.company}
            company={company}
            onClick={onCompanyClick}
            selected={selectedCompanies.includes(company.company)}
            onSelect={handleSelectCompany}
          />
        ))}
      </Stack>

      {/* Pagination Controls - Bottom */}
      {totalPages > 1 && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 4
        }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Floating Compare Bar */}
      <Slide direction="up" in={selectedCompanies.length > 0} mountOnEnter unmountOnExit>
        <AppBar position="fixed" color="default" sx={{ top: 'auto', bottom: 0, borderTop: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 64, md: 80 } }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}>
                  {selectedCompanies.length}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Selected for comparison
                </Typography>
                <Button
                  size="small"
                  startIcon={<ClearAll />}
                  onClick={handleClearSelection}
                  sx={{ color: 'text.secondary' }}
                >
                  Clear
                </Button>
              </Stack>

              <Button
                variant="contained"
                size="large"
                startIcon={<CompareArrows />}
                disabled={selectedCompanies.length < 2}
                onClick={() => onCompare?.(selectedCompanies)}
                sx={{
                  px: 4,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)'
                }}
              >
                Compare ({selectedCompanies.length})
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
      </Slide>
    </Box>
  );
}
