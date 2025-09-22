import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Shield, X, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { privacyService } from '@/services/privacyService';
import { ReportReason } from '@/types/privacy';

interface BlockUserModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  venue?: string;
  onUserBlocked: () => void;
}

const reportReasons: ReportReason[] = [
  {
    id: 'inappropriate_behavior',
    label: 'Inappropriate Behavior',
    description: 'Harassment, offensive language, or inappropriate conduct',
  },
  {
    id: 'spam',
    label: 'Spam or Fake Profile',
    description: 'Spam messages, fake photos, or suspicious activity',
  },
  {
    id: 'safety_concern',
    label: 'Safety Concern',
    description: 'Threatening behavior or safety-related issues',
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Other reason not listed above',
  },
];

export default function BlockUserModal({
  visible,
  onClose,
  userId,
  userName,
  venue,
  onUserBlocked,
}: BlockUserModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  const resetForm = () => {
    setSelectedReason('');
    setDescription('');
    setShowReportForm(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBlockUser = async () => {
    setIsBlocking(true);
    try {
      await privacyService.blockUser({
        userId,
        reason: selectedReason,
        venue,
      });
      
      Alert.alert(
        'User Blocked',
        `${userName} has been blocked. They will no longer be able to see your profile or contact you.`,
        [{ text: 'OK', onPress: () => {
          onUserBlocked();
          handleClose();
        }}]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to block user. Please try again.');
    } finally {
      setIsBlocking(false);
    }
  };

  const handleReportUser = async () => {
    if (!selectedReason) {
      Alert.alert('Error', 'Please select a reason for reporting.');
      return;
    }

    setIsReporting(true);
    try {
      await privacyService.reportUser({
        reportedUserId: userId,
        reason: selectedReason,
        description: description.trim() || undefined,
        venue,
      });
      
      Alert.alert(
        'Report Submitted',
        'Thank you for reporting. Our team will review this report and take appropriate action.',
        [{ text: 'OK', onPress: handleClose }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setIsReporting(false);
    }
  };

  const handleBlockAndReport = async () => {
    if (!selectedReason) {
      Alert.alert('Error', 'Please select a reason.');
      return;
    }

    setIsBlocking(true);
    try {
      // Block user first
      await privacyService.blockUser({
        userId,
        reason: selectedReason,
        venue,
      });

      // Then report user
      await privacyService.reportUser({
        reportedUserId: userId,
        reason: selectedReason,
        description: description.trim() || undefined,
        venue,
      });
      
      Alert.alert(
        'User Blocked and Reported',
        `${userName} has been blocked and reported. Our team will review this report.`,
        [{ text: 'OK', onPress: () => {
          onUserBlocked();
          handleClose();
        }}]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to block and report user. Please try again.');
    } finally {
      setIsBlocking(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Block User</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.userInfo}>
            <Shield size={48} color="#DC2626" />
            <Text style={styles.userName}>Block {userName}?</Text>
            <Text style={styles.userDescription}>
              Blocked users won't be able to see your profile, send you messages, 
              or appear in your discovery feed.
            </Text>
          </View>

          <View style={styles.reasonSection}>
            <Text style={styles.sectionTitle}>Reason for blocking (optional)</Text>
            {reportReasons.map((reason) => (
              <TouchableOpacity
                key={reason.id}
                style={[
                  styles.reasonOption,
                  selectedReason === reason.id && styles.selectedReason,
                ]}
                onPress={() => setSelectedReason(reason.id)}
              >
                <View style={styles.reasonContent}>
                  <Text style={[
                    styles.reasonLabel,
                    selectedReason === reason.id && styles.selectedReasonText,
                  ]}>
                    {reason.label}
                  </Text>
                  <Text style={styles.reasonDescription}>{reason.description}</Text>
                </View>
                <View style={[
                  styles.radioButton,
                  selectedReason === reason.id && styles.selectedRadio,
                ]}>
                  {selectedReason === reason.id && (
                    <View style={styles.radioDot} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {selectedReason && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Additional details (optional)</Text>
              <TextInput
                style={styles.descriptionInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Provide additional context..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                maxLength={500}
              />
              <Text style={styles.characterCount}>{description.length}/500</Text>
            </View>
          )}

          <View style={styles.reportSection}>
            <View style={styles.reportHeader}>
              <AlertTriangle size={20} color="#F59E0B" />
              <Text style={styles.reportTitle}>Report for Review</Text>
            </View>
            <Text style={styles.reportDescription}>
              If this user violated our community guidelines, you can also report 
              them for our safety team to review.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.blockOnlyButton}
            onPress={handleBlockUser}
            disabled={isBlocking || isReporting}
          >
            {isBlocking && !selectedReason ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.blockOnlyText}>Block User</Text>
            )}
          </TouchableOpacity>

          {selectedReason && (
            <TouchableOpacity
              style={styles.blockReportButton}
              onPress={handleBlockAndReport}
              disabled={isBlocking || isReporting}
            >
              {isBlocking || isReporting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.blockReportText}>Block & Report</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userInfo: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
    marginTop: 16,
    marginBottom: 12,
  },
  userDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  reasonSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  reasonOption: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedReason: {
    borderColor: '#E53935',
    backgroundColor: '#FFF5F5',
  },
  reasonContent: {
    flex: 1,
  },
  reasonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  selectedReasonText: {
    color: '#E53935',
  },
  reasonDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  selectedRadio: {
    borderColor: '#E53935',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E53935',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
  },
  reportSection: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 24,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 8,
  },
  reportDescription: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  blockOnlyButton: {
    backgroundColor: '#6B7280',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  blockOnlyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  blockReportButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  blockReportText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});