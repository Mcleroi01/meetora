import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import { Button } from '@/src/components/ui/Button';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Organisez vos événements facilement',
    description: 'Créez et gérez tous vos événements en quelques clics. Invitez vos proches et gardez le contrôle.',
    image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
  {
    id: '2',
    title: 'Invitations digitales + QR/RSVP',
    description: 'Envoyez des invitations personnalisées et gérez les réponses avec des QR codes uniques.',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
  {
    id: '3',
    title: 'Réservez des prestataires vérifiés',
    description: 'Trouvez et réservez les meilleurs prestataires pour vos événements. Tous sont vérifiés et évalués.',
    image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=500',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const renderItem = ({ item }: { item: typeof ONBOARDING_DATA[0] }) => (
    <View style={{ width }} className="flex-1 items-center justify-center px-8">
      <Image 
        source={{ uri: item.image }}
        className="w-72 h-72 rounded-3xl mb-8"
      />
      
      <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
        {item.title}
      </Text>
      
      <Text className="text-lg text-gray-600 text-center leading-6">
        {item.description}
      </Text>
    </View>
  );

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex });
    } else {
      router.replace('/onboarding/auth');
    }
  };

  const handleSkip = () => {
    router.replace('/onboarding/auth');
  };

  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Skip Button */}
      <View className="flex-row justify-end p-4">
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
          <Text className="text-primary-600 font-medium">Passer</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      {/* Bottom Section */}
      <View className="px-8 pb-8">
        {/* Dots Indicator */}
        <View className="flex-row justify-center mb-8">
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </View>

        {/* Next Button */}
        <Button
          title={currentIndex === ONBOARDING_DATA.length - 1 ? 'Commencer' : 'Suivant'}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}