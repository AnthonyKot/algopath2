
import { useMemo } from 'react';
import { useUserProfile } from './useUserProfile';
import { studyPlanService } from '../services/studyPlanService';

export interface BadgeStatus {
    id: string;
    achieved: boolean;
    current: number;
    target: number;
}

export function useBadges() {
    const { profile } = useUserProfile();

    // Recalculate stats whenever profile/studyPlans change (not perfectly reactive, 
    // but good enough given local storage limitations).
    // Ideally, studyPlanService should emit events or use a context.
    // For now, we compute on render/mount.

    const stats = useMemo(() => {
        const allPlans = studyPlanService.getStudyPlans();

        let totalSolved = 0;
        let easySolved = 0;
        let mediumSolved = 0;
        let hardSolved = 0;
        let topics = new Set<string>();
        let streakDays = 0; // This requires date parsing logic

        allPlans.forEach(plan => {
            // Iterate progress of each plan?
            // Or just use the 'progress' object if it was updated?
            // studyPlanService.initializeProgress returns stats.
            // But updated stats are inside the schedule...

            // Let's iterate problems to be precise
            plan.schedule.forEach(session => {
                session.problems.forEach(p => {
                    if (p.status === 'completed') {
                        totalSolved++;
                        if (p.difficulty === 'EASY') easySolved++;
                        if (p.difficulty === 'MEDIUM') mediumSolved++;
                        if (p.difficulty === 'HARD') hardSolved++;
                        p.topics.forEach(t => topics.add(t));
                    }
                });
            });
        });

        return {
            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,
            topicsCompleted: 0, // Need precise logic for "Completed Topic"
            streakDays: profile?.pin ? 1 : 0 // Fake streak for now until we have real streak logic
        };
    }, [profile]); // Trigger re-calc if profile changes (login/logout)

    return stats;
}
