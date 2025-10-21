// screens/FeedScreen.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  Alert,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FullScreenPaperCard from '../components/FullScreenPaperCard';
import TopicTabBar from '../components/TopicTabBar';
import { storageUtils } from '../utils/storage';
import papersData from '../data/papers.json';

const { height, width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 10;

const TOPICS = [
  { id: 'ml', name: 'Machine Learning' },
  { id: 'robotics', name: 'Robotics' },
  { id: 'for-you', name: 'For You' },
];

const TOPIC_CATEGORIES = {
  'for-you': null,
  'ml': ['Machine Learning'],
  'nlp': ['Machine Learning', 'Natural Language Processing'],
  'cv': ['Machine Learning', 'Computer Vision'],
  'robotics': ['Robotics'],
  'ai': ['Machine Learning', 'Artificial Intelligence'],
  'deep-learning': ['Machine Learning'],
};

export default function FeedScreen({ navigation }) {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(2); // Start at 'For You'
  const [topicPapers, setTopicPapers] = useState({});
  const [loading, setLoading] = useState(true);
  const [userInterests, setUserInterests] = useState([]);
  const horizontalFlatListRef = useRef(null);
  const verticalFlatListRefs = useRef({});

  const currentTopic = TOPICS[currentTopicIndex].id;

  useFocusEffect(
    useCallback(() => {
      loadUserInterests();
    }, [])
  );

  useEffect(() => {
    loadAllTopics();
  }, [userInterests]);

  const loadUserInterests = async () => {
    try {
      const interests = await storageUtils.getUserInterests();
      setUserInterests(interests);
    } catch (error) {
      console.error('Error loading user interests:', error);
    }
  };

  const getInterestCategories = (interests) => {
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

    const allCategories = new Set();
    interests.forEach(interest => {
      const categories = interestCategories[interest] || [];
      categories.forEach(cat => allCategories.add(cat));
    });

    return Array.from(allCategories);
  };

  const loadAllTopics = async () => {
    try {
      setLoading(true);
      const allTopicPapers = {};

      TOPICS.forEach(topic => {
        let filteredPapers;

        if (topic.id === 'for-you') {
          const categories = getInterestCategories(userInterests);
          if (categories.length === 0) {
            filteredPapers = papersData;
          } else {
            filteredPapers = papersData.filter(paper =>
              categories.includes(paper.category)
            );
          }
        } else {
          const categories = TOPIC_CATEGORIES[topic.id];
          filteredPapers = papersData.filter(paper =>
            categories.includes(paper.category)
          );
        }

        const shuffledPapers = filteredPapers.sort(() => Math.random() - 0.5);
        allTopicPapers[topic.id] = shuffledPapers.slice(0, ITEMS_PER_PAGE);
      });

      setTopicPapers(allTopicPapers);
    } catch (error) {
      console.error('Error loading papers:', error);
      Alert.alert('Error', 'Failed to load papers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (topicId) => {
    const newIndex = TOPICS.findIndex(t => t.id === topicId);
    if (newIndex !== -1 && horizontalFlatListRef.current) {
      horizontalFlatListRef.current.scrollToIndex({ 
        index: newIndex, 
        animated: true 
      });
    }
  };

  const handleSearchPress = () => {
    Alert.alert('Search', 'Search functionality coming soon!');
  };

  const handleBookmarkChange = (paperId, isBookmarked) => {
    console.log(`Paper ${paperId} bookmark status changed to ${isBookmarked}`);
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== undefined) {
      setCurrentTopicIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderTopicFeed = ({ item: topic }) => {
    const papers = topicPapers[topic.id] || [];

    return (
      <View style={styles.topicContainer}>
        <FlatList
          ref={(ref) => (verticalFlatListRefs.current[topic.id] = ref)}
          data={papers}
          renderItem={({ item }) => (
            <View style={styles.paperContainer}>
              <FullScreenPaperCard
                paper={item}
                onBookmarkChange={handleBookmarkChange}
                navigation={navigation}
              />
            </View>
          )}
          keyExtractor={(item) => `${topic.id}-${item.id}`}
          showsVerticalScrollIndicator={false}
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
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <TopicTabBar
          currentTopic={currentTopic}
          onTopicChange={handleTopicChange}
          onSearchPress={handleSearchPress}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading papers...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopicTabBar
        currentTopic={currentTopic}
        onTopicChange={handleTopicChange}
        onSearchPress={handleSearchPress}
      />
      
      <FlatList
        ref={horizontalFlatListRef}
        data={TOPICS}
        renderItem={renderTopicFeed}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        initialScrollIndex={2} // Start at 'For You'
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topicContainer: {
    width: width,
    height: height,
  },
  paperContainer: {
    height: height,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#ffffff',
  },
});