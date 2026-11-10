import type { Mentor, NewMentor } from "./mentor.types";
import type { MentorProfile, MentorProfileUpdate, MentorProfilePublicDto } from "./mentor-profile.types";

export interface MentorRepositoryPort {
  findAll(): Promise<Mentor[]>;
  findPublishedProfiles(): Promise<MentorProfilePublicDto[]>;
  create(input: NewMentor): Promise<Mentor>;
  findProfileByUserId(userId: string): Promise<MentorProfile | null>;
  updateProfile(userId: string, input: MentorProfileUpdate): Promise<MentorProfile>;
  publishProfile(userId: string): Promise<MentorProfile>;
  unpublishProfile(userId: string): Promise<MentorProfile>;
  findPublicProfile(slug: string): Promise<MentorProfilePublicDto | null>;
}
