"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useCurrentUser() {
  const profile = useQuery(api.users.getMyProfile);
  return {
    profile,
    isLoading: profile === undefined,
    isAuthenticated: profile !== null && profile !== undefined,
    isAdmin: profile?.role === "admin",
    isTenant: profile?.role === "tenant",
    isLandlord: profile?.role === "landlord",
  };
}
