export type ID = string;

export type PaymentMethod = "cash" | "card" | "upi" | "other";

export type FoodPreference = string; // simple string for now, e.g., "Spicy", "Extra Cheese"

export interface MenuItem {
  id: ID;
  name: string;
  price: number; // in currency units, e.g., INR
  category: string;
  active: boolean;
  image?: string; // optional URL for menu thumbnail
  preferences?: FoodPreference[];
}

export interface OrderLine {
  id: ID;
  tableId: ID;
  groupId?: ID; // set when table is in a group
  itemId: ID;
  quantity: number;
  note?: string;
  remarks?: string;
  waiterId?: ID;
  name: string;
  createdAt: string | number | Date;
}
export interface Order {
  id: string;
  item_id: string;
  quantity: number;
  waiter_id?: string;
  currentGroupId?: ID;
  createdAt: string;
  group_id?: string;
  note?: string;
}

export type TableStatus = "free" | "occupied" | "reserved";

export interface Table {
  room_id: string;
  room_name?: string;
  id: ID;
  name: string; // e.g., T1, T2
  capacity?: number;
  description?: string;
  status: TableStatus;
  currentGroupId?: ID;
}

export interface Room {
  id: ID;
  name: string;
  description: string;
  tables?: Table[];
}

export interface Group {
  id: ID;
  name: string; // e.g., "Smith Family"
  people_count: number;
  restaurant_id: string;
  tenant_id: string;
  opened_at: string; // ISO
  closed_at?: string; // ISO
  tables?: Table[];
}

export interface GroupWithTables {
  tables: Table[];
  groups: Group[];
  updateTable: (id: string, data: Partial<Table>) => void;
  assignTableToGroup: (tableId: string, groupName?: string) => void;
}

export interface Payment {
  id: ID;
  groupId: ID;
  amount: number; // positive
  method: PaymentMethod;
  paidAt: string; // ISO
}

export type categorys = "Breakfast" | "Lunch" | "Dinner" | "snacks";

export interface BalanceEntry {
  id: ID;
  groupId: ID;
  total: number;
  tableId: ID;
  name?: string;
  discount?: number;
  serviceCharge?: number;
  waiterId?: ID;
  tax?: number;
  settled: boolean;
  closedAt: string; // ISO
  category: categorys;
  orderIds: ID[];
}

export type WaiterStatus = "Active" | "Inactive" | "In Break";
export type WaiterShift = "Morning" | "Evening" | "Night";

export interface Waiter {
  id: ID;
  name: string;
  rating?: number;
  status?: WaiterStatus;
  mobile?: number;
  shift?: WaiterShift;
}

export interface KOT {
  id: ID;
  tableId: ID;
  groupId?: ID;
  waiterId?: ID;
  orderIds: ID[];
  items: {
    orderId: ID;
    note?: string;
    remarks?: string;
  }[];
  type: string;
  createdAt: string; // ISO
}
