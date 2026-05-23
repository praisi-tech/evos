import { create } from 'zustand';
import { User, Event, Division, NotificationLog } from '@evos/shared-types';

interface AppState {
  user: User | null;
  activeEvent: Event | null;
  activeDivision: Division | null;
  notifications: NotificationLog[];
  
  // Actions
  setUser: (user: User | null) => void;
  setActiveEvent: (event: Event | null) => void;
  setActiveDivision: (division: Division | null) => void;
  setNotifications: (notifications: NotificationLog[]) => void;
  addNotification: (notification: NotificationLog) => void;
  markNotificationRead: (notificationId: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  activeEvent: null,
  activeDivision: null,
  notifications: [],

  setUser: (user) => set({ user }),
  setActiveEvent: (event) => set({ activeEvent: event, activeDivision: null }), // Clear division context when changing event
  setActiveDivision: (division) => set({ activeDivision: division }),
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) => 
    set((state) => ({ notifications: [notification, ...state.notifications] })),
  markNotificationRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
      ),
    })),
  logout: () => set({ user: null, activeEvent: null, activeDivision: null, notifications: [] }),
}));
