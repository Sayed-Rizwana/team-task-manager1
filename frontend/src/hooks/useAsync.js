import { useCallback, useState } from "react";
import toast from "react-hot-toast";

export const useAsync = (asyncFn, options = {}) => {
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        return await asyncFn(...args);
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.message ||
          options.fallbackMessage ||
          "Something went wrong.";
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [asyncFn, options.fallbackMessage]
  );

  return { execute, loading };
};
