import { PrivacyPolicy, BlockedUser, UserReport, BlockUserRequest } from '@/types/privacy';

// Mock API service - replace with actual API calls
class PrivacyService {
  private static instance: PrivacyService;
  private blockedUserIds: Set<string> = new Set(['blocked_user_1', 'blocked_user_2']);

  static getInstance(): PrivacyService {
    if (!PrivacyService.instance) {
      PrivacyService.instance = new PrivacyService();
    }
    return PrivacyService.instance;
  }

  async getPrivacyPolicy(): Promise<PrivacyPolicy> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'privacy_policy_v1',
          version: '1.0',
          lastUpdated: '2025-01-15',
          sections: [
            {
              id: '1',
              title: 'Information We Collect',
              content: 'We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with other users. This includes your name, email address, photos, location data when you check into venues, and messages you send through our platform.',
              order: 1,
            },
            {
              id: '2',
              title: 'How We Use Your Information',
              content: 'We use the information we collect to provide, maintain, and improve our services, including to facilitate connections between users at the same venues, send you notifications about matches and messages, and ensure the safety and security of our platform.',
              order: 2,
            },
            {
              id: '3',
              title: 'Location Data',
              content: 'We collect precise location data when you check into venues to enable proximity-based matching. This data is only used to determine if you are within the designated venue area and is not shared with other users beyond general venue information.',
              order: 3,
            },
            {
              id: '4',
              title: 'Information Sharing',
              content: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with service providers who assist us in operating our platform.',
              order: 4,
            },
            {
              id: '5',
              title: 'Data Security',
              content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.',
              order: 5,
            },
            {
              id: '6',
              title: 'Your Rights',
              content: 'You have the right to access, update, or delete your personal information. You can also control your privacy settings within the app, including blocking other users and managing your visibility at venues.',
              order: 6,
            },
          ],
        });
      }, 500);
    });
  }

  async acceptPrivacyPolicy(): Promise<boolean> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Privacy policy acceptance recorded');
        resolve(true);
      }, 300);
    });
  }

  async getBlockedUsers(): Promise<BlockedUser[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'blocked_user_1',
            name: 'John Doe',
            photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
            blockedAt: '2 days ago',
            venue: 'Central Park Café',
            reason: 'Inappropriate behavior',
          },
          {
            id: 'blocked_user_2',
            name: 'Mike Smith',
            photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
            blockedAt: '1 week ago',
            venue: 'The Rusty Anchor',
            reason: 'Spam messages',
          },
        ]);
      }, 300);
    });
  }

  async blockUser(request: BlockUserRequest): Promise<boolean> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        this.blockedUserIds.add(request.userId);
        console.log('User blocked:', request);
        resolve(true);
      }, 300);
    });
  }

  async unblockUser(userId: string): Promise<boolean> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        this.blockedUserIds.delete(userId);
        console.log('User unblocked:', userId);
        resolve(true);
      }, 300);
    });
  }

  async reportUser(report: UserReport): Promise<boolean> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('User reported:', report);
        resolve(true);
      }, 300);
    });
  }

  async isUserBlocked(userId: string): Promise<boolean> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.blockedUserIds.has(userId));
      }, 100);
    });
  }

  async getBlockedUserIds(): Promise<string[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Array.from(this.blockedUserIds));
      }, 100);
    });
  }
}

export const privacyService = PrivacyService.getInstance();