// hooks/useAttendanceCamera.ts
// Hook xử lý toàn bộ luồng: chụp ảnh + lấy toạ độ + reverse geocode

import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

export interface AttendanceSnapshot {
  photoBase64: string; // base64 không có prefix
  photoUri: string; // URI local để preview
  latitude: number;
  longitude: number;
  address: string; // Địa chỉ dạng text
  timestamp: string; // ISO string lúc chụp
}

export function useAttendanceCamera() {
  const [snapshot, setSnapshot] = useState<AttendanceSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Xin quyền camera
      const camPerm = await ImagePicker.requestCameraPermissionsAsync();
      if (!camPerm.granted) throw new Error("Vui lòng cấp quyền Camera.");

      // 2. Xin quyền location
      const locPerm = await Location.requestForegroundPermissionsAsync();
      if (!locPerm.granted) throw new Error("Vui lòng cấp quyền Vị trí.");

      // 3. Chụp ảnh
      const photo = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        base64: true,
        allowsEditing: false,
      });
      if (photo.canceled || !photo.assets?.[0])
        throw new Error("Đã hủy chụp ảnh.");
      const asset = photo.assets[0];

      // 4. Lấy toạ độ (song song với chụp ảnh để tiết kiệm thời gian)
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = position.coords;

      // 5. Reverse geocode → địa chỉ text
      const [geo] = await Location.reverseGeocodeAsync({ latitude, longitude });
      const addressParts = [
        geo?.streetNumber,
        geo?.street,
        geo?.district,
        geo?.city,
      ].filter(Boolean);
      const address =
        addressParts.length > 0
          ? addressParts.join(", ")
          : `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

      setSnapshot({
        photoBase64: asset.base64!,
        photoUri: asset.uri,
        latitude,
        longitude,
        address,
        timestamp: new Date().toISOString(),
      });
    } catch (e: any) {
      setError(e.message ?? "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSnapshot(null);
    setError(null);
  }, []);

  return { snapshot, loading, error, capture, reset };
}
