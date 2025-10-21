import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storageUtils } from '../utils/storage';

const { width, height } = Dimensions.get('window');

export default function FullScreenPaperCard({ paper, onBookmarkChange, navigation }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    checkBookmarkStatus();
  }, []);

  const checkBookmarkStatus = async () => {
    const bookmarked = await storageUtils.isPaperBookmarked(paper.id);
    setIsBookmarked(bookmarked);
  };

  const toggleBookmark = async () => {
    try {
      if (isBookmarked) {
        await storageUtils.removeBookmarkedPaper(paper.id);
        setIsBookmarked(false);
        onBookmarkChange?.(paper.id, false);
      } else {
        await storageUtils.saveBookmarkedPaper(paper);
        setIsBookmarked(true);
        onBookmarkChange?.(paper.id, true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update bookmark. Please try again.');
    }
  };

  const navigateToDetail = () => {
    if (navigation) {
      navigation.navigate('PaperDetail', { paper });
    }
  };

  const getAuthorsText = () => {
    if (paper.authors.length <= 3) {
      return paper.authors.join(', ');
    } else {
      return `${paper.authors.slice(0, 3).join(', ')} et al.`;
    }
  };

  const getAbstractPreview = () => {
    const maxLength = 500;
    if (paper.abstract.length <= maxLength) {
      return paper.abstract;
    }
    return paper.abstract.substring(0, maxLength).trim();
  };

  const getTitleFontSize = () => {
    const titleLength = paper.title.length;
    if (titleLength < 50) return 26;
    if (titleLength < 80) return 24;
    if (titleLength < 120) return 22;
    return 20;
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={navigateToDetail}
      activeOpacity={0.95}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header with category and bookmark */}
      <View style={styles.header}>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{paper.category}</Text>
          {paper.year && <Text style={styles.year}>{paper.year}</Text>}
        </View>
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleBookmark();
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={32}
            color={isBookmarked ? '#007AFF' : '#ffffff'}
          />
        </TouchableOpacity>
      </View>

      {/* Main content area */}
      <View style={styles.content}>
        <View style={styles.topSection}>
          {/* Title */}
          <Text style={[styles.title, { fontSize: getTitleFontSize() }]}>
            {paper.title}
          </Text>

          {/* Authors */}
          <Text style={styles.authors}>{getAuthorsText()}</Text>

          {/* Venue */}
          {paper.venue && (
            <Text style={styles.venue}>{paper.venue}</Text>
          )}
        </View>

        {/* Abstract - Fixed at bottom */}
        <View style={styles.abstractContainer}>
          <Text style={styles.abstractLabel}>Abstract</Text>
          <Text style={styles.abstract} numberOfLines={10}>
            {getAbstractPreview()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.825,
    backgroundColor: '#1a1a1a',
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 0,
    height: 50,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  year: {
    fontSize: 14,
    color: '#cccccc',
    fontWeight: '500',
  },
  bookmarkButton: {
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 34,
    marginBottom: 24,
    textAlign: 'center',
  },
  authors: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  venue: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  abstractContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  abstractLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 12,
  },
  abstract: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
});