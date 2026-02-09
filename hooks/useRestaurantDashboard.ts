import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";

interface MenuItem {
  menu_item_id: string;
  name: string;
  quantity: number;
}

interface BestSeller extends MenuItem {
  revenue: string;
}

interface SalesOverviewItem {
  day: string;
  total: string;
}

interface SalesOverview {
  last_30_days: SalesOverviewItem[];
  this_week: SalesOverviewItem[];
  last_week: SalesOverviewItem[];
  average_customers_last_30_days: number;
}

interface Heatmap {
  days: string[];
  hours: number[];
  matrix: number[][];
}

export interface DashboardData {
  menu_items_sold_today: MenuItem[];
  total_customers_today: number;
  earnings_today: string;
  sales_overview: SalesOverview;
  best_sellers: BestSeller[];
  heatmap: Heatmap;
}

export const useRestaurantDashboard = (restaurantId: string) => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard", restaurantId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/restaurants/${restaurantId}/dashboard`
      );
      return data;
    },
  });
};
