# React Native News Reader App

A modern, feature-rich news reader application built with React Native CLI that allows users to stay updated with the latest headlines and save articles for later reading.

## 📱 Features

### Core Functionality
- **Latest News Feed**: Browse current news articles from reliable sources
- **Article Details**: Read full article content with images and source attribution
- **Bookmark System**: Save interesting articles for later reading with persistent storage
- **Search Functionality**: Find articles on specific topics or keywords
- **Share Articles**: Share news articles with friends and social media

### User Experience
- **Pull-to-Refresh**: Update content with a simple swipe gesture
- **Responsive Design**: Clean, modern interface optimized for mobile devices
- **Smooth Navigation**: Intuitive bottom tab navigation between news feed and bookmarks
- **Offline Bookmarks**: Access saved articles even without internet connection
- **Visual Feedback**: Clear indicators for bookmark status and loading states

## 🛠 Technology Stack

- **Framework**: React Native CLI
- **Navigation**: React Navigation (Bottom Tabs + Stack Navigation)
- **HTTP Client**: Axios for API communication
- **Local Storage**: AsyncStorage for bookmark persistence
- **Icons**: React Native Vector Icons (Material Icons)
- **API**: GNews.io for news content

## 📊 API Source

This app uses the GNews API to fetch real-time news articles. The API provides:
- Latest news from multiple sources
- Search functionality for specific topics
- Article metadata including images, descriptions, and publication dates
- Support for different languages and countries

## 🚀 Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- React Native CLI
- Android Studio with SDK (for Android development)
- Java Development Kit (JDK 8 or higher)
- Android device or emulator

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Musaid1234/news-reader-app.git
   cd news-reader-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Link vector icons (for Android)**
   ```bash
   npx react-native link react-native-vector-icons
   ```

4. **Start Metro bundler**
   ```bash
   npx react-native start
   ```

5. **Run on Android device/emulator**
   ```bash
   npx react-native run-android
   ```

### Troubleshooting
- If you encounter build errors, try cleaning the project:
  ```bash
  cd android && ./gradlew clean && cd ..
  ```
- For Metro bundler issues, reset the cache:
  ```bash
  npx react-native start --reset-cache
  ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ArticleCard.js   # Article display component
├── navigation/          # Navigation configuration
│   └── AppNavigator.js  # Main navigation setup
├── screens/            # Full-screen components
│   ├── HomeScreen.js    # News feed screen
│   ├── BookmarksScreen.js # Saved articles screen
│   └── ArticleDetailScreen.js # Article detail view
├── services/           # API and data services
│   ├── newsAPI.js      # GNews API integration
│   └── bookmarkService.js # Local storage management
└── utils/              # Helper functions
```

## 🎯 Key Learning Outcomes

Building this app demonstrates proficiency in:

### React Native Development
- Component-based architecture and reusable UI elements
- State management with React hooks (useState, useEffect)
- Navigation between multiple screens using React Navigation
- Responsive design principles for mobile interfaces

### Mobile App Concepts
- Asynchronous data fetching and error handling
- Local data persistence with AsyncStorage
- Pull-to-refresh patterns for better user experience
- Proper loading states and user feedback

### API Integration
- RESTful API consumption with proper error handling
- Data transformation and formatting for UI consumption
- Search functionality implementation
- Network request optimization

### Software Engineering Practices
- Modular code organization with separation of concerns
- Service layer architecture for data management
- Git version control and proper commit practices
- Documentation and code commenting

## 🔧 Available Scripts

- `npm start` - Start the Metro bundler
- `npx react-native run-android` - Run on Android device/emulator
- `npx react-native run-ios` - Run on iOS device/simulator (requires macOS)
- `cd android && ./gradlew assembleDebug` - Build APK for testing

## 📱 APK Download

You can download and install the latest APK build here: [APK Download Link]

*Note: This is a debug build for testing purposes. Enable "Unknown Sources" in your Android settings to install.*

## 🔮 Future Enhancements

Potential improvements for future versions:
- Offline reading mode with article caching
- Push notifications for breaking news
- User preferences for news categories
- Social features like commenting and sharing
- Dark mode theme option
- Multiple language support

## 👨‍💻 Developer

Built as part of a React Native development assignment to demonstrate mobile app development skills and understanding of modern React Native patterns.

## 📄 License

This project is created for educational purposes and uses the GNews API for news content.

---

*This README demonstrates the developer's ability to create comprehensive documentation alongside functional code, showcasing both technical and communication skills essential for modern software development.*