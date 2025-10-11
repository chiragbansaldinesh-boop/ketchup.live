import { supabase } from '@/config/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface SupabaseUser {
  id: string;
  email: string;
  full_name?: string;
  display_name?: string;
  phone?: string;
  photo_url?: string;
  bio?: string;
  age?: number;
  interests?: string[];
  photos?: string[];
  is_online?: boolean;
  last_seen?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseVenue {
  id: string;
  name: string;
  type: 'coffee' | 'bar' | 'restaurant';
  address: string;
  latitude: number;
  longitude: number;
  active_users: number;
  rating: number;
  qr_code: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseMatch {
  id: string;
  user1_id: string;
  user2_id: string;
  venue: string;
  matched_at: string;
  is_active: boolean;
  last_message_at?: string;
}

export interface SupabaseMessage {
  id: string;
  match_id: string;
  sender_id: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface SupabaseCheckIn {
  id: string;
  user_id: string;
  venue_id: string;
  checked_in_at: string;
  expires_at: string;
  is_active: boolean;
}

class SupabaseDatabaseService {
  async getUser(userId: string): Promise<SupabaseUser | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async updateUser(userId: string, updates: Partial<SupabaseUser>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  async updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    try {
      await this.updateUser(userId, {
        is_online: isOnline,
        last_seen: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating user online status:', error);
    }
  }

  async blockUser(userId: string, blockedUserId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('blocked_users')
        .insert({
          user_id: userId,
          blocked_user_id: blockedUserId,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error blocking user:', error);
      return false;
    }
  }

  async unblockUser(userId: string, blockedUserId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('blocked_users')
        .delete()
        .eq('user_id', userId)
        .eq('blocked_user_id', blockedUserId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unblocking user:', error);
      return false;
    }
  }

  async getBlockedUsers(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('blocked_users')
        .select('blocked_user_id')
        .eq('user_id', userId);

      if (error) throw error;
      return data?.map((row) => row.blocked_user_id) || [];
    } catch (error) {
      console.error('Error getting blocked users:', error);
      return [];
    }
  }

  async hideVenue(userId: string, venueId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('hidden_venues')
        .insert({
          user_id: userId,
          venue_id: venueId,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error hiding venue:', error);
      return false;
    }
  }

  async unhideVenue(userId: string, venueId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('hidden_venues')
        .delete()
        .eq('user_id', userId)
        .eq('venue_id', venueId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unhiding venue:', error);
      return false;
    }
  }

  async getHiddenVenues(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('hidden_venues')
        .select('venue_id')
        .eq('user_id', userId);

      if (error) throw error;
      return data?.map((row) => row.venue_id) || [];
    } catch (error) {
      console.error('Error getting hidden venues:', error);
      return [];
    }
  }

  async getNearbyUsers(
    latitude: number,
    longitude: number,
    radiusKm: number = 5
  ): Promise<SupabaseUser[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_online', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting nearby users:', error);
      return [];
    }
  }

  subscribeToUserUpdates(
    userId: string,
    callback: (user: SupabaseUser) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel(`user-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as SupabaseUser);
        }
      )
      .subscribe();

    return channel;
  }

  unsubscribe(channel: RealtimeChannel): void {
    supabase.removeChannel(channel);
  }
}

export const supabaseDatabaseService = new SupabaseDatabaseService();
