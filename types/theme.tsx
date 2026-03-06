import { MD3LightTheme as DefaultTheme, useTheme as usePaperTheme } from "react-native-paper";

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "tomato",
    secondary: "yellow",
    textColor: "black",
  }
};

declare global {
  namespace ReactNativePaper {
    interface MD3Colors {
      textColor: string
    }
  }
};

export type AppTheme = typeof theme;

export const useAppTheme = () => usePaperTheme<AppTheme>();