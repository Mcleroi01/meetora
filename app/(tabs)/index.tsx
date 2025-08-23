import { View, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';

export default function Index() {
  const { loading, isAuthenticated, profile } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/onboarding" />;
  }

  // Redirect based on role
  if (profile?.role === 'vendor') {
    return <Redirect href="/(tabs)/vendor" />;
  } else if (profile?.role === 'admin') {
    return <Redirect href="/(tabs)/admin" />;
  } else {
    return <Redirect href="/(tabs)/home" />;
  }
}