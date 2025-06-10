# AfriStyle - African Fashion & Culture Mobile App

<div align="center">
  <img src="./assets/images/icon.png" alt="AfriStyle Logo" width="120" height="120">
  
  **Discover authentic African fashion and culture from the comfort of your mobile device**
  
  [![React Native](https://img.shields.io/badge/React%20Native-0.79.3-blue.svg)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-53.0.11-black.svg)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-Private-red.svg)]()
</div>

## 📱 About AfriStyle

AfriStyle is a comprehensive mobile application that celebrates African fashion, culture, and style. The app provides users with an immersive experience to explore authentic African fashion trends, read inspiring blog content, and discover the rich cultural heritage behind African style.

### 🌟 Key Features

- **📖 Fashion Blog**: Curated articles about African fashion, trends, and cultural insights
- **❤️ Like System**: Save your favorite blog posts for easy access
- **🔍 Smart Search**: Find specific content by title, category, or keywords
- **👤 User Authentication**: Secure login and registration system
- **📱 Modern UI**: Beautiful, responsive design with smooth animations
- **🎨 African-Inspired Design**: Orange-themed UI reflecting African aesthetics
- **📚 Rich Content**: Detailed articles covering fashion guides, trends, and cultural stories

## 🏗️ Architecture & Technology Stack

### Frontend Framework
- **React Native 0.79.3** - Cross-platform mobile development
- **Expo 53.0.11** - Development platform and build tools
- **TypeScript 5.8.3** - Type-safe JavaScript development
- **Expo Router 5.0.7** - File-based navigation system

### State Management
- **React Context API** - Global state management
- **AsyncStorage** - Persistent local data storage
- **Custom Hooks** - Reusable state logic

### UI & Design
- **React Native Safe Area Context** - Handle device safe areas
- **Expo Vector Icons** - Comprehensive icon library
- **Custom Components** - Reusable UI components
- **Responsive Design** - Adaptive layouts for different screen sizes

### Navigation
- **Expo Router** - File-based routing system
- **Bottom Tab Navigation** - Main app navigation
- **Stack Navigation** - Screen transitions and deep linking

## 📂 Project Structure

```
AfriStyle/
├── app/                          # Main application screens
│   ├── (tabs)/                   # Tab-based navigation screens
│   │   ├── index.tsx            # Home screen
│   │   ├── blog.tsx             # Blog listing and search
│   │   ├── explore.tsx          # Liked posts screen
│   │   ├── profile.tsx          # User profile
│   │   └── settings.tsx         # App settings
│   ├── signup/                   # Registration flow
│   ├── blog-detail.tsx          # Individual blog post view
│   ├── signin.tsx               # Login screen
│   ├── onboarding.tsx           # App introduction
│   ├── forgot-password.tsx      # Password recovery
│   ├── verify-otp.tsx           # OTP verification
│   └── reset-password.tsx       # Password reset
├── components/                   # Reusable UI components
│   ├── ui/                      # Core UI components
│   │   ├── Button.tsx           # Custom button component
│   │   ├── TextField.tsx        # Input field component
│   │   ├── TopAppBar.tsx        # Header component
│   │   ├── OTPInput.tsx         # OTP input component
│   │   └── ...                  # Other UI components
│   └── ...                      # Other components
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx          # Authentication state management
│   └── SaveContext.tsx          # Like/save functionality
├── constants/                    # App constants and configuration
│   ├── Colors.ts                # Color palette and theme
│   ├── Typography.ts            # Font styles and sizes
│   └── Layout.ts                # Layout constants
├── hooks/                        # Custom React hooks
├── assets/                       # Static assets (images, fonts)
└── types.d.ts                   # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** (for iOS development) or **Android Studio** (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mobile_team_App_techCrush
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on specific platforms**
   ```bash
   # iOS Simulator
   npm run ios
   
   # Android Emulator
   npm run android
   
   # Web Browser
   npm run web
   ```

### Demo Credentials

For testing purposes, use these demo credentials:
- **Email**: `demo@example.com`
- **Password**: `password123`

## 📱 App Features & Screens

### 🔐 Authentication Flow
- **Onboarding**: Welcome screens introducing app features
- **Sign Up**: User registration with form validation
- **Sign In**: Secure login with demo credentials
- **Password Recovery**: Forgot password and OTP verification
- **Password Reset**: Secure password reset functionality

### 🏠 Main Application
- **Home Screen**: Welcome dashboard with user information
- **Blog Screen**: 
  - Featured posts carousel with pagination
  - Popular posts section
  - Search functionality with real-time filtering
  - "Show All" view with expanded post listings
- **Blog Detail**: 
  - Full article content with rich text
  - Like functionality with heart animations
  - Scrollable headers for better UX
- **Liked Posts**: 
  - Collection of user's liked articles
  - Unlike functionality
  - Timestamps showing when posts were liked
- **Profile**: User profile information and settings
- **Settings**: App preferences and account management

### 🎨 Design System

#### Color Palette
- **Primary Orange**: `#E9642C` - Main brand color
- **Secondary**: `#034B45` - Accent color
- **Grays**: Various shades for text and backgrounds
- **Status Colors**: Success, error, warning, and info colors

#### Typography
- **Headings**: Bold, prominent text for titles
- **Body Text**: Readable font sizes for content
- **Captions**: Smaller text for metadata and descriptions

#### Components
- **Buttons**: Primary, secondary, and text button variants
- **Input Fields**: Text inputs with validation states
- **Cards**: Content containers with shadows and borders
- **Icons**: Comprehensive icon set from Expo Vector Icons

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web

# Lint code
npm run lint

# Reset project (clean cache)
npm run reset-project
```

### Code Style & Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Expo configuration
- **File Naming**: PascalCase for components, camelCase for utilities
- **Component Structure**: Functional components with hooks
- **State Management**: Context API for global state, local state for component-specific data

### Key Dependencies

#### Core Framework
- `react`: 19.0.0
- `react-native`: 0.79.3
- `expo`: 53.0.11
- `expo-router`: 5.0.7

#### Navigation & UI
- `@react-navigation/native`: 7.1.6
- `@react-navigation/bottom-tabs`: 7.3.10
- `@expo/vector-icons`: 14.1.0
- `react-native-safe-area-context`: 5.4.0

#### Storage & State
- `@react-native-async-storage/async-storage`: 2.1.2
- React Context API (built-in)

#### Development Tools
- `typescript`: 5.8.3
- `eslint`: 9.25.0
- `@babel/core`: 7.25.2

## 📊 App Flow & User Journey

### New User Experience
1. **Splash Screen** → **Onboarding** → **Sign Up** → **Main App**
2. **Email Verification** (if required)
3. **Profile Setup**

### Returning User Experience
1. **Splash Screen** → **Auto Login** → **Main App**
2. **Quick Access** to liked posts and recent content

### Content Discovery
1. **Browse Featured Posts** on blog home
2. **Search for Specific Topics** using search bar
3. **Like Interesting Articles** for later reading
4. **Read Full Articles** with rich content
5. **Manage Liked Posts** in dedicated section

## 🔒 Security & Privacy

- **Secure Authentication**: Token-based authentication system
- **Local Data Storage**: Encrypted AsyncStorage for sensitive data
- **Input Validation**: Client-side validation for all user inputs
- **Privacy Controls**: User control over personal data

## 🌍 Localization & Accessibility

- **English Language**: Primary language support
- **Accessibility**: Screen reader support and proper contrast ratios
- **Responsive Design**: Adapts to different screen sizes and orientations

## 📈 Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Optimized image loading and caching
- **Memory Management**: Efficient state management and cleanup
- **Bundle Optimization**: Code splitting and tree shaking

## 🚀 Deployment

### Building for Production

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Create development build
expo install --fix
expo prebuild
```

### App Store Deployment
1. **iOS**: Submit to Apple App Store via Xcode or Expo Application Services
2. **Android**: Upload to Google Play Console
3. **Testing**: Use Expo's internal distribution for beta testing

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test on both iOS and Android platforms
- Ensure accessibility compliance

## 📞 Support & Contact

For support, feature requests, or bug reports:
- **Email**: support@afristyle.com
- **GitHub Issues**: Create an issue in this repository
- **Documentation**: Check the inline code documentation

## 📄 License

This project is private and proprietary. All rights reserved.

---

<div align="center">
  <p><strong>Built with ❤️ for African Fashion & Culture</strong></p>
  <p>© 2025 AfriStyle. All rights reserved.</p>
</div> 