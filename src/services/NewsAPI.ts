import axios from 'axios';

const API_CONFIG = {
  BASE_URL: 'https://gnews.io/api/v4',
  API_KEY: '6ee9060d1e8618dbf7cce014de237d23',
  DEFAULT_PARAMS: {
    lang: 'en',
    country: 'in',
    max: 10,
  }
};

interface NewsResponse {
  articles: any[];
  totalArticles: number;
  currentPage: number;
  hasMorePages: boolean;
}

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please check your internet connection.');
    } else if (error.response?.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else {
      throw new Error('Failed to fetch news. Please try again.');
    }
  }
);

export const fetchNews = async (query = 'general', page = 1): Promise<NewsResponse> => {
  try {
    console.log(`Fetching news for category: ${query}, page: ${page}`);
    
    const offset = (page - 1) * API_CONFIG.DEFAULT_PARAMS.max;
    
    const response = await apiClient.get('/top-headlines', {
      params: {
        category: query,
        apikey: API_CONFIG.API_KEY,
        ...API_CONFIG.DEFAULT_PARAMS,
        from: offset,
      }
    });

    console.log('API Response received:', response.data);
    
    const totalArticles = response.data.totalArticles || 0;
    const articlesPerPage = API_CONFIG.DEFAULT_PARAMS.max;
    const hasMorePages = (page * articlesPerPage) < totalArticles;

    return {
      articles: response.data.articles || [],
      totalArticles,
      currentPage: page,
      hasMorePages,
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const fetchTrendingNews = async (page = 1): Promise<NewsResponse> => {
  try {
    console.log(`Loading trending news, page: ${page}`);
    
    const offset = (page - 1) * API_CONFIG.DEFAULT_PARAMS.max;
    
    const response = await fetch(
      `https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=us&max=${API_CONFIG.DEFAULT_PARAMS.max}&from=${offset}&apikey=${API_CONFIG.API_KEY}`
    );
    
    const newsData = await response.json();
    
    const totalArticles = newsData.totalArticles || 0;
    const articlesPerPage = API_CONFIG.DEFAULT_PARAMS.max;
    const hasMorePages = (page * articlesPerPage) < totalArticles;

    return {
      articles: newsData.articles || [],
      totalArticles,
      currentPage: page,
      hasMorePages,
    };
  } catch (error) {
    console.error('Error loading trending news:', error);
    throw error;
  }
};

export const searchNews = async (searchTerm: string, page = 1): Promise<NewsResponse> => {
  try {
    console.log(`Searching news for term: ${searchTerm}, page: ${page}`);
    
    const offset = (page - 1) * API_CONFIG.DEFAULT_PARAMS.max;
    
    const response = await apiClient.get('/search', {
      params: {
        q: searchTerm,
        apikey: API_CONFIG.API_KEY,
        ...API_CONFIG.DEFAULT_PARAMS,
        from: offset,
      }
    });

    console.log('Search API Response received:', response.data);
    
    const totalArticles = response.data.totalArticles || 0;
    const articlesPerPage = API_CONFIG.DEFAULT_PARAMS.max;
    const hasMorePages = (page * articlesPerPage) < totalArticles;

    return {
      articles: response.data.articles || [],
      totalArticles,
      currentPage: page,
      hasMorePages,
    };
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
};

export const formatArticle = (article: any) => {
  console.log('Formatting article:', article.title);
  return {
    id: article.url,
    title: article.title || 'No Title',
    description: article.description || 'No description available',
    content: article.content || 'Content not available',
    url: article.url,
    image: article.image || null,
    publishedAt: article.publishedAt,
    source: article.source?.name || 'Unknown Source',
    sourceUrl: article.source?.url || '',
  };
};