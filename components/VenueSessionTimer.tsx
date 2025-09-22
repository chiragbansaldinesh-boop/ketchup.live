import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, MapPin } from 'lucide-react-native';

interface VenueSessionTimerProps {
  venueName: string;
  expiryTime: Date;
  onExtend: () => void;
  onExpire: () => void;
}

export default function VenueSessionTimer({ 
  venueName, 
  expiryTime, 
  onExtend, 
  onExpire 
}: VenueSessionTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpiring, setIsExpiring] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = expiryTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Expired');
        onExpire();
        clearInterval(timer);
        return;
      }

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (minutes < 10) {
        setIsExpiring(true);
      }

      if (minutes > 60) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        setTimeLeft(`${hours}h ${remainingMinutes}m`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTime, onExpire]);

  return (
    <View style={[styles.container, isExpiring && styles.expiringContainer]}>
      <View style={styles.info}>
        <View style={styles.venueInfo}>
          <MapPin size={14} color="#E53935" />
          <Text style={styles.venueName}>{venueName}</Text>
        </View>
        <View style={styles.timeInfo}>
          <Clock size={14} color={isExpiring ? "#DC2626" : "#6B7280"} />
          <Text style={[styles.timeLeft, isExpiring && styles.expiringText]}>
            {timeLeft}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.extendButton} onPress={onExtend}>
        <Text style={styles.extendText}>Extend</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FED7D7',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  expiringContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  info: {
    flex: 1,
  },
  venueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  venueName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E53935',
    marginLeft: 6,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLeft: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginLeft: 6,
  },
  expiringText: {
    color: '#DC2626',
    fontWeight: '600',
  },
  extendButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E53935',
  },
  extendText: {
    fontSize: 12,
    color: '#E53935',
    fontWeight: '600',
  },
});