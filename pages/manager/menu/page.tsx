"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import z, { ZodError } from "zod";
import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import axios from "axios";
import { menuSchema } from "../../../../../validation-schema/menuSchema";
import {
  MenuIngredientFormValues,
  menuIngredientsSchema,
} from "../../../../../validation-schema/menuIngredientsSchema";
import MainMenuPageSkeleton from "@/components/LoadingPages/MainMenuLoad";

type MenuFormValues = z.infer<typeof menuSchema>;

const menuResolver: Resolver<MenuFormValues> = async (values) => {
  try {
    menuSchema.parse(values);

    menuIngredientsSchema.array().parse(values.ingredients || []);

    return { values, errors: {} };
  } catch (err) {
    if (err instanceof ZodError) {
      const fieldErrors = err.flatten().fieldErrors;
      return { values: {} as MenuFormValues, errors: fieldErrors };
    }
    return { values: {} as MenuFormValues, errors: {} };
  }
};

export default function MenuPage() {
  const categories = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Drinks",
    "Desert",
    "Salad",
  ];
  const [selecteditem, setSelected] = useState<MenuFormValues | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("restaurant_id");
    setRestaurantId(id);
  }, []);

  const {
    data: menu = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["menu", restaurantId],
    enabled: !!restaurantId,
    queryFn: async () => {
      const res = await axiosInstance.get(`/restaurants/${restaurantId}/menu`);
      return res.data;
    },
  });

  // In your main onSubmit function for adding menu items
  const { mutateAsync: addMenuItem } = useMutation({
    mutationKey: ["AddMenuItem", restaurantId],
    mutationFn: async (values: MenuFormValues) => {
      if (!restaurantId) throw new Error("Restaurant ID not found");

      const payload = {
        ...values,
        restaurant_id: restaurantId,
        // Don't send ingredients with frontend-generated IDs
        ingredients:
          values.ingredients?.map((ing) => ({
            name: ing.name,
            default_included: ing.default_included,
            // Let backend generate the ID
          })) || [],
      };

      const res = await axiosInstance.post(
        `/restaurants/${restaurantId}/menu`,
        payload
      );
      return res.data;
    },
    onSuccess: () => refetch(),
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Pagination logic
  const filteredMenu = menu.filter((m: MenuFormValues) => {
    const matchesCategory = !filterCategory || m.category === filterCategory;
    const matchesSearch =
      !searchTerm || m.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredMenu.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  if (isLoading) {
    return <MainMenuPageSkeleton />;
  }
  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-5">
      {" "}
      <h1 className="text-xl text-center sm:text-left sm:text-3xl font-bold text-zinc-900 mb-4">
        MENU
        <span className="text-[#FB8A22] text-xl sm:text-3xl font-bold">
          {" "}
          SECTION
        </span>
      </h1>
      <div className="grid sm:gap-6 xl:gap-50 md:grid-cols-2 relative">
        <div
          className="hidden md:block
    absolute 
    -top-20 right-2 w-50 h-50      /* small top-right for mobile */
    sm:w-20 sm:h-20              /* slightly bigger for small screens */
    md:top-1/2 md:-right-10 md:-translate-y-1/2 md:w-[350px] md:h-auto
    lg:w-[500px]                 /* larger for big screens */
  "
        >
          <Image
            src="/icons/menu_image.svg"
            alt="Menu Illustration"
            width={500}
            height={150}
            className="object-contain w-full h-full"
          />
        </div>

        <Card className="w-full mx-auto border-0 bg-white shadow-md shadow-black/45 rounded-xl sm:rounded-2xl">
          <CardHeader className="px-3 py-1 sm:px-6 sm:py-1">
            <CardTitle className="text-amber-500 text-base sm:text-xl font-medium">
              Add Menu Item
            </CardTitle>
          </CardHeader>

          <CardContent className="px-3  sm:px-6 ">
            <AddMenuForm
              category={formCategory}
              setCategory={setFormCategory}
              categories={categories}
              onSubmit={async (values) => {
                if (!values.name?.trim()) {
                  toast.error("Name cannot be empty!");
                  return;
                }

                const price = Number(values.price);
                if (!price || price <= 0) {
                  toast.error("Price must be greater than 0!");
                  return;
                }

                // Validate category
                if (!values.category?.trim()) {
                  toast.error("Category cannot be empty!");
                  return;
                }

                // Validate restaurant selection
                if (!restaurantId) {
                  toast.error("Please select a restaurant first!");
                  return;
                }

                console.log("restaurantId:", restaurantId);
                console.log("POST values:", values);

                try {
                  await addMenuItem(values);
                  toast.success("Menu item added successfully!");
                } catch (err: unknown) {
                  if (axios.isAxiosError(err)) {
                    console.error(
                      "Add menu item error:",
                      err.response?.data || err.message
                    );
                    toast.error(
                      err.response?.data?.message || "Failed to add menu item"
                    );
                  } else {
                    console.error("Unexpected error:", err);
                    toast.error("Failed to add menu item");
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
      <Card className="border-0 shadow-none bg-transparent">
        <div className="flex items-center w-full justify-start  gap-2">
          {/* Search box */}
          <div className="flex items-center w-[200px] sm:w-[250px] h-8 md:h-10 shadow rounded-md border px-2 bg-white gap-2">
            <button type="button">
              <Icon
                icon="mdi:magnify"
                className=" h-3 w-3 md:w-5 md:h-5 text-[#6A6C6E] transform scale-x-[-1]"
              />
            </button>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 h-full outline-none bg-transparent text-xs sm:text-sm"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-between w-[90px] h-8 px-2 rounded-md bg-white shadow hover:bg-gray-100 transition sm:w-[200px] sm:h-10 sm:px-3">
                <Icon
                  icon="mingcute:dish-cover-line"
                  className="w-3 h-3 sm:w-5 sm:h-5 text-[#FB8A22]"
                />
                <span className="text-[10px] sm:text-sm text-gray-700 truncate">
                  {filterCategory || "All Dishes"}
                </span>
                <Icon
                  icon="mdi:keyboard-arrow-down"
                  className="w-2 h-2 sm:w-5 sm:h-5 text-gray-500"
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="bottom"
              align="end"
              className="z-50  bg-white/90 backdrop-blur-xs rounded-md text-[#616161] shadow-md cursor-pointer py-0 sm:py-1 px-0 sm:px-3"
            >
              <DropdownMenuItem
                onClick={() => setFilterCategory("")}
                className="mb-1 rounded hover-text-black text-[10px] sm:text-sm transition-colors py-1 px-2 sm:py-1 sm:px-3"
              >
                All Dishes
              </DropdownMenuItem>
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className="mb-1 rounded hover-text-black  text-[10px] sm:text-sm text-[#6A6C6E] transition-colors py-1 px-2 sm:py-1 sm:px-3 last:mb-0"
                >
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
            </DialogHeader>

            {selecteditem && (
              <AddMenuForm
                category={formCategory || selecteditem?.category || ""}
                setCategory={setFormCategory}
                categories={categories}
                mode="edit"
                selectedId={selecteditem.id}
                resolver={menuResolver}
                initialValues={{
                  ...selecteditem,
                  ingredients: selecteditem?.ingredients || [],
                }}
                onSubmit={async (values) => {
                  try {
                    // 1️⃣ Update main menu item
                    await axiosInstance.patch(
                      `/restaurants/${restaurantId}/menu/${selecteditem.id}`,
                      {
                        name: values.name,
                        price: values.price,
                        category: values.category,
                        active: values.active,
                        restaurant_id: restaurantId,
                      }
                    );

                    // 2️⃣ Get CURRENT ingredients from backend to compare accurately
                    const currentIngredientsRes = await axiosInstance.get(
                      `/restaurants/${restaurantId}/menu/${selecteditem.id}/ingredients`
                    );
                    const currentBackendIngredients =
                      currentIngredientsRes.data || [];

                    const formIngredients = values.ingredients || [];

                    // Identify ingredients to DELETE (exist in backend but not in form)
                    const toDelete = currentBackendIngredients.filter(
                      (backendIng: { id: string }) =>
                        !formIngredients.some(
                          (formIng) => formIng.id === backendIng.id
                        )
                    );

                    // Identify ingredients to ADD (exist in form but not in backend - or have empty IDs)
                    const toAdd = formIngredients.filter(
                      (formIng) =>
                        !formIng.id ||
                        formIng.id === "" ||
                        !currentBackendIngredients.some(
                          (backendIng: { id: string }) =>
                            backendIng.id === formIng.id
                        )
                    );

                    // 🟢 Add new ingredients
                    for (const newIng of toAdd) {
                      await axiosInstance.post(
                        `/restaurants/${restaurantId}/menu/${selecteditem.id}/ingredients`,
                        {
                          name: newIng.name,
                          default_included: newIng.default_included,
                          restaurant_id: restaurantId,
                          menu_item_id: selecteditem.id,
                        }
                      );
                    }

                    for (const delIng of toDelete) {
                      console.log(`🗑️ Deleting: ${delIng.name} (${delIng.id})`);
                      await axiosInstance.delete(
                        `/restaurants/${restaurantId}/menu/${selecteditem.id}/ingredients/${delIng.id}`
                      );
                    }

                    toast.success("Menu updated successfully");
                    refetch();
                    setIsEditOpen(false);
                  } catch (error: unknown) {
                    console.error("Update error:", error);
                    toast.error("Failed to update menu");
                  }
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Menu Item</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete &quot;{selecteditem?.name}&quot;?
            </p>

            <DialogFooter className="flex flex-row items-center justify-end gap-2 flex-nowrap">
              <Button
                variant="destructive"
                className="w-[5rem]  sm:w-auto"
                onClick={async () => {
                  try {
                    await axiosInstance.delete(
                      `/restaurants/${restaurantId}/menu/${selecteditem?.id}`
                    );
                    toast.success("Menu deleted successfully");
                    refetch();
                    setIsDeleteOpen(false);
                  } catch (error) {
                    toast.error("Failed to delete menu");
                    console.error(error);
                  }
                }}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                className="w-[5rem]  sm:w-auto"
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-10 gap-y-4">
          {currentItems.length > 0 ? (
            currentItems.map((m: MenuFormValues) => (
              <div
                key={m.id}
                className="relative flex flex-row items-stretch gap-2 rounded-xl border border-zinc-200/70
                 bg-white shadow-xl h-[90px] sm:h-[110px] md:h-[130px] lg:h-[100px] xl:h-[170px] overflow-hidden
                 w-[20vh]  sm:w-[25vh] lg:w-[35vh] xl:w-[45vh] 2xl:w-[40vh] "
              >
                {/* Image */}
                {m.image && m.image.startsWith("http") && (
                  <div className="relative h-full flex-shrink-0 rounded-l-lg overflow-hidden transition-all duration-300 w-[15vw] sm:w-[12vw] md:w-[10vw] lg:w-[9vw] ">
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {/* Content */}
                <div className="relative flex-1 flex flex-col justify-between p-1 sm:p-4">
                  <div
                    className={`absolute top-2 right-2 text-[10px] sm:text-sm font-medium rounded-full px-1 py-1 sm:px-3 sm:py-3 ${
                      m.active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {m.active ? "Available" : "Unavailable"}
                  </div>
                  <div className="flex items-start mt-auto gap-2  w-full ">
                    <div className="flex flex-col flex-1">
                      <div className="font-bold text-[#222222E3]/80 line-clamp-2 text-xs sm:text-sm md:text-2xl ">
                        {m.name}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs sm:text-xm md:text-base font-medium">
                          रु{Number(m.price).toFixed(2)}
                        </p>

                        <div className="flex gap-2">
                          <div
                            onClick={() => {
                              setSelected(m);
                              setIsEditOpen(true);
                            }}
                          >
                            <Icon
                              icon="ri:edit-2-line"
                              className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5"
                            />
                          </div>
                          <div
                            onClick={() => {
                              setSelected(m);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Icon
                              icon="weui:delete-filled"
                              className="text-red-500 w-4 h-4 sm:w-5 sm:h-5"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-sm sm:text-base py-10">
              No items found
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center mt-4 gap-1 sm:gap-2">
        {/* Prev Button */}
        <button
          className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-bold 
      ${
        currentPage === 1
          ? "bg-[#EEEEF0] text-black cursor-not-allowed"
          : "bg-[#EEEEF0] text-black hover:bg-gray-300"
      }`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          &lt;
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm font-medium cursor-pointer
        ${
          currentPage === i + 1
            ? "bg-[#FB8A22] text-white border border-orange-500"
            : "bg-[#EEEEF0] text-gray-700 hover:bg-orange-400 hover:text-white"
        }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-bold 
      ${
        currentPage === totalPages
          ? "bg-[#EEEEF0] text-black cursor-not-allowed"
          : "bg-[#EEEEF0] text-black hover:bg-gray-300"
      }`}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
function AddMenuForm({
  category,
  setCategory,
  categories,
  onSubmit,
  initialValues,
  mode = "add",
  resolver,
  selectedId,
}: {
  category: string;
  setCategory: (cat: string) => void;
  categories: string[];
  onSubmit: (values: MenuFormValues) => Promise<void>;
  initialValues?: Partial<MenuFormValues>;
  mode?: "add" | "edit";
  selectedId?: string;
  resolver?: Resolver<MenuFormValues>;
}) {
  const menuForm = useForm<MenuFormValues>({
    resolver: resolver || zodResolver(menuSchema),
    defaultValues: {
      id: "",
      name: "",
      price: "",
      category: initialValues?.category || "",
      image: initialValues?.image || "",
      ingredients: [],
      active: true,
      ...initialValues,
    },
  });
  const { fields, append, remove } = useFieldArray<MenuFormValues>({
    name: "ingredients",
    control: menuForm.control,
  });
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<MenuIngredientFormValues[]>(
    []
  );
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    reset,
  } = menuForm;
  const [, setVisibleErrors] = useState<{ [key: string]: string }>({});
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await axiosInstance.get("/ingredients/search", {
          params: { q: inputValue, limit: 10 },
        });
        setSuggestions(res.data); // ensure backend returns array of strings
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    }, 1000);

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [inputValue]);

  useEffect(() => {
    const id = localStorage.getItem("restaurant_id");
    setRestaurantId(id);
  }, []);

  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const newErrors: { [key: string]: string } = {};
      Object.keys(errors).forEach((key) => {
        const err = errors[key as keyof MenuFormValues];
        if (err?.message) toast.error(err.message, { duration: 3000 });
      });
      setVisibleErrors(newErrors);

      const timer = setTimeout(() => setVisibleErrors({}), 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Update your useMenuIngredients hook to log the response
  function useMenuIngredients(
    restaurantId: string | null,
    menu_item_id: string | null
  ) {
    return useQuery({
      queryKey: ["menu_ingredients", restaurantId, menu_item_id],
      enabled: !!restaurantId && !!menu_item_id,
      queryFn: async () => {
        if (!restaurantId || !menu_item_id) return [];

        console.log("🔍 Fetching ingredients from API...");
        const res = await axiosInstance.get(
          `/restaurants/${restaurantId}/menu/${menu_item_id}/ingredients`
        );

        console.log("📥 API Response:", res.data);
        return res.data;
      },
    });
  }

  const { data: menuIngredients = [] } = useMenuIngredients(
    restaurantId,
    initialValues?.id ?? null
  );

  // Add this debugging effect to see ALL data sources
  useEffect(() => {
    // Check if there are ID mismatches
    if (menuIngredients.length > 0 && fields.length > 0) {
      const backendIds = menuIngredients.map(
        (ing: MenuIngredientFormValues) => ing.id
      );
      const formIds = fields.map((field) => field.id);
      const missingInBackend = formIds.filter((id) => !backendIds.includes(id));

      console.log(
        "7. ID MISMATCHES - These IDs are in form but not in backend:",
        missingInBackend
      );
    }
    console.groupEnd();
  }, [menuIngredients, fields, initialValues, mode, selectedId, restaurantId]);

  useEffect(() => {
    console.log("🔍 DEBUG - Ingredient Data Sources:", {
      menuIngredientsFromAPI: menuIngredients,
      initialValuesIngredients: initialValues?.ingredients,
      currentFormIngredients: fields,
      mode: mode,
    });
  }, [menuIngredients, initialValues?.ingredients, fields, mode]);

  // Call this in your useEffect and handleRemove
  useEffect(() => {
    if (mode === "edit") {
      console.log("🔄 Loading edit form...");

      menuForm.reset({
        ...initialValues,
        id: initialValues?.id,
        name: initialValues?.name || "",
        price: initialValues?.price || "",
        category: initialValues?.category || "",
        image: initialValues?.image || "",
        active: initialValues?.active || false,
      });

      if (menuIngredients && menuIngredients.length > 0) {
        console.log("📥 Loading ingredients from BACKEND API");

        remove();

        menuIngredients.forEach((ingredient: MenuIngredientFormValues) => {
          if (ingredient.id && ingredient.id !== "") {
            append({
              id: ingredient.id,
              name: ingredient.name,
              default_included: ingredient.default_included ?? true,
            });
          }
        });
      } else {
        console.log("⚠️ No backend ingredients found - form will be empty");
        remove();
      }

      setCategory(initialValues?.category || "");
    }
  }, [
    mode,
    initialValues,
    menuIngredients,
    append,
    remove,
    menuForm,
    setCategory,
  ]);

  const handleRemove = async (index: number, id?: string) => {
    const ingredientName = fields[index]?.name;

    console.log("🗑️ Delete attempt:", { id, name: ingredientName });

    // 🚨 Check if this ID actually exists in backend data
    const backendIngredientIds = menuIngredients.map(
      (ing: MenuIngredientFormValues) => ing.id
    );
    const isRealBackendId = id && backendIngredientIds.includes(id);

    console.log("Backend IDs:", backendIngredientIds);
    console.log("Is real backend ID?", isRealBackendId);

    if (!isRealBackendId) {
      console.log("🚫 Not a real backend ID - removing from UI only");
      remove(index);
      toast.success("Ingredient removed");
      return;
    }

    // Only make API call for verified backend IDs
    // try {
    //   console.log("🌐 Deleting real backend ingredient...");
    //   // const response = await axiosInstance.delete(
    //   //   `/restaurants/${restaurantId}/menu/${selectedId}/ingredients/${id}`
    //   // );
    //   console.log("✅ Backend deletion successful");
    //   remove(index);
    //   toast.success("Ingredient deleted!");
    // } catch (error: any) {
    //   console.error("❌ Backend deletion failed:", error.response?.data);
    //   remove(index);
    //   toast.success("Ingredient removed from list");
    // }
  };

  return (
    <form
      onSubmit={rhfHandleSubmit(async (values) => {
        const capitalizedName =
          values.name.charAt(0).toUpperCase() + values.name.slice(1);
        const payload = {
          ...initialValues,
          ...values,
          name: capitalizedName,
          image: values.image || initialValues?.image,
          restaurant_id: restaurantId || "",
          ingredients: values.ingredients || [],
        };

        await onSubmit(payload);

        if (mode === "add") {
          reset();
          setCategory("");
        }
      })}
      className="flex flex-col gap-4"
      autoComplete="off"
    >
      <div className="relative w-full">
        <Icon
          icon="streamline-plump:fork-knife"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        />
        <Input
          {...menuForm.register("name")}
          placeholder="Item name"
          className="pl-10"
        />
      </div>

      <div className="relative w-full">
        <Icon
          icon="mdi:currency-inr"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        />
        <Input
          type="number"
          {...menuForm.register("price")}
          placeholder="0.00"
          className="pl-10"
        />
      </div>

      <div className="relative w-full">
        <Icon
          icon="marketeq:hastag-circle"
          className="absolute left-2 top-3 w-5 h-5 text-gray-400"
        />

        <div
          className="flex flex-wrap items-center gap-2 pl-10 pr-2 py-2 border border-zinc-300 rounded-lg min-h-[2.5rem] max-h-32 overflow-y-auto"
          onClick={() => {
            document.getElementById("ingredient-input")?.focus();
          }}
        >
          {fields.map((field, index) => (
            <span
              key={field.id}
              className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-sm"
            >
              {field.name}
              <button
                type="button"
                onClick={() => handleRemove(index, field.id)}
                className="ml-1 text-orange-600 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {/* inline input for new tags */}
          <input
            id="ingredient-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (inputValue.trim()) {
                  let value = inputValue.trim();
                  if (!value.startsWith("#")) {
                    value = "#" + value;
                  }

                  append({ id: "", name: value, default_included: true });
                  setInputValue("");
                }
              }
              if (
                e.key === "Backspace" &&
                inputValue === "" &&
                fields.length > 0
              ) {
                const lastIndex = fields.length - 1;
                handleRemove(lastIndex, fields[lastIndex].id);
              }
            }}
            onBlur={() => {
              if (inputValue.trim()) {
                let value = inputValue.trim();
                if (!value.startsWith("#")) value = "#" + value;
                append({ id: "", name: value, default_included: true });
                setInputValue("");
              }
            }}
            placeholder={fields.length === 0 ? "Ingredients..." : ""}
            className="flex-1 min-w-[100px] border-none outline-none focus:ring-0 text-sm"
          />

          {suggestions.length > 0 && (
            <ul className="absolute left-0 top-full mt-1 w-full bg-white border rounded shadow z-10 text-sm">
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    let value =
                      s.display_name?.trim() || s.canonical_name || "";
                    if (!value.startsWith("#")) value = "#" + value;
                    append({ id: "", name: value, default_included: true });
                    setInputValue("");
                    setSuggestions([]);
                  }}
                >
                  {s.display_name || s.canonical_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="relative w-full">
        <Icon
          icon="lucide:tag"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="pl-10 pr-3 w-full h-10 border border-zinc-300 rounded-lg flex items-center justify-between cursor-pointer  ">
              <span className="text-gray-500 font-light truncate">
                {category || "category"}
              </span>
              <Icon
                icon="mdi:keyboard-arrow-down"
                className="w-5 h-5 text-gray-500 ml-2"
              />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="bottom"
            align="end"
            sideOffset={-5}
            alignOffset={-80}
            className="w-[8rem] z-50 bg-white rounded-md shadow-md py-2 justify-end"
          >
            {categories.map((cat) => (
              <DropdownMenuItem
                key={cat}
                className="cursor-pointer px-6 py-1  mb-1 rounded-md text-[#6A6C6E] hover:bg-gray-100 hover:text-gray-700 transition-colors last:mb-0"
                onClick={() => {
                  setCategory(cat);
                  menuForm.setValue("category", cat);
                }}
              >
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Image */}
      <div className="relative w-full">
        <Image
          src="/icons/Gallery.svg"
          width={10}
          height={10}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400/50"
          alt={""}
        />
        <Input
          {...menuForm.register("image")}
          placeholder="Optional"
          className="pl-10"
        />
      </div>

      {/* Active Checkbox */}
      <div className="grid gap-1">
        <label className="text-sm flex items-center gap-2 accent-amber-600 ">
          <input type="checkbox" {...menuForm.register("active")} />
          Available
        </label>
      </div>

      {/* Submit Button */}
      <div>
        <Button
          className="bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-lg py-2 px-6 w-10px sm:w-auto shadow-lg shadow-orange-400/50"
          type="submit"
        >
          {mode === "add" ? "Add" : "Update"}
        </Button>
      </div>
    </form>
  );
}
