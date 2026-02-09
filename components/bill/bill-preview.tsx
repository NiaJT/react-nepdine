import { BillData } from "@/lib/thermalBill";

export function BillPreview({ bill }: { bill: BillData }) {
  return (
    <div className="w-[260px] mx-auto bg-white text-[11px] font-mono text-black border p-2 leading-tight relative">
      {/* Close button */}

      {/* Header */}
      <div className="text-center font-bold uppercase">
        {bill.restaurantName}
      </div>
      <div className="text-center uppercase">{bill.restaurantLocation}</div>
      <div className="text-center text-[10px] mt-1">{bill.date}</div>

      <Divider />

      {/* Table header */}
      <div className="flex font-bold">
        <span className="w-6">SN</span>
        <span className="flex-1">ITEM</span>
        <span className="w-8 text-right">Q</span>
        <span className="w-16 text-right">AMT</span>
      </div>

      <Divider />

      {/* Items */}
      {bill.orders.map((o, i) => (
        <div key={i} className="flex">
          <span className="w-6">{i + 1}</span>
          <span className="flex-1 truncate">{o.name}</span>
          <span className="w-8 text-right">{o.qty}</span>
          <span className="w-16 text-right">{o.amount.toFixed(2)}</span>
        </div>
      ))}

      <Divider />

      {/* Totals */}
      <Row label="SUBTOTAL" value={bill.subtotal} />
      <Row label="DISCOUNT" value={-(bill.discount ?? 0)} />
      <Row label="TAX" value={bill.tax ?? 0} />

      <Divider />

      {/* Final total */}
      <div className="flex font-bold">
        <span className="flex-1">TOTAL</span>
        <span className="w-16 text-right">Rs {bill.total.toFixed(2)}</span>
      </div>

      <Divider />

      {/* Footer */}
      <div className="text-center text-[10px] mt-2">THANK YOU!</div>
      <div className="text-center text-[10px]">PLEASE VISIT AGAIN</div>
    </div>
  );
}

/* ---------- Helpers ---------- */
function Divider() {
  return <div className="my-1 border-b border-black" />;
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex">
      <span className="flex-1">{label}</span>
      <span className="w-16 text-right">Rs {value.toFixed(2)}</span>
    </div>
  );
}
