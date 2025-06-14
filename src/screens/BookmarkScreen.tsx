import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import ArticleCard from '../components/ArticleCard';
import { clearAllBookmarks, getBookmarks } from '../services/BookmarkService';

interface Article {
  id: string;
  url: string;
  title: string;
  description: string;
  content: string;
  image: string;
  publishedAt: string;
  source: string;
  bookmarkedAt?: string;
}

interface BookmarkScreenProps {
  navigation: any;
}

const BookmarksScreen: React.FC<BookmarkScreenProps> = ({ navigation }) => {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookmarks = useCallback(async () => {
    try {
      console.log('Loading bookmarks...');
      setLoading(true);
      const savedBookmarks = await getBookmarks();
      console.log('Bookmarks loaded:', savedBookmarks.length);
      setBookmarks(savedBookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      Alert.alert('Error', 'Failed to load bookmarks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadBookmarks();
    } finally {
      setRefreshing(false);
    }
  }, [loadBookmarks]);

  const handleArticleTap = (article: Article) => {
    navigation.navigate('ArticleDetail', { article });
  };

  const handleClearAllBookmarks = () => {
    Alert.alert(
      'Clear All Bookmarks',
      'Are you sure you want to remove all bookmarked articles? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllBookmarks();
              setBookmarks([]);
              Alert.alert('Success', 'All bookmarks have been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear bookmarks. Please try again.');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => 
        bookmarks.length > 0 ? (
          <TouchableOpacity
            onPress={handleClearAllBookmarks}
            style={styles.headerButton}
          >
            <Image 
              source={require('../assets/cross.png')} 
              style={[styles.headerIcon, { tintColor: '#333' }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, bookmarks.length]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadBookmarks();
    });

    return unsubscribe;
  }, [navigation, loadBookmarks]);

  const renderBookmarkItem = ({ item }: { item: Article }) => (
    <ArticleCard
      article={item}
      onPress={() => handleArticleTap(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Image 
        source={require('../assets/bookmark.png')} 
        style={{ width: 64, height: 64, tintColor: '#ccc' }}
        resizeMode="contain"
      />
      <Text style={styles.emptyStateTitle}>No Bookmarks Yet</Text>
      <Text style={styles.emptyStateDescription}>
        Start bookmarking articles you want to read later. 
        Tap the bookmark icon on any article to save it here.
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.browseButtonText}>Browse News</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <Text style={styles.loadingText}>Loading your bookmarks...</Text>
    </View>
  );

  const renderListHeader = () => {
    if (bookmarks.length === 0) return null;
    
    return (
      <View style={styles.listHeader}>
        <Text style={styles.bookmarkCount}>
          {bookmarks.length} article{bookmarks.length !== 1 ? 's' : ''} saved
        </Text>
        <Text style={styles.listHeaderSubtext}>
          Most recently saved articles appear first
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        renderLoadingState()
      ) : bookmarks.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={bookmarks}
          renderItem={renderBookmarkItem}
          keyExtractor={(item) => item.url}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#2196F3']}
              tintColor="#2196F3"
            />
          }
          ListHeaderComponent={renderListHeader}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerButton: {
    marginRight: 16,
    padding: 4,
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  listContainer: {
    padding: 16,
  },
  listHeader: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  bookmarkCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  listHeaderSubtext: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

export default BookmarksScreen;