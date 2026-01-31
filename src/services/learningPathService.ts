import { learningPaths } from '../data/learningPaths';
import type { CompanyLearningPath } from '../types/learningPath';

export const learningPathService = {
  async getLearningPaths(): Promise<CompanyLearningPath[]> {
    return learningPaths;
  },
  async getLearningPath(company: string): Promise<CompanyLearningPath | undefined> {
    return learningPaths.find((path) => path.company === company);
  }
};
