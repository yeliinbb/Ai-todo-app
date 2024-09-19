"use client";

import CustomToastContainer from "@/components/CustomToastContainer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useState } from "react";
import { SessionProvider } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity
          }
        }
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <CustomToastContainer />
        {children}
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default Providers;
