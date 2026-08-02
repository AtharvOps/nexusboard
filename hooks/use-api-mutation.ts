import { useState } from "react";
import { useMutation } from "convex/react";
import { FunctionReference } from "convex/server";

export const useApiMutation = (
  mutationFunction: FunctionReference<"mutation"> | unknown
) => {
  const [pending, setPending] = useState(false);

  const apiMutation = useMutation(
    mutationFunction as FunctionReference<"mutation">
  );

  const mutate = (payload: Record<string, unknown> | unknown) => {
    setPending(true);
    return apiMutation(payload as Record<string, unknown>)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => setPending(false));
  };

  return {
    mutate,
    pending,
  };
};