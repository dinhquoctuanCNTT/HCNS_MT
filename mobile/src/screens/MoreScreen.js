// Đường dẫn ví dụ: src/screens/MoreScreen.js

import React from 'react';
import { View, Text, FlatList } from 'react-native';
// Import dữ liệu từ file bạn vừa tạo
import { FEATURES, APPS } from '../constants/MoreScreenData'; 

export default function MoreScreen() {
  return (
    <View>
       {/* Sử dụng biến FEATURES ở đây */}
       {FEATURES.map(item => ( ... ))}
    </View>
  );
}