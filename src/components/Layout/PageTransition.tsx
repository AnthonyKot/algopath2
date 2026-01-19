import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
    children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ width: '100%', height: '100%' }}
        >
            {children}
        </motion.div>
    );
}

// Higher order component for staggering children
export const StaggerContainer = ({ children }: { children: React.ReactNode }) => (
    <motion.div
        initial="hidden"
        animate="show"
        variants={{
            hidden: { opacity: 0 },
            show: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.1
                }
            }
        }}
    >
        {children}
    </motion.div>
);
