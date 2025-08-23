import React from 'react';
import { View, Text, Image } from 'react-native';

interface AvatarProps {
  source?: { uri: string } | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ source, name, size = 'md', className }: AvatarProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-16 h-16';
      case 'xl':
        return 'w-20 h-20';
      default:
        return 'w-12 h-12';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-2xl';
      case 'xl':
        return 'text-3xl';
      default:
        return 'text-lg';
    }
  };

  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const containerClasses = `${getSizeClasses()} rounded-full bg-primary-100 items-center justify-center overflow-hidden ${className || ''}`;

  if (source?.uri) {
    return (
      <View className={containerClasses}>
        <Image source={source} className="w-full h-full" />
      </View>
    );
  }

  return (
    <View className={containerClasses}>
      <Text className={`${getTextSize()} font-semibold text-primary-700`}>
        {initials || '?'}
      </Text>
    </View>
  );
}