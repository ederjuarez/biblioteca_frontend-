import "react-native-paper";

declare module "react-native-paper" {
  // Extendemos específicamente la interfaz de colores de MD3
  export interface MD3Colors {
    textColor: string;
  }
}
