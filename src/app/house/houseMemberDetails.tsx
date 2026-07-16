// app/member-details.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CharacterDetails {
  id: string;
  name: string;
  actor: string;
  house: string;
  ancestry: string;
  patronus: string;
  dateOfBirth: string;
  wand: {
    wood: string;
    core: string;
    length: number | null;
  };
  image: string;
}

const HOUSE_THEMES: Record<string, { color: string; textColor: string; name: string }> = {
  gryffindor: { color: '#740001', textColor: '#FFF', name: 'Gryffindor' },
  slytherin: { color: '#1A472A', textColor: '#FFF', name: 'Slytherin' },
  ravenclaw: { color: '#222F5B', textColor: '#FFF', name: 'Ravenclaw' },
  hufflepuff: { color: '#FFDB00', textColor: '#000', name: 'Hufflepuff' },
};

export default function MemberDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [character, setCharacter] = useState<CharacterDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        // Fetching the specific character data using their ID
        const response = await fetch(`https://hp-api.onrender.com/api/character/${id}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          setCharacter(data[0]);
        } else {
          setError('Character not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch character details');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterDetails();
  }, [id]);

  // Determine theme dynamically based on the fetched character's house
  const houseKey = character?.house?.toLowerCase() || 'gryffindor';
  const theme = HOUSE_THEMES[houseKey] || HOUSE_THEMES.gryffindor;

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: '#121212' }]}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  if (error || !character) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: '#121212' }]}>
        <Text style={styles.errorText}>{error || 'Something went wrong'}</Text>
        <TouchableOpacity style={styles.errorButton} onPress={() => router.back()}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.color }]}>
      
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.textColor === '#000' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }]} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={[styles.backButtonText, { color: theme.textColor }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>Profile</Text>
      </View>

      {/* DETAILS CARD CONTENT */}
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileCard, { backgroundColor: theme.textColor === '#000' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.15)' }]}>
          
          {/* CHARACTER IMAGE */}
          {character.image ? (
            <Image 
              source={{ uri: character.image }} 
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: theme.textColor === '#000' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }]}>
              <Text style={[styles.placeholderText, { color: theme.textColor }]}>No Image Available</Text>
            </View>
          )}

          <Text style={[styles.name, { color: theme.textColor, marginTop: 16 }]}>{character.name}</Text>
          <Text style={[styles.houseSub, { color: theme.textColor, opacity: 0.8 }]}>
            House of {theme.name}
          </Text>

          <View style={[styles.divider, { backgroundColor: theme.textColor, opacity: 0.2 }]} />

          {/* BIO METRICS */}
          <View style={styles.infoSection}>
            <Text style={[styles.label, { color: theme.textColor, opacity: 0.6 }]}>Actor</Text>
            <Text style={[styles.value, { color: theme.textColor }]}>{character.actor || 'N/A'}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={[styles.label, { color: theme.textColor, opacity: 0.6 }]}>Ancestry</Text>
            <Text style={[styles.value, { color: theme.textColor }]}>{character.ancestry || 'Unknown'}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={[styles.label, { color: theme.textColor, opacity: 0.6 }]}>Date of Birth</Text>
            <Text style={[styles.value, { color: theme.textColor }]}>{character.dateOfBirth || 'Unknown'}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={[styles.label, { color: theme.textColor, opacity: 0.6 }]}>Patronus</Text>
            <Text style={[styles.value, { color: theme.textColor }]}>{character.patronus || 'None/Unknown'}</Text>
          </View>

          {/* WAND CHARACTERISTICS */}
          <View style={styles.infoSection}>
            <Text style={[styles.label, { color: theme.textColor, opacity: 0.6 }]}>Wand</Text>
            <Text style={[styles.value, { color: theme.textColor }]}>
              {character.wand.wood ? `${character.wand.wood} wood` : 'Unknown wood'} 
              {character.wand.core ? `, ${character.wand.core} core` : ''}
              {character.wand.length ? `, ${character.wand.length}"` : ''}
            </Text>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15 },
  backButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  backButtonText: { fontSize: 14, fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  profileCard: { padding: 24, borderRadius: 20 },
  profileImage: { width: '100%', height: 320, borderRadius: 12 },
  imagePlaceholder: { width: '100%', height: 320, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 16, fontWeight: '500', opacity: 0.6 },
  name: { fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
  houseSub: { fontSize: 16, textAlign: 'center', marginTop: 4, fontStyle: 'italic' },
  divider: { height: 1, marginVertical: 20 },
  infoSection: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  value: { fontSize: 17, fontWeight: '500', marginTop: 2 },
  errorText: { color: '#FFF', fontSize: 16, marginBottom: 15, textAlign: 'center' },
  errorButton: { backgroundColor: '#FF3B30', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  errorButtonText: { color: '#FFF', fontWeight: 'bold' }
});