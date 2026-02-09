"use client";

import { useState } from "react";
import { useForm, Path, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Utensils, UserPlus } from "lucide-react";
import Image from "next/image";
import { uploadToCloudinary } from "@/components/shared/UploadToCloudinary";
import { z } from "zod";
import {
  CreateRestaurantPayload,
  useCreateRestaurant,
} from "@/hooks/auth/useCreateRestaurant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldError } from "react-hook-form";

// ------------------- ZOD SCHEMA -------------------
const userSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["waiter", "cook", "admin", "manager"], "Role is required"),
  contact: z.string().regex(/^\d{10}$/, "Contact must be exactly 10 digits"),
});

const restaurantSchema = z.object({
  restaurant_name: z.string().min(1, "Restaurant name is required"),
  contact_name: z.string().min(1, "Contact name is required"),
  contact_phone: z
    .string()
    .regex(/^\d{6}$|^\d{10}$/, "Contact phone must be 6 or 10 digits"),
  location: z.string().min(1, "Location is required"),
  website_url: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/\S+$/.test(val),
      "Invalid website URL"
    ),

  notes: z.string().optional(),
  restaurant_image: z
    .any()
    .refine(
      (file) => file instanceof FileList && file.length === 1,
      "Please upload exactly one image"
    ),

  addUser: z.boolean(),
  additional_user: userSchema.optional(),
});

type FormValues = z.infer<typeof restaurantSchema>;

const ErrorMessage = ({ error }: { error?: FieldError }) => {
  if (!error) return null;
  return <p className="text-red-500 text-sm">{error.message}</p>;
};

export default function CreateRestaurantPage() {
  const [addUser, setAddUser] = useState(false);
  const router = useRouter();
  const { mutateAsync: createRestaurant, isPending } = useCreateRestaurant();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: { addUser: false },
  });
  const [isUploading, setIsUploading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsUploading(true); // disable button immediately

      let imageUrl: string | undefined;
      if (values.restaurant_image && values.restaurant_image.length > 0) {
        imageUrl = await uploadToCloudinary(values.restaurant_image[0]);
      }

      const payload: CreateRestaurantPayload = {
        restaurant_name: values.restaurant_name,
        contact_name: values.contact_name,
        contact_phone: values.contact_phone,
        location: values.location,
        website_url: values.website_url || "",
        restaurant_image_url: imageUrl,
        social_links: {},
        notes: values.notes,
        additional_user: addUser ? values.additional_user : undefined,
      };

      await createRestaurant(payload);
      toast.success(
        "Your restaurant application has been submitted successfully!"
      );
      reset();
      router.push("/restaurants");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create restaurant");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center w-full items-center bg-gradient-to-br from-[#fff9f6] via-[#fff4f4] to-[#ffe8e8] px-4 py-10">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#EA454C] font-medium bg-white border border-[#fcd6ca] px-3 py-1.5 rounded-full shadow-sm hover:bg-[#fff0ec] hover:shadow-md transition-all duration-200"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 md:p-10 space-y-6 border border-[#ffe1d4]">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-3xl font-bold">
            <Image
              src="/nepdineLogo.png"
              width={40}
              height={40}
              alt="nepdine logo"
            />
            <h1>
              <span className="text-[#FB8A22]">Nep</span>
              <span className="text-[#EA454C]">Dine</span>
            </h1>
          </div>
          <p className="text-gray-600 text-sm md:text-base">
            Start your restaurant with{" "}
            <span className="font-semibold text-[#FB8A22]">NepDine</span> —
            we’ll handle the rest.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Restaurant Details */}
          <section>
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <Utensils className="text-[#FB8A22]" /> Restaurant Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-3">
              {/* Restaurant Name */}
              <div>
                <Label>Restaurant Name</Label>
                <Input
                  {...register("restaurant_name")}
                  placeholder="Restaurant name"
                />
                <ErrorMessage error={errors.restaurant_name} />
              </div>

              {/* Contact Name */}
              <div>
                <Label>Contact Name</Label>
                <Input
                  {...register("contact_name")}
                  placeholder="Contact name"
                />
                <ErrorMessage error={errors.contact_name} />
              </div>

              {/* Contact Phone */}
              <div>
                <Label>Contact Phone</Label>
                <Input {...register("contact_phone")} placeholder="Phone" />
                <ErrorMessage error={errors.contact_phone} />
              </div>

              {/* Location */}
              <div>
                <Label>Location</Label>
                <Input {...register("location")} placeholder="Location" />
                <ErrorMessage error={errors.location} />
              </div>

              {/* Website URL */}
              <div className="sm:col-span-2">
                <Label>Website URL</Label>
                <Input
                  {...register("website_url")}
                  placeholder="https://example.com"
                />
                <ErrorMessage error={errors.website_url} />
              </div>

              {/* Notes */}
              <div className="sm:col-span-2">
                <Label>Notes</Label>
                <Input {...register("notes")} placeholder="Additional notes" />
              </div>

              {/* Image */}
              <div className="sm:col-span-2">
                <Label>Restaurant Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  {...register("restaurant_image")}
                />
                <ErrorMessage
                  error={errors.restaurant_image as FieldError | undefined}
                />
              </div>
            </div>
          </section>

          {/* Additional User */}
          <section className="pt-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={addUser}
                onChange={() => setAddUser(!addUser)}
                className="accent-[#FB8A22]"
              />
              Add a user for this restaurant
            </label>

            {addUser && (
              <div className="mt-3 border border-gray-200 rounded-lg p-4 bg-[#fffdf9]">
                <h3 className="text-md font-semibold flex items-center gap-2 text-gray-800 mb-3">
                  <UserPlus className="text-[#EA454C]" /> User Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Full Name, Email, Password */}
                  {["full_name", "email", "password", "contact"].map(
                    (field) => (
                      <div key={field}>
                        <Label>{field.replace("_", " ").toUpperCase()}</Label>
                        <Input
                          {...register(
                            `additional_user.${field}` as Path<FormValues>
                          )}
                          placeholder={field}
                          type={field === "password" ? "password" : "text"}
                        />
                        <ErrorMessage
                          error={
                            errors.additional_user?.[
                              field as keyof typeof errors.additional_user
                            ] as FieldError | undefined
                          }
                        />
                      </div>
                    )
                  )}

                  {/* Role Dropdown */}
                  <div>
                    <Label>Role</Label>
                    <Controller
                      control={control}
                      name="additional_user.role"
                      render={({ field }) => (
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {["waiter", "cook", "admin", "manager"].map(
                              (role) => (
                                <SelectItem key={role} value={role}>
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <ErrorMessage
                      error={
                        errors.additional_user?.role as FieldError | undefined
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Submit */}
          <div className="pt-4 text-center">
            <Button
              type="submit"
              disabled={isPending || isUploading}
              className="w-full bg-gradient-to-r from-[#FB8A22] to-[#EA454C] text-white font-semibold py-2 rounded-lg shadow-md hover:scale-[1.02] transition-transform"
            >
              {isPending || isUploading ? "Uploading..." : "Create Restaurant"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
