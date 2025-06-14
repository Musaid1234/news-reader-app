import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { isArticleBookmarked, toggleBookmark } from '../services/BookmarkService';

const { width: screenWidth } = Dimensions.get('window');

interface Article {
  url: string;
  title: string;
  description: string;
  content: string;
  image: string;
  publishedAt: string;
  source: string;
}

interface ArticleCardProps {
  article: Article;
  onPress: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onPress }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const bookmarked = await isArticleBookmarked(article.url);
        setIsBookmarked(bookmarked);
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };

    if (article?.url) {
      checkBookmarkStatus();
    }
  }, [article?.url]);

  const handleBookmarkPress = async () => {
    try {
      setBookmarkLoading(true);
      
      const newBookmarkStatus = await toggleBookmark(article);
      setIsBookmarked(newBookmarkStatus);
      
      Alert.alert(
        'Success',
        newBookmarkStatus ? 'Article bookmarked!' : 'Bookmark removed!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update bookmark. Please try again.');
      console.error('Bookmark error:', error);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      }
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {article.image ? (
          <Image
            source={{ uri: article.image }}
            style={styles.image}
            resizeMode="cover"
            onError={(error) => {
              console.log('Image loading error:', error);
            }}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Image 
              source={require('../assets/news.png')} 
              style={{ width: 32, height: 32, tintColor: '#ccc' }}
              resizeMode="contain"
            />
          </View>
        )}
        
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={handleBookmarkPress}
          disabled={bookmarkLoading}
          activeOpacity={0.7}
        >
          <Image 
            source={
              isBookmarked 
                ? require('../assets/bookmark-filled.png')
                : require('../assets/bookmark.png')
            } 
            style={[
              styles.bookmarkIcon, 
              { tintColor: isBookmarked ? 'red' : '#fff' }
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.metaContainer}>
          <Text style={styles.sourceText}>{article.source}</Text>
          <Text style={styles.dateText}>{formatDate(article.publishedAt)}</Text>
        </View>

        <Text style={styles.title} numberOfLines={3}>
          {article.title}
        </Text>

        <Text style={styles.description} numberOfLines={3}>
          {article.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkIcon: {
    width: 20,
    height: 20,
  },
  contentContainer: {
    padding: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sourceText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default ArticleCard;