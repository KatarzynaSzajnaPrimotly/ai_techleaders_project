import type { Mentor, NewMentor } from "./mentor.types";
import type { MentorRepositoryPort } from "./mentor-repository.port";
import type { MentorProfileOwnerDto, MentorProfilePublicDto, MentorProfileUpdate } from "./mentor-profile.types";
import { NotFoundError } from "../../http/errors";

export class MentorService {
  private readonly mentorRepository: MentorRepositoryPort;

  constructor({ mentorRepository }: { mentorRepository: MentorRepositoryPort }) {
    this.mentorRepository = mentorRepository;
  }

  list(): Promise<Mentor[]> {
    return this.mentorRepository.findAll();
  }

  listPublishedProfiles(): Promise<MentorProfilePublicDto[]> {
    return this.mentorRepository.findPublishedProfiles();
  }

  register(input: NewMentor): Promise<Mentor> {
    return this.mentorRepository.create(input);
  }

  async profile(userId: string): Promise<MentorProfileOwnerDto> {
    const profile = await this.mentorRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundError("Mentor profile not found");
    return { id: profile.id, publicWorkUrl: profile.publicWorkUrl ?? null, bio: profile.bio ?? null, sessionChannel: profile.sessionChannel ?? null, stackTags: profile.stackTags ?? [], slug: profile.slug ?? null, publishedAt: profile.publishedAt ?? null, readiness: { publicWorkUrl: Boolean(profile.publicWorkUrl), bio: Boolean(profile.bio?.trim()), sessionChannel: Boolean(profile.sessionChannel?.trim()) } };
  }
  async updateProfile(userId: string, input: MentorProfileUpdate): Promise<MentorProfileOwnerDto> { await this.mentorRepository.updateProfile(userId, { ...input, publicWorkUrl: input.publicWorkUrl === "" ? null : input.publicWorkUrl, sessionChannel: input.sessionChannel === "" ? null : input.sessionChannel }); return this.profile(userId); }
  async publishProfile(userId: string): Promise<MentorProfileOwnerDto> { await this.mentorRepository.publishProfile(userId); return this.profile(userId); }
  async unpublishProfile(userId: string): Promise<MentorProfileOwnerDto> { await this.mentorRepository.unpublishProfile(userId); return this.profile(userId); }
  async publicProfile(slug: string): Promise<MentorProfilePublicDto> { const profile = await this.mentorRepository.findPublicProfile(slug); if (!profile) throw new NotFoundError("Mentor page not found"); return profile; }
}
