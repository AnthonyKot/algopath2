import React from 'react';
import { motion } from 'framer-motion';
import { Card, type CardProps } from '@mui/material';

export const AnimatedCard = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
            <Card
                ref={ref}
                {...props}
                sx={{
                    // Ensure these don't conflict with themes, but reinforce the motion
                    ...props.sx
                }}
            >
                {props.children}
            </Card>
        </motion.div>
    );
});

AnimatedCard.displayName = 'AnimatedCard';
