import type { CompanyLearningPath } from '../types/learningPath';

export const learningPaths: CompanyLearningPath[] = [
  {
    company: 'Google',
    icon: '🧠',
    level: 'L4',
    mission: 'Latency-aware SWE',
    summary: 'Blend graph search mastery with clean system design narratives for Search / Ads interview loops.',
    targetRole: 'Software Engineer',
    timelineWeeks: 8,
    focusTopics: ['Dynamic Programming', 'Graphs', 'Distributed Systems'],
    signalBoosters: [
      'Storytell big-O tradeoffs vs. cache budgets',
      'Name industry comparables for each system design'
    ],
    modules: [
      {
        id: 'google-core',
        title: 'Graph Precision Warmup',
        focus: 'Master weighted graph traversal patterns with pruning heuristics.',
        durationWeeks: 2,
        checkpoints: [
          'Derive bidirectional BFS complexity verbally',
          'Solve 3 shortest-path variations back-to-back'
        ],
        spotlightProblems: [
          'LeetCode 126 - Word Ladder II',
          'LeetCode 332 - Reconstruct Itinerary'
        ]
      },
      {
        id: 'google-systems',
        title: 'Throughput-led System Design',
        focus: 'Translate QPS targets to storage + caching budgets before diagramming.',
        durationWeeks: 3,
        checkpoints: [
          'Outline GFS-like replication in 5 sentences',
          'Defend a sharding strategy under product churn'
        ],
        spotlightProblems: [
          'Design: Nearby Place Discovery',
          'Design: Realtime Document Collaboration'
        ]
      },
      {
        id: 'google-mastery',
        title: 'Signal Rehearsal',
        focus: 'Simulate onsite pacing with alternating algo/system sessions.',
        durationWeeks: 3,
        checkpoints: [
          'Record a 45-minute mock with peer feedback',
          'Ship a typed summary of lessons learned'
        ],
        spotlightProblems: [
          'LeetCode 297 - Serialize and Deserialize Binary Tree',
          'LeetCode 410 - Split Array Largest Sum'
        ]
      }
    ]
  },
  {
    company: 'Meta',
    icon: '🎯',
    level: 'L5',
    mission: 'Product-surface SWE',
    summary: 'Bias for practical optimizations, data-informed stories, and collaboration under ambiguity.',
    targetRole: 'Software Engineer',
    timelineWeeks: 6,
    focusTopics: ['Greedy', 'Trees', 'Product Thinking'],
    signalBoosters: [
      'Discuss experimentation impact in stories',
      'Reference production constraints (feature flags, rollout)'
    ],
    modules: [
      {
        id: 'meta-handoff',
        title: 'Iteration Speed Fundamentals',
        focus: 'Sharpen pattern recognition for medium-to-hard coding prompts.',
        durationWeeks: 2,
        checkpoints: [
          'Solve 5 tree traversals emphasizing tradeoffs',
          'Practice one dry-run explanation daily'
        ],
        spotlightProblems: [
          'LeetCode 124 - Binary Tree Maximum Path Sum',
          'LeetCode 301 - Remove Invalid Parentheses'
        ]
      },
      {
        id: 'meta-system',
        title: 'Product-aware Architecture',
        focus: 'Connect system design choices to creator/ads surface metrics.',
        durationWeeks: 2,
        checkpoints: [
          'Map instrumentation plan for each proposed system',
          'Contrast online/offline processing paths'
        ],
        spotlightProblems: [
          'Design: Instagram Stories Analytics',
          'Design: Ad Ranking Cold Start'
        ]
      },
      {
        id: 'meta-story',
        title: 'Signal Repetition',
        focus: 'Mix behavioral STAR reps with code + design mocks for endurance.',
        durationWeeks: 2,
        checkpoints: [
          'Capture 3 leadership anecdotes tied to data',
          'Run a mock onsite rotation (90 minutes)'
        ],
        spotlightProblems: [
          'LeetCode 269 - Alien Dictionary',
          'LeetCode 560 - Subarray Sum Equals K'
        ]
      }
    ]
  },
  {
    company: 'Airbnb',
    icon: '🌉',
    level: 'Mixed',
    mission: 'Platform-minded SWE',
    summary: 'Highlight marketplace reasoning, data quality discipline, and sharp communication.',
    targetRole: 'Full-stack / Infrastructure',
    timelineWeeks: 5,
    focusTopics: ['Backtracking', 'Data Quality', 'Metrics'],
    signalBoosters: [
      'Frame decisions in terms of guest/host trust',
      'Mention rollout + experimentation safety nets'
    ],
    modules: [
      {
        id: 'airbnb-algos',
        title: 'Marketplace Algorithms',
        focus: 'Revise matching/search questions with pruning heuristics.',
        durationWeeks: 2,
        checkpoints: [
          'Practice labeling constraints before coding',
          'Summarize pruning decisions in final answer'
        ],
        spotlightProblems: [
          'LeetCode 51 - N-Queens',
          'LeetCode 212 - Word Search II'
        ]
      },
      {
        id: 'airbnb-quality',
        title: 'Signals & Observability',
        focus: 'Anchor system designs with data contracts and anomaly handling.',
        durationWeeks: 1,
        checkpoints: [
          'List SLOs per subsystem in each design',
          'Explain how you would detect silent failures'
        ],
        spotlightProblems: [
          'Design: Trust & Safety Review Queue'
        ]
      },
      {
        id: 'airbnb-delivery',
        title: 'Mock Loop Integration',
        focus: 'Alternate algo, design, behavior sessions to build pacing.',
        durationWeeks: 2,
        checkpoints: [
          'Schedule two peer mocks this week',
          'Write a retro after every session'
        ],
        spotlightProblems: [
          'LeetCode 295 - Find Median from Data Stream',
          'LeetCode 981 - Time Based Key-Value Store'
        ]
      }
    ]
  }
];
