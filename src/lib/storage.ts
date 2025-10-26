// Local storage utilities for the habit tracker

// Helper to get date string in local timezone (YYYY-MM-DD)
export const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  goal: number;
  color: string;
  createdAt: string;
  completions: { date: string; note?: string }[];
}

export interface ScreenTimeEntry {
  id: string;
  app: string;
  minutes: number;
  date: string;
}

export interface UserProfile {
  name: string;
  onboarded: boolean;
}

const STORAGE_KEYS = {
  USER: 'habitly_user',
  HABITS: 'habitly_habits',
  SCREEN_TIME: 'habitly_screen_time',
};

// User Profile
export const getUser = (): UserProfile | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const setUser = (user: UserProfile): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

// Habits
export const getHabits = (): Habit[] => {
  const data = localStorage.getItem(STORAGE_KEYS.HABITS);
  return data ? JSON.parse(data) : [];
};

export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
};

export const addHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'completions'>): Habit => {
  const habits = getHabits();
  const newHabit: Habit = {
    ...habit,
    id: Date.now().toString(),
    createdAt: getLocalDateString(),
    completions: [],
  };
  habits.push(newHabit);
  saveHabits(habits);
  return newHabit;
};

export const updateHabit = (id: string, updates: Partial<Habit>): void => {
  const habits = getHabits();
  const index = habits.findIndex(h => h.id === id);
  if (index !== -1) {
    habits[index] = { ...habits[index], ...updates };
    saveHabits(habits);
  }
};

export const deleteHabit = (id: string): void => {
  const habits = getHabits().filter(h => h.id !== id);
  saveHabits(habits);
};

export const toggleHabitCompletion = (habitId: string, date: string, note?: string): void => {
  const habits = getHabits();
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return;

  const existingIndex = habit.completions.findIndex(c => c.date === date);
  if (existingIndex !== -1) {
    habit.completions.splice(existingIndex, 1);
  } else {
    habit.completions.push({ date, note });
  }
  saveHabits(habits);
};

// Screen Time
export const getScreenTime = (): ScreenTimeEntry[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SCREEN_TIME);
  return data ? JSON.parse(data) : [];
};

export const saveScreenTime = (entries: ScreenTimeEntry[]): void => {
  localStorage.setItem(STORAGE_KEYS.SCREEN_TIME, JSON.stringify(entries));
};

export const addScreenTimeEntry = (entry: Omit<ScreenTimeEntry, 'id'>): void => {
  const entries = getScreenTime();
  const newEntry: ScreenTimeEntry = {
    ...entry,
    id: Date.now().toString(),
  };
  entries.push(newEntry);
  saveScreenTime(entries);
};

export const updateScreenTimeEntry = (id: string, updates: Partial<ScreenTimeEntry>): void => {
  const entries = getScreenTime();
  const index = entries.findIndex(e => e.id === id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updates };
    saveScreenTime(entries);
  }
};

export const deleteScreenTimeEntry = (id: string): void => {
  const entries = getScreenTime().filter(e => e.id !== id);
  saveScreenTime(entries);
};

// Analytics helpers
export const getHabitStreak = (habit: Habit): number => {
  if (habit.completions.length === 0) return 0;
  
  const sortedDates = habit.completions
    .map(c => new Date(c.date))
    .sort((a, b) => b.getTime() - a.getTime());
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedDates.length; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    checkDate.setHours(0, 0, 0, 0);
    
    const hasCompletion = sortedDates.some(d => {
      d.setHours(0, 0, 0, 0);
      return d.getTime() === checkDate.getTime();
    });
    
    if (hasCompletion) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const getCompletionRate = (habit: Habit, days: number = 30): number => {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  const completionsInPeriod = habit.completions.filter(c => {
    const completionDate = new Date(c.date);
    return completionDate >= startDate;
  }).length;
  
  return Math.round((completionsInPeriod / days) * 100);
};
