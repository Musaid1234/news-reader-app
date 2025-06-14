import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Share,
  Dimensions,
} from 'react-native';
import { isArticleBookmarked, toggleBookmark } from '../services/BookmarkService';

const { width: screenWidth } = Dimensions.get('window');

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

interface ArticleDetailScreenProps {
  route: {
    params: {
      article: Article;
    };
  };
  navigation: any;
}

const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({ route, navigation }) => {
  const { article } = route.params;
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        console.log('Checking bookmark status for article:', article.url);
        const bookmarked = await isArticleBookmarked(article.url);
        console.log('Article bookmark status:', bookmarked);
        setIsBookmarked(bookmarked);
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };

    checkBookmarkStatus();
  }, [article.url]);

  const handleBookmarkPress = async () => {
    try {
      console.log('Toggling bookmark for article:', article.title);
      setBookmarkLoading(true);
      const newBookmarkStatus = await toggleBookmark(article);
      console.log('New bookmark status:', newBookmarkStatus);
      setIsBookmarked(newBookmarkStatus);
      
      Alert.alert(
        'Success',
        newBookmarkStatus ? 'Article bookmarked!' : 'Bookmark removed!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      Alert.alert('Error', 'Failed to update bookmark. Please try again.');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleOpenInBrowser = async () => {
    try {
      const supported = await Linking.canOpenURL(article.url);
      if (supported) {
        await Linking.openURL(article.url);
      } else {
        Alert.alert('Error', "Cannot open this URL");
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open article in browser');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\n${article.description}\n\nRead more: ${article.url}`,
        url: article.url,
        title: article.title,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Date not available';
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={handleBookmarkPress}
            disabled={bookmarkLoading}
            style={styles.headerButton}
          >
            <Image 
              source={
                isBookmarked 
                  ? require('../assets/heart-filled.png')
                  : require('../assets/heart.png')
              } 
              style={[
                styles.headerIcon, 
                { tintColor: isBookmarked ? '#FF6B6B' : '#333' }
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShare}
            style={styles.headerButton}
          >
            <View style={styles.shareIcon}>
              <View style={styles.shareIconBox}>
                <View style={styles.shareIconArrow} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isBookmarked, bookmarkLoading]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {article.image && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: article.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}

      <View style={styles.contentContainer}>
        <View style={styles.metaContainer}>
          <Text style={styles.sourceText}>{article.source}</Text>
          <Text style={styles.dateText}>{formatDate(article.publishedAt)}</Text>
        </View>

        <Text style={styles.title}>{article.title}</Text>

        {article.description && (
          <Text style={styles.description}>{article.description}</Text>
        )}

        {article.content && (
          <View style={styles.articleContentContainer}>
            <Text style={styles.articleContent}>{article.content}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={handleOpenInBrowser}
        >
          <Image 
            source={require('../assets/link.png')} 
            style={[styles.linkIcon, { tintColor: '#fff' }]}
            resizeMode="contain"
          />
          <Text style={styles.readMoreText}>Read Full Article</Text>
        </TouchableOpacity>

        <View style={styles.sourceContainer}>
          <Text style={styles.sourceLabel}>Source: </Text>
          <TouchableOpacity onPress={handleOpenInBrowser}>
            <Text style={styles.sourceLink}>{article.source}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 16,
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  shareIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIconBox: {
    width: 18,
    height: 12,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 2,
    position: 'relative',
  },
  shareIconArrow: {
    position: 'absolute',
    top: -8,
    right: 3,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#333',
  },
  imageContainer: {
    width: '100%',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sourceText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 32,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  articleContentContainer: {
    marginBottom: 24,
  },
  articleContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 26,
    textAlign: 'justify',
  },
  readMoreButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  linkIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  readMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sourceLabel: {
    fontSize: 14,
    color: '#666',
  },
  sourceLink: {
    fontSize: 14,
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
});

export default ArticleDetailScreen;