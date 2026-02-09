import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type MenuIngredientsListProps = {
  cardId: string;
  filters: Record<string, string[]>;
  togglePreference: (cardId: string, pref: string) => void;
};

export const MenuIngredientsList: React.FC<MenuIngredientsListProps> = ({
  cardId,
  filters,
  togglePreference,
}) => {
  const prefs = filters[cardId] || [];
  return (
    <div className="p-2 flex flex-col gap-1 max-h-48 overflow-y-auto">
      {prefs.length === 0 && (
        <p className="text-xs text-gray-500">No ingredients</p>
      )}
      {prefs.map((pref) => (
        <label
          key={pref}
          className="flex items-center gap-2 text-sm cursor-pointer"
        >
          <input
            type="checkbox"
            checked
            onChange={() => togglePreference(cardId, pref)}
            className="w-4 h-4"
          />
          {pref}
        </label>
      ))}
    </div>
  );
};

export type CartItem = {
  id: string;
  name: string;
  qty: number;
  price: number;
  note?: string;
  prefs?: string[];
  image?: string; // add this
};

type CartProps = {
  cart: Record<string, CartItem>;
  menu: { id: string; name: string; price: number }[];
  foodFilters: Record<string, string[]>;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  note: string;
  setNote: (note: string) => void;
  total: number;
  handleSendToKitchen: () => void;
  clearCart: () => void;
};

export const MobileCart: React.FC<
  CartProps & { show: boolean; onClose: () => void }
> = ({
  show,
  onClose,
  cart,
  menu,
  foodFilters,
  increase,
  decrease,
  note,
  setNote,
  total,
  handleSendToKitchen,
  clearCart,
}) => {
  if (!show) return null;

  return (
    <div
      className="lg:hidden fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-2"
      onClick={onClose}
    >
      <div
        className="relative w-72 max-w-[90vw] max-h-[70vh] overflow-auto shadow-lg rounded-lg bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 flex flex-col gap-2">
          <h3 className="text-xl font-semibold text-[#FB8A22] mb-2">Cart</h3>
          {Object.keys(cart).length === 0 ? (
            <p className="text-sm text-black/70">Tap items to add to cart.</p>
          ) : (
            Object.entries(cart).map(([id, item]) => (
              <div
                key={id}
                className="relative flex flex-col border rounded-md px-2 py-5 bg-white shadow-sm"
              >
                <p className="text-sm font-semibold">{item.name}</p>
                {foodFilters[id]?.length > 0 && (
                  <ul className="text-xs text-gray-600 list-disc list-inside mt-1">
                    {foodFilters[id].map((pref) => (
                      <li key={pref}>{pref}</li>
                    ))}
                  </ul>
                )}

                <div className="absolute top-1 right-1 flex items-center gap-1 rounded-lg bg-zinc-200 px-2 py-0.5 shadow-sm">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => decrease(id)}
                  >
                    -
                  </Button>
                  <span className="text-xs font-semibold w-5 text-center text-black">
                    {item.qty}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => increase(id)}
                  >
                    +
                  </Button>
                </div>

                <p
                  className={`absolute right-2 text-xs font-medium text-black ${
                    foodFilters[id]?.length > 0 ? "bottom-1" : "bottom-2"
                  }`}
                >
                  रु{item.price.toFixed(2)}
                </p>
              </div>
            ))
          )}

          <span className="text-sm font-medium text-black mt-2 block">
            Note:
          </span>
          <Input
            className="mt-1 shadow-sm rounded-md text-sm"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Less spicy"
          />

          <div className="h-px w-full bg-gray-300 my-2"></div>

          <div className="flex justify-between text-sm font-semibold text-black/80">
            <span>Total</span>
            <span>रु.{total.toFixed(2)}/-</span>
          </div>

          <div className="flex gap-2 mt-3">
            <Button
              className="flex-1 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-lg h-9"
              onClick={handleSendToKitchen}
            >
              Send to Kitchen
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-white text-black/60 shadow rounded-lg h-9"
              onClick={clearCart}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DesktopCart: React.FC<CartProps> = ({
  cart,
  menu,
  foodFilters,
  increase,
  decrease,
  note,
  setNote,
  total,
  handleSendToKitchen,
  clearCart,
}) => {
  return (
    <div className="hidden lg:block w-full max-w-md mx-auto">
      <div className="flex flex-col min-h-[20rem] shadow-lg rounded-xl overflow-hidden bg-white">
        <div className="p-4 flex flex-col">
          <h3 className="text-2xl font-semibold mb-3 text-[#FB8A22]">Cart</h3>
          {Object.keys(cart).length === 0 ? (
            <p className="text-lg text-black/70">Tap items to add to cart.</p>
          ) : (
            Object.entries(cart).map(([id, item]) => (
              <div
                key={id}
                className="relative flex flex-col border rounded-lg px-3 py-6 bg-white shadow-sm"
              >
                <p className="text-md font-semibold">{item.name}</p>
                {foodFilters[id]?.length > 0 && (
                  <ul className="text-xs text-gray-600 list-disc list-inside mt-1">
                    {foodFilters[id].map((pref) => (
                      <li key={pref}>{pref}</li>
                    ))}
                  </ul>
                )}

                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-xl bg-zinc-200 px-3 py-1 shadow-sm">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => decrease(id)}
                  >
                    -
                  </Button>
                  <span className="text-sm font-semibold w-6 text-center text-black">
                    {item.qty}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => increase(id)}
                  >
                    +
                  </Button>
                </div>

                <p
                  className={`absolute right-3 text-sm font-medium text-black ${foodFilters[id]?.length > 0 ? "bottom-2" : "bottom-3"}`}
                >
                  रु{item.price.toFixed(2)}
                </p>
              </div>
            ))
          )}

          <span className="font-medium text-black block mt-4">Note:</span>
          <Input
            className="mt-2 shadow-sm rounded-lg"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Less spicy"
          />

          <div className="h-px w-full bg-gray-300 my-4"></div>

          <div className="flex justify-between font-semibold text-black/80">
            <span>Total</span>
            <span>रु{total.toFixed(2)}/-</span>
          </div>

          <div className="flex gap-4 mt-4">
            <Button
              className="flex-1 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-xl h-10"
              onClick={handleSendToKitchen}
            >
              Send to Kitchen
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-white text-black/60 shadow rounded-xl h-10"
              onClick={clearCart}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
