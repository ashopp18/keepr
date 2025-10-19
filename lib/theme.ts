// lib/theme.ts
import { Platform } from 'react-native';

export const Colors = {
  bg: '#F4F5F7',
  text: '#101315',
  muted: '#687280',
  border: '#E5E7EB',
  accent: '#6F86F7',
  textOnAccent: '#FFFFFF',
  glassBg: 'rgba(255,255,255,0.75)',
  glassBorder: 'rgba(255,255,255,0.9)',
  accentTranslucent: 'rgba(111,131,230,0.65)',
};

export const spacing = (u: number) => u * 8;

export const Radii = { sm: 10, md: 16, lg: 22, xl: 28, full: 999 };

export const shadow = (elevation = 4) => {
  if (Platform.OS === 'ios') {
    const opacity = Math.min(0.12 + elevation * 0.01, 0.3);
    const radius = 4 + elevation;
    return {
      shadowColor: '#000',
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: Math.ceil(elevation / 2) },
    };
  }
  return { elevation };
};
