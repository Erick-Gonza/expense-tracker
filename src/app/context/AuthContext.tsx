"use client";

interface Props {
  children: ReactNode;
}

interface Auth {
  user: any;
  googleSignIn: () => void;
  logOut: () => void;
}

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const AuthContext = createContext<Auth>(null!);

export const AuthContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<any | null>(null);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  const contextValue = { user, googleSignIn, logOut };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
