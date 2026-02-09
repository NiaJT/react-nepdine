import React from "react";

export interface OrderLine {
  id: string;
  name: string;
  qty: number;
  remark?: string;
}

export interface KOTProps {
  table: string;
  waiter: string;
  orders: OrderLine[];
  note?: string;
  totalQty?: number;
}

interface KOTPreviewProps {
  kot: KOTProps;
  onClose: () => void;
}

export const KOTPreview: React.FC<KOTPreviewProps> = ({ kot }) => {
  const restaurantName = localStorage.getItem("restaurant_name") ?? "";
  const restaurantLocation = localStorage.getItem("restaurant_location") ?? "";

  return (
    <div className="w-[300px] mx-auto bg-white text-[11px] font-mono text-black border p-2 leading-tight relative">
      {/* Header */}
      <div className="text-center font-bold uppercase">{restaurantName}</div>
      {restaurantLocation && (
        <div className="text-center uppercase text-[10px]">
          {restaurantLocation}
        </div>
      )}
      <div className="text-center text-[10px] mt-1">
        {new Date().toLocaleString()}
      </div>
      <div className="text-center font-bold mt-2">KOT</div>

      <Divider />

      {/* Table info */}
      <div className="flex justify-between text-[11px]">
        <span>Table: {kot.table}</span>
        <span>Waiter: {kot.waiter}</span>
      </div>

      <Divider />

      {/* Table header */}
      <div className="flex font-bold">
        <span className="w-6">No</span>
        <span className="flex-1">ITEM</span>
        <span className="w-8 text-right">QTY</span>
      </div>

      <Divider />

      {/* Orders */}
      {kot.orders.map((order, i) => (
        <div key={order.id} className="mb-1">
          <div className="flex">
            <span className="w-6">{i + 1}</span>
            <span className="flex-1 truncate">{order.name.toUpperCase()}</span>
            <span className="w-8 text-right">{order.qty}</span>
          </div>
          {order.remark && (
            <div className="ml-6 italic text-[10px]">
              * {order.remark.toUpperCase()}
            </div>
          )}
        </div>
      ))}

      <Divider />

      {/* Note */}
      {kot.note && (
        <div className="text-[10px]">
          <div className="font-bold">NOTE:</div>
          <div>{kot.note.toUpperCase()}</div>
        </div>
      )}

      {/* Total Qty */}
      {typeof kot.totalQty === "number" && (
        <div className="text-right font-bold mt-1 text-[11px]">
          TOTAL QTY: {kot.totalQty}
        </div>
      )}

      <Divider />

      {/* Footer */}
      <div className="text-center text-[10px] mt-1">THANK YOU!</div>
    </div>
  );
};

/* ---------- Helpers ---------- */
function Divider() {
  return <div className="my-1 border-b border-black" />;
}
