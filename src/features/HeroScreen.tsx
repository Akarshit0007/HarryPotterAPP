import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// 1. Import useRouter from expo-router
import { useRouter } from 'expo-router';
import { cards, useHeroTabs } from './hooks/useHeroTabs';

const logoImg = require("@/assets/images/Logo.png");

const getHouseColor = (house: string) => {
  switch (house.toLowerCase()) {
    case 'gryffindor': return '#740001';
    case 'ravenclaw': return '#0E1A40';
    case 'hufflepuff': return '#ECB939';
    case 'slytherin': return '#1A472A';
    default: return '#1F242C';
  }
};

const getTextColor = (house: string) => {
  return house.toLowerCase() === 'hufflepuff' ? '#0D1117' : '#FFFFFF';
};

export function HeroScreen() {
  const { activeTab, setActiveTab, tabs } = useHeroTabs();
  const insets = useSafeAreaInsets();
  // 2. Initialize the router
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />

      {/* STICKY TOP NAVIGATION NAVBAR */}
      <View style={[styles.stickyHeaderContainer, { paddingTop: insets.top + 10 }]}>
        <Image source={logoImg} style={styles.locallogo} />

        <View style={styles.headerRow}>
          <Text style={styles.brandLogo}>MINISTRY OF MAGIC</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.stickyButton,
                    isActive ? styles.activeStickyButton : styles.inactiveStickyButton
                  ]}
                  onPress={() => {
                    if (tab.toLowerCase() === 'spells') {
                      // Redirects straight to your new folder structure!
                      router.push('/spell/spells');
                    } else {
                      setActiveTab(tab);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.stickyButtonText, isActive && styles.activeStickyButtonText]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* DYNAMIC BODY MAIN CONTENT */}
      <ScrollView contentContainerStyle={styles.bodyScrollView}>
        {activeTab === 'House' ? (
          <View>
            <Text style={styles.sectionTitle}>Select Your House</Text>
            <View style={styles.grid}>
              {cards.map((house) => (
                <TouchableOpacity
                  key={house}
                  style={[styles.houseCard, { backgroundColor: getHouseColor(house) }]}
                  activeOpacity={0.8}
                  // 3. Navigate dynamic path based on the item clicked
                  // Cast the string cleanly inside the router call to match an accepted type
                  onPress={() => {
                    const targetHouse = house.toLowerCase() as "gryffindor" | "slytherin" | "ravenclaw" | "hufflepuff";
                    router.push(`/house/${targetHouse}`);
                  }}
                >
                  <Text style={[styles.houseText, { color: getTextColor(house) }]}>
                    {house}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          /* STANDARD FALLBACK CONTENT FOR ALL OTHER TABS */
          <View style={styles.fallbackContent}>
            <Text style={styles.sectionTitle}>{activeTab}</Text>
            <Text style={styles.bodyText}>
              Welcome to the {activeTab} section. This official bulletin area remains standard
              for all Ministry personnel. Please review daily magic guidelines below.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117'
  },
  bodyScrollView: {
    flexGrow: 1,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 2,
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  houseCard: {
    width: '47%',
    height: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  houseText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  fallbackContent: {
    marginTop: 20,
    alignItems: 'center',
  },
  bodyText: {
    fontSize: 16,
    color: '#8B949E',
    textAlign: 'center',
    lineHeight: 24,
  },
  stickyHeaderContainer: {
    backgroundColor: '#0D1117',
    borderBottomWidth: 1,
    borderBottomColor: '#1F242C',
    paddingBottom: 15,
  },
  locallogo: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  headerRow: {
    gap: 12
  },
  brandLogo: {
    fontSize: 14,
    fontWeight: '900',
    color: '#D4AF37',
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 4
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  stickyButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  activeStickyButton: {
    backgroundColor: '#D4AF37'
  },
  stickyButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B949E'
  },
  inactiveStickyButton: {
    backgroundColor: '#1F242C',
  },
  activeStickyButtonText: {
    color: '#0D1117'
  },
});