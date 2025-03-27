import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  token: string;
  userid: number | null;
  login: (newToken: string, newUserid: number, remember?: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // 从本地存储初始化认证状态
  const [token, setToken] = useState<string>(() => localStorage.getItem('token') || '');
  const [userid, setUserid] = useState<number | null>(() => {
    const storedUserid = localStorage.getItem('userid');
    return storedUserid ? parseInt(storedUserid) : null;
  });
  
  const loginHandler = (newToken: string, newUserid: number, remember: boolean = false) => {
    setToken(newToken);
    setUserid(newUserid);
    
    // 只有当remember为true时才存储到localStorage
    if (remember) {
      localStorage.setItem('token', newToken);
      localStorage.setItem('userid', newUserid.toString());
    } else {
      // 如果不记住密码，则移除之前可能存在的存储
      localStorage.removeItem('token');
      localStorage.removeItem('userid');
    }
  };
  
  const logoutHandler = () => {
    setToken('');
    setUserid(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
  };
  
  return (
    <AuthContext.Provider 
      value={{
        token,
        userid,
        login: loginHandler,
        logout: logoutHandler,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
