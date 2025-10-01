import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import PaperCard from '../components/PaperCard';
import { storageUtils } from '../utils/storage';

export default function BookmarkScreen({ navigation }) {
  const [bookmarkedPapers, setBookmarkedPapers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadBookmarkedPapers();
    }, [])
  );

  const loadBookmarkedPapers = async () => {
    try {
      setLoading(true);
      const papers = await storageUtils.getBookmarkedPapers();
      setBookmarkedPapers(papers);
    } catch (error) {
      console.error('Error loading bookmarked papers:', error);
      Alert.alert('Error', 'Failed to load saved papers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookmarkedPapers();
    setRefreshing(false);
  };

  const handleBookmarkChange = (paperId, isBookmarked) => {
    if (!isBookmarked) {
      // Remove from local state when unbookmarked
      setBookmarkedPapers(prevPapers => 
        prevPapers.filter(paper => paper.id !== paperId)
      );
    }
  };

  const clearAllBookmarks = () => {
    Alert.alert(
      'Clear All Bookmarks',
      'Are you sure you want to remove all saved papers?',
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
              await storageUtils.removeBookmarkedPaper('all');
              setBookmarkedPapers([]);
            } catch (error) {
              Alert.alert('Error', 'Failed to clear bookmarks. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderPaper = ({ item }) => (
    <PaperCard
      paper={item}
      onBookmarkChange={handleBookmarkChange}
      navigation={navigation}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bookmark-outline" size={64} color="#cccccc" />
      <Text style={styles.emptyTitle}>No Saved Papers</Text>
      <Text style={styles.emptySubtitle}>
        Papers you bookmark will appear here.{'\n'}
        Start exploring the feed to save interesting papers!
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Feed')}
        activeOpacity={0.8}
      >
        <Text style={styles.exploreButtonText}>Explore Papers</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => {
    if (bookmarkedPapers.length === 0) return null;
    
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {bookmarkedPapers.length} saved paper{bookmarkedPapers.length !== 1 ? 's' : ''}
        </Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearAllBookmarks}
          activeOpacity={0.7}
        >
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading saved papers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarkedPapers}
        renderItem={renderPaper}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  listContainer: {
    paddingVertical: 16,
    paddingBottom: 32,
  },
  separator: {
    height: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: '#555555',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#ff3b30',
    fontWeight: '500',
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
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
