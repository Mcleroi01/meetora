import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { CategoryCard } from '@/src/components/CategoryCard';
import { VendorCard } from '@/src/components/VendorCard';
import { Button } from '@/src/components/ui/Button';
import { supabase } from '@/src/lib/supabase';
import { router } from 'expo-router';

const CATEGORIES = [
  {
    key: 'venue',
    label: 'Salles',
    image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    key: 'catering',
    label: 'Traiteurs',
    image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    key: 'decoration',
    label: 'Décoration',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    key: 'photography',
    label: 'Photographes',
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    key: 'car_rental',
    label: 'Location',
    image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select(`
          *,
          profiles!inner(*)
        `)
        .eq('status', 'approved')
        .limit(6);

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error loading vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category: string) => {
    router.push(`/vendors?category=${category}`);
  };

  const handleVendorPress = (vendorId: string) => {
    router.push(`/vendors/${vendorId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4 bg-white">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Bonjour ! 👋
          </Text>
          <Text className="text-gray-600">
            Organisez votre événement parfait
          </Text>
        </View>

        {/* Search Bar */}
        <View className="px-6 py-4 bg-white">
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
            <Search size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="Rechercher un prestataire..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Categories */}
        <View className="py-4">
          <Text className="text-lg font-semibold text-gray-900 px-6 mb-4">
            Catégories
          </Text>
          <FlatList
            data={CATEGORIES}
            renderItem={({ item }) => (
              <CategoryCard
                category={item}
                onPress={() => handleCategoryPress(item.key)}
              />
            )}
            keyExtractor={(item) => item.key}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          />
        </View>

        {/* Featured Vendors */}
        <View className="py-4">
          <View className="flex-row items-center justify-between px-6 mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Prestataires recommandés
            </Text>
            <Button
              title="Voir tout"
              variant="ghost"
              size="sm"
              onPress={() => router.push('/vendors')}
            />
          </View>
          
          <View className="px-6">
            {loading ? (
              <Text className="text-center text-gray-500 py-8">
                Chargement...
              </Text>
            ) : vendors.length > 0 ? (
              vendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  onPress={() => handleVendorPress(vendor.id)}
                />
              ))
            ) : (
              <Text className="text-center text-gray-500 py-8">
                Aucun prestataire disponible
              </Text>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 py-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Actions rapides
          </Text>
          <View className="space-y-3">
            <Button
              title="Créer un nouvel événement"
              onPress={() => router.push('/events/create')}
            />
            <Button
              title="Parcourir tous les prestataires"
              variant="outline"
              onPress={() => router.push('/vendors')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}