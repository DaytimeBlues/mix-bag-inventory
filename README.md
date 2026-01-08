# Mix Bag Inventory

A Progressive Web App for tracking product inventory and usage.

## Features

- 📦 Track bag and box inventory
- ✅ Task management
- 🔄 Real-time cloud sync via Firebase
- 📱 PWA - installable on mobile devices
- 📋 Transaction history

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/DaytimeBlues/mix-bag-inventory.git
cd mix-bag-inventory
```

### 2. Configure Firebase

1. Copy the template to create your config file:
   ```bash
   cp firebase-config.template.js firebase-config.js
   ```

2. Get your Firebase credentials from [Firebase Console](https://console.firebase.google.com):
   - Go to **Project Settings** > **General** > **Your apps**
   - Copy the Firebase SDK config values

3. Edit `firebase-config.js` and replace the placeholder values with your credentials

> ⚠️ **Important**: Never commit `firebase-config.js` to version control. It contains sensitive API keys.

### 3. Run locally

Simply open `index.html` in a browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

### 4. Deploy

Deploy to Firebase Hosting:

```bash
firebase deploy
```

## Firebase Security

This app uses Firestore for data storage. Make sure to configure proper [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started) to protect your data.

## License

MIT
