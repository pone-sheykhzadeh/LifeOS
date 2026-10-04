export type TaskCategory = 'critical' | 'tech' | 'growth' | 'health';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priorityLabel: string;
  timeLabel: string;
  contextNote?: string;
  xp: number;
  completed: boolean;
  completedAt?: string;
  progressPercent?: number; // for tasks with micro-progress like Kubernetes 65%
  isEpic?: boolean; // epic quests on today dashboard
  icon?: string;
  tags?: string[];
  createdAt: string;
}

export interface Habit {
  id: string;
  title: string;
  category: TaskCategory;
  icon: string;
  targetCount: number;
  currentStreak: number;
  history: { [dateStr: string]: boolean }; // YYYY-MM-DD -> boolean
  color: string;
  reminderTime?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  roleTitle: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  streakDays: number;
  completedTasksCount: number;
  focusMinutesTotal: number;
  boostMultiplier: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  progress: number;
  maxProgress: number;
}

export interface FocusSession {
  id: string;
  durationMinutes: number;
  completedAt: string;
  xpEarned: number;
  taskTitle?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'achievement' | 'task' | 'streak' | 'system';
}

export type ActiveTab = 'today' | 'tasks' | 'habits' | 'smart';
