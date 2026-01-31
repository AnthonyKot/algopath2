export interface LeaderboardEntry {
  id: string;
  name: string;
  streak: number;
  companyFocus: string;
  timezone: string;
  completion: number;
  pin?: string;
}

const DEFAULT_ENTRIES: LeaderboardEntry[] = [
  { id: '1', name: 'Rina', streak: 12, companyFocus: 'Google ML', timezone: 'NYC', completion: 86 },
  { id: '2', name: 'Akshay', streak: 9, companyFocus: 'Meta Infra', timezone: 'BLR', completion: 74 },
  { id: '3', name: 'Morgan', streak: 8, companyFocus: 'Airbnb Platform', timezone: 'SFO', completion: 69 },
  { id: '4', name: 'Leo', streak: 7, companyFocus: 'Stripe Risk', timezone: 'LDN', completion: 65 },
  { id: '5', name: 'Aya', streak: 6, companyFocus: 'Databricks Platform', timezone: 'TOK', completion: 61 }
];

let customEntries: LeaderboardEntry[] = [];

export const communityService = {
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return [...DEFAULT_ENTRIES, ...customEntries];
  },
  async submitEntry(entry: Omit<LeaderboardEntry, 'id'>): Promise<void> {
    const id = crypto.randomUUID();
    customEntries = [{ id, ...entry }, ...customEntries].slice(0, 10);
  }
};
