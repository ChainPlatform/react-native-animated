# @chainplatform/animated

Animation lib from Chain Platform (Bros Chain).

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
import { DancingText } from '@chainplatform/animated';

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
    </View>
  );
}
```