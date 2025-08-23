import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface CategoryCardProps {
  category: {
    key: string;
    label: string;
    image: string;
  };
  onPress: () => void;
}

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View className="bg-white rounded-xl shadow-sm overflow-hidden mr-4 w-32">
        <Image 
          source={{ uri: category.image }}
          className="w-full h-24"
        />
        <View className="p-3">
          <Text className="text-center font-medium text-gray-900 text-sm">
            {category.label}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}