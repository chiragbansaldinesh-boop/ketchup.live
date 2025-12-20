import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabaseAuthService } from '@/services/supabaseAuthService';
import { router } from 'expo-router';
import { User, Mail, Lock, Phone, Camera } from 'lucide-react-native';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    profilePic: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await supabaseAuthService.signUp(
        formData.email,
        formData.password,
        {
          full_name: formData.fullName,
          phone: formData.phone,
          photo_url: formData.profilePic,
        }
      );

      if (result.success) {
        Alert.alert(
          'Success',
          'Account created successfully! Welcome to Ketchup.live',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        Alert.alert(
          'Signup Failed',
          result.error || 'An error occurred during signup. Please try again.'
        );
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert(
        'Signup Failed',
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join Ketchup.live and start connecting with people nearby
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <User size={20} color="#6B7280" />
              </View>
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="Full Name"
                placeholderTextColor="#9CA3AF"
                value={formData.fullName}
                onChangeText={(text) => updateFormData('fullName', text)}
                autoCapitalize="words"
              />
            </View>
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Mail size={20} color="#6B7280" />
              </View>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email Address"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Phone size={20} color="#6B7280" />
              </View>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="Phone Number"
                placeholderTextColor="#9CA3AF"
                value={formData.phone}
                onChangeText={(text) => updateFormData('phone', text)}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </View>
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Camera size={20} color="#6B7280" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Profile Picture URL (Optional)"
                placeholderTextColor="#9CA3AF"
                value={formData.profilePic}
                onChangeText={(text) => updateFormData('profilePic', text)}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Lock size={20} color="#6B7280" />
              </View>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={formData.password}
                onChangeText={(text) => updateFormData('password', text)}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Lock size={20} color="#6B7280" />
              </View>
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder="Confirm Password"
                placeholderTextColor="#9CA3AF"
                value={formData.confirmPassword}
                onChangeText={(text) => updateFormData('confirmPassword', text)}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

            <TouchableOpacity
              style={[styles.signupButton, loading && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.signupButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginPrompt}>
              <Text style={styles.loginPromptText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
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
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: '#374151',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 16,
    marginLeft: 4,
  },
  signupButton: {
    backgroundColor: '#D50000',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#D50000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  loginPromptText: {
    fontSize: 16,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 16,
    color: '#D50000',
    fontWeight: '600',
  },
});