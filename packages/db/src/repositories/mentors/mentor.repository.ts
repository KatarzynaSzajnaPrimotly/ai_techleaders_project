import type { EntityName } from "@mikro-orm/core";
import type { EntityManager } from "@mikro-orm/postgresql";
import { ConflictError, NotFoundError, ValidationError, type Mentor, type MentorProfile, type MentorProfileOwnerDto, type MentorProfilePublicDto, type MentorProfileUpdate, type MentorRepositoryPort, type NewMentor } from "@devmentor/core";

// The entity is referenced by name, not by schema object: bundlers may load this package more than once
// (one copy per Next.js route), and the ORM only recognises the schema instance it was initialised with.
// The cast is needed because MikroORM 7 types no longer list string names, though it still resolves them.
const MENTOR = "Mentor" as unknown as EntityName<Mentor>;
const PROFILE = "MentorProfile" as unknown as EntityName<MentorProfile>;
const USER = "User" as unknown as EntityName<{ id: string; displayName: string | null }>;

// PostgreSQL error code for unique_violation.
const UNIQUE_VIOLATION = "23505";

export function createMentorRepository(em: EntityManager): MentorRepositoryPort {
  return {
    findAll(): Promise<Mentor[]> {
      return em.find<Mentor>(MENTOR, {}, { orderBy: { createdAt: "asc" } });
    },
    async create(input: NewMentor): Promise<Mentor> {
      const mentor = em.create<Mentor>(MENTOR, { ...input, createdAt: new Date() });
      try {
        await em.flush();
      } catch (error) {
        // Matched by code, not instanceof (see the note above about duplicate package copies).
        if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
          throw new ConflictError(`A mentor with email ${input.email} already exists`);
        }
        throw error;
      }
      return mentor;
    },
    async findProfileByUserId(userId): Promise<MentorProfile | null> {
      return em.findOne<MentorProfile>(PROFILE, { userId });
    },
    async updateProfile(userId, input): Promise<MentorProfile> {
      const profile = await em.findOne<MentorProfile>(PROFILE, { userId });
      if (!profile) throw new NotFoundError("Mentor profile not found");
      if (profile.publishedAt) throw new ValidationError("Unpublish your profile before editing");
      Object.assign(profile, input, { updatedAt: new Date() });
      await em.flush();
      return profile;
    },
    async publishProfile(userId): Promise<MentorProfile> {
      const initial = await em.findOne<MentorProfile>(PROFILE, { userId });
      if (!initial) throw new NotFoundError("Mentor profile not found");
      if (!initial.publicWorkUrl) throw new ValidationError("Profile is incomplete", { publicWorkUrl: ["Add a link to your public work before publishing"] });
      if (!initial.bio?.trim()) throw new ValidationError("Profile is incomplete", { bio: ["Add a description before publishing"] });
      if (initial.slug) {
        initial.publishedAt = new Date(); await em.flush(); return initial;
      }
      const user = await em.findOne<{ id: string; displayName: string | null }>(USER, { id: userId });
      const normalized = (user?.displayName || "mentor").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "mentor";
      for (let suffix = 0; suffix < 100; suffix++) {
        const tail = suffix ? `-${suffix + 1}` : "";
        const candidate = `${normalized.slice(0, 60 - tail.length).replace(/-+$/g, "")}${tail}`;
        try {
          return await em.transactional(async (tx) => {
            const profile = await tx.findOne<MentorProfile>(PROFILE, { userId }, { lockMode: 2 });
            if (!profile) throw new NotFoundError("Mentor profile not found");
            if (profile.slug) { profile.publishedAt = new Date(); await tx.flush(); return profile; }
            const collision = await tx.findOne<MentorProfile>(PROFILE, { slug: candidate });
            if (collision) throw new ConflictError("SLUG_COLLISION");
            profile.slug = candidate; profile.publishedAt = new Date(); await tx.flush(); return profile;
          });
        } catch (error) {
          const detail = error as { code?: string; constraint?: string; message?: string };
          if (detail.message === "SLUG_COLLISION" || (detail.code === UNIQUE_VIOLATION && detail.constraint?.includes("slug"))) continue;
          throw error;
        }
      }
      throw new ConflictError("Could not allocate a unique mentor link; retry publication");
    },
    async unpublishProfile(userId): Promise<MentorProfile> {
      const profile = await em.findOne<MentorProfile>(PROFILE, { userId });
      if (!profile) throw new NotFoundError("Mentor profile not found");
      profile.publishedAt = null; await em.flush(); return profile;
    },
    async findPublicProfile(slug): Promise<MentorProfilePublicDto | null> {
      const profile = await em.findOne<MentorProfile>(PROFILE, { slug, publishedAt: { $ne: null } });
      if (!profile?.publicWorkUrl || !profile.bio) return null;
      const user = await em.findOne<{ id: string; displayName: string | null }>(USER, { id: profile.userId });
      return { slug: profile.slug!, displayName: user?.displayName || "Mentor", publicWorkUrl: profile.publicWorkUrl, bio: profile.bio, stackTags: profile.stackTags || [] };
    },
  };
}
