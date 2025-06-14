import React from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import BookmarksScreen from '../screens/BookmarkScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';

interface Article {
  id: string;
  url: string;
  title: string;
  description: string;
  content: string;
  image: string;
  publishedAt: string;
  source: string;
}

type StackParamList = {
  HomeTab: undefined;
  BookmarksTab: undefined;
  ArticleDetail: {
    article: Article;
  };
};

type TabParamList = {
  Home: undefined;
  Bookmarks: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<StackParamList>();

function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ title: 'Latest News' }}
      />
      <Stack.Screen 
        name="ArticleDetail" 
        component={ArticleDetailScreen} 
        options={{ title: 'Article Details' }}
      />
    </Stack.Navigator>
  );
}

function BookmarksStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="BookmarksTab" 
        component={BookmarksScreen} 
        options={{ title: 'My Bookmarks' }}
      />
      <Stack.Screen 
        name="ArticleDetail" 
        component={ArticleDetailScreen} 
        options={{ title: 'Article Details' }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;
          
          if (route.name === 'Home') {
            iconSource = require('../assets/news.png');
          } else if (route.name === 'Bookmarks') {
            iconSource = focused 
              ? require('../assets/bookmark-filled.png')
              : require('../assets/bookmark.png');
          }

          return (
            <Image 
              source={iconSource} 
              style={{ 
                width: size, 
                height: size, 
                tintColor: color 
              }} 
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#666',    
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator}
        options={{ title: 'News' }}
      />
      <Tab.Screen 
        name="Bookmarks" 
        component={BookmarksStackNavigator}
        options={{ title: 'Saved' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}