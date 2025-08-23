import React from 'react';
import { View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, className, style, variant = 'default' }: CardProps) {
  const getCardClasses = () => {
    let classes = 'rounded-xl p-4 ';
    
    switch (variant) {
      case 'elevated':
        classes += 'bg-white shadow-lg ';
        break;
      case 'outlined':
        classes += 'bg-white border border-gray-200 ';
        break;
      default:
        classes += 'bg-white shadow-sm ';
    }
    
    return classes + (className || '');
  };

  return (
    <View className={getCardClasses()} style={style}>
      {children}
    </View>
  );
}