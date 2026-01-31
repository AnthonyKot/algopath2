import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Box, Typography, Paper } from '@mui/material';
import type { AcceptanceVsDifficultyData } from '../../types/analytics';

interface AcceptanceVsDifficultyChartProps {
  data: AcceptanceVsDifficultyData[];
  title?: string;
  height?: number;
}

const DIFFICULTY_COLORS = {
  'EASY': '#4CAF50',
  'MEDIUM': '#FF9800',
  'HARD': '#F44336',
  'UNKNOWN': '#9E9E9E'
};

const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  const dataPoint = payload?.[0]?.payload as AcceptanceVsDifficultyData | undefined;
  if (active && dataPoint) {
    return (
      <Paper sx={{ p: 2, maxWidth: 350 }}>
        <Typography variant="subtitle2" gutterBottom>
          {dataPoint.title}
        </Typography>
        <Typography variant="body2">
          Acceptance Rate: {(dataPoint.acceptanceRate * 100).toFixed(1)}%
        </Typography>
        <Typography variant="body2">
          Perceived Difficulty: {dataPoint.perceivedDifficulty}/3
        </Typography>
        <Typography variant="body2">
          Actual Difficulty: {dataPoint.actualDifficulty.toFixed(2)}/3
        </Typography>
        <Typography variant="body2">
          Originality Score: {(dataPoint.originalityScore * 100).toFixed(1)}%
        </Typography>
        <Typography variant="body2">
          Total Votes: {dataPoint.totalVotes.toLocaleString()}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
          {dataPoint.acceptanceRate > (4 - dataPoint.perceivedDifficulty) / 3 
            ? "Easier than expected" 
            : "Harder than expected"}
        </Typography>
      </Paper>
    );
  }
  return null;
};

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: AcceptanceVsDifficultyData;
}

const CustomDot = ({ cx = 0, cy = 0, payload }: CustomDotProps) => {
  const color = payload ? DIFFICULTY_COLORS[payload.category as keyof typeof DIFFICULTY_COLORS] : '#9E9E9E';
  const size = payload ? Math.max(4, Math.min(12, payload.originalityScore * 15)) : 4;
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={size} 
      fill={color} 
      fillOpacity={0.7}
      stroke={color}
      strokeWidth={1}
    />
  );
};

export const AcceptanceVsDifficultyChart: React.FC<AcceptanceVsDifficultyChartProps> = ({
  data,
  title = "Acceptance Rate vs Perceived Difficulty",
  height = 500
}) => {
  // Group data by difficulty category for legend
  const difficultyGroups = Object.keys(DIFFICULTY_COLORS).map(difficulty => ({
    difficulty,
    color: DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS],
    data: data.filter(d => d.category === difficulty)
  })).filter(group => group.data.length > 0);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Points above the diagonal line are easier than their difficulty suggests. 
        Bubble size represents originality score.
      </Typography>
      
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="perceivedDifficulty"
            domain={[0.5, 3.5]}
            ticks={[1, 2, 3]}
            tickFormatter={(value) => {
              const labels = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
              return labels[value as keyof typeof labels] || value.toString();
            }}
            label={{ value: 'Perceived Difficulty', position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            type="number" 
            dataKey="acceptanceRate"
            domain={[0, 1]}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            label={{ value: 'Acceptance Rate', angle: -90, position: 'insideLeft' }}
          />
          
          {/* Reference line showing expected difficulty correlation */}
          <ReferenceLine 
            segment={[{ x: 1, y: 0.8 }, { x: 3, y: 0.2 }]}
            stroke="#666"
            strokeDasharray="5 5"
            label={{ value: "Expected correlation", position: "top" }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {difficultyGroups.map(({ difficulty, color, data: groupData }) => (
            <Scatter
              key={difficulty}
              name={difficulty}
              data={groupData}
              fill={color}
              shape={<CustomDot />}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          <strong>Interpretation:</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          • Points above the line: Problems easier than their difficulty rating suggests
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          • Points below the line: Problems harder than their difficulty rating suggests
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          • Larger bubbles: Higher community originality scores (better problems)
        </Typography>
      </Box>
    </Box>
  );
};

export default AcceptanceVsDifficultyChart;
