import { KOTProps } from "@/components/bill/thermalKot";

export interface BillData {
  restaurantName: string;
  restaurantLocation?: string;
  date: string;
  subtotal: number;
  discount?: number;
  serviceCharge?: number;
  tax?: number;
  total: number;
  orders: {
    name: string;
    qty: number;
    rate: number;
    amount: number;
  }[];
}

declare global {
  interface Window {
    electronAPI?: {
      /** Send bill data to Electron for printing */
      printBill: (billData: BillData) => void;

      /** Fired when no USB printer is detected */
      onNoPrinter: (callback: () => void) => void;

      /** Fired when print is successfully sent */
      onPrintSuccess: (callback: () => void) => void;

      /** Fired when print fails */
      onPrintError: (callback: (message: string) => void) => void;

      /** Send KOT data to Electron for printing */
      printKOT: (kotData: KOTProps) => void;

      /** Fired when KOT print is successfully sent */
      onKOTPrintSuccess: (callback: () => void) => void;

      /** Fired when KOT print fails */
      onKOTPrintError: (callback: (message: string) => void) => void;
    };
  }
}

// utils/print.ts
export const handlePrint = (billData: BillData) => {
  console.log("Handling bill print");
  if (window.electronAPI) {
    window.electronAPI.printBill(billData);
  } else {
    console.log("Not running inside Electron", billData);
  }
};

export const handlePrintKOT = (kotData: KOTProps) => {
  console.log("Handling KOT print");
  if (window.electronAPI) {
    window.electronAPI.printKOT(kotData);

    // Listen for success/error
    window.electronAPI.onKOTPrintSuccess(() => {
      console.log("KOT printed successfully!");
    });
    window.electronAPI.onKOTPrintError((msg) => {
      console.error("KOT print failed:", msg);
    });
  } else {
    console.log("Not running inside Electron", kotData);
  }
};
