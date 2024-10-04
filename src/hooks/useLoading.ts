import { useLoadingStore } from "@/store/loading.store";
import Router from "next/router";
import { useEffect } from "react";

export const useLoading = () => {
  const { setNowLoading } = useLoadingStore();

  useEffect(() => {
    const handleStart = (url: string) => {
      if (url.includes("/diary/diary-detail/")) {
        setNowLoading(true);
      }
    };
    const handleComplete = () => setNowLoading(false);

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleComplete);
    Router.events.on("routeChangeError", handleComplete);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleComplete);
      Router.events.off("routeChangeError", handleComplete);
    };
  }, [setNowLoading]);
};
