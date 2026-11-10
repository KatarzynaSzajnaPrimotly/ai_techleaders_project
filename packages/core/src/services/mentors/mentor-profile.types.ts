export const MENTOR_STACK_TAGS = ["TypeScript", "React", "Python", "AI agents"] as const;
export type MentorStackTag = typeof MENTOR_STACK_TAGS[number];
export interface MentorProfileUpdate { publicWorkUrl?: string | null; bio?: string; stackTags?: MentorStackTag[]; sessionChannel?: string | null }
export interface MentorProfile {
  id: string; userId: string; initialPublishDueAt: Date | null;
  publicWorkUrl?: string | null; bio?: string | null; sessionChannel?: string | null; stackTags?: string[];
  slug?: string | null; publishedAt?: Date | null; lastPublishedAvailabilityAt?: Date | null; createdAt: Date; updatedAt: Date;
}
export interface MentorProfileOwnerDto { id: string; publicWorkUrl: string | null; bio: string | null; sessionChannel: string | null; stackTags: string[]; slug: string | null; publishedAt: Date | null; lastPublishedAvailabilityAt: Date | null; readiness: { publicWorkUrl: boolean; bio: boolean; sessionChannel: boolean } }
export interface MentorProfilePublicDto { slug: string; displayName: string; publicWorkUrl: string; bio: string; stackTags: string[] }
