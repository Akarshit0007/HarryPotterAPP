// app/house-members.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Character {
  id: string;
  name: string;
  actor: string;
  ancestry: string;
}

const HOUSE_THEMES: Record<string, { color: string; textColor: string; name: string }> = {
  gryffindor: { color: '#740001', textColor: '#FFF', name: 'Gryffindor' },
  slytherin: { color: '#1A472A', textColor: '#FFF', name: 'Slytherin' },
  ravenclaw: { color: '#222F5B', textColor: '#FFF', name: 'Ravenclaw' },
  hufflepuff: { color: '#FFDB00', textColor: '#000', name: 'Hufflepuff' },
};

export default function HouseMembersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { house } = useLocalSearchParams<{ house: string }>();

  const houseKey = (house as string)?.toLowerCase() || 'gryffindor';
  const theme = HOUSE_THEMES[houseKey] || HOUSE_THEMES.gryffindor;

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://hp-api.onrender.com/api/characters/house/${houseKey}`);
        const data = await response.json();
        setCharacters(data.slice(0, 30)); // Limit to first 30 characters
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [houseKey]);

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
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>{theme.name} Members</Text>
      </View>

      {/* LIST CONTENT */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.textColor} />
        </View>
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: theme.textColor === '#000' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.15)' }]}>
              <Text style={[styles.characterName, { color: theme.textColor }]}>{item.name}</Text>
              <Text style={[styles.characterSub, { color: theme.textColor, opacity: 0.7 }]}>
                Played by: {item.actor || 'Unknown'}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15 },
  backButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  backButtonText: { fontSize: 14, fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { padding: 16, borderRadius: 12, marginBottom: 10 },
  characterName: { fontSize: 16, fontWeight: 'bold' },
  characterSub: { fontSize: 13, marginTop: 4 }
});