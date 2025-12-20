import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock } from 'lucide-react-native';

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
  onExpire,
}: VenueSessionTimerProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = expiryTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Expired');
        onExpire();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      setIsExpiringSoon(diff < 15 * 60 * 1000);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiryTime, onExpire]);

  return (
    <View style={[styles.container, isExpiringSoon && styles.containerWarning]}>
      <View style={styles.content}>
        <Clock size={16} color={isExpiringSoon ? '#F59E0B' : '#6B7280'} />
        <Text style={[styles.text, isExpiringSoon && styles.textWarning]}>
          Session at {venueName}: {timeLeft}
        </Text>
      </View>
      {isExpiringSoon && (
        <TouchableOpacity onPress={onExtend} style={styles.extendButton}>
          <Text style={styles.extendText}>Extend</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F3F4F6',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  containerWarning: {
    backgroundColor: '#FEF3C7',
    borderBottomColor: '#FCD34D',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    marginLeft: 8,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  textWarning: {
    color: '#F59E0B',
  },
  extendButton: {
    backgroundColor: '#D50000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  extendText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
