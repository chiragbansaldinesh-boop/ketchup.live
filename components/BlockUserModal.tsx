import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Shield } from 'lucide-react-native';
import { privacyService } from '@/services/privacyService';

interface BlockUserModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  venue: string;
  onUserBlocked: () => void;
}

export default function BlockUserModal({
  visible,
  onClose,
  userId,
  userName,
  venue,
  onUserBlocked,
}: BlockUserModalProps) {
  const [isBlocking, setIsBlocking] = useState(false);
  const [blockVenue, setBlockVenue] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBlock = async () => {
    setIsBlocking(true);
    setError(null);

    try {
      await privacyService.blockUser(userId);

      if (blockVenue) {
        await privacyService.hideVenue(venue);
      }

      onUserBlocked();
    } catch (err) {
      setError('Failed to block user. Please try again.');
      console.error('Error blocking user:', err);
    } finally {
      setIsBlocking(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <Shield size={32} color="#DC2626" />
          </View>

          <Text style={styles.modalTitle}>Block {userName}?</Text>

          <Text style={styles.modalDescription}>
            They won't be able to see your profile or send you messages.
          </Text>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setBlockVenue(!blockVenue)}
          >
            <View style={[styles.checkbox, blockVenue && styles.checkboxChecked]}>
              {blockVenue && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              Also hide {venue} from my venues
            </Text>
          </TouchableOpacity>

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isBlocking}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.blockButton]}
              onPress={handleBlock}
              disabled={isBlocking}
            >
              {isBlocking ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.blockButtonText}>Block</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#D50000',
    borderColor: '#D50000',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  blockButton: {
    backgroundColor: '#DC2626',
  },
  blockButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
