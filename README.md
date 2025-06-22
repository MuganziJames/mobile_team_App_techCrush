# MyStyleMag - African Fashion & Culture Mobile App

<div align="center">
  <img src="./assets/images/MyStyleMag.png" alt="MyStyleMag Logo" width="120" height="120">
  
  **Explore exclusive, modern and exquisite African Designs at your fingertips**
  
  [![React Native](https://img.shields.io/badge/React%20Native-0.79.4-blue.svg)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-53.0.12-black.svg)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-Private-red.svg)]()
</div>

## 📱 About MyStyleMag

MyStyleMag is a comprehensive mobile application that celebrates African fashion, culture, and style. The app provides users with an immersive experience to explore authentic African fashion trends, create personalized lookbooks, read inspiring blog content, and discover the rich cultural heritage behind African style.

### 🌟 Key Features

- **👗 Style Discovery**: Browse curated African fashion outfits and styles
- **📚 Personal Lookbooks**: Create and organize custom fashion collections
- **📖 Fashion Blog**: Curated articles about African fashion, trends, and cultural insights
- **❤️ Save System**: Save favorite styles and blog posts for easy access
- **🔍 Smart Search**: Find specific content by title, category, or keywords
- **👤 User Authentication**: Secure login and registration with TechCrush API
- **📱 Modern UI**: Beautiful, responsive design with smooth animations
- **🎨 African-Inspired Design**: Orange-themed UI reflecting African aesthetics
- **🔐 Account Management**: Full profile editing and account deletion capabilities
- **📊 Export Features**: Export lookbook data and outfit collections

## 🏗️ Architecture & Technology Stack

### Frontend Framework
- **React Native 0.79.4** - Cross-platform mobile development
- **Expo 53.0.12** - Development platform and build tools
- **TypeScript 5.8.3** - Type-safe JavaScript development
- **Expo Router 5.0.7** - File-based navigation system

### Backend Integration
- **TechCrush API** - Authentication and user management
- **RESTful Services** - Blog, category, and outfit data
- **Axios** - HTTP client for API communication

### State Management
- **React Context API** - Global state management
- **AsyncStorage** - Persistent local data storage
- **Custom Hooks** - Reusable state logic

### UI & Design
- **Custom Design System** - Consistent UI components
- **Expo Vector Icons** - Comprehensive icon library
- **Animated Components** - Smooth transitions and interactions
- **Responsive Design** - Adaptive layouts for different screen sizes

## 📂 Project Structure

```
MyStyleMag/
├── app/                          # Main application screens
│   ├── (tabs)/                   # Tab-based navigation screens
│   │   ├── index.tsx            # Home screen with style discovery
│   │   ├── explore.tsx          # Explore styles and outfits
│   │   ├── blog.tsx             # Blog listing and search
│   │   ├── lookbook.tsx         # Personal lookbook management
│   │   ├── profile.tsx          # User profile
│   │   └── settings.tsx         # App settings and account management
│   ├── signup/                   # Registration flow
│   │   ├── index.tsx            # Email signup
│   │   └── full-form.tsx        # Complete registration
│   ├── onboarding/              # App introduction screens
│   ├── blog-detail.tsx          # Individual blog post view
│   ├── style-detail.tsx         # Outfit/style detail view
│   ├── lookbook-folder.tsx      # Lookbook folder contents
│   ├── signin.tsx               # Login screen
│   ├── forgot-password.tsx      # Password recovery
│   ├── verify-otp.tsx           # OTP verification
│   ├── reset-password.tsx       # Password reset
│   ├── edit-profile.tsx         # Profile editing
│   ├── privacy-security.tsx     # Privacy and security settings
│   └── terms.tsx                # Terms and conditions
├── components/                   # Reusable UI components
│   ├── ui/                      # Core UI components
│   │   ├── Button.tsx           # Custom button component
│   │   ├── TextField.tsx        # Input field component
│   │   ├── TopAppBar.tsx        # Header component
│   │   ├── SuccessCard.tsx      # Success message component
│   │   ├── ErrorCard.tsx        # Error message component
│   │   ├── ErrorModal.tsx       # Error modal component
│   │   ├── ConfirmationModal.tsx # Confirmation dialog
│   │   ├── ProfileEditModal.tsx # Profile editing modal
│   │   ├── OTPInput.tsx         # OTP input component
│   │   ├── Logo.tsx             # App logo component
│   │   └── ...                  # Other UI components
│   ├── StyleCard.tsx            # Style/outfit card component
│   ├── FolderCard.tsx           # Lookbook folder card
│   └── ...                      # Other components
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx          # Authentication state management
│   ├── SaveContext.tsx          # Save functionality (deprecated)
│   ├── BlogContext.tsx          # Blog data management
│   ├── CategoryContext.tsx      # Category data management
│   ├── LookbookContext.tsx      # Lookbook management
│   └── OutfitContext.tsx        # Outfit/style data management
├── api/                         # API service layer
│   ├── axios.ts                 # HTTP client configuration
│   ├── auth.service.ts          # Authentication services
│   ├── blog.service.ts          # Blog API services
│   ├── category.service.ts      # Category API services
│   ├── lookbook.service.ts      # Lookbook API services
│   ├── outfit.service.ts        # Outfit API services
│   └── types.ts                 # API type definitions
├── constants/                    # App constants and configuration
│   ├── Colors.ts                # Color palette and theme
│   ├── Typography.ts            # Font styles and sizes
│   ├── Layout.ts                # Layout constants
│   └── Config.ts                # App configuration
├── hooks/                        # Custom React hooks
├── utils/                        # Utility functions
│   ├── dataManager.ts           # Data management utilities
│   ├── exportUtils.ts           # Export functionality
│   └── outfitAdapter.ts         # Data transformation utilities
├── assets/                       # Static assets (images, fonts)
│   ├── images/                  # App images and logos
│   └── fonts/                   # Custom fonts
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

### API Configuration

The app integrates with the TechCrush API. API configuration is handled in `api/axios.ts` and `constants/Config.ts`.

## 📱 App Features & Screens

### 🎨 Enhanced Splash Screen
- **MyStyleMag Logo**: Beautiful branded logo display
- **App Name**: "MyStyleMag" text below logo
- **White Background**: Clean, professional appearance
- **Loading Animation**: Smooth loading indicator

### 🔐 Authentication Flow
- **Onboarding**: Welcome screens introducing app features
- **Sign Up**: 
  - Email-based registration
  - Complete profile setup
  - Beautiful account exists modal
- **Sign In**: 
  - Secure login with TechCrush API
  - Elegant error handling with animated banners
  - "Explore exclusive, modern and exquisite African Designs" subtitle
- **Password Recovery**: Forgot password and OTP verification
- **Password Reset**: Beautiful success modal with branded design

### 🏠 Main Application

#### 🎯 Home Screen (Style Discovery)
- **Style Grid**: Browse curated African fashion outfits
- **Save to Lookbook**: Add styles to personal collections
- **Style Details**: View detailed outfit information
- **Search & Filter**: Find specific styles and categories

#### 🔍 Explore Screen
- **Extended Style Collection**: More outfit discovery options
- **Advanced Filtering**: Category-based filtering
- **Lookbook Integration**: Save favorite styles directly

#### 📖 Blog Screen
- **Featured Posts**: Carousel with pagination dots
- **Popular Posts**: Trending African fashion content
- **Search Functionality**: Real-time content filtering
- **Clean Design**: Removed inappropriate bookmark icons

#### 📚 Lookbook Screen
- **Personal Collections**: Create and manage custom lookbooks
- **Folder Management**: Organize styles by themes/occasions
- **Beautiful Modals**: Elegant creation and deletion confirmations
- **Export Features**: Share and export lookbook data
- **Error Handling**: Custom error cards for better UX

#### 👤 Profile & Settings
- **Profile Management**: Edit personal information
- **Account Security**: Privacy and security settings
- **Account Deletion**: Complete account removal functionality
- **Beautiful Modals**: Consistent design across all interactions

### 🎨 Design System Improvements

#### Enhanced UI Components
- **SuccessCard**: Elegant success messages with orange branding
- **ErrorCard**: Beautiful error displays with red theming
- **ErrorModal**: Full-screen error modals for critical issues
- **ConfirmationModal**: Consistent confirmation dialogs
- **ProfileEditModal**: Smooth profile editing experience

#### Consistent User Experience
- **No More Alert.alert()**: All system alerts replaced with branded components
- **Smooth Animations**: Slide-in/slide-out transitions
- **Auto-hide Messages**: Timed success and error messages
- **Visual Feedback**: Clear loading states and interactions

#### Color Palette
- **Primary Orange**: `#E9642C` - Main brand color
- **Success Green**: `#4CAF50` - Success states
- **Error Red**: `#FF6B6B` - Error states
- **Grays**: Various shades for text and backgrounds

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

# Reset project (clean cache)
npm run reset-project
```

### Key Features Implemented

#### ✅ Lookbook System
- Create custom fashion collections
- Organize styles by folders/themes
- Save and remove styles with elegant feedback
- Export lookbook data
- Beautiful folder management UI

#### ✅ Enhanced Authentication
- Real API integration with TechCrush backend
- Secure token-based authentication
- Complete account management
- Password reset with OTP verification
- Account deletion functionality

#### ✅ Improved User Experience
- Consistent design language across all screens
- Smooth animations and transitions
- Intelligent error handling
- Auto-clearing success messages
- Professional splash screen with branding

#### ✅ Content Management
- Blog content without inappropriate bookmarking
- Style discovery and saving system
- Category-based filtering
- Search functionality across content types

### Code Style & Standards

- **TypeScript**: Strict type checking enabled
- **Component Architecture**: Functional components with hooks
- **State Management**: Context API for global state
- **API Layer**: Centralized service layer for backend communication
- **Error Handling**: Comprehensive error boundaries and user feedback

## 📊 App Flow & User Journey

### New User Experience
1. **Splash Screen** (MyStyleMag logo) → **Onboarding** → **Sign Up** → **Main App**
2. **Profile Setup** and **Lookbook Creation**
3. **Style Discovery** and **Content Exploration**

### Returning User Experience
1. **Splash Screen** → **Auto Login** → **Main App**
2. **Quick Access** to personal lookbooks and saved styles
3. **Seamless Content Discovery**

### Content Discovery & Management
1. **Browse Styles** on home and explore screens
2. **Save to Lookbooks** with folder organization
3. **Read Fashion Blog** content
4. **Manage Collections** with export capabilities
5. **Profile Customization** and account management

## 🔒 Security & Privacy

- **TechCrush API Integration**: Secure backend authentication
- **Token-based Security**: JWT authentication system
- **Local Data Encryption**: Secure AsyncStorage implementation
- **Account Control**: Complete account deletion capabilities
- **Privacy Settings**: User control over personal data

## 🌍 Accessibility & Performance

- **Screen Reader Support**: Accessible component design
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Proper color contrast ratios
- **Responsive Design**: Adapts to different screen sizes
- **Performance Optimization**: Efficient rendering and state management

## 🚀 Deployment

### Production Builds
- **iOS**: App Store ready with proper provisioning
- **Android**: Play Store compatible APK/AAB generation
- **Expo Application Services**: Streamlined build process

### Environment Configuration
- **Development**: Local development with hot reloading
- **Staging**: Testing environment with production API
- **Production**: Optimized builds for app stores

## 📈 Recent Updates & Improvements

### Version 1.1.0 Features
- ✅ Complete lookbook system implementation
- ✅ Enhanced authentication with TechCrush API
- ✅ Beautiful modal system replacing system alerts
- ✅ Improved splash screen with branding
- ✅ Account management and deletion
- ✅ Consistent error handling across app
- ✅ Blog content optimization
- ✅ Style discovery and saving system
- ✅ Export functionality for user data

### UI/UX Improvements
- ✅ Consistent orange branding throughout app
- ✅ Smooth animations and transitions
- ✅ Professional success and error messaging
- ✅ Elegant confirmation dialogs
- ✅ Auto-hiding notifications
- ✅ Improved visual hierarchy

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** TypeScript and React Native best practices
4. **Test** on both iOS and Android platforms
5. **Submit** a Pull Request with detailed description

### Code Guidelines
- Use TypeScript for all new code
- Follow the established component architecture
- Implement proper error handling
- Add meaningful comments for complex logic
- Ensure accessibility compliance
- Test across different screen sizes

## 📞 Support & Contact

For support, feature requests, or bug reports:
- **GitHub Issues**: Create an issue in this repository
- **Documentation**: Check the inline code documentation
- **Code Review**: Follow established patterns in the codebase

## 📄 License

This project is private and proprietary. All rights reserved.

---

<div align="center">
  <p><strong>Built with ❤️ for African Fashion & Culture</strong></p>
  <p><em>Explore exclusive, modern and exquisite African Designs at your fingertips</em></p>
  <p>© 2025 MyStyleMag. All rights reserved.</p>
</div> 