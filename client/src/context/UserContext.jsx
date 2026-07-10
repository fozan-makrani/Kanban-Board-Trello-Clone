import { createContext, useContext, useState, useEffect } from 'react';

const MOCK_USERS = [
  { id: 'u1', name: 'Fozan Makrani', color: '#f97316' },
  { id: 'u2', name: 'Sara Khan', color: '#8b5cf6' },
  { id: 'u3', name: 'Dev Patel', color: '#10b981' },
  { id: 'u4', name: 'Maria Gomez', color: '#3b82f6' },
];

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kanban_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = MOCK_USERS.find((u) => u.id === parsed.id);
        if (match) return match;
      }
    } catch (err) {
      // Corrupted or invalid data in localStorage - fall back to default
      // instead of crashing the whole app.
      console.warn('Could not parse saved user, resetting:', err.message);
      localStorage.removeItem('kanban_current_user');
    }
    return MOCK_USERS[0];
  });

  useEffect(() => {
    localStorage.setItem('kanban_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchUser = (userId) => {
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (user) setCurrentUser(user);
  };

  return (
    <UserContext.Provider value={{ currentUser, switchUser, allUsers: MOCK_USERS }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};