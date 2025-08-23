import { Tabs } from 'expo-router';
import { Chrome as Home, Calendar, MessageCircle, User, Store } from 'lucide-react-native';
import { useAuth } from '@/src/hooks/useAuth';

export default function TabLayout() {
  const { profile } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
      }}>
      
      {profile?.role === 'vendor' ? (
        <>
          <Tabs.Screen
            name="vendor"
            options={{
              title: 'Mon espace',
              tabBarIcon: ({ size, color }) => (
                <Store size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="bookings"
            options={{
              title: 'Réservations',
              tabBarIcon: ({ size, color }) => (
                <Calendar size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="chat"
            options={{
              title: 'Messages',
              tabBarIcon: ({ size, color }) => (
                <MessageCircle size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profil',
              tabBarIcon: ({ size, color }) => (
                <User size={size} color={color} />
              ),
            }}
          />
        </>
      ) : profile?.role === 'admin' ? (
        <>
          <Tabs.Screen
            name="admin"
            options={{
              title: 'Administration',
              tabBarIcon: ({ size, color }) => (
                <Store size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profil',
              tabBarIcon: ({ size, color }) => (
                <User size={size} color={color} />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Tabs.Screen
            name="home"
            options={{
              title: 'Accueil',
              tabBarIcon: ({ size, color }) => (
                <Home size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="events"
            options={{
              title: 'Mes événements',
              tabBarIcon: ({ size, color }) => (
                <Calendar size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="bookings"
            options={{
              title: 'Réservations',
              tabBarIcon: ({ size, color }) => (
                <Store size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="chat"
            options={{
              title: 'Messages',
              tabBarIcon: ({ size, color }) => (
                <MessageCircle size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profil',
              tabBarIcon: ({ size, color }) => (
                <User size={size} color={color} />
              ),
            }}
          />
        </>
      )}
      
      {/* Hide unused tabs */}
      <Tabs.Screen 
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}