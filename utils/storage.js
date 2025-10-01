import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_INTERESTS: 'user_interests',
  BOOKMARKED_PAPERS: 'bookmarked_papers',
  HAS_LAUNCHED: 'hasLaunched',
};

export const storageUtils = {
  // User interests
  async saveUserInterests(interests) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_INTERESTS, JSON.stringify(interests));
    } catch (error) {
      console.error('Error saving user interests:', error);
    }
  },

  async getUserInterests() {
    try {
      const interests = await AsyncStorage.getItem(STORAGE_KEYS.USER_INTERESTS);
      return interests ? JSON.parse(interests) : [];
    } catch (error) {
      console.error('Error getting user interests:', error);
      return [];
    }
  },

  // Bookmarked papers
  async saveBookmarkedPaper(paper) {
    try {
      const bookmarks = await this.getBookmarkedPapers();
      const updatedBookmarks = [...bookmarks, paper];
      await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKED_PAPERS, JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error saving bookmarked paper:', error);
    }
  },

  async removeBookmarkedPaper(paperId) {
    try {
      if (paperId === 'all') {
        // Clear all bookmarks
        await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKED_PAPERS, JSON.stringify([]));
      } else {
        const bookmarks = await this.getBookmarkedPapers();
        const updatedBookmarks = bookmarks.filter(paper => paper.id !== paperId);
        await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKED_PAPERS, JSON.stringify(updatedBookmarks));
      }
    } catch (error) {
      console.error('Error removing bookmarked paper:', error);
    }
  },

  async getBookmarkedPapers() {
    try {
      const bookmarks = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKED_PAPERS);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error getting bookmarked papers:', error);
      return [];
    }
  },

  async isPaperBookmarked(paperId) {
    try {
      const bookmarks = await this.getBookmarkedPapers();
      return bookmarks.some(paper => paper.id === paperId);
    } catch (error) {
      console.error('Error checking if paper is bookmarked:', error);
      return false;
    }
  },

  // App launch state
  async setHasLaunched() {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_LAUNCHED, 'true');
    } catch (error) {
      console.error('Error setting has launched:', error);
    }
  },

  async getHasLaunched() {
    try {
      const hasLaunched = await AsyncStorage.getItem(STORAGE_KEYS.HAS_LAUNCHED);
      return hasLaunched === 'true';
    } catch (error) {
      console.error('Error getting has launched:', error);
      return false;
    }
  },
};
