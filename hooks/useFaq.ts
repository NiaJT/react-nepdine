import { axiosInstance } from "@/lib/axios.instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


export interface Faq {
  question: string;
  
}

// ✅ Add faq
export const useAddFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (faq : Faq) => {
      const res = await axiosInstance.post("/faqs", faq);
      return res.data;
    },
    onSuccess: () => {
      toast.success("FAQ created!");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
    onError: () => toast.error("Can only send 1 FAQ per day"),
  });
};
 