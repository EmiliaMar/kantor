export const theme = {
  colors: {
    primary: "#007AFF",
    secondary: "#5856D6",
    success: "#34C759",
    warning: "#FF9500",
    danger: "#FF3B30",

    background: "#F2F2F7",
    surface: "#FFFFFF",
    card: "rgba(255, 255, 255, 0.7)",

    text: {
      primary: "#000000",
      secondary: "#8E8E93",
      tertiary: "#C7C7CC",
    },

    border: "rgba(0, 0, 0, 0.05)",
    shadow: "rgba(0, 0, 0, 0.08)",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  borderRadius: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    full: 9999,
  },

  typography: {
    largeTitle: {
      fontSize: 34,
      fontWeight: "700" as const,
      letterSpacing: 0.4,
    },
    title1: {
      fontSize: 28,
      fontWeight: "700" as const,
    },
    title2: {
      fontSize: 22,
      fontWeight: "600" as const,
    },
    title3: {
      fontSize: 20,
      fontWeight: "600" as const,
    },
    headline: {
      fontSize: 17,
      fontWeight: "600" as const,
    },
    body: {
      fontSize: 17,
      fontWeight: "400" as const,
    },
    callout: {
      fontSize: 16,
      fontWeight: "400" as const,
    },
    subheadline: {
      fontSize: 15,
      fontWeight: "400" as const,
    },
    footnote: {
      fontSize: 13,
      fontWeight: "400" as const,
    },
    caption: {
      fontSize: 12,
      fontWeight: "400" as const,
    },
  },

  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 8,
    },
  },

  glass: {
    background: "rgba(255, 255, 255, 0.7)",
    border: "rgba(255, 255, 255, 0.3)",
    blur: 20,
  },
};

export type Theme = typeof theme;
