// src/lib/fonts.ts
import WebFont from "webfontloader";

// Load fonts once
WebFont.load({
  google: {
    families: [
      "Poppins:400,500,600,700",
      "Inter:400,500,600,700",
      "Roboto:400,500,700,900", // ✅ Roboto added
    ],
  },
});

// Export class names to reuse in your components
export const PoppinsFont = { className: "font-poppins" };
export const InterFont = { className: "font-inter" };
export const RobotoFont = { className: "font-roboto" }; // ✅ Roboto
