import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { storageUtils } from '../utils/storage';

const INTERESTS = [
  { id: 'ml', name: 'Machine Learning', emoji: '🤖' },
  { id: 'nlp', name: 'Natural Language Processing', emoji: '💬' },
  { id: 'cv', name: 'Computer Vision', emoji: '👁️' },
  { id: 'robotics', name: 'Robotics', emoji: '🤖' },
  { id: 'ai', name: 'Artificial Intelligence', emoji: '🧠' },
  { id: 'deep-learning', name: 'Deep Learning', emoji: '🧬' },
  { id: 'reinforcement', name: 'Reinforcement Learning', emoji: '🎮' },
  { id: 'neuroscience', name: 'Neuroscience', emoji: '🧠' },
  { id: 'statistics', name: 'Statistics', emoji: '📊' },
  { id: 'optimization', name: 'Optimization', emoji: '⚡' },
  { id: 'graphics', name: 'Computer Graphics', emoji: '🎨' },
  { id: 'systems', name: 'Systems', emoji: '⚙️' },
];

export default function OnboardingScreen({ navigation }) {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (interestId) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedInterests.length === 0) {
      Alert.alert(
        'Select Interests',
        'Please select at least one interest to continue.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await storageUtils.saveUserInterests(selectedInterests);
      await storageUtils.setHasLaunched();
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to save your preferences. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to PaperFeed</Text>
          <Text style={styles.subtitle}>
            Discover the latest research papers tailored to your interests
          </Text>
        </View>

        <View style={styles.interestsSection}>
          <Text style={styles.sectionTitle}>What are you interested in?</Text>
          <Text style={styles.sectionSubtitle}>
            Select topics that interest you most (you can change these later)
          </Text>

          <View style={styles.interestsGrid}>
            {INTERESTS.map((interest) => (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.interestCard,
                  selectedInterests.includes(interest.id) && styles.interestCardSelected,
                ]}
                onPress={() => toggleInterest(interest.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.interestEmoji}>{interest.emoji}</Text>
                <Text style={[
                  styles.interestName,
                  selectedInterests.includes(interest.id) && styles.interestNameSelected,
                ]}>
                  {interest.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              selectedInterests.length === 0 && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={selectedInterests.length === 0}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.continueButtonText,
              selectedInterests.length === 0 && styles.continueButtonTextDisabled,
            ]}>
              Continue ({selectedInterests.length} selected)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  interestsSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    lineHeight: 22,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  interestCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  interestCardSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  interestEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  interestName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 18,
  },
  interestNameSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonDisabled: {
    backgroundColor: '#e1e1e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#999999',
  },
});
