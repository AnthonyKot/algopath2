import { Box, Typography, Button } from '@mui/material';
import { SentimentDissatisfied as EmptyIcon } from '@mui/icons-material';

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
}

/**
 * Reusable empty state component with illustration
 */
export function EmptyState({
    title,
    description,
    icon,
    action
}: EmptyStateProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                px: 4,
                textAlign: 'center',
            }}
        >
            {/* Illustration */}
            <Box
                sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                }}
            >
                {icon || (
                    <EmptyIcon
                        sx={{
                            fontSize: 48,
                            color: 'primary.main',
                            opacity: 0.7,
                        }}
                    />
                )}
            </Box>

            {/* Title */}
            <Typography
                variant="h5"
                component="h3"
                sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 600,
                    mb: 1,
                    color: 'text.primary',
                }}
            >
                {title}
            </Typography>

            {/* Description */}
            {description && (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        maxWidth: 400,
                        mb: action ? 3 : 0,
                    }}
                >
                    {description}
                </Typography>
            )}

            {/* Action Button */}
            {action && (
                <Button
                    variant="contained"
                    size="large"
                    onClick={action.onClick}
                    sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                    }}
                >
                    {action.label}
                </Button>
            )}
        </Box>
    );
}
