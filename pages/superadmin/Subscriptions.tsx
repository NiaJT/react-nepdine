"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash } from "lucide-react";
import {
  useAddSubscription,
  useDeleteSubscription,
  useGetSubscriptions,
  useUpdateSubscription,
} from "@/hooks/superAdmin/useSubscriptions";
import type { Subscription } from "@/hooks/superAdmin/useSubscriptions";
import { useGetFeatures } from "@/hooks/superAdmin/useFeatures";
import type { Feature } from "@/hooks/superAdmin/useFeatures";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialogue";

const subscriptionSchema = z.object({
  name: z.string().min(1, "Name is required").max(30),
  description: z.string().optional(),
  is_default: z.boolean(),
  features: z.array(z.string()).optional(), // store feature IDs
});

type SubscriptionForm = z.infer<typeof subscriptionSchema>;

export default function SubscriptionsPage() {
  const { data: subscriptions, isLoading } = useGetSubscriptions();
  const { data: features, isLoading: featuresLoading } = useGetFeatures();

  const addSubscription = useAddSubscription();
  const deleteSubscription = useDeleteSubscription();
  const updateSubscription = useUpdateSubscription();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);

  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<
    string | null
  >(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubscriptionForm>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      description: "",
      is_default: false,
      features: [],
    },
  });

  const onSubmit = (data: SubscriptionForm) => {
    const payload = {
      ...data,
      description: data.description ?? "",
      features:
        data.features?.map((featureId) => ({
          feature_id: featureId,
          enabled: true,
        })) || [],
    };

    if (editingSubscription) {
      updateSubscription.mutate({
        subscription_id: editingSubscription.id,
        subscription: payload,
      });
    } else {
      addSubscription.mutate(payload);
    }

    setDialogOpen(false);
    setEditingSubscription(null);
    reset();
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setValue("name", subscription.name);
    setValue("description", subscription.description || "");
    setValue("is_default", subscription.is_default);
    setValue("features", subscription.features?.map((f) => f.feature_id) || []);
    setDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setSubscriptionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (subscriptionToDelete) {
      deleteSubscription.mutate(subscriptionToDelete);
    }
    setDeleteDialogOpen(false);
    setSubscriptionToDelete(null);
  };

  if (isLoading || featuresLoading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscriptions</h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Subscription
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSubscription ? "Edit Subscription" : "Add Subscription"}
              </DialogTitle>
            </DialogHeader>

            <form className="grid gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Name</label>
                <Input {...register("name")} />
                {errors.name && (
                  <span className="text-red-500 text-xs">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Description</label>
                <Input {...register("description")} />
                {errors.description && (
                  <span className="text-red-500 text-xs">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Default</span>
                <Switch
                  checked={watch("is_default")}
                  onCheckedChange={(val: boolean) =>
                    setValue("is_default", val)
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Features</label>
                <select
                  multiple
                  className="border rounded-md p-2"
                  {...register("features")}
                >
                  {features?.map((feature: Feature) => (
                    <option key={feature.id} value={feature.id}>
                      {feature.name}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-gray-500">
                  (Hold Ctrl or Cmd to select multiple)
                </span>
              </div>

              <Button type="submit" className="mt-2 w-full">
                {editingSubscription
                  ? "Update Subscription"
                  : "Add Subscription"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ---------- Table ---------- */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {subscriptions?.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.description}</TableCell>
              <TableCell>{s.is_default ? "Yes" : "No"}</TableCell>
              <TableCell>{new Date(s.created_at).toLocaleString()}</TableCell>

              <TableCell className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(s)}
                  className="p-1 cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => confirmDelete(s.id)}
                  className="p-1 text-red-500 cursor-pointer"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ---------- Delete Confirmation Dialog ---------- */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        entityName="subscription"
      />
    </div>
  );
}
