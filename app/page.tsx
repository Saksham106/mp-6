"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface UserInfo {
  login: string;
  name: string;
  avatar_url: string;
  email: string;
  github_profile: string;
}

const Main = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #e6fffa;
  transition: background 0.5s;
`;

const Heading = styled.h1`
  font-size: 3.5vw;
  font-weight: 800;
  margin-bottom: 4vh;
  color: #1e293b;
  text-shadow: 0 2vh 8vw #c7d2fe55;
`;

const SignInButton = styled.button`
  padding: 2vh 6vw;
  border-radius: 5vw;
  background: #24292f;
  color: #fff;
  font-weight: 700;
  font-size: 1.8vw;
  border: none;
  cursor: pointer;
  margin-bottom: 3vh;
  box-shadow: 0 0.4vh 1.6vw #64748b33;
`;

const Card = styled.div`
  margin-top: 3vh;
  padding: 3vh 3vw;
  border: 0.1vw solid #e0e7ff;
  border-radius: 2vw;
  background: #fff;
  min-width: 30vw;
  box-shadow: 0 0.8vh 4.8vw #64748b22;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardHeading = styled.h2`
  font-weight: 700;
  margin-bottom: 2vh;
  color: #1e293b;
  font-size: 2vw;
`;

const Avatar = styled.img`
  width: 6vw;
  height: 6vw;
  border-radius: 50%;
  margin-bottom: 2vh;
`;

const Info = styled.div`
  margin-bottom: 1vh;
  font-size: 1.1vw;
`;

const GithubLink = styled.a`
  color: #2563eb;
  text-decoration: underline;
`;

const SignOutButton = styled.button`
  margin-top: 2vh;
  padding: 1.2vh 4vw;
  border-radius: 5vw;
  background: #e53e3e;
  color: #fff;
  font-weight: 700;
  font-size: 1.1vw;
  border: none;
  display: block;
  box-shadow: 0 0.4vh 1.6vw #fca5a533;
`;

export default function Home() {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const login = params.get("login");
      const name = params.get("name");
      const avatar_url = params.get("avatar_url");
      const email = params.get("email");
      const github_profile = params.get("github_profile");
      if (login && name && avatar_url && email && github_profile) {
        setUser({ login, name, avatar_url, email, github_profile });
      }
    }
  }, []);

  const handleSignIn = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;
    const scope = "read:user user:email";
    if (!clientId || !redirectUri) {
      alert("GitHub OAuth environment variables are not set.");
      return;
    }
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}`;
    window.location.href = githubAuthUrl;
  };

  const handleSignOut = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  return (
    <Main>
      <Heading>CS391 OAuth App 🤖</Heading>
      {!user ? (
        <SignInButton onClick={handleSignIn}>Sign in with GitHub</SignInButton>
      ) : (
        <Card>
          <CardHeading>User Info</CardHeading>
          <Avatar src={user.avatar_url} alt="avatar" />
          <Info><strong>Name:</strong> {user.name}</Info>
          <Info><strong>Username:</strong> {user.login}</Info>
          <Info><strong>Email:</strong> {user.email}</Info>
          <Info style={{ marginBottom: "2vh" }}>
            <strong>GitHub:</strong> <GithubLink href={user.github_profile} target="_blank" rel="noopener noreferrer">{user.github_profile}</GithubLink>
          </Info>
          <SignOutButton onClick={handleSignOut}>Sign out</SignOutButton>
        </Card>
      )}
    </Main>
  );
}
