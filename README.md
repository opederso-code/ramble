# Ramble

An interactive walking tour demo built with **React Native, Expo SDK 58, Expo Router, and TypeScript**, based on the supplied [Figma designs](https://www.figma.com/design/qPNfGutNZbyWlRsbOwe9xc/DesignComp?node-id=68-2344).

## Run

Requires Node.js 22.13+ and npm.

```sh
npm ci
npm start
```

Scan the QR code with Expo Go, or press `i` for the iOS simulator and `a` for an Android emulator. Install an Expo Go version compatible with SDK 58. Run `npm run web` for a browser preview.

## Included screens

- Discover: map pins, suggested guides, category filters, and location cards.
- Both notification entry variants.
- Tour introduction and message composer.
- Active tour with route, narration controls, and nearby places.
- Location details, photo carousel, saved places, and guide voice note.
- Return to the tour with the visited location state.
- Conversation with message replay and route suggestions.
- Updated route to Urban Light.

Tap Kendrick in Discover → **Grab some food** → **Fatburger** → **Back to tour** → **Ask a question** → **Somewhere iconic** to follow the full flow. Places saved with **Save** persist on the device. Tap a selected guide category again to clear its filter.

On desktop, a preview sidebar links to every design state. On mobile web, use `?screen=browse`, `entry`, `entry-alt`, `intro`, `tour`, `detail`, `back`, `conversation`, or `rerouted`. Native development builds use the `ramble` URL scheme with the same `screen` query parameter.

## Design implementation

React Native `View`, `Text`, `Image`, `Pressable`, `ScrollView`, and `TextInput` components render the interface; the screens are not screenshots. Layouts adapt to device width, safe areas, and keyboard height. iOS uses the system rounded font. Android and browsers use their available system fonts, so line breaks can differ slightly.

Original image fills and route SVGs are bundled locally. Byte-identical exports are deduplicated, and `design-assets.json` records the Figma node, original variable, size, and SHA-256 for each retained file. Interface icons are sourced from [Untitled UI](https://github.com/untitleduico/icons); their MIT license is included in `assets/icons/LICENSE`.

## Demo boundaries

The supplied designs are implemented as a local prototype. Maps are the original Figma map images with separate route overlays; there is no GPS or live directions integration. Chat responds to local intents (`next`, food, iconic, sunset, route) and does not call an AI service. Read aloud and message replay use the device's standard text-to-speech voice, not Kendrick Lamar's voice. The waveform control toggles read aloud; it does not record audio.

The notification and lock screen are in-app previews. Other guides are marked as coming soon. Location hours, ratings, and guide quotes are demo content from the design or supporting demo copy. Website buttons open the venue's public site; Call explains that a telephone number was not provided. No API keys, account, or backend are required.

## Verify

```sh
npm run check
npx expo-doctor
npm run export
npm test
```

`npm test` uses Chrome and the production web export in `dist/`. It starts a local Python HTTP server on port 8083 if needed. Tests cover the complete tour, persistent saved places, filters, typed messages, cancellation of pending reroutes, all screen assets, and a 320px viewport. Python 3 and Google Chrome are needed for these checks. `node scripts/capture.mjs` captures each screen while the preview server is running.

## Structure

- `src/app/`: Expo Router entry and layout.
- `src/Ramble.tsx`: navigation, demo intents, speech, saved places, and preview shell.
- `src/screens/`: individual screen implementations.
- `src/components/`: shared typography, buttons, avatars, composer, and route map.
- `src/theme.ts`: shared colors, fonts, and shadows.
- `assets/`: local Figma artwork and Untitled UI icons.
- `tests/`: end-to-end behavior checks.
