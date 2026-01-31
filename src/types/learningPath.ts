export interface LearningPathModule {
  id: string;
  title: string;
  focus: string;
  durationWeeks: number;
  checkpoints: string[];
  spotlightProblems: string[];
}

export interface CompanyLearningPath {
  company: string;
  icon: string;
  level: 'L4' | 'L5' | 'Staff' | 'Mixed';
  mission: string;
  summary: string;
  targetRole: string;
  timelineWeeks: number;
  focusTopics: string[];
  signalBoosters: string[];
  modules: LearningPathModule[];
}
