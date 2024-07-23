"use client";
import { useCallback, useEffect, useState } from "react";

interface SessionHook {
  sessionId: string | null;
  createSession: () => Promise<void>;
  endSession: () => Promise<void>;
  isLoading: boolean;
  user: any | null;
}

export const useSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      //   const {data : {user} , error : authError} = await supabase.auth.getUser();
      //   if(authError || !user) {
      //     return NextResponse.json({error : "Unauthorized"}, {status : 401})
      //   }

      // user가 있는 경우에 로직 실행
      const response = await fetch("/api/session");
      if (response.ok) {
        const data = await response.json();
        setSessionId(data.sessionId);
      } else {
        setSessionId(null);
      }
    } catch (error) {
      console.error("Error checking sessions", error);
      setSessionId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const createSession = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/session", {
        method: "POST"
      });
      if (response.ok) {
        await checkSession();
      } else {
        throw new Error("Failed to create session");
      }
    } catch (error) {
      console.error("Error creating session", error);
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/session", { method: "DELETE" });
      if (response.ok) {
        setSessionId(null);
      } else {
        throw new Error("Failed to end session");
      }
    } catch (error) {
      console.error("Error ending session", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { sessionId, createSession, endSession, isLoading };
};
