import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

// Base dimensions: iPhone 14 / Pixel 7 (390 x 844)
const BASE_W = 390;
const BASE_H = 844;

// Clamp scale to avoid extremes on very small/large screens
const scaleW = Math.min(Math.max(width / BASE_W, 0.8), 1.2);
const scaleH = Math.min(Math.max(height / BASE_H, 0.8), 1.2);

/** Scale theo chiều ngang (padding, margin, icon size) */
export const s = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scaleW));

/** Scale theo chiều dọc (height, paddingTop/Bottom) */
export const vs = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scaleH));

/** Scale vừa phải — dùng cho font size (ít bị scale mạnh hơn s()) */
export const ms = (size: number, factor = 0.45) =>
  Math.round(PixelRatio.roundToNearestPixel(size + (s(size) - size) * factor));

export const SCREEN_W = width;
export const SCREEN_H = height;
