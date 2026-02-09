import { axiosInstance } from "@/lib/axios.instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


export interface Feedback {
  full_name: string;
  email: string;
  description: string;
}

// ✅ Add feedback
export const useAddFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (feedback : Feedback) => {
      const res = await axiosInstance.post("/feedbacks", feedback);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Feedback created!");
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
    onError: () => toast.error("Failed to create feedback"),
  });
};
