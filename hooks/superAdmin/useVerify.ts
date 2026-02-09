import { axiosInstance } from "@/lib/axios.instance";
import { getApiErrorMessage } from "@/lib/types/globalTypes/api-response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
export interface IApplication {
  id: string;
  status: string;
  restaurant_name: string;
  submitted_at: string;
  restaurant_image_url: string;
}
export const useGetApplications = () => {
  return useQuery<IApplication[]>({
    queryKey: ["Applications"],
    queryFn: async () => {
      const res = await axiosInstance.get("/register/applications");
      return res.data;
    },
  });
};
export const useVerifyApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["verify"],
    mutationFn: async (id: string) => {
      const res = await axiosInstance.post(
        `/register/applications/${id}/review`,
        {
          approve: true,
          notes: "Reviewed Account successfully",
        }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Reviewed Successfully");
      queryClient.invalidateQueries({ queryKey: ["Applications"] });
    },
    onError: (res) => {
      toast.error(getApiErrorMessage(res));
    },
  });
};
