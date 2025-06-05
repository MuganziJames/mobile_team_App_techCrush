import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Layout = {
  window: {
    width,
    height,
  },
  // Grid & spacing
  baseSpacing: 8,
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
  },
  // Corner radius
  borderRadius: 8,
  // Margins
  horizontalMargin: 24,
  // Safe areas
  statusBarHeight: 44,
  homeIndicatorHeight: 34,
  // Design dimensions (iPhone 11 frame)
  designWidth: 393,
  designHeight: 852,
  // Button height
  buttonHeight: 48,
  // Text field height
  textFieldHeight: 48,
  // OTP box size
  otpBoxSize: 48,
  // Hero image height (65% of screen)
  heroImageHeight: height * 0.65,
};

export default Layout; 