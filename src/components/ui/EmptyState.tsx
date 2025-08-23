import React from 'react';
import { View, Text } from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <View className={`flex-1 items-center justify-center p-8 ${className || ''}`}>
      <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
        <Icon size={32} color="#9CA3AF" />
      </View>
      
      <Text className="text-xl font-semibold text-gray-900 text-center mb-2">
        {title}
      </Text>
      
      <Text className="text-gray-500 text-center mb-6 max-w-sm">
        {description}
      </Text>
      
      {action}
    </View>
  );
}