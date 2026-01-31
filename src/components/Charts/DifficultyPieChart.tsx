import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { TooltipProps } from 'recharts';
import type { LegendPayload } from 'recharts/types/component/Legend';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Box, Typography, useTheme } from '@mui/material';
import type { CompanyData } from '../../types/company';

interface DifficultyPieChartProps {
  company: CompanyData;
  size?: number;
  showLegend?: boolean;
}

interface DifficultyChartDatum {
  name: string;
  value: number;
  color: string;
}

export function DifficultyPieChart({ 
  company, 
  size = 300, 
  showLegend = true 
}: DifficultyPieChartProps) {
  const theme = useTheme();

  // Ensure difficulty distribution exists with default values
  const difficultyDistribution = company.difficultyDistribution || {
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
    UNKNOWN: 0
  };

  // Prepare data for the pie chart
  const data: DifficultyChartDatum[] = [
    {
      name: 'Easy',
      value: difficultyDistribution.EASY,
      color: theme.palette.success.main
    },
    {
      name: 'Medium',
      value: difficultyDistribution.MEDIUM,
      color: theme.palette.warning.main
    },
    {
      name: 'Hard',
      value: difficultyDistribution.HARD,
      color: theme.palette.error.main
    },
    {
      name: 'Unknown',
      value: difficultyDistribution.UNKNOWN,
      color: theme.palette.grey[500]
    }
  ].filter(item => item.value > 0); // Only show non-zero values

  const totalProblems = data.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    const tooltipDatum = payload?.[0];
    if (active && tooltipDatum && typeof tooltipDatum.value === 'number') {
      const percentage = totalProblems > 0 ? ((tooltipDatum.value / totalProblems) * 100).toFixed(1) : '0';
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            p: 1,
            boxShadow: 2
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {tooltipDatum.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tooltipDatum.value} problems ({percentage}%)
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (totalProblems === 0) {
    return (
      <Box 
        sx={{ 
          height: size, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No difficulty data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={showLegend ? 40 : 60}
            outerRadius={showLegend ? 80 : 100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value: string, entry?: LegendPayload) => (
                <span style={{ color: entry?.color }}>{value}</span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
