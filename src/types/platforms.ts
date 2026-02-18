export type PlatformGuide = {
  name: string;
  safeArea: number;
  description: string;
  foregroundSize?: number;
};

export const PLATFORM_GUIDES = {
  icon: {
    name: "Icono Estándar",
    safeArea: 0.8,
    description: "Mantén el logo dentro del área segura (80%)"
  },
  android: {
    name: "Android Adaptive Icon",
    safeArea: 0.75,
    foregroundSize: 0.65,
    description: "Área segura: 75% | Foreground: 65%"
  },
  ios: {
    name: "iOS App Icon",
    safeArea: 0.7,
    description: "Área segura: 70% para evitar recortes"
  },
  web: {
    name: "Web Favicon",
    safeArea: 0.85,
    description: "Área más permisiva para web"
  },
  googlePlay: {
    name: "Google Play Store",
    safeArea: 0.9,
    description: "Icono completo, poco recorte"
  }
} as const;

export const PLATFORM_SIZES = {
  icon: [16, 20, 29, 32, 40, 48, 58, 60, 64, 72, 76, 80, 87, 96, 120, 128, 144, 152, 167, 180, 192, 256, 512, 1024],
  android: [48, 72, 96, 144, 192, 512],
  ios: [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024],
  web: [16, 32, 48, 64, 96, 128, 192, 256, 512],
  googlePlay: [512],
  all: [16, 20, 29, 32, 40, 48, 58, 60, 64, 72, 76, 80, 87, 96, 120, 128, 144, 152, 167, 180, 192, 256, 512, 1024]
} as const;

export type PlatformKey = keyof typeof PLATFORM_GUIDES;
export type PlatformSizeKey = keyof typeof PLATFORM_SIZES;