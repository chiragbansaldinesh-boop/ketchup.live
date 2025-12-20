import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { Shield, MapPin, Users, Eye, MessageCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface SafetyTip {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: 'meeting' | 'online' | 'venue' | 'general';
}

const safetyTips: SafetyTip[] = [
  {
    icon: <MapPin size={24} color="#D50000" />,
    title: 'Meet in Public Places',
    description: 'Always meet your matches in public venues like cafés, restaurants, or other busy locations. Avoid private or isolated areas for first meetings.',
    category: 'meeting',
  },
  {
    icon: <Users size={24} color="#D50000" />,
    title: 'Tell Someone Your Plans',
    description: 'Let a friend or family member know where you\'re going, who you\'re meeting, and when you expect to return.',
    category: 'meeting',
  },
  {
    icon: <Eye size={24} color="#D50000" />,
    title: 'Trust Your Instincts',
    description: 'If something feels off or uncomfortable, trust your gut feeling. You can always leave or end the conversation.',
    category: 'general',
  },
  {
    icon: <MessageCircle size={24} color="#D50000" />,
    title: 'Keep Conversations on the App',
    description: 'Avoid sharing personal contact information too quickly. Use the app\'s messaging system until you feel comfortable.',
    category: 'online',
  },
  {
    icon: <Shield size={24} color="#D50000" />,
    title: 'Protect Personal Information',
    description: 'Don\'t share your home address, workplace details, or financial information with matches.',
    category: 'online',
  },
  {
    icon: <AlertTriangle size={24} color="#D50000" />,
    title: 'Report Suspicious Behavior',
    description: 'If someone makes you uncomfortable or violates our guidelines, block and report them immediately.',
    category: 'general',
  },
];

const categoryTitles = {
  meeting: 'Meeting in Person',
  online: 'Online Safety',
  venue: 'Venue Safety',
  general: 'General Safety',
};

export default function SafetyTipsScreen() {
  const categorizedTips = Object.entries(categoryTitles).map(([category, title]) => ({
    category: category as keyof typeof categoryTitles,
    title,
    tips: safetyTips.filter(tip => tip.category === category),
  }));

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Safety Tips',
          headerShown: true,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTitleStyle: { fontSize: 18, fontWeight: '600' },
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Shield size={32} color="#D50000" />
          </View>
          <Text style={styles.title}>Safety First</Text>
          <Text style={styles.subtitle}>
            Your safety is our top priority. Follow these guidelines to have 
            safe and enjoyable experiences on Ketchup.live.
          </Text>
        </View>

        {categorizedTips.map((category) => (
          <View key={category.category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            {category.tips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <View style={styles.tipIcon}>{tip.icon}</View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.emergencySection}>
          <View style={styles.emergencyHeader}>
            <AlertTriangle size={24} color="#DC2626" />
            <Text style={styles.emergencyTitle}>Emergency Situations</Text>
          </View>
          <Text style={styles.emergencyText}>
            If you feel unsafe or threatened, prioritize your safety:
            {'\n\n'}
            • Leave the situation immediately
            {'\n'}
            • Contact local emergency services (911)
            {'\n'}
            • Report the incident to our safety team
            {'\n\n'}
            Remember: Your safety is more important than being polite.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            For additional support or to report safety concerns, contact our 
            safety team at safety@ketchup.live
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  categorySection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  tipDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  emergencySection: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 24,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
    marginLeft: 12,
  },
  emergencyText: {
    fontSize: 14,
    color: '#7F1D1D',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});