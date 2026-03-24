import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  cssVarsPrefix: "ix",
  theme: {
    tokens: {
      fonts: {
        body: { value: "var(--font-geist-sans), system-ui, sans-serif" },
        heading: { value: "var(--font-geist-sans), system-ui, sans-serif" },
        mono: { value: "var(--font-geist-mono), ui-monospace, SFMono-Regular" },
      },
      radii: {
        md: { value: "8px" },
        lg: { value: "12px" },
      },
      colors: {
        brand: {
          50: { value: "#eff6ff" },
          100: { value: "#dbeafe" },
          200: { value: "#bfdbfe" },
          300: { value: "#93c5fd" },
          400: { value: "#60a5fa" },
          500: { value: "#3b82f6" },
          600: { value: "#2563eb" },
          700: { value: "#1d4ed8" },
          800: { value: "#1e40af" },
          900: { value: "#1e3a8a" },
        },
        whatsapp: {
          500: { value: "#25D366" },
          600: { value: "#128C7E" },
        },
        surface: {
          canvas: { value: "{colors.white}" },
          panel: { value: "{colors.gray.50}" },
          border: { value: "{colors.gray.200}" },
        },
      },
      shadows: {
        subtle: { value: "0 1px 2px rgba(0,0,0,0.06)" },
        elevated: { value: "0 10px 25px rgba(0,0,0,0.08)" },
      },
    },
    semanticTokens: {
      colors: {
        canvas: {
          value: { base: "{colors.white}", _dark: "{colors.gray.950}" },
        },
        panel: {
          value: { base: "{colors.gray.50}", _dark: "{colors.gray.900}" },
        },
        border: {
          value: { base: "{colors.gray.200}", _dark: "{colors.gray.700}" },
        },
        muted: {
          value: { base: "{colors.gray.600}", _dark: "{colors.gray.300}" },
        },
        text: {
          value: { base: "{colors.gray.900}", _dark: "{colors.gray.50}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
