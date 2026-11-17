import type { EntityName } from "@mikro-orm/core";
import type { EntityManager } from "@mikro-orm/postgresql";
import { ConflictError, NotFoundError, slugify, uniqueSlug, ValidationError, type Mentor, type MentorProfile, type MentorProfilePublicBaseDto, type MentorProfilePublicSource, type MentorRepositoryPort, type NewMentor } from "@devmentor/core";

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
    async findProfileById(profileId): Promise<MentorProfile | null> {
      return em.findOne<MentorProfile>(PROFILE, { id: profileId });
    },
    async findPublishedProfiles(): Promise<MentorProfilePublicBaseDto[]> {
      const profiles = await em.find<MentorProfile>(PROFILE, { publishedAt: { $ne: null } }, { orderBy: { publishedAt: "desc" } });
      if (profiles.length === 0) return [];
      const users = await em.find<{ id: string; displayName: string | null }>(USER, { id: { $in: profiles.map((profile) => profile.userId) } });
      const displayNames = new Map(users.map((user) => [user.id, user.displayName]));
      return profiles.flatMap((profile) => {
        if (!profile.slug || !profile.publicWorkUrl || !profile.bio) return [];
        return [{
          slug: profile.slug,
          displayName: displayNames.get(profile.userId) || "Mentor",
          publicWorkUrl: profile.publicWorkUrl,
          bio: profile.bio,
          stackTags: profile.stackTags ?? [],
        }];
      });
    },
    async updateProfile(userId, input): Promise<MentorProfile> {
      const profile = await em.findOne<MentorProfile>(PROFILE, { userId });
      if (!profile) throw new NotFoundError("Mentor profile not found");
      Object.assign(profile, input, { updatedAt: new Date() });
      await em.flush();
      return profile;
    },
    async updatePrices(userId, price25Cents, price50Cents): Promise<MentorProfile> {
      return em.transactional(async (tx) => {
        const profile = await tx.findOne<MentorProfile>(PROFILE, { userId }, { lockMode: 2 });
        if (!profile) throw new NotFoundError("Mentor profile not found");
        profile.price25Cents = price25Cents;
        profile.price50Cents = price50Cents;
        profile.updatedAt = new Date();
        await tx.flush();
        return profile;
      });
    },
    async publishProfile(userId): Promise<MentorProfile> {
      const user = await em.findOne<{ id: string; displayName: string | null }>(USER, { id: userId });
      const base = slugify(user?.displayName || "mentor");
      for (let suffix = 0; suffix < 100; suffix++) {
        const candidate = uniqueSlug(base, suffix);
        try {
          return await em.transactional(async (tx) => {
            const profile = await tx.findOne<MentorProfile>(PROFILE, { userId }, { lockMode: 2 });
            if (!profile) throw new NotFoundError("Mentor profile not found");
            const fieldErrors: Record<string, string[]> = {};
            if (!profile.publicWorkUrl) fieldErrors.publicWorkUrl = ["Add a link to your public work before publishing"];
            if (!profile.bio?.trim()) fieldErrors.bio = ["Add a description before publishing"];
            if (!profile.stackTags?.length) fieldErrors.stackTags = ["Choose at least one area of expertise before publishing"];
            if (Object.keys(fieldErrors).length) throw new ValidationError("Profile is incomplete", fieldErrors);
            if (profile.slug) {
              profile.publishedAt ??= new Date();
              await tx.flush();
              return profile;
            }
            const collision = await tx.findOne<MentorProfile>(PROFILE, { slug: candidate });
            if (collision) throw new ConflictError("SLUG_COLLISION");
            profile.slug = candidate;
            profile.publishedAt = new Date();
            await tx.flush();
            return profile;
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
      return em.transactional(async (tx) => {
        const profile = await tx.findOne<MentorProfile>(PROFILE, { userId }, { lockMode: 2 });
        if (!profile) throw new NotFoundError("Mentor profile not found");
        profile.publishedAt = null;
        await tx.flush();
        return profile;
      });
    },
    async findPublicProfile(slug): Promise<MentorProfilePublicSource | null> {
      const profile = await em.findOne<MentorProfile>(PROFILE, { slug, publishedAt: { $ne: null } });
      if (!profile?.publicWorkUrl || !profile.bio) return null;
      const user = await em.findOne<{ id: string; displayName: string | null }>(USER, { id: profile.userId });
      return { slug: profile.slug!, displayName: user?.displayName || "Mentor", publicWorkUrl: profile.publicWorkUrl, bio: profile.bio, stackTags: profile.stackTags || [], sessionChannel: profile.sessionChannel ?? null, publishedAt: profile.publishedAt!, price25Cents: profile.price25Cents ?? null, price50Cents: profile.price50Cents ?? null };
    },
  };
}
