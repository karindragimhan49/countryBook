import { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    const savedTimestamp = localStorage.getItem('sessionTimestamp');
    if (savedUser && savedTimestamp && Date.now() - savedTimestamp < SESSION_TIMEOUT) {
      return { username: savedUser };
    }
    localStorage.removeItem('user');
    localStorage.removeItem('sessionTimestamp');
    return null;
    
  });

  const login = (username) => {
    localStorage.setItem('user', username);
    localStorage.setItem('sessionTimestamp', Date.now());
    setUser({ username });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('sessionTimestamp');
    setUser(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const savedTimestamp = localStorage.getItem('sessionTimestamp');
      if (savedTimestamp && Date.now() - savedTimestamp >= SESSION_TIMEOUT) {
        logout();
      }
    }, 1000); // Check every second
    return () => clearInterval(interval);
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
