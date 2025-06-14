import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKMARKS_KEY = 'user_bookmarks';

interface Article {
  url: string;
  title: string;
  description: string;
  content: string;
  image: string;
  publishedAt: string;
  source: string;
}

export const getBookmarks = async (): Promise<Article[]> => {
  try {
    console.log('Getting bookmarks...');
    const bookmarksData = await AsyncStorage.getItem(BOOKMARKS_KEY);
    console.log('Raw bookmark data:', bookmarksData);
    
    if (bookmarksData) {
      const parsed = JSON.parse(bookmarksData);
      console.log('Parsed bookmarks:', parsed);
      return parsed;
    }
    console.log('No bookmarks found, returning empty array');
    return [];
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    return [];
  }
};

export const addBookmark = async (article: Article): Promise<boolean> => {
  try {
    console.log('Adding bookmark for:', article.title);
    const existingBookmarks = await getBookmarks();
    
    const isAlreadyBookmarked = existingBookmarks.some(
      bookmark => bookmark.url === article.url
    );
    
    if (isAlreadyBookmarked) {
      console.log('Article already bookmarked');
      return false;
    }
    
    const bookmarkWithTimestamp = {
      ...article,
      bookmarkedAt: new Date().toISOString(),
    };
    
    const updatedBookmarks = [bookmarkWithTimestamp, ...existingBookmarks];
    
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    console.log('Bookmark added successfully');
    return true;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw new Error('Failed to save bookmark');
  }
};

export const removeBookmark = async (articleUrl: string): Promise<boolean> => {
  try {
    console.log('Removing bookmark for URL:', articleUrl);
    const existingBookmarks = await getBookmarks();
    
    const updatedBookmarks = existingBookmarks.filter(
      bookmark => bookmark.url !== articleUrl
    );
    
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    console.log('Bookmark removed successfully');
    return true;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw new Error('Failed to remove bookmark');
  }
};

export const isArticleBookmarked = async (articleUrl: string): Promise<boolean> => {
  try {
    console.log('Checking if article is bookmarked:', articleUrl);
    const bookmarks = await getBookmarks();
    const isBookmarked = bookmarks.some(bookmark => bookmark.url === articleUrl);
    console.log('Is bookmarked:', isBookmarked);
    return isBookmarked;
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
};

export const toggleBookmark = async (article: Article): Promise<boolean> => {
  try {
    console.log('Toggling bookmark for:', article.title);
    const isBookmarked = await isArticleBookmarked(article.url);
    
    if (isBookmarked) {
      await removeBookmark(article.url);
      return false;
    } else {
      await addBookmark(article);
      return true;
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    throw error;
  }
};

export const clearAllBookmarks = async (): Promise<boolean> => {
  try {
    console.log('Clearing all bookmarks');
    await AsyncStorage.removeItem(BOOKMARKS_KEY);
    console.log('All bookmarks cleared');
    return true;
  } catch (error) {
    console.error('Error clearing bookmarks:', error);
    throw new Error('Failed to clear bookmarks');
  }
};