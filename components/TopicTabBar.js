// components/TopicTabBar.js
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const TOPICS = [
  { id: 'ml', name: 'Machine Learning' },
  { id: 'robotics', name: 'Robotics' },
  { id: 'for-you', name: 'For You' },
];

const SEARCH_BUTTON_WIDTH = 56;

export default function TopicTabBar({ currentTopic, onTopicChange, onSearchPress }) {
  const scrollViewRef = useRef(null);
  const tabRefs = useRef({});

  useEffect(() => {
    // Center the active tab when it changes, accounting for search button
    if (scrollViewRef.current && tabRefs.current[currentTopic]) {
      setTimeout(() => {
        tabRefs.current[currentTopic]?.measureLayout(
          scrollViewRef.current?.getNativeScrollRef?.(),
          (x, y, tabWidth, height) => {
            const centerOffset = x - width / 2 + tabWidth / 2;
            scrollViewRef.current?.scrollTo({ x: centerOffset, animated: true });
          },
          () => {}
        );
      }, 100);
    }
  }, [currentTopic]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {TOPICS.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            ref={(ref) => (tabRefs.current[topic.id] = ref)}
            style={[
              styles.tab,
              currentTopic === topic.id && styles.tabActive,
            ]}
            onPress={() => onTopicChange(topic.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                currentTopic === topic.id && styles.tabTextActive,
              ]}
            >
              {topic.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <TouchableOpacity
        style={styles.searchButton}
        onPress={onSearchPress}
        activeOpacity={0.7}
      >
        <Ionicons name="search" size={22} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingTop: 50, // For status bar
    height: 95,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: (width + SEARCH_BUTTON_WIDTH) / 2,
    alignItems: 'center',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
    paddingVertical: 10,
    marginHorizontal: 8,
    borderRadius: 20,
  },
  tabActive: {
    // Active tab styling
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  tabTextActive: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  searchButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginLeft: 8,
  },
});