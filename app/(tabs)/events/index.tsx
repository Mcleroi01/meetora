import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Calendar, MapPin } from 'lucide-react-native';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/hooks/useAuth';
import { router } from 'expo-router';

export default function EventsScreen() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', user.id)
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'published':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'published':
        return 'Publié';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-gray-900">
            Mes événements
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/events/create')}
            className="bg-primary-600 w-10 h-10 rounded-full items-center justify-center"
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Aucun événement"
          description="Créez votre premier événement et commencez à organiser."
          action={
            <Button
              title="Créer un événement"
              onPress={() => router.push('/events/create')}
            />
          }
        />
      ) : (
        <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
          {events.map((event) => (
            <TouchableOpacity
              key={event.id}
              onPress={() => router.push(`/events/${event.id}`)}
              activeOpacity={0.7}
            >
              <Card variant="elevated" className="mb-4">
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 mb-2">
                      {event.title}
                    </Text>
                    <View className="flex-row items-center mb-2">
                      <Calendar size={16} color="#6B7280" />
                      <Text className="text-gray-500 ml-2">
                        {formatDate(event.event_date)}
                      </Text>
                    </View>
                    {event.location_text && (
                      <View className="flex-row items-center">
                        <MapPin size={16} color="#6B7280" />
                        <Text className="text-gray-500 ml-2" numberOfLines={1}>
                          {event.location_text}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className={`px-3 py-1 rounded-full ${getStatusColor(event.status)}`}>
                    <Text className="text-xs font-medium">
                      {getStatusLabel(event.status)}
                    </Text>
                  </View>
                </View>

                {event.description && (
                  <Text className="text-gray-600 text-sm" numberOfLines={2}>
                    {event.description}
                  </Text>
                )}

                {event.budget && (
                  <View className="mt-3 pt-3 border-t border-gray-100">
                    <Text className="text-sm text-primary-600 font-medium">
                      Budget: {event.budget}€
                    </Text>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}