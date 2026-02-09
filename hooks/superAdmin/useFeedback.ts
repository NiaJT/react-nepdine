// useFeedback.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import { Feedback } from "@/app/superadmin/feedbacks/page";
import toast from "react-hot-toast";

export const useGetFeedbacks = (page: number) => {
  return useQuery<Feedback[]>({
    queryKey: ["feedbacks", page],
    queryFn: async () => {
      const res = await axiosInstance.get(`/feedbacks`, {
        params: { page, limit: 10 }, // 👈 pass pagination params
      });
      return res.data;
    },
  });
};

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationKey: ["delete-feedback"],
    mutationFn: async (feedback_id: string) => {
      await axiosInstance.delete(`/feedbacks/${feedback_id}`);
    },
    onSuccess: () => {
      toast.success("Feedback deleted!");
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
    onError: () => toast.error("Failed to delete feedback"),
  });
};
