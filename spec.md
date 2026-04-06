# SortCraft Puzzle

## Current State
- Full 5000-level color-sorting puzzle game with cartoon UI
- HomeScreen has PLAY, LEVELS, Daily Challenge buttons
- Shop button (🛒) in GameScreen opens PauseMenu (incorrect - should open Shop)
- No Shop screen exists
- No premium/subscription system
- No background system
- Game backgrounds are hardcoded sky gradient in GameScreen
- Storage (storage.ts) has SaveData with basic fields

## Requested Changes (Diff)

### Add
- **ShopScreen** component with two tabs:
  1. **Premium Tab** (Remove Ads): 4 plans — ₹19/week, ₹49/month, ₹99/3months, ₹199/6months. Demo payment UI (button shows "Buy" then simulates purchase with success message)
  2. **Backgrounds Tab**: 
     - 25+ normal backgrounds (free, unlock by watching simulated ad or already free)
     - 10+ VIP backgrounds (₹29 each, or watch 3-4 simulated ads to unlock)
     - Selected background applies to gameplay screen
- **Simulated Ad Screen**: A countdown (5s) fake ad screen shown when user chooses "Watch Ad" for background unlock
- **Background system in storage.ts**: Add `unlockedBackgrounds`, `activeBackground`, `premiumUntil` fields to SaveData
- **Apply active background** in GameScreen instead of hardcoded gradient
- **Shop navigation**: Shop 🛒 button in GameScreen and a Shop button in HomeScreen both navigate to ShopScreen (not pause menu)

### Modify
- `storage.ts` — Add `unlockedBackgrounds: string[]`, `activeBackground: string`, `premiumUntil: number | null` to SaveData and defaults
- `App.tsx` — Add `shop` screen type, handle `onOpenShop` callback, pass `activeBackground` to GameScreen
- `GameScreen.tsx` — Shop button navigates to shop (not pause), accept `activeBackground` prop, apply background from prop
- `HomeScreen.tsx` — Add a Shop button that navigates to ShopScreen

### Remove
- Nothing removed

## Implementation Plan
1. Update `storage.ts` to add premium/background fields
2. Create `src/frontend/src/screens/ShopScreen.tsx` with Premium tab + Backgrounds tab + simulated ad flow
3. Define 25+ normal backgrounds + 10+ VIP backgrounds as gradient/color definitions (no external images needed)
4. Update `App.tsx` to add shop screen type and navigation
5. Update `GameScreen.tsx` to accept + apply activeBackground prop, fix shop button to open shop
6. Update `HomeScreen.tsx` to add Shop button
