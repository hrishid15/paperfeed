import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
  Alert,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FullScreenPaperCard from '../components/FullScreenPaperCard';
import { storageUtils } from '../utils/storage';
import papersData from '../data/papers.json';

const { height } = Dimensions.get('window');

const ITEMS_PER_PAGE = 5;

export default function FeedScreen({ navigation }) {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [userInterests, setUserInterests] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      loadUserInterests();
      loadInitialPapers();
    }, [])
  );

  const loadUserInterests = async () => {
    try {
      const interests = await storageUtils.getUserInterests();
      setUserInterests(interests);
    } catch (error) {
      console.error('Error loading user interests:', error);
    }
  };

  const filterPapersByInterests = (papersData, interests) => {
    if (interests.length === 0) {
      return papersData;
    }

    const interestCategories = {
      'ml': ['Machine Learning'],
      'nlp': ['Machine Learning', 'Natural Language Processing'],
      'cv': ['Machine Learning', 'Computer Vision'],
      'robotics': ['Robotics'],
      'ai': ['Machine Learning', 'Artificial Intelligence'],
      'deep-learning': ['Machine Learning'],
      'reinforcement': ['Machine Learning'],
      'neuroscience': ['Neuroscience'],
      'statistics': ['Statistics'],
      'optimization': ['Optimization'],
      'graphics': ['Computer Graphics'],
      'systems': ['Systems'],
    };

    return papersData.filter(paper => {
      return interests.some(interest => {
        const categories = interestCategories[interest] || [];
        return categories.includes(paper.category);
      });
    });
  };

  const loadInitialPapers = async () => {
    try {
      setLoading(true);
      const filteredPapers = filterPapersByInterests(papersData, userInterests);
      
      // Shuffle papers for variety
      const shuffledPapers = filteredPapers.sort(() => Math.random() - 0.5);
      
      setPapers(shuffledPapers.slice(0, ITEMS_PER_PAGE));
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading papers:', error);
      Alert.alert('Error', 'Failed to load papers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadMorePapers = async () => {
    if (loadingMore) return;

    try {
      setLoadingMore(true);
      const filteredPapers = filterPapersByInterests(papersData, userInterests);
      const startIndex = currentPage * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      
      if (startIndex < filteredPapers.length) {
        const newPapers = filteredPapers.slice(startIndex, endIndex);
        setPapers(prevPapers => [...prevPapers, ...newPapers]);
        setCurrentPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error loading more papers:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserInterests();
    await loadInitialPapers();
    setRefreshing(false);
  };

  const handleBookmarkChange = (paperId, isBookmarked) => {
    // Update local state if needed for UI feedback
    console.log(`Paper ${paperId} bookmark status changed to ${isBookmarked}`);
  };

  const renderPaper = ({ item, index }) => (
    <View style={styles.paperContainer}>
      <FullScreenPaperCard
        paper={item}
        onBookmarkChange={handleBookmarkChange}
        navigation={navigation}
      />
    </View>
  );

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingText}>Loading more papers...</Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Papers Found</Text>
      <Text style={styles.emptySubtitle}>
        Try refreshing or check your interests in the settings
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading papers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={papers}
        renderItem={renderPaper}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        onEndReached={loadMorePapers}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        pagingEnabled={true}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
      />
      
      {/* Paper counter */}
      {papers.length > 0 && (
        <View style={styles.paperCounter}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {papers.length}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  paperContainer: {
    height: height,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  footerLoader: {
    height: height,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
    backgroundColor: '#1a1a1a',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 22,
  },
  paperCounter: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  counterText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
});
