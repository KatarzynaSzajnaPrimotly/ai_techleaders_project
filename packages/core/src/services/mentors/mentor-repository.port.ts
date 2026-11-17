import type { Mentor, NewMentor } from "./mentor.types";
import type { MentorProfile, MentorProfileUpdate, MentorProfilePublicBaseDto, MentorProfilePublicSource } from "./mentor-profile.types";

export interface MentorRepositoryPort {
  findAll(): Promise<Mentor[]>;
  findPublishedProfiles(): Promise<MentorProfilePublicBaseDto[]>;
  create(input: NewMentor): Promise<Mentor>;
  findProfileByUserId(userId: string): Promise<MentorProfile | null>;
  findProfileById(profileId: string): Promise<MentorProfile | null>;
  updateProfile(userId: string, input: MentorProfileUpdate): Promise<MentorProfile>;
  updatePrices(userId: string, price25Cents: number, price50Cents: number): Promise<MentorProfile>;
  publishProfile(userId: string): Promise<MentorProfile>;
  unpublishProfile(userId: string): Promise<MentorProfile>;
  findPublicProfile(slug: string): Promise<MentorProfilePublicSource | null>;
}
