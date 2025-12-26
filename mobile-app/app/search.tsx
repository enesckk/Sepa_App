import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search as SearchIcon, X, Calendar, Newspaper } from 'lucide-react-native';
import { Colors } from '../src/constants/colors';
import { getNews, News } from '../src/services/api';
import { getEvents, Event } from '../src/services/api';
import { parseApiError } from '../src/utils/errorHandler';

type SearchCategory = 'all' | 'news' | 'events';

interface SearchResults {
  news: News[];
  events: Event[];
}

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({ news: [], events: [] });
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (query: string, category: SearchCategory) => {
    if (!query.trim()) {
      setResults({ news: [], events: [] });
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (__DEV__) {
        console.log('[SearchScreen] Performing search:', { query, category });
      }

      const searchPromises: Promise<any>[] = [];

      // Search news
      if (category === 'all' || category === 'news') {
        searchPromises.push(
          getNews({ search: query, limit: 10 })
            .then((result) => {
              if (__DEV__) {
                console.log('[SearchScreen] News search result:', result);
              }
              return result;
            })
            .catch((err) => {
              if (__DEV__) {
                console.error('[SearchScreen] News search error:', err);
              }
              // Don't fail silently, return empty result
              return { news: [], total: 0, limit: 10, offset: 0 };
            })
        );
      } else {
        searchPromises.push(Promise.resolve({ news: [], total: 0, limit: 10, offset: 0 }));
      }

      // Search events - search in both past and future events
      if (category === 'all' || category === 'events') {
        // For search, include events from the past year to future year to allow searching everything
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const dateFrom = oneYearAgo.toISOString().split('T')[0];
        
        const oneYearLater = new Date();
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
        const dateTo = oneYearLater.toISOString().split('T')[0];
        
        searchPromises.push(
          getEvents({ 
            search: query, 
            date_from: dateFrom,
            date_to: dateTo,
            limit: 20  // Get more results for search
          })
            .then((result) => {
              if (__DEV__) {
                console.log('[SearchScreen] Events search result:', {
                  query,
                  resultCount: result?.events?.length || 0,
                  total: result?.total || 0,
                  result: result,
                });
              }
              return result;
            })
            .catch((err) => {
              if (__DEV__) {
                console.error('[SearchScreen] Events search error:', {
                  query,
                  error: err,
                  message: err?.message,
                });
              }
              // Return empty result instead of throwing
              return { events: [], total: 0, limit: 20, offset: 0 };
            })
        );
      } else {
        searchPromises.push(Promise.resolve({ events: [], total: 0, limit: 20, offset: 0 }));
      }

      const [newsResult, eventsResult] = await Promise.all(searchPromises);

      if (__DEV__) {
        console.log('[SearchScreen] Combined results:', {
          newsCount: newsResult?.news?.length || 0,
          eventsCount: eventsResult?.events?.length || 0,
        });
      }

      const newsArray = newsResult?.news || [];
      const eventsArray = eventsResult?.events || [];

      setResults({
        news: Array.isArray(newsArray) ? newsArray : [],
        events: Array.isArray(eventsArray) ? eventsArray : [],
      });

      // If no results and we had a search query, show helpful message
      if (newsArray.length === 0 && eventsArray.length === 0 && query.trim()) {
        setError(null); // Don't show error, just show "no results" message
      }
    } catch (err) {
      const apiError = parseApiError(err);
      setError(apiError.message || 'Arama yapılırken bir hata oluştu');
      setResults({ news: [], events: [] });
      if (__DEV__) {
        console.error('[SearchScreen] Search error:', apiError);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery, selectedCategory);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, performSearch]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setResults({ news: [], events: [] });
  };

  const handleNewsPress = (news: News) => {
    // TODO: Navigate to news detail when created
    if (__DEV__) {
      console.log('[SearchScreen] News pressed:', news.id);
    }
  };

  const handleEventPress = (event: Event) => {
    // Navigate to events tab - users can find the event there
    router.push('/(tabs)/events');
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const totalResults = results.news.length + results.events.length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Ara</Text>
          <Text style={styles.headerSubtitle}>Uygulamada ara</Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <SearchIcon size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Haber, etkinlik ara..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            returnKeyType="search"
            onSubmitEditing={() => performSearch(searchQuery, selectedCategory)}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={handleClearSearch} style={styles.clearButton}>
              <X size={20} color={Colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { id: 'all' as SearchCategory, label: 'Tümü' },
            { id: 'news' as SearchCategory, label: 'Haberler' },
            { id: 'events' as SearchCategory, label: 'Etkinlikler' },
          ].map((category) => (
            <Pressable
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.id && styles.categoryButtonTextActive,
                ]}
              >
                {category.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {loading && searchQuery.trim() ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Aranıyor...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : searchQuery.trim() && totalResults === 0 ? (
          <View style={styles.emptyContainer}>
            <SearchIcon size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
            <Text style={styles.emptySubtext}>
              "{searchQuery}" için sonuç bulunamadı. Farklı bir arama terimi deneyin.
            </Text>
          </View>
        ) : !searchQuery.trim() ? (
          <View style={styles.emptyContainer}>
            <SearchIcon size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>Arama yapmak için yazın</Text>
            <Text style={styles.emptySubtext}>
              Haberler, etkinlikler ve daha fazlasını arayın
            </Text>
          </View>
        ) : (
          <>
            {/* News Results */}
            {results.news.length > 0 && (
              <View style={styles.resultsSection}>
                <View style={styles.sectionHeader}>
                  <Newspaper size={20} color={Colors.primary} />
                  <Text style={styles.sectionTitle}>Haberler ({results.news.length})</Text>
                </View>
                {results.news.map((news) => (
                  <Pressable
                    key={news.id}
                    onPress={() => handleNewsPress(news)}
                    style={styles.resultItem}
                  >
                    {news.image_url && (
                      <Image source={{ uri: news.image_url }} style={styles.resultImage} />
                    )}
                    <View style={styles.resultContent}>
                      <Text style={styles.resultTitle} numberOfLines={2}>
                        {news.title}
                      </Text>
                      {(news.summary || news.content) && (
                        <Text style={styles.resultExcerpt} numberOfLines={2}>
                          {news.summary || news.content.replace(/<[^>]*>/g, '').substring(0, 100)}
                        </Text>
                      )}
                      {news.published_at && (
                        <Text style={styles.resultDate}>{formatDate(news.published_at)}</Text>
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Events Results */}
            {results.events.length > 0 && (
              <View style={styles.resultsSection}>
                <View style={styles.sectionHeader}>
                  <Calendar size={20} color={Colors.primary} />
                  <Text style={styles.sectionTitle}>Etkinlikler ({results.events.length})</Text>
                </View>
                {results.events.map((event) => (
                  <Pressable
                    key={event.id}
                    onPress={() => handleEventPress(event)}
                    style={styles.resultItem}
                  >
                    {event.image_url && (
                      <Image source={{ uri: event.image_url }} style={styles.resultImage} />
                    )}
                    <View style={styles.resultContent}>
                      <Text style={styles.resultTitle} numberOfLines={2}>
                        {event.title}
                      </Text>
                      {event.description && (
                        <Text style={styles.resultExcerpt} numberOfLines={2}>
                          {event.description}
                        </Text>
                      )}
                      {event.date && (
                        <Text style={styles.resultDate}>{formatDate(event.date)}</Text>
                      )}
                      {event.location && (
                        <Text style={styles.resultLocation}>{event.location}</Text>
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  categoryContainer: {
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryButtonTextActive: {
    color: Colors.surface,
  },
  resultsContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  resultsSection: {
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  resultItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.border,
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  resultExcerpt: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  resultDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  resultLocation: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 4,
  },
});

