import { Platform } from 'react-native';

import '@/global.css';

export const theme = {
  paper: '#F3EEE6',
  paperDeep: '#E6DDD0',
  card: '#FFFBF6',
  ink: '#1C1916',
  inkSoft: '#5C5348',
  line: '#DDD2C3',
  terracotta: '#C4512E',
  terracottaDeep: '#8E2E16',
  moss: '#24543F',
  mossSoft: '#DCE8DF',
  water: '#B7CDC6',
  waterDeep: '#7E9E96',
  street: '#E4D7C6',
  block: '#F7F1E6',
  park: '#D3E3D2',
  ahead: '#FFFBF6',
} as const;

const web = {
  display: 'Fraunces_600SemiBold, "Liberation Serif", Georgia, serif',
  displayBold: 'Fraunces_700Bold, "Liberation Serif", Georgia, serif',
  body: 'Outfit_400Regular, Inter, "Liberation Sans", sans-serif',
  medium: 'Outfit_500Medium, Inter, "Liberation Sans", sans-serif',
  semibold: 'Outfit_600SemiBold, Inter, "Liberation Sans", sans-serif',
};

const native = {
  display: 'Fraunces_600SemiBold',
  displayBold: 'Fraunces_700Bold',
  body: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semibold: 'Outfit_600SemiBold',
};

export const font = Platform.OS === 'web' ? web : native;
