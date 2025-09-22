import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ProximityDetector from '@/components/ProximityDetector';
import { DEFAULT_CAFE } from '@/utils/locationUtils';

export default function ProximityScreen() {
  const [showingNearbyPeople, setShowingNearbyPeople] = useState(false);

  const handleShowNearbyPeople = () => {
    setShowingNearbyPeople(true);
    // Navigate to the main discovery screen or show nearby people
    console.log('Showing nearby people in the café');
  };

  return (
    <View style={styles.container}>
      <ProximityDetector
        cafeLocation={DEFAULT_CAFE}
        onShowNearbyPeople={handleShowNearbyPeople}
        radiusMeters={60} // 200 feet
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});