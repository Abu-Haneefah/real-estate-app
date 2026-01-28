import { Alert } from "react-native";
import { useEffect, useState, useCallback, useRef } from "react";

interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams?: P) => Promise<void>;
}

export const useAppwrite = <T, P extends Record<string, string | number>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  // We memoize fetchData so it doesn't change unless 'fn' changes
  const fetchData = useCallback(
    async (fetchParams: P) => {
      // Don't proceed if component is unmounted
      if (!mountedRef.current) return;

      setLoading(true);
      setError(null);

      try {
        const result = await fn(fetchParams);
        if (mountedRef.current) {
          setData(result);
        }
      } catch (err: unknown) {
        if (mountedRef.current) {
          const errorMessage =
            err instanceof Error ? err.message : "An unknown error occurred";
          setError(errorMessage);
          // Don't show alert for authentication errors
          if (
            !errorMessage.includes("Session") &&
            !errorMessage.includes("Unauthorized")
          ) {
            Alert.alert("Error", errorMessage);
          }
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [fn],
  );

  useEffect(() => {
    mountedRef.current = true;

    if (!skip) {
      fetchData(params);
    }

    return () => {
      mountedRef.current = false;
    };
  }, [skip, fetchData, params]);

  const refetch = async (newParams?: P) => {
    if (mountedRef.current) {
      await fetchData(newParams || params);
    }
  };

  return { data, loading, error, refetch };
};
