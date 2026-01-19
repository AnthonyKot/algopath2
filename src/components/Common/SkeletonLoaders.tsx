import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

/**
 * Skeleton for company cards during loading
 */
export function CardSkeleton() {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                    <Skeleton variant="text" width="60%" height={28} />
                </Box>

                {/* Metrics */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Skeleton variant="text" width="80%" height={40} sx={{ mx: 'auto' }} />
                        <Skeleton variant="text" width="60%" height={16} sx={{ mx: 'auto' }} />
                    </Box>
                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Skeleton variant="text" width="80%" height={40} sx={{ mx: 'auto' }} />
                        <Skeleton variant="text" width="60%" height={16} sx={{ mx: 'auto' }} />
                    </Box>
                </Box>

                {/* Difficulty bar */}
                <Skeleton variant="text" width="40%" height={16} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" height={16} sx={{ borderRadius: 2, mb: 2 }} />

                {/* Topics */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Skeleton variant="rounded" width={60} height={24} />
                    <Skeleton variant="rounded" width={80} height={24} />
                    <Skeleton variant="rounded" width={50} height={24} />
                </Box>
            </CardContent>
        </Card>
    );
}

/**
 * Grid of card skeletons
 */
export function CardSkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 3
        }}>
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </Box>
    );
}

/**
 * Skeleton for chart sections
 */
export function ChartSkeleton({ height = 300 }: { height?: number }) {
    return (
        <Card>
            <CardContent>
                <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
                <Skeleton
                    variant="rectangular"
                    height={height}
                    sx={{ borderRadius: 2 }}
                    animation="wave"
                />
            </CardContent>
        </Card>
    );
}

/**
 * Skeleton for table rows
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <Stack spacing={1}>
            {Array.from({ length: rows }).map((_, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'center', py: 1 }}>
                    <Skeleton variant="text" width="30%" height={24} />
                    <Skeleton variant="rounded" width={60} height={24} />
                    <Skeleton variant="text" width="20%" height={24} />
                    <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
                        <Skeleton variant="rounded" width={50} height={20} />
                        <Skeleton variant="rounded" width={70} height={20} />
                    </Box>
                </Box>
            ))}
        </Stack>
    );
}

/**
 * Skeleton for analytics overview cards
 */
export function AnalyticsCardsSkeleton() {
    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 3
        }}>
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                        <Skeleton variant="circular" width={40} height={40} sx={{ mx: 'auto', mb: 1 }} />
                        <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto' }} />
                        <Skeleton variant="text" width="80%" height={20} sx={{ mx: 'auto' }} />
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}
