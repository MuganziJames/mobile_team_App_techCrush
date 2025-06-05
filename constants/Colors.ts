/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

const Colors = {
  primary: '#E76E2C',    // Primary Orange (buttons, accents)
  black: '#000000',      // Black (headings)
  darkGray: '#333333',   // Dark Gray (body text)
  midGray: '#707070',    // Mid Gray (placeholders / meta)
  lightGray: '#F4F4F4',  // Light Gray (field fills)
  errorRed: '#E0544C',   // Error Red (validation)
  white: '#FFFFFF',      // White
  disabledBg: '#E76E2C33', // Primary Orange with 20% opacity
  disabledText: '#FFFFFF66', // White with 40% opacity
  inactiveDot: '#D4D4D4', // Inactive pagination dot
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export default Colors;
