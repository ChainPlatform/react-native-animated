# @chainplatform/animated

Animation lib from Chain Platform (Bros Chain).

**DancingText** — text animation.

**ImageView** — Smooth image loading with shimmer or solid placeholder.  Supports **React Native**, **React Native Web**, and **SVG images**.

<p align="center">
  <a href="https://github.com/ChainPlatform/react-native-animated/blob/HEAD/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/animated">
    <img src="https://img.shields.io/npm/v/@chainplatform/pull-to-refresh?color=brightgreen&label=npm%20package" alt="Current npm package version." />
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/animated">
    <img src="https://img.shields.io/npm/dt/@chainplatform/animated.svg"></img>
  </a>
  <a href="https://www.npmjs.com/package/@chainplatform/animated">
    <img src="https://img.shields.io/badge/platform-android%20%7C%20ios%20%7C%20web-blue"></img>
  </a>
  <a href="https://github.com/ChainPlatform/animated/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
  <a href="https://x.com/intent/follow?screen_name=doansan">
    <img src="https://img.shields.io/twitter/follow/doansan.svg?label=Follow%20@doansan" alt="Follow @doansan"></img>
  </a>
</p>

## 📦 Installation

```bash
npm install @chainplatform/animated
# or
yarn add @chainplatform/animated
```

---

## 🚀 Usage

```jsx
import { View } from "react-native";
import { DancingText, ImageView } from '@chainplatform/animated';

export default function Home() {

  return (
    <View style={{ flex: 1 }}>
      <DancingText 
        letters={"Chain Platform"}
        textStyle={{
          fontSize: 14,
          fontWeight: "500",
          color: "red"
        }}
      />
      <ImageView
          imageType="link"
          source="https://example.com/logo.png"
          resizeMode="contain"
          placeholderType="shimmer"
          placeholderColor="#f0f0f0"
          shimmerAngle={20}
          shimmerWidth={24}
          shimmerSpeed={1200}
          shimmerIntensity={0.6}
          transitionDuration={300}
          style={{
            width: 120,
            height: 60,
            borderRadius: 8,
            backgroundColor: '#eee',
          }}
          onImageLoaded={() => console.log('Image loaded!')}
        />
    </View>
  );
}
```

---

## ⚙️ DancingText Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| **letters** | `string` | — | aniamted text |
| **textStyle** | `object` | — | Container or image style |

## ⚙️ ImageView Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| **imageType** | `"link"` \| `"local"` | — | Image source type |
| **source** | `string` \| `require()` | — | Image URL or local file |
| **resizeMode** | `string` | `'cover'` | React Native Image resize mode |
| **placeholderType** | `"solid"` \| `"shimmer"` | `"shimmer"` | Type of loading placeholder |
| **placeholderColor** | `string` | `#e0e0e0` | Background color for placeholder |
| **transitionDuration** | `number` | `300` | Fade-in transition duration |
| **shimmerAngle** | `number` | `15` | Angle of shimmer highlight (in degrees) |
| **shimmerWidth** | `number` | `20` | Width of shimmer band |
| **shimmerSpeed** | `number` | `1300` | Animation duration for shimmer loop |
| **shimmerIntensity** | `number` | `0.55` | Brightness of shimmer center |
| **onImageLoaded** | `(loaded: boolean) => void` | — | Callback fired when image finishes loading |
| **style** | `object` | — | Container or image style |

## 💡 Notes
- Fully compatible with **React Native Web**.  
- Supports **SVG** via `react-native-svg`.  
- Automatically detects SVG format from URL.  
- Animation uses `useNativeDriver` when possible for smoother performance.

---

## 🪪 License
MIT © 2025 [Chain Platform](https://chainplatform.net)

---

## 💖 Support & Donate

If you find this package helpful, consider supporting the development:

| Cryptocurrency | Address |
|----------------|----------|
| **Bitcoin (BTC)** | `17grbSNSEcEybS1nHh4TGYVodBwT16cWtc` |
![alt text](image-1.png)
| **Ethereum (ETH)** | `0xa2fd119a619908d53928e5848b49bf1cc15689d4` |
![alt text](image-2.png)
| **Tron (TRX)** | `TYL8p2PLCLDfq3CgGBp58WdUvvg9zsJ8pd` |
![alt text](image.png)
| **DOGE (DOGE)** | `DDfKN2ys4frNaUkvPKcAdfL6SiVss5Bm19` |
| **USDT (SOLANA)** | `cPUZsb7T9tMfiZFqXbWbRvrUktxgZQXQ2Ni1HiVXgFm` |

Your contribution helps maintain open-source development under the Chain Platform ecosystem 🚀
