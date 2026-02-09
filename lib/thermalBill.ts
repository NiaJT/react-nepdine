import jsPDF from "jspdf";

interface Order {
  name: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface BillData {
  restaurantName: string;
  restaurantLocation: string;
  date: string;
  subtotal: number;
  discount?: number;
  serviceCharge?: number;
  tax?: number;
  total: number;
  orders: Order[];
}

const PAGE_WIDTH = 80; // Thermal width
const LEFT_X = 6;
const RIGHT_X = 74;

const NO_COL_WIDTH = 8;
const QTY_COL_WIDTH = 14; // Increased to prevent overlap
const ITEM_COL_WIDTH = RIGHT_X - LEFT_X - NO_COL_WIDTH - QTY_COL_WIDTH;

const FONT_SIZE = 9;
const LINE_HEIGHT = 4;

export function generateThermalPDF(data: BillData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [PAGE_WIDTH, 100],
  });

  // -------- Calculate estimated height dynamically --------
  let estimatedLines = 0;
  data.orders.forEach((order) => {
    estimatedLines += doc.splitTextToSize(
      order.name.toUpperCase(),
      ITEM_COL_WIDTH
    ).length;
  });

  const totalsCount = [
    data.subtotal,
    data.discount,
    data.serviceCharge,
    data.tax,
    data.total,
  ].filter((v) => typeof v === "number" && v !== 0).length;

  const estimatedHeight =
    30 + estimatedLines * LINE_HEIGHT + totalsCount * LINE_HEIGHT + 12;
  doc.internal.pageSize.height = estimatedHeight;

  let y = 6;

  // -------- Helpers --------
  const setFont = (bold = false, size = FONT_SIZE) => {
    doc.setFont("courier", bold ? "bold" : "normal");
    doc.setFontSize(size);
  };

  const next = (lines = 1) => (y += LINE_HEIGHT * lines);

  const wrapText = (
    text: string,
    x: number,
    maxWidth: number,
    bold = false
  ) => {
    setFont(bold);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length;
  };

  const QTY_X = LEFT_X + NO_COL_WIDTH + ITEM_COL_WIDTH;
  const AMT_X = RIGHT_X;

  // -------- HEADER --------
  setFont(true, 11);
  doc.text(data.restaurantName.toUpperCase(), PAGE_WIDTH / 2, y, {
    align: "center",
  });
  next();

  if (data.restaurantLocation) {
    setFont(false, 9);
    doc.text(data.restaurantLocation.toUpperCase(), PAGE_WIDTH / 2, y, {
      align: "center",
    });
    next();
  }

  setFont(false, 8);
  doc.text(`Date: ${data.date}`, PAGE_WIDTH / 2, y, { align: "center" });
  next(0.5);

  doc.line(LEFT_X, y, RIGHT_X, y);
  next();

  // -------- TABLE HEADER --------
  setFont(true);
  doc.text("No", LEFT_X, y);
  doc.text("Item", LEFT_X + NO_COL_WIDTH, y);
  doc.text("Qty", QTY_X, y, { align: "right" });
  doc.text("Amt", AMT_X, y, { align: "right" });
  next();

  doc.line(LEFT_X, y, RIGHT_X, y);
  next();

  // -------- ORDERS --------
  setFont(false);
  data.orders.forEach((order, index) => {
    const itemLines = doc.splitTextToSize(
      order.name.toUpperCase(),
      ITEM_COL_WIDTH
    );
    itemLines.forEach((line: string, idx: number) => {
      if (idx === 0) doc.text(String(index + 1), LEFT_X, y); // No column
      doc.text(line, LEFT_X + NO_COL_WIDTH, y); // Item column
      if (idx === 0) {
        doc.text(String(order.qty), QTY_X, y, { align: "right" }); // Qty column
        doc.text(order.amount.toFixed(0), AMT_X, y, { align: "right" }); // Amount column
      }
      next();
    });
  });

  next(0.5);
  doc.line(LEFT_X, y, RIGHT_X, y);
  next();

  // -------- TOTALS --------
  const totalsCandidate = [
    { label: "SUB TOTAL", value: data.subtotal },
    { label: "DISCOUNT", value: data.discount },
    { label: "SERVICE", value: data.serviceCharge },
    { label: "TAX", value: data.tax },
  ];

  const totals = totalsCandidate.filter(
    (t): t is { label: string; value: number } =>
      typeof t.value === "number" && t.value !== 0
  );

  totals.forEach((t) => {
    doc.text(t.label, LEFT_X, y);
    doc.text(`Rs ${t.value.toFixed(0)}`, AMT_X, y, { align: "right" });
    next();
  });

  // Total final
  setFont(true);
  doc.text("TOTAL", LEFT_X, y);
  doc.text(`Rs ${data.total.toFixed(0)}`, AMT_X, y, { align: "right" });
  next(1);

  // -------- FOOTER --------
  doc.text("THANK YOU!", PAGE_WIDTH / 2, y, {
    align: "center",
    baseline: "middle",
  });

  // -------- OPEN PDF --------
  const url = doc.output("bloburl");
  window.open(url, "_blank");
}
