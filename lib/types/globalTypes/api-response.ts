export interface ApiError {
  response: {
    status: number;
    data?: {
      message?: string;
      detail?: string;
    };
  };
}

export interface ApiSuccess {
  data: {
    message: string;
  };
}
function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as Record<string, unknown>).response === "object"
  );
}
export const getApiErrorMessage = (err: unknown): string => {
  if (isApiError(err)) {
    const data = err.response.data;
    return data?.message || data?.detail || "Something went wrong";
  }
  // fallback for non-API errors
  if (err instanceof Error) return err.message;
  return "Something went wrong";
};
