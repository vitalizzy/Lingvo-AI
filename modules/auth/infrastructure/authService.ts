import { User } from '../../../shared/types/types';

const STORAGE_KEY = 'lingvo_user_v1';

export const authService = {
  getUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  login: async (provider: 'google' | 'email', email?: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockUser: User = {
      id: crypto.randomUUID(),
      name: provider === 'google' ? 'Alex Rivera' : (email?.split('@')[0] || 'User'),
      email: email || 'alex.rivera@gmail.com',
      photoUrl: provider === 'google' ? 'https://picsum.photos/100/100' : undefined,
      preferredLanguage: 'es'
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    return mockUser;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  updateUser: (updates: Partial<User>) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      const newUser = { ...user, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      return newUser;
    }
    return null;
  }
};