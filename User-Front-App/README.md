# USTHB Chat Mobile App

A React Native mobile application for the USTHB Chat system built with Expo.

## Features

- 🔐 User authentication (login/register)
- 💬 Real-time chat with AI assistant
- 📊 Admin dashboard for statistics
- 🎨 Clean and modern UI
- 📱 Cross-platform (iOS & Android)

## Prerequisites

- Node.js 16+ installed
- Expo CLI installed globally: `npm install -g expo-cli`
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app on your physical device (optional)

## Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd usthb-chat-mobile

# Install dependencies
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the API URL in `.env`:
- **iOS Simulator**: `http://localhost:8080/api`
- **Android Emulator**: `http://10.0.2.2:8080/api`
- **Physical Device**: `http://YOUR_COMPUTER_IP:8080/api`

### 3. Start Development Server

```bash
# Start Expo development server
npx expo start

# Or with clearing cache
npx expo start -c
```

### 4. Run on Device/Simulator

- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app for physical device

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Chat/        # Chat-specific components
│   └── common/      # Common UI components
├── context/         # React Context providers
├── navigation/      # Navigation configuration
├── screens/         # Screen components
├── services/        # API services
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## Key Technologies

- **React Native**: Mobile framework
- **Expo**: Development platform
- **TypeScript**: Type safety
- **React Navigation**: Navigation
- **Axios**: HTTP client
- **AsyncStorage**: Local storage
- **React Hook Form**: Form handling

## Available Scripts

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Type check
npm run typecheck

# Lint code
npm run lint
```

## Building for Production

### Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

### Configure EAS

```bash
eas configure
```

### Build

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both platforms
eas build --platform all
```

## Common Issues

### Network Request Failed

- Ensure your backend is running
- Check API URL in `.env`
- Verify device is on same network as backend

### Metro Bundler Issues

```bash
# Clear cache and restart
npx expo start -c
```

### Build Errors

```bash
# Clear all caches
rm -rf node_modules
npm install
npx expo start -c
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@usthb.dz or join our Slack channel.