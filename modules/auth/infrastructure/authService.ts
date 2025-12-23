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

    // Generate a more random name for testing multiple users
    const randomNames = ['Alex Rivera', 'Sam Smith', 'Jordan Lee', 'Casey Jones'];
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];

    const mockUser: User = {
      id: crypto.randomUUID(),
      name: provider === 'google' ? randomName : (email?.split('@')[0] || 'User'),
      email: email || `${randomName.toLowerCase().replace(' ', '.')}@gmail.com`,
      photoUrl: provider === 'google' ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}` : undefined,
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