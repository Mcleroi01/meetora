import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonClasses = () => {
    let classes = 'rounded-xl items-center justify-center ';
    
    // Size classes
    switch (size) {
      case 'sm':
        classes += 'px-4 py-2 ';
        break;
      case 'lg':
        classes += 'px-8 py-4 ';
        break;
      default:
        classes += 'px-6 py-3 ';
    }
    
    // Variant classes
    switch (variant) {
      case 'secondary':
        classes += 'bg-secondary-500 ';
        break;
      case 'outline':
        classes += 'border border-primary-500 bg-transparent ';
        break;
      case 'ghost':
        classes += 'bg-transparent ';
        break;
      default:
        classes += 'bg-primary-600 ';
    }
    
    if (disabled || loading) {
      classes += 'opacity-50 ';
    }
    
    return classes + (className || '');
  };

  const getTextClasses = () => {
    let classes = 'font-semibold ';
    
    // Size classes
    switch (size) {
      case 'sm':
        classes += 'text-sm ';
        break;
      case 'lg':
        classes += 'text-lg ';
        break;
      default:
        classes += 'text-base ';
    }
    
    // Variant classes
    switch (variant) {
      case 'outline':
        classes += 'text-primary-600 ';
        break;
      case 'ghost':
        classes += 'text-primary-600 ';
        break;
      default:
        classes += 'text-white ';
    }
    
    return classes;
  };

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      style={style}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#7c3aed' : 'white'} />
      ) : (
        <Text className={getTextClasses()} style={textStyle}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}