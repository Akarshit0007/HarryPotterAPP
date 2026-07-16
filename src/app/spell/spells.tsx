import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Spell {
  id: string;
  name: string;
  description: string;
}

export default function SpellsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [spells, setSpells] = useState<Spell[]>([]);
  const [filteredSpells, setFilteredSpells] = useState<Spell[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetch('https://hp-api.onrender.com/api/spells')
      .then((response) => response.json())
      .then((data: Spell[]) => {
        setSpells(data);
        setFilteredSpells(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching spells:", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text === '') {
      setFilteredSpells(spells);
    } else {
      const filtered = spells.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase()) || 
        item.description.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSpells(filtered);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>SPELLS COMPENDIUM</Text>
      </View>

      {/* SEARCH BAR INPUT */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search incantations (e.g., Lumos)..."
        placeholderTextColor="#8B949E"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* LAYOUT STATES */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>Unlocking ancient spellbooks...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSpells}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.spellCard}>
              <Text style={styles.spellName}>{item.name}</Text>
              <Text style={styles.spellDescription}>{item.description}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No magic matches your search query.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: '#1F242C',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginRight: 15,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 2,
  },
  searchBar: {
    backgroundColor: '#1F242C',
    color: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  spellCard: {
    backgroundColor: '#161B22',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  spellName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  spellDescription: {
    fontSize: 14,
    color: '#C9D1D9',
    lineHeight: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    color: '#8B949E',
    marginTop: 12,
    fontSize: 14,
  },
  emptyText: {
    color: '#8B949E',
    textAlign: 'center',
    fontSize: 15,
  },
});