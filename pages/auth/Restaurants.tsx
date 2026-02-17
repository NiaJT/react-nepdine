"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "./../../lib/useRouter";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGetMyRestaurants } from "@/hooks/shared/useGetMyRestaurants";
import Image from "@/components/ui/image";

export interface MyRestaurantResponse {
  restaurant: {
    id: string;
    tenant_id: string;
    name: string;
    location: string;
    active: string;
    created_at: string;
    image_url: string;
  };
  assignment_role: string;
}
export type MyRestaurantsResponse = MyRestaurantResponse[];

export default function WelcomePage() {
  const router = useRouter();
  const { data: restaurants = [], isPending = true } = useGetMyRestaurants();
  useEffect(() => {
    if (!isPending && restaurants.length === 0) {
      router.replace("/demo");
    }
  }, [isPending, restaurants, router]);

  const [role, setRole] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    string | null
  >(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleSelectCard = (
    restaurantId: string,
    assigned_role: string,
    name: string,
    loc: string,
  ) => {
    setSelectedRestaurantId(restaurantId);
    setSelectedName(name);
    setSelectedLocation(loc);
    setRole(assigned_role);
  };

  const handleGetStarted = () => {
    if (!selectedRestaurantId || !selectedName || !selectedLocation) return;
    localStorage.setItem("restaurant_id", selectedRestaurantId);
    localStorage.setItem("restaurant_name", selectedName);
    localStorage.setItem("restaurant_location", selectedLocation);
    if (role === "waiter") {
      router.push("/tables");
    } else router.push("/");
  };

  const scrollLeft = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  // Detect overflow
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkOverflow = () => {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setIsOverflowing(hasOverflow);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [restaurants]);

  return (
    <div className="min-h-screen w-full flex flex-col  bg-[#f9fafb]  relative">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full text-center"
      >
        <h1 className=" text-3xl md:text-5xl font-bold mb-2 text-center mt-10 w-full">
          <span className="text-[#FB8A22]">WELCOME </span>TO{" "}
          <span className="text-red-500">NEP</span>DINE
        </h1>
        <h2 className="text-2xl text-center w-full">Choose your restaurant!</h2>
      </motion.div>
      {/* Top Right Image */}
      <div className="absolute top-0 right-0 pointer-events-none select-none overflow-hidden hidden md:block">
        <Image
          width={300}
          height={300}
          src="/restaurant_decor/fork.png"
          alt="decor"
          className="object-cover"
        />
      </div>

      {/* Bottom Left Image */}
      <div className="absolute bottom-0 left-0 pointer-events-none select-none overflow-hidden hidden md:block">
        <Image
          src="/restaurant_decor/chef.png"
          alt="decor"
          height={300}
          width={300}
          className="object-contain"
        />
      </div>

      {/* Left Arrow — only show if overflow */}
      {isOverflowing && (
        <Button
          onClick={scrollLeft}
          className="hidden md:flex z-10 absolute left-6 top-1/2  
               bg-[#FB8A22] hover:bg-[#EA454C] 
               hover:shadow-xl rounded-full cursor-pointer
               w-14 h-14 p-3"
        >
          <span className="text-4xl"> &lt;</span>
        </Button>
      )}

      <div className="max-w-6xl w-full mx-auto flex flex-col items-center space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl w-full"
        >
          <div className="relative w-full">
            {/* Scrollable Container */}
            <div
              ref={scrollRef}
              className={`
          flex flex-row mt-6 flex-wrap md:flex-nowrap
          justify-center items-center md:items-start
          overflow-x-auto overflow-y-hidden
          gap-4 sm:gap-6 px-4 py-4 scroll-smooth no-scrollbar
        `}
            >
              {restaurants.map((item) => {
                const isSelected = item.restaurant.id === selectedRestaurantId;
                return (
                  <Card
                    key={item.restaurant.id}
                    className={`w-[281px] h-[280px] rounded-[25.54px] flex-shrink-0 shadow-xl hover:shadow-xl hover:scale-[1.05] transition-all duration-300 cursor-pointer bg-white ${
                      isSelected ? " ring-2 ring-[#FB8A22] scale-[1.05]" : ""
                    }`}
                    onClick={() =>
                      handleSelectCard(
                        item.restaurant.id,
                        item.assignment_role,
                        item.restaurant.name,
                        item.restaurant.location,
                      )
                    }
                  >
                    <CardHeader className="flex flex-col h-full p-0">
                      {/* Image Container */}
                      <div className="relative w-full h-[160px] rounded-t-[25px] overflow-hidden">
                        <Image
                          src={item.restaurant.image_url}
                          alt={`Image of ${item.restaurant.name}`}
                          fill
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Restaurant Title */}
                      <CardTitle className="text-[18px] font-semibold text-gray-800 text-center capitalize mt-2 px-2">
                        {item.restaurant.name}
                      </CardTitle>

                      {/* Card Details */}
                      <div className="flex flex-col w-full mt-1 px-3 text-left space-y-1">
                        <CardContent className="text-sm p-0">
                          <span className="text-[14px] ">Location:</span>{" "}
                          <span className="text-[14px] capitalize">
                            {item.restaurant.location}
                          </span>
                        </CardContent>

                        <CardContent className="text-sm p-0">
                          <span className="text-[14px]">Status:</span>{" "}
                          <span
                            className={`${
                              item.restaurant.active === "active"
                                ? "text-green-400 capitalize text-[14px]"
                                : "text-red-400 capitalize text-[14px]"
                            }`}
                          >
                            {item.restaurant.active}
                          </span>
                        </CardContent>

                        <CardContent className="text-sm p-0">
                          <span className="text-[14px]">Role:</span>{" "}
                          <span className="capitalize text-[14px]">
                            {item.assignment_role}
                          </span>
                        </CardContent>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </motion.h1>
      </div>

      {/* Right Arrow — only show if overflow */}
      {isOverflowing && (
        <Button
          onClick={scrollRight}
          className="hidden md:flex z-10 absolute right-6 top-1/2  
               bg-[#FB8A22] hover:bg-[#EA454C] 
               hover:shadow-xl rounded-full cursor-pointer
               w-14 h-14"
        >
          <span className="text-4xl"> &gt;</span>
        </Button>
      )}

      {/* Get Started Button */}
      <Button
        onClick={handleGetStarted}
        disabled={!selectedRestaurantId}
        className="absolute bottom-10 left-1/2 -translate-x-1/2
             w-[261px] h-[61px]
             bg-gradient-to-r from-[#F3A305] to-[#EA454CE5]
             text-xl rounded-3xl
             flex justify-center items-center
             cursor-pointer
             transition-all duration-300
             disabled:opacity-50 disabled:cursor-not-allowed
             hover:scale-105 hover:shadow-lg"
      >
        Get Started
      </Button>
    </div>
  );
}
