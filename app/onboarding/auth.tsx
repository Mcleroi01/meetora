import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { signUp, signIn, resetPassword } from '@/src/lib/auth';
import { router } from 'expo-router';

type AuthMode = 'signin' | 'signup' | 'reset';

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!email || (!password && mode !== 'reset')) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs requis');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        router.replace('/(tabs)');
      } else if (mode === 'signup') {
        if (!fullName) {
          Alert.alert('Erreur', 'Veuillez renseigner votre nom complet');
          return;
        }
        const { error } = await signUp(email, password, { full_name: fullName, role });
        if (error) throw error;
        Alert.alert(
          'Compte créé !',
          'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
          [{ text: 'OK', onPress: () => setMode('signin') }]
        );
      } else if (mode === 'reset') {
        const { error } = await resetPassword(email);
        if (error) throw error;
        Alert.alert(
          'Email envoyé',
          'Un lien de réinitialisation a été envoyé à votre adresse email.',
          [{ text: 'OK', onPress: () => setMode('signin') }]
        );
      }
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (mode) {
      case 'signup':
        return (
          <>
            <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
              Créer un compte
            </Text>
            <Text className="text-gray-600 text-center mb-8">
              Rejoignez Sambukila dès maintenant
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 font-medium mb-2">Nom complet</Text>
                <TextInput
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  placeholder="Entrez votre nom complet"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>

              <View>
                <Text className="text-gray-700 font-medium mb-2">Email</Text>
                <TextInput
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  placeholder="votre@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text className="text-gray-700 font-medium mb-2">Mot de passe</Text>
                <View className="relative">
                  <TextInput
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl pr-12"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3"
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#9CA3AF" />
                    ) : (
                      <Eye size={20} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <Text className="text-gray-700 font-medium mb-2">Je suis...</Text>
                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    onPress={() => setRole('customer')}
                    className={`flex-1 p-4 rounded-xl border-2 ${
                      role === 'customer' ? 'border-primary-600 bg-primary-50' : 'border-gray-300'
                    }`}
                  >
                    <Text className={`text-center font-medium ${
                      role === 'customer' ? 'text-primary-700' : 'text-gray-700'
                    }`}>
                      Client
                    </Text>
                    <Text className="text-xs text-gray-500 text-center mt-1">
                      J'organise des événements
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => setRole('vendor')}
                    className={`flex-1 p-4 rounded-xl border-2 ${
                      role === 'vendor' ? 'border-primary-600 bg-primary-50' : 'border-gray-300'
                    }`}
                  >
                    <Text className={`text-center font-medium ${
                      role === 'vendor' ? 'text-primary-700' : 'text-gray-700'
                    }`}>
                      Prestataire
                    </Text>
                    <Text className="text-xs text-gray-500 text-center mt-1">
                      Je propose mes services
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Button
                title="Créer mon compte"
                onPress={handleSubmit}
                loading={loading}
                className="mt-6"
              />

              <View className="flex-row justify-center items-center mt-4">
                <Text className="text-gray-600">Déjà un compte ? </Text>
                <TouchableOpacity onPress={() => setMode('signin')}>
                  <Text className="text-primary-600 font-medium">Se connecter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        );

      case 'reset':
        return (
          <>
            <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
              Mot de passe oublié
            </Text>
            <Text className="text-gray-600 text-center mb-8">
              Entrez votre email pour recevoir un lien de réinitialisation
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 font-medium mb-2">Email</Text>
                <TextInput
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  placeholder="votre@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Button
                title="Envoyer le lien"
                onPress={handleSubmit}
                loading={loading}
                className="mt-6"
              />

              <View className="flex-row justify-center items-center mt-4">
                <TouchableOpacity onPress={() => setMode('signin')}>
                  <Text className="text-primary-600 font-medium">Retour à la connexion</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        );

      default:
        return (
          <>
            <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
              Bon retour !
            </Text>
            <Text className="text-gray-600 text-center mb-8">
              Connectez-vous à votre compte
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 font-medium mb-2">Email</Text>
                <TextInput
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  placeholder="votre@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text className="text-gray-700 font-medium mb-2">Mot de passe</Text>
                <View className="relative">
                  <TextInput
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl pr-12"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3"
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#9CA3AF" />
                    ) : (
                      <Eye size={20} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setMode('reset')}
                className="self-end"
              >
                <Text className="text-primary-600 font-medium text-sm">
                  Mot de passe oublié ?
                </Text>
              </TouchableOpacity>

              <Button
                title="Se connecter"
                onPress={handleSubmit}
                loading={loading}
                className="mt-6"
              />

              <View className="flex-row justify-center items-center mt-4">
                <Text className="text-gray-600">Pas encore de compte ? </Text>
                <TouchableOpacity onPress={() => setMode('signup')}>
                  <Text className="text-primary-600 font-medium">S'inscrire</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center p-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View className="px-6 pb-6">
          <Card className="p-6">
            {renderForm()}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}