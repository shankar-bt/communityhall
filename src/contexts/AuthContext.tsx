import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useApp } from "./AppContext";

export interface User {
  name: string;
  contact: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  otpSent: boolean;
  setOtpSent: (val: boolean) => void;
  loginCitizenSendOtp: (username: string, mobile: string, t: any) => Promise<boolean>;
  verifyCitizenOtp: (username: string, mobile: string, otp: string) => Promise<User>;
  loginOfficial: (username: string, password: string, t: any) => Promise<User>;
  registerSendOtp: (mobile: string, details: any, t: any) => Promise<boolean>;
  registerVerifyOtp: (otp: string, name: string, mobile: string) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, setUser } = useApp();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const isAuthenticated = !!user;

  const loginCitizenSendOtp = async (username: string, mobile: string, t: any): Promise<boolean> => {
    setIsLoggingIn(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setOtpSent(true);
        setIsLoggingIn(false);
        resolve(true);
      }, 600);
    });
  };

  const verifyCitizenOtp = async (username: string, mobile: string, otp: string): Promise<User> => {
    setIsLoggingIn(true);
    return new Promise((resolve, reject) => {
      if (!otp) {
        setIsLoggingIn(false);
        reject(new Error("Enter OTP"));
        return;
      }
      setTimeout(() => {
        const loggedInUser: User = { name: username, contact: mobile, role: "citizen" };
        setUser(loggedInUser);
        setIsLoggingIn(false);
        resolve(loggedInUser);
      }, 600);
    });
  };

  const loginOfficial = async (username: string, password: string, t: any): Promise<User> => {
    setIsLoggingIn(true);
    return new Promise((resolve, reject) => {
      if (!username || !password) {
        setIsLoggingIn(false);
        reject(new Error(t.requiredError));
        return;
      }
      setTimeout(() => {
        const loggedInUser: User = { name: username, contact: "N/A", role: "official" };
        setUser(loggedInUser);
        setIsLoggingIn(false);
        resolve(loggedInUser);
      }, 600);
    });
  };

  const registerSendOtp = async (mobile: string, details: any, t: any): Promise<boolean> => {
    setIsLoggingIn(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setOtpSent(true);
        setIsLoggingIn(false);
        resolve(true);
      }, 600);
    });
  };

  const registerVerifyOtp = async (otp: string, name: string, mobile: string): Promise<User> => {
    setIsLoggingIn(true);
    return new Promise((resolve, reject) => {
      if (!otp) {
        setIsLoggingIn(false);
        reject(new Error("Enter OTP"));
        return;
      }
      setTimeout(() => {
        const registeredUser: User = { name, contact: mobile, role: "citizen" };
        setUser(registeredUser);
        setIsLoggingIn(false);
        resolve(registeredUser);
      }, 600);
    });
  };

  const logout = () => {
    setUser(null);
    setOtpSent(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoggingIn,
        otpSent,
        setOtpSent,
        loginCitizenSendOtp,
        verifyCitizenOtp,
        loginOfficial,
        registerSendOtp,
        registerVerifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

