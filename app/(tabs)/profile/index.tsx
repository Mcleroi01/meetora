import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Settings, User, Bell, CircleHelp as HelpCircle } from 'lucide-react-native';
import { Avatar } from '@/src/components/ui/Avatar';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/hooks/useAuth';
import { signOut } from '@/src/lib/auth';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { profile, user } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert('Erreur', 'Erreur lors de la déconnexion');
            } else {
              router.replace('/onboarding');
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: Settings,
      label: 'Paramètres',
      onPress: () => router.push('/profile/settings'),
    },
    {
      icon: Bell,
      label: 'Notifications',
      onPress: () => router.push('/profile/notifications'),
    },
    {
      icon: HelpCircle,
      label: 'Aide et support',
      onPress: () => router.push('/profile/help'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4 bg-white">
          <Text className="text-xl font-bold text-gray-900 mb-6">
            Mon profil
          </Text>
          
          {/* Profile Info */}
          <View className="items-center mb-6">
            <Avatar
              source={profile?.avatar_url ? { uri: profile.avatar_url } : null}
              name={profile?.full_name || user?.email}
              size="xl"
              className="mb-4"
            />
            
            <Text className="text-xl font-semibold text-gray-900 mb-1">
              {profile?.full_name || 'Utilisateur'}
            </Text>
            
            <Text className="text-gray-500 mb-2">
              {user?.email}
            </Text>
            
            <View className="bg-primary-100 px-3 py-1 rounded-full">
              <Text className="text-primary-700 font-medium text-sm capitalize">
                {profile?.role === 'customer' ? 'Client' : 
                 profile?.role === 'vendor' ? 'Prestataire' : 
                 profile?.role === 'admin' ? 'Administrateur' : profile?.role}
              </Text>
            </View>
          </View>
          
          <Button
            title="Modifier le profil"
            variant="outline"
            onPress={() => router.push('/profile/edit')}
          />
        </View>

        {/* Menu Items */}
        <View className="p-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Card className="mb-3">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
                    <item.icon size={20} color="#6B7280" />
                  </View>
                  
                  <Text className="flex-1 text-gray-900 font-medium">
                    {item.label}
                  </Text>
                  
                  <Text className="text-gray-400">›</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <View className="px-6 pb-6">
          <TouchableOpacity
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <Card className="border border-red-200">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-4">
                  <LogOut size={20} color="#DC2626" />
                </View>
                
                <Text className="flex-1 text-red-600 font-medium">
                  Se déconnecter
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}