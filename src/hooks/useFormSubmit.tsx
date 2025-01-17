import { useState } from "react";

type ActionResponse<T, E = Record<string, string[]>> =
  | { message?: string; data?: T }
  | { errors: Partial<E> | { root: string[] } };

type UseSubmitFormParams<T, R, E = Record<string, string[]>> = {
  action: (formData: T) => Promise<ActionResponse<R, E>>;
  onSuccess?: (res: { data?: R; message?: string } | null) => void;
  onError?: (errors: Partial<E> | { root: string[] }) => void;
  setError?: (field: keyof E, error: { message: string }) => void;
  disableLoadingReset?: boolean;
};

export function useSubmitForm<T, R, E = Record<string, string[]>>({
  action,
  onSuccess,
  onError,
  setError,
  disableLoadingReset,
}: UseSubmitFormParams<T, R, E>) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ root: string[] } | Partial<E> | null>(
    null
  );
  const [response, setResponse] = useState<ActionResponse<R, E> | null>(null);

  const handleSubmit = async (values: T): Promise<void> => {
    setIsLoading(true);
    setErrors(null);
    setResponse(null);

    let result: ActionResponse<R, E> | null | undefined = null;

    try {
      result = await action(values);

      if (result && "errors" in result) {
        setErrors(result.errors);
        onError?.(result.errors);
        if (setError) {
          if (typeof result.errors === "object" && result.errors !== null) {
            for (const key in result.errors) {
              const k = key as keyof E;
              const errorMessages = (result.errors as E)[k];

              if (Array.isArray(errorMessages)) {
                const allMessages = errorMessages.join(", ");
                setError(k, { message: allMessages });
              } else {
                setError(k, { message: "Unknown error" });
              }
            }
          }
        }
        setIsLoading(false);
      } else {
        setResponse(result);
        onSuccess?.({ data: result.data, message: result.message });
      }
    } catch {
      const rootError = { root: ["An unexpected error occurred."] } as E;
      setErrors(rootError);

      if (setError) {
        setError("root" as keyof E, {
          message: "An unexpected error occurred.",
        });
      }

      setIsLoading(false);
    } finally {
      if (!disableLoadingReset) {
        setIsLoading(false);
      }
    }
  };

  return { handleSubmit, isLoading, errors, response, setIsLoading };
}
