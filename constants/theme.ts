// /constants/theme.ts
export const Colors = {
  // Paleta base (clara)
  bg: '#F5F6F7',                // fondo
  text: '#101315',              // texto principal
  muted: '#687280',             // texto secundario
  border: '#E5E7EB',            // bordes muy suaves
  accent: '#6F7DE6',            // acento (más suave que el azul fuerte)
  accentTranslucent: 'rgba(111, 125, 230, 0.18)', // para “glass” y estados
  glassBg: 'rgba(255,255,255,0.65)',              // fondo “liquid glass”
  glassBorder: 'rgba(255,255,255,0.55)',

  // Aliases para evitar confusiones:
  background: '#F5F6F7',        // alias de bg (para quien escriba background)
};

export const Radii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  // alias solicitado por tu código:
  full: 999,
};

export const spacing = (u: number) => 4 * u; // 4px unit
export const shadow = {
  // sombra suave y difusa (iOS/Android)
  style: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
};
