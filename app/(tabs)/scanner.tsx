import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { MapPin, CircleCheck as CheckCircle, Users, Clock, Star } from 'lucide-react-native';

export default function ScannerScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [checkedInVenue, setCheckedInVenue] = useState<string | null>(null);
  const [sessionExpiry, setSessionExpiry] = useState<string | null>(null);

  useEffect(() => {
    // Reset scanned state when component mounts
    setScanned(false);
  }, []);

  if (!permission) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading camera...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionText}>
            We need camera permission to scan QR codes at venues
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    
    // Simulate venue check-in
    const venueNames = ['Blue Bottle Coffee', 'The Rusty Anchor Bar', 'Sunset Bistro', 'Central Park Café'];
    const randomVenue = venueNames[Math.floor(Math.random() * venueNames.length)];
    
    setTimeout(() => {
      setCheckedInVenue(randomVenue);
      // Set session expiry to 2 hours from now
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 2);
      setSessionExpiry(expiry.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 500);
  };

  const resetScanner = () => {
    setScanned(false);
    setCheckedInVenue(null);
    setSessionExpiry(null);
  };

  const extendSession = () => {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 2);
    setSessionExpiry(expiry.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  if (checkedInVenue) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <CheckCircle size={64} color="#10B981" />
          </View>
          <Text style={styles.successTitle}>Check-in Successful!</Text>
          <Text style={styles.successVenue}>{checkedInVenue}</Text>
          
          <View style={styles.sessionInfo}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.sessionText}>
              Active until {sessionExpiry}
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.venueStatItem}>
              <Users size={24} color="#D50000" />
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>People here now</Text>
            </View>
            <View style={styles.venueStatItem}>
              <Star size={24} color="#F59E0B" />
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Venue rating</Text>
            </View>
          </View>

          <Text style={styles.successDescription}>
            You can now discover and match with other people at this venue!
          </Text>
          
          <TouchableOpacity style={styles.discoverButton}>
            <Text style={styles.discoverButtonText}>Start Discovering</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.extendSessionButton} onPress={extendSession}>
            <Clock size={16} color="#D50000" />
            <Text style={styles.extendSessionText}>Extend Session (+2 hours)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.scanAgainButton} onPress={resetScanner}>
            <Text style={styles.scanAgainText}>Scan Another Venue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan Venue QR Code</Text>
        <Text style={styles.subtitle}>
          Find and connect with people at the same venue
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.scannerFrame} />
            <Text style={styles.scannerText}>
              Point your camera at the venue's QR code
            </Text>
          </View>
        </CameraView>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.instructionsContainer}>
          <View style={styles.instruction}>
            <MapPin size={20} color="#D50000" />
            <Text style={styles.instructionText}>
              Look for QR codes at tables, counters, or entrance
            </Text>
          </View>
        </View>

        <View style={styles.recentVenues}>
          <Text style={styles.recentTitle}>Recent Check-ins</Text>
          <TouchableOpacity style={styles.recentVenue}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.recentVenueText}>The Coffee House</Text>
            <Text style={styles.recentTime}>2 hours ago</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.recentVenue}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.recentVenueText}>Rooftop Lounge</Text>
            <Text style={styles.recentTime}>Yesterday</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerFrame: {
    width: 200,
    height: 200,
    borderColor: '#D50000',
    borderWidth: 3,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  scannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  instructionsContainer: {
    marginBottom: 24,
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  instructionText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  recentVenues: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  recentVenue: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  recentVenueText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#374151',
    flex: 1,
    fontWeight: '500',
  },
  recentTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#D50000',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 12,
    textAlign: 'center',
  },
  successVenue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  sessionText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  venueStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#D50000',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  successDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  discoverButton: {
    backgroundColor: '#D50000',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 16,
    width: '100%',
  },
  extendSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#D50000',
    marginBottom: 16,
  },
  extendSessionText: {
    color: '#D50000',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  discoverButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  scanAgainButton: {
    paddingVertical: 12,
  },
  scanAgainText: {
    color: '#D50000',
    fontSize: 16,
    fontWeight: '500',
  },
});