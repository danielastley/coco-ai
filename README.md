# Coco AI

A React Native chat application built with Expo Router and Zustand for state management.

## Features

- 💬 Real-time chat interface
- 📱 Cross-platform (iOS, Android, Web)
- 🔄 Conversation history
- ⚙️ Customizable server settings
- 🎨 Modern UI with native components

## Prerequisites

- Node.js 18+ (installed via NVM)
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coco-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## Usage

1. Open the app and navigate to the Settings tab
2. Configure your LLM server settings:
   - Server URL (e.g., https://api.openai.com/v1)
   - API Key
   - Model name (e.g., gpt-3.5-turbo)
3. Save the settings
4. Go to the Chat tab to start conversing

## Project Structure

```
/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   ├── _layout.tsx        # Root layout
│   └── modal.tsx          # Modal screen
├── components/            # Reusable components
├── store/                 # Zustand state management
├── api/                   # API clients
├── utils/                 # Utility functions
├── constants/             # App constants
└── types/                 # TypeScript definitions
```

## Development

- **Start development server**: `npm start`
- **Run on iOS**: `npm run ios`
- **Run on Android**: `npm run android`
- **Run on Web**: `npm run web`

## Technologies Used

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **Expo Router** - File-based routing
- **Zustand** - State management
- **TypeScript** - Type safety
- **AsyncStorage** - Local data persistence

## License

MIT 