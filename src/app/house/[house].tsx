import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Define an interface for consistent data structure
interface HouseInfo {
  color: string;
  name: string;
  traits: string;
  textColor: string;
}

// Ensure every entry has the same properties
const HOUSE_DATA: Record<string, HouseInfo> = {
  gryffindor: { color: '#740001', name: 'Gryffindor', traits: 'Bravery, helping hand, and chivalry.', textColor: '#FFF' },
  slytherin: { color: '#1A472A', name: 'Slytherin', traits: 'Ambition, cunning, and resourcefulness.', textColor: '#FFF' },
  ravenclaw: { color: '#222F5B', name: 'Ravenclaw', traits: 'Intelligence, knowledge, and wit.', textColor: '#FFF' },
  hufflepuff: { color: '#FFDB00', name: 'Hufflepuff', traits: 'Hard work, patience, and loyalty.', textColor: '#000' },
};

export default function HouseDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { house } = useLocalSearchParams<{ house: string }>();

  // Safely get data; fallback to Gryffindor if the key is missing
  const houseKey = (house as string)?.toLowerCase() || 'gryffindor';
  const data = HOUSE_DATA[houseKey] || HOUSE_DATA.gryffindor;

  return (
    <View style={[styles.container, { backgroundColor: data.color }]}>
      
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: data.textColor === '#000' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }]} 
          onPress={() => router.back()} 
          activeOpacity={0.7}
        >
          <Text style={[styles.backButtonText, { color: data.textColor }]}>← Common Room Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.centerContent}>
        <Text style={[styles.text, { color: data.textColor }]}>Welcome to {data.name}!</Text>
        <Text style={[styles.subtext, { color: data.textColor, opacity: 0.7 }]}>{data.traits}</Text>

        {/* 🆕 NEW BUTTON TO GO TO THE MEMBERS SCREEN */}
        <TouchableOpacity 
          style={[styles.membersButton, { backgroundColor: data.textColor === '#000' ? '#000' : '#FFF' }]}
          onPress={() => router.push({
            pathname: './houseMember', // The new route we will create
            params: { house: houseKey } // Pass the selected house along
          })}
          activeOpacity={0.8}
        >
          <Text style={[styles.membersButtonText, { color: data.textColor === '#000' ? '#FFF' : '#000' }]}>
            View House Members →
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 10, width: '100%' },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  backButtonText: { fontSize: 14, fontWeight: '600', letterSpacing: 0.5 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, marginTop: -60 },
  text: { fontSize: 28, fontWeight: 'bold', letterSpacing: 1, textAlign: 'center' },
  subtext: { fontSize: 16, marginTop: 8, textAlign: 'center' },
  
  // 🆕 Button styles
  membersButton: { marginTop: 30, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  membersButtonText: { fontSize: 16, fontWeight: 'bold' }
});