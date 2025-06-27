# Maze Game

このプロジェクトは、React + Vite + three.js（@react-three/fiber, drei）を使った3D迷路ゲームです。

## 主な機能

- 3D空間内をWASDキーで移動
- Shiftキーで走る（速度アップ）
- マウスで視点操作（PointerLock対応）
- 壁との当たり判定あり（壁抜け不可）
- テクスチャ付きの床・壁・天井

## 操作方法

- **クリック**：マウスロック開始
- **W/A/S/D**：移動
- **Shift**：走る
- **マウス**：視点移動
- **Esc**：マウスロック解除

## 開発・実行

```bash
npm install
npm run dev
```

## 依存ライブラリ

- React
- Vite
- three.js
- @react-three/fiber
- @react-three/drei

## ディレクトリ構成例

```
maze-game/
├─ public/
│  └─ textures/
│      ├─ yuka.jpg
│      └─ wall.jpg
├─ src/
│  ├─ components/
│  │   └─ PlayerControls.jsx
│  ├─ App.jsx
│  └─ ...
└─ README.md
```

## 備考

- テクスチャ画像は `public/textures/` 配下に配置してください。
- コードのカスタマイズや拡張も自由にどうぞ。
