import React from 'react';
import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showNumber?: boolean;
  className?: string;
}

export function RatingStars({ 
  rating, 
  maxStars = 5, 
  size = 16, 
  showNumber = false,
  className 
}: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View className={`flex-row items-center ${className || ''}`}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star
          key={`full-${index}`}
          size={size}
          color="#FCD34D"
          fill="#FCD34D"
        />
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <Star
          size={size}
          color="#FCD34D"
          fill="#FCD34D"
          opacity={0.5}
        />
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star
          key={`empty-${index}`}
          size={size}
          color="#D1D5DB"
          fill="transparent"
        />
      ))}
      
      {showNumber && (
        <Text className="ml-2 text-gray-600 text-sm font-medium">
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
}