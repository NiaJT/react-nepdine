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
  useAddFeature,
  useDeleteFeature,
  useGetFeatures,
  useUpdateFeature,
} from "@/hooks/superAdmin/useFeatures";
import type { Feature } from "@/hooks/superAdmin/useFeatures";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// --------------- Zod Schema ----------------
const featureSchema = z.object({
  key: z.string().min(1, "Key is required"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(15, "Name must be at most 15 characters"),
  description: z.string().optional(),
  default_enabled: z.boolean(),
});

type FeatureForm = z.infer<typeof featureSchema>;

export default function FeaturesPage() {
  const { data: features, isLoading } = useGetFeatures();

  const addFeature = useAddFeature();
  const deleteFeature = useDeleteFeature();
  const updateFeature = useUpdateFeature();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FeatureForm>({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      key: "",
      name: "",
      description: "",
      default_enabled: false,
    },
  });

  const onSubmit = (data: FeatureForm) => {
    if (editingFeature) {
      updateFeature.mutate({
        feature_id: editingFeature.id,
        feature: data,
      });
    } else {
      addFeature.mutate(data);
    }
    setDialogOpen(false);
    setEditingFeature(null);
    reset();
  };
  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature);
    setValue("key", feature.key);
    setValue("name", feature.name);
    setValue("description", feature.description);
    setValue("default_enabled", feature.default_enabled);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteFeature.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Features</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Feature
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingFeature ? "Edit Feature" : "Add Feature"}
              </DialogTitle>
            </DialogHeader>

            <form className="grid gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Key</label>
                <Input {...register("key")} />
                {errors.key && (
                  <span className="text-red-500 text-xs">
                    {errors.key.message}
                  </span>
                )}
              </div>

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
                <span className="text-sm font-medium">Default Enabled</span>
                <Switch
                  checked={watch("default_enabled")}
                  onCheckedChange={(val: boolean) =>
                    setValue("default_enabled", val)
                  }
                />
              </div>

              <Button type="submit" className="mt-2 w-full">
                {editingFeature ? "Update Feature" : "Add Feature"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Default Enabled</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features?.map((f) => (
            <TableRow key={f.id}>
              <TableCell>{f.key}</TableCell>
              <TableCell>{f.name}</TableCell>
              <TableCell>{f.description}</TableCell>
              <TableCell>{f.default_enabled ? "Yes" : "No"}</TableCell>
              <TableCell>{new Date(f.created_at).toLocaleString()}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(f)}
                  className="p-1"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(f.id)}
                  className="p-1 text-red-500"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
