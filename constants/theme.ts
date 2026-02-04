export const colors = {
  primary: {
    main: '#FF6B6B',
    light: '#FF8E8E',
    dark: '#E85555',
    gradient: ['#FF6B6B', '#FF8E53'],
  },
  secondary: {
    main: '#FFE5E5',
    light: '#FFF0F0',
    dark: '#FFD6D6',
  },
  accent: {
    gold: '#FDCB6E',
    coral: '#FF7675',
    rose: '#FD79A8',
    mint: '#00B894',
  },
  success: {
    main: '#00B894',
    light: '#55EFC4',
    dark: '#00997A',
  },
  warning: {
    main: '#FDCB6E',
    light: '#FFEAA7',
    dark: '#E5B85C',
  },
  error: {
    main: '#FF6B6B',
    light: '#FF8E8E',
    dark: '#E85555',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F7F8FA',
    tertiary: '#F0F2F5',
    card: '#FFFFFF',
  },
  text: {
    primary: '#2D3436',
    secondary: '#636E72',
    tertiary: '#B2BEC3',
    inverse: '#FFFFFF',
  },
  border: {
    light: '#E8ECEF',
    medium: '#DFE6E9',
    dark: '#B2BEC3',
  },
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  bodySemibold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  captionMedium: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  smallMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  },
  colored: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  }),
};

export const gradients = {
  primary: ['#FF6B6B', '#FF8E53'],
  sunset: ['#FF6B6B', '#FFA07A'],
  warm: ['#FF8E53', '#FDCB6E'],
  rose: ['#FD79A8', '#FF6B6B'],
  mint: ['#00B894', '#55EFC4'],
  overlay: ['transparent', 'rgba(0,0,0,0.6)'],
  overlayStrong: ['transparent', 'rgba(0,0,0,0.8)'],
};

export const animations = {
  fast: 150,
  normal: 250,
  slow: 350,
  spring: {
    damping: 15,
    stiffness: 150,
  },
};
