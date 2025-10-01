# PaperFeed

A React Native (Expo) app that provides a TikTok-style vertical scrolling experience for research paper abstracts.

## Features

- **Onboarding Screen**: Users can select their research interests (ML, robotics, etc.) which are stored in AsyncStorage
- **Feed Screen**: Infinite scroll of paper cards with title, authors, abstract (expandable), and link to paper
- **Bookmark System**: Save papers with like/save button functionality
- **Paper Details**: Detailed view of individual papers with full abstract and sharing options
- **Clean UI**: Minimal, card-based design optimized for vertical scrolling
- **Navigation**: Tab-based navigation with react-navigation

## Tech Stack

- React Native (Expo)
- React Navigation
- AsyncStorage for local data persistence
- Mock JSON data (ready for real API integration)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd paperfeed
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
paperfeed/
├── App.js                 # Main app component with navigation
├── components/
│   ├── LoadingScreen.js   # Loading component
│   └── PaperCard.js       # Individual paper card component
├── screens/
│   ├── OnboardingScreen.js # Interest selection screen
│   ├── FeedScreen.js       # Main feed with infinite scroll
│   ├── PaperDetailScreen.js # Detailed paper view
│   └── BookmarkScreen.js   # Saved papers screen
├── utils/
│   └── storage.js         # AsyncStorage utilities
├── data/
│   └── papers.json        # Mock paper data
├── package.json
├── app.json
└── babel.config.js
```

## Data Structure

The app currently uses mock data from `data/papers.json`. Each paper object contains:

```json
{
  "id": "unique_id",
  "title": "Paper Title",
  "authors": ["Author 1", "Author 2"],
  "abstract": "Full abstract text...",
  "link": "https://paper-url",
  "category": "Machine Learning",
  "year": "2023",
  "venue": "Conference Name"
}
```

## Future Enhancements

- Integration with real APIs (Google Scholar, arXiv)
- User authentication
- Social features (sharing, comments)
- Advanced filtering and search
- Push notifications for new papers
- Offline reading capabilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
