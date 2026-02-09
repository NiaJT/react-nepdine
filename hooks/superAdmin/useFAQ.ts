import { axiosInstance } from "@/lib/axios.instance";
import { useQuery } from "@tanstack/react-query";

export interface IFAQ {
  id: string;
  question: string;
  created_at: string;
}

// Hook for fetching FAQs
export const useGetFAQs = (page: number) => {
  return useQuery<IFAQ[]>({
    queryKey: ["faqs", page],
    queryFn: async () => {
      const res = await axiosInstance.get("/faqs", {
        params: { page, limit: 10 },
      });
      return res.data;
    },
  });
};
