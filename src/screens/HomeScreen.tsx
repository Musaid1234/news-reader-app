import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import ArticleCard from '../components/ArticleCard';
import { fetchNews, formatArticle, searchNews, fetchTrendingNews } from '../services/NewsAPI';

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

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'latest' | 'trending'>('latest');

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); 
  const [totalArticles, setTotalArticles] = useState(0);

  const loadNews = useCallback(async (query = 'general', page = 1, shouldAppend = false) => {
    try {
      console.log(`Loading news with query: ${query}, page: ${page}, append: ${shouldAppend}`);
      
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const newsData = await fetchNews(query, page);
      console.log('News data received:', newsData);
      
      const formattedArticles = newsData.articles.map(formatArticle);
      console.log(`Formatted ${formattedArticles.length} articles for page ${page}`);
      
      if (shouldAppend) {
        setArticles(prevArticles => {
          const existingUrls = new Set(prevArticles.map(article => article.url));
          const newArticles = formattedArticles.filter(article => !existingUrls.has(article.url));
          return [...prevArticles, ...newArticles];
        });
      } else {
        setArticles(formattedArticles);
      }
      
      setCurrentPage(newsData.currentPage);
      setHasMorePages(newsData.hasMorePages);
      setTotalArticles(newsData.totalArticles);
      
    } catch (error: any) {
      console.error('Error in loadNews:', error);
      Alert.alert(
        'Error Loading News',
        error.message || 'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadTrendingNews = useCallback(async (page = 1, shouldAppend = false) => {
    try {
      console.log(`Loading trending news, page: ${page}, append: ${shouldAppend}`);
      
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const newsData = await fetchTrendingNews(page);
      const formattedArticles = newsData.articles.map(formatArticle);
      
      if (shouldAppend) {
        setArticles(prevArticles => {
          const existingUrls = new Set(prevArticles.map(article => article.url));
          const newArticles = formattedArticles.filter(article => !existingUrls.has(article.url));
          return [...prevArticles, ...newArticles];
        });
      } else {
        setArticles(formattedArticles);
      }
      
      setCurrentPage(newsData.currentPage);
      setHasMorePages(newsData.hasMorePages);
      setTotalArticles(newsData.totalArticles);
      
    } catch (error: any) {
      console.error('Error loading trending news:', error);
      Alert.alert(
        'Error Loading Trending News',
        error.message || 'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const performSearch = useCallback(async (query: string, page = 1, shouldAppend = false) => {
    try {
      console.log(`Searching for: ${query}, page: ${page}, append: ${shouldAppend}`);
      
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setIsSearching(true);
      
      const searchResults = await searchNews(query, page);
      const formattedArticles = searchResults.articles.map(formatArticle);
      
      if (shouldAppend) {
        setArticles(prevArticles => {
          const existingUrls = new Set(prevArticles.map(article => article.url));
          const newArticles = formattedArticles.filter(article => !existingUrls.has(article.url));
          return [...prevArticles, ...newArticles];
        });
      } else {
        setArticles(formattedArticles);
      }
      
      setCurrentPage(searchResults.currentPage);
      setHasMorePages(searchResults.hasMorePages);
      setTotalArticles(searchResults.totalArticles);
      
    } catch (error: any) {
      Alert.alert('Search Error', error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadMoreArticles = useCallback(() => {
    if (loadingMore || !hasMorePages) {
      return;
    }

    console.log(`Loading more articles, current page: ${currentPage}, has more: ${hasMorePages}`);
    
    const nextPage = currentPage + 1;
    
    if (isSearching && searchQuery.trim()) {
      performSearch(searchQuery, nextPage, true);
    } else if (activeTab === 'latest') {
      loadNews('general', nextPage, true);
    } else {
      loadTrendingNews(nextPage, true);
    }
  }, [currentPage, hasMorePages, loadingMore, isSearching, searchQuery, activeTab, performSearch, loadNews, loadTrendingNews]);

  const handleTabChange = (tab: 'latest' | 'trending') => {
    console.log(`Switching to tab: ${tab}`);
    setActiveTab(tab);
    setIsSearching(false);
    setSearchQuery('');
    
    setCurrentPage(1);
    setHasMorePages(true);
    setTotalArticles(0);
    
    if (tab === 'latest') {
      loadNews('general', 1, false);
    } else {
      loadTrendingNews(1, false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setCurrentPage(1);
      setHasMorePages(true);
      
      if (activeTab === 'latest') {
        loadNews('general', 1, false);
      } else {
        loadTrendingNews(1, false);
      }
      return;
    }

    setCurrentPage(1);
    setHasMorePages(true);
    setTotalArticles(0);
    
    performSearch(searchQuery, 1, false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setCurrentPage(1);
    setHasMorePages(true);
    setTotalArticles(0);
    
    if (activeTab === 'latest') {
      loadNews('general', 1, false);
    } else {
      loadTrendingNews(1, false);
    }
  };

  const handleRefresh = useCallback(async () => {
    console.log('Refreshing content...');
    setRefreshing(true);
    
    setCurrentPage(1);
    setHasMorePages(true);
    setTotalArticles(0);
    
    try {
      if (isSearching && searchQuery) {
        await performSearch(searchQuery, 1, false);
      } else if (activeTab === 'latest') {
        await loadNews('general', 1, false);
      } else {
        await loadTrendingNews(1, false);
      }
    } finally {
      setRefreshing(false);
    }
  }, [isSearching, searchQuery, activeTab, performSearch, loadNews, loadTrendingNews]);

  const handleArticleTap = (article: Article) => {
    navigation.navigate('ArticleDetail', { article });
  };

  useEffect(() => {
    loadNews('general', 1, false);
  }, [loadNews]);

  const renderArticleItem = ({ item }: { item: Article }) => (
    <ArticleCard
      article={item}
      onPress={() => handleArticleTap(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Image 
        source={require('../assets/news.png')} 
        style={{ width: 64, height: 64, tintColor: '#ccc' }}
        resizeMode="contain"
      />
      <Text style={styles.emptyStateText}>
        {isSearching ? 'No articles found for your search' : 'No news articles available'}
      </Text>
      {isSearching && (
        <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch}>
          <Text style={styles.clearSearchText}>Show All News</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <ActivityIndicator size="large" color="#2196F3" />
      <Text style={styles.loadingText}>Loading news...</Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#2196F3" />
        <Text style={styles.footerLoaderText}>Loading more articles...</Text>
      </View>
    );
  };

  const renderTabBar = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'latest' && styles.activeTab]}
        onPress={() => handleTabChange('latest')}
      >
        <Image 
          source={require('../assets/latest.png')} 
          style={[
            styles.tabIcon, 
            { tintColor: activeTab === 'latest' ? '#2196F3' : '#666' }
          ]}
          resizeMode="contain"
        />
        <Text style={[
          styles.tabText, 
          activeTab === 'latest' && styles.activeTabText
        ]}>
          Latest
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'trending' && styles.activeTab]}
        onPress={() => handleTabChange('trending')}
      >
        <Image 
          source={require('../assets/trending.png')} 
          style={[
            styles.tabIcon, 
            { tintColor: activeTab === 'trending' ? '#2196F3' : '#666' }
          ]}
          resizeMode="contain"
        />
        <Text style={[
          styles.tabText, 
          activeTab === 'trending' && styles.activeTabText
        ]}>
          Trending
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Image 
            source={require('../assets/search.png')} 
            style={[styles.searchIcon, { tintColor: '#666' }]}
            resizeMode="contain"
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search news..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Image 
                source={require('../assets/cross.png')} 
                style={[styles.clearIcon, { tintColor: '#666' }]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {!isSearching && renderTabBar()}

      {loading && articles.length === 0 ? (
        renderLoadingState()
      ) : (
        <FlatList
          data={articles}
          renderItem={renderArticleItem}
          keyExtractor={(item) => item.id}
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
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
          onEndReached={loadMoreArticles}
          onEndReachedThreshold={0.1}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
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
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    width: 16,
    height: 16,
  },
  searchButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  listHeader: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  articlesCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  moreAvailable: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerLoaderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  clearSearchButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  clearSearchText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;