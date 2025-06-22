/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#E9642C'; // Primary orange
const tintColorDark = '#FF8C5F';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
  primary: '#E9642C', // MyStyleMag brand orange
  secondary: '#034B45',
  white: '#FFFFFF',
  black: '#000000',
  lightGray: '#F5F5F5',
  midGray: '#E1E1E1',
  darkGray: '#777777',
  errorRed: '#FF3B30',
  successGreen: '#34C759',
  warning: '#FFC107',
  info: '#2196F3',
  inactiveDot: '#DDDDDD',
  background: '#FFFFFF',
  cardBackground: '#F9F9F9',
  border: '#E1E1E1',
  shadow: 'rgba(0, 0, 0, 0.1)',
};
