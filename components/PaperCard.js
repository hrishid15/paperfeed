import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storageUtils } from '../utils/storage';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export default function PaperCard({ paper, onBookmarkChange, navigation }) {
  const [isExpanded, setIsExpanded] = useState(false);
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

  const openPaperLink = () => {
    if (paper.link) {
      Linking.openURL(paper.link).catch(err => {
        Alert.alert('Error', 'Failed to open paper link.');
      });
    }
  };

  const toggleAbstract = () => {
    setIsExpanded(!isExpanded);
  };

  const getAuthorsText = () => {
    if (paper.authors.length <= 3) {
      return paper.authors.join(', ');
    } else {
      return `${paper.authors.slice(0, 3).join(', ')} et al.`;
    }
  };

  const getAbstractPreview = () => {
    const maxLength = 150;
    if (paper.abstract.length <= maxLength || isExpanded) {
      return paper.abstract;
    }
    return paper.abstract.substring(0, maxLength) + '...';
  };

  const navigateToDetail = () => {
    if (navigation) {
      navigation.navigate('PaperDetail', { paper });
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={navigateToDetail} activeOpacity={0.95}>
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
            size={24}
            color={isBookmarked ? '#007AFF' : '#666666'}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{paper.title}</Text>

      <Text style={styles.authors}>{getAuthorsText()}</Text>

      {paper.venue && (
        <Text style={styles.venue}>{paper.venue}</Text>
      )}

      <View style={styles.abstractContainer}>
        <Text style={styles.abstract}>{getAbstractPreview()}</Text>
        {paper.abstract.length > 150 && (
          <TouchableOpacity onPress={toggleAbstract} style={styles.expandButton}>
            <Text style={styles.expandText}>
              {isExpanded ? 'Show less' : 'Read more'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={openPaperLink}
          activeOpacity={0.7}
        >
          <Ionicons name="link-outline" size={20} color="#007AFF" />
          <Text style={styles.linkText}>View Paper</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={toggleAbstract}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#666666"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  year: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  bookmarkButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 24,
    marginBottom: 8,
  },
  authors: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    fontWeight: '500',
  },
  venue: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  abstractContainer: {
    marginBottom: 16,
  },
  abstract: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  expandButton: {
    marginTop: 8,
  },
  expandText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  linkText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
  },
});
