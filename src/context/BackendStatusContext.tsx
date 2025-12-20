import React, { createContext, useContext, useEffect, useState } from "react";
import { pingBackend } from "@/services/auth-endpoints";
import ServiceUnavailable from "@/pages/ServiceUnavailable";

type Status = "loading" | "available" | "unavailable";

interface BackendStatusContextType {
  status: Status;
  checkStatus: () => Promise<void>;
}

const BackendStatusContext = createContext<
  BackendStatusContextType | undefined
>(undefined);

export function BackendStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<Status>("loading");

  const checkStatus = async () => {
    // Only set loading if we are already in an unavailable state or initial load?
    // User requested "freeze" (null return) instead of spinner, so state change to loading allows that.
    setStatus("loading");
    const isAvailable = await pingBackend();
    setStatus(isAvailable ? "available" : "unavailable");
  };

  useEffect(() => {
    checkStatus();
  }, []);

  if (status === "loading") {
    // User requested "freezing" - returning null renders nothing.
    return null;
  }

  if (status === "unavailable") {
    return <ServiceUnavailable />;
  }

  return (
    <BackendStatusContext.Provider value={{ status, checkStatus }}>
      {children}
    </BackendStatusContext.Provider>
  );
}

export function useBackendStatus() {
  const context = useContext(BackendStatusContext);
  if (context === undefined) {
    throw new Error(
      "useBackendStatus must be used within a BackendStatusProvider"
    );
  }
  return context;
}
