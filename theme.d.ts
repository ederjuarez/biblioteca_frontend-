import { MD3Theme } from "react-native-paper";

declare global {
  namespace ReactNativePaper {
    // Esto modifica directamente el tipo de 'colors' dentro de MD3Theme
    interface ThemeColors {
      textColor: string;
      text: string
    }
  }
}
