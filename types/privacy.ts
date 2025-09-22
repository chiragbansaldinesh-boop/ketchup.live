export interface PrivacyPolicySection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface PrivacyPolicy {
  id: string;
  version: string;
  lastUpdated: string;
  sections: PrivacyPolicySection[];
}

export interface BlockedUser {
  id: string;
  name: string;
  photo: string;
  blockedAt: string;
  venue?: string;
  reason?: string;
}

export interface ReportReason {
  id: string;
  label: string;
  description: string;
}

export interface UserReport {
  reportedUserId: string;
  reason: string;
  description?: string;
  venue?: string;
}

export interface BlockUserRequest {
  userId: string;
  reason?: string;
  venue?: string;
}