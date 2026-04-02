import { createContext, useContext, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const QueryContext = createContext(queryClient);

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryContext value={queryClient}>{children}</QueryContext>
    </QueryClientProvider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useQueryClient() {
  return useContext(QueryContext);
}
