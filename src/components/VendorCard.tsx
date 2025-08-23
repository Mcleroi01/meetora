import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Card } from './ui/Card';
import { RatingStars } from './ui/RatingStars';
import type { Database } from '../lib/supabase';

type VendorProfile = Database['public']['Tables']['vendor_profiles']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};

interface VendorCardProps {
  vendor: VendorProfile;
  onPress: () => void;
}

const CATEGORY_LABELS = {
  venue: 'Salle',
  catering: 'Traiteur',
  decoration: 'Décoration',
  photography: 'Photographe',
  car_rental: 'Location voiture',
};

const CATEGORY_IMAGES = {
  venue: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=400',
  catering: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400',
  decoration: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
  photography: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400',
  car_rental: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400',
};

export function VendorCard({ vendor, onPress }: VendorCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card variant="elevated" className="mb-4">
        <Image 
          source={{ uri: CATEGORY_IMAGES[vendor.category] }}
          className="w-full h-32 rounded-lg mb-3"
        />
        
        <View className="space-y-2">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 mb-1">
                {vendor.company_name}
              </Text>
              
              <Text className="text-sm text-primary-600 font-medium mb-2">
                {CATEGORY_LABELS[vendor.category]}
              </Text>
            </View>
            
            {vendor.base_price && (
              <View className="bg-primary-50 px-3 py-1 rounded-full">
                <Text className="text-primary-700 font-semibold text-sm">
                  À partir de {vendor.base_price}€
                </Text>
              </View>
            )}
          </View>
          
          {vendor.service_area && (
            <View className="flex-row items-center">
              <MapPin size={14} color="#6B7280" />
              <Text className="text-gray-500 text-sm ml-1">
                {vendor.service_area}
              </Text>
            </View>
          )}
          
          <View className="flex-row items-center justify-between">
            <RatingStars 
              rating={vendor.rating_avg || 0} 
              showNumber 
              size={14}
            />
            
            <Text className="text-xs text-gray-400">
              {vendor.rating_count} avis
            </Text>
          </View>
          
          {vendor.description && (
            <Text className="text-gray-600 text-sm" numberOfLines={2}>
              {vendor.description}
            </Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}