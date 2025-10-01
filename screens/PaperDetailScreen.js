import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storageUtils } from '../utils/storage';

export default function PaperDetailScreen({ route, navigation }) {
  const { paper } = route.params;
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
      } else {
        await storageUtils.saveBookmarkedPaper(paper);
        setIsBookmarked(true);
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

  const sharePaper = async () => {
    try {
      const shareContent = {
        message: `Check out this research paper: ${paper.title}\n\n${paper.link}`,
        title: paper.title,
      };
      await Share.share(shareContent);
    } catch (error) {
      console.error('Error sharing paper:', error);
    }
  };

  const getAuthorsText = () => {
    return paper.authors.join(', ');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
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
              color={isBookmarked ? '#007AFF' : '#666666'}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{paper.title}</Text>

        <View style={styles.metaInfo}>
          <Text style={styles.authorsLabel}>Authors:</Text>
          <Text style={styles.authors}>{getAuthorsText()}</Text>
        </View>

        {paper.venue && (
          <View style={styles.metaInfo}>
            <Text style={styles.venueLabel}>Published in:</Text>
            <Text style={styles.venue}>{paper.venue}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abstract</Text>
          <Text style={styles.abstract}>{paper.abstract}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={openPaperLink}
            activeOpacity={0.8}
          >
            <Ionicons name="link-outline" size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>View Full Paper</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={sharePaper}
            activeOpacity={0.8}
          >
            <Ionicons name="share-outline" size={20} color="#007AFF" />
            <Text style={styles.secondaryButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  year: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  bookmarkButton: {
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 32,
    marginBottom: 20,
  },
  metaInfo: {
    marginBottom: 16,
  },
  authorsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 4,
  },
  authors: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
  },
  venueLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 4,
  },
  venue: {
    fontSize: 16,
    color: '#333333',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  abstract: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    marginRight: 12,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
