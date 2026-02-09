export interface ApiError {
  response: {
    status: number;
    data: {
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

export const getApiErrorMessage = (err: unknown): string => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const data = (err as ApiError).response.data;
    return data.message || data.detail || "Something went wrong";
  }
  return "Something went wrong";
};
