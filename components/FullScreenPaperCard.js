import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storageUtils } from '../utils/storage';

const { width, height } = Dimensions.get('window');

export default function FullScreenPaperCard({ paper, onBookmarkChange, navigation }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAbstractExpanded, setIsAbstractExpanded] = useState(false);

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

  const openPaperLink = () => {
    if (paper.link) {
      Linking.openURL(paper.link).catch(err => {
        Alert.alert('Error', 'Failed to open paper link.');
      });
    }
  };

  const navigateToDetail = () => {
    if (navigation) {
      navigation.navigate('PaperDetail', { paper });
    }
  };

  const toggleAbstract = () => {
    setIsAbstractExpanded(!isAbstractExpanded);
  };

  const getAuthorsText = () => {
    if (paper.authors.length <= 3) {
      return paper.authors.join(', ');
    } else {
      return `${paper.authors.slice(0, 3).join(', ')} et al.`;
    }
  };

  const getAbstractPreview = () => {
    const maxLength = isAbstractExpanded ? 800 : 300;
    if (paper.abstract.length <= maxLength || isAbstractExpanded) {
      return paper.abstract;
    }
    return paper.abstract.substring(0, maxLength) + '...';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header with category and bookmark */}
      <View style={styles.header}>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{paper.category}</Text>
          {paper.year && <Text style={styles.year}>{paper.year}</Text>}
        </View>
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={toggleBookmark}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={28}
            color={isBookmarked ? '#007AFF' : '#ffffff'}
          />
        </TouchableOpacity>
      </View>

      {/* Main content area */}
      <View style={styles.content}>
        {/* Title */}
        <TouchableOpacity onPress={navigateToDetail} activeOpacity={0.9}>
          <Text style={styles.title}>{paper.title}</Text>
        </TouchableOpacity>

        {/* Authors */}
        <Text style={styles.authors}>{getAuthorsText()}</Text>

        {/* Venue */}
        {paper.venue && (
          <Text style={styles.venue}>{paper.venue}</Text>
        )}

        {/* Abstract - Main focus */}
        <View style={styles.abstractContainer}>
          <Text style={styles.abstractLabel}>Abstract</Text>
          <Text style={styles.abstract}>{getAbstractPreview()}</Text>
          
          {paper.abstract.length > 300 && (
            <TouchableOpacity onPress={toggleAbstract} style={styles.expandButton}>
              <Text style={styles.expandText}>
                {isAbstractExpanded ? 'Show less' : 'Read more'}
              </Text>
              <Ionicons
                name={isAbstractExpanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#007AFF"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Bottom actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={navigateToDetail}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text-outline" size={24} color="#ffffff" />
          <Text style={styles.actionText}>Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryActionButton}
          onPress={openPaperLink}
          activeOpacity={0.8}
        >
          <Ionicons name="link-outline" size={24} color="#ffffff" />
          <Text style={styles.primaryActionText}>Read Paper</Text>
        </TouchableOpacity>
      </View>

      {/* Swipe indicator */}
      <View style={styles.swipeIndicator}>
        <View style={styles.swipeDot} />
        <Text style={styles.swipeText}>Swipe for next paper</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: '#1a1a1a',
    paddingTop: 50, // Account for status bar
    paddingBottom: 100, // Account for home indicator
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
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
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 32,
    marginBottom: 16,
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
    marginBottom: 32,
  },
  abstractContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  expandText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginRight: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
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
  primaryActionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  swipeIndicator: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  swipeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666666',
    marginBottom: 8,
  },
  swipeText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
});
