"use client";

interface UserCredentials {
  email?: string | undefined;
  password?: string | undefined;
}

import { useState } from "react";
import { UserAuth } from "./context/AuthContext";

export default function Home() {
  const [credentials, setCredentials] = useState<UserCredentials>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { user, googleSignIn, logOut } = UserAuth();

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCredentials({ ...credentials, [e.target.name]: value });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center sm:p-24 p-4">
      <section className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h2 className="text-center p-4 text-2xl md:text-4xl tracking-wider font-semibold">
          Login Form
        </h2>
        <form
          className="grid grid-cols-1 gap-3 text-black w-full md:w-1/2 items-center justify-center m-auto"
          onSubmit={handleSubmit}
        >
          <input
            className="col-span-3 p-3 border"
            type="text"
            name="email"
            placeholder="Enter email here."
            value={credentials?.email === undefined ? "" : credentials?.email}
            onChange={handleChange}
          />

          <div className="col-span-3 relative">
            <input
              className="w-full p-3 border"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password here."
              value={
                credentials?.password === undefined ? "" : credentials?.password
              }
              onChange={handleChange}
            />
            <input
              className="absolute bottom-[25%] right-2"
              onClick={handleShowPassword}
              type="button"
              value={showPassword ? "Hide" : "Show"}
            />
          </div>

          {!user ? (
            <>
              <button
                className="text-white bg-slate-900 hover:bg-slate-950 p-3 text-base md:text-xl col-span-3"
                type="submit"
                onClick={handleSignIn}
              >
                Sign In
              </button>
              <button
                className="text-white bg-slate-900 hover:bg-slate-950 p-3 text-base md:text-xl col-span-3"
                type="submit"
                onClick={handleSignIn}
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              className="text-white bg-slate-900 hover:bg-slate-950 p-3 text-base md:text-xl col-span-3"
              type="submit"
              onClick={handleSignOut}
            >
              Log out
            </button>
          )}
        </form>
      </section>
    </main>
  );
}
