import type { Mentor, NewMentor } from "./mentor.types";
import type { MentorRepositoryPort } from "./mentor-repository.port";
import type { MentorProfile, MentorProfileOwnerDto, MentorProfilePublicBaseDto, MentorProfilePublicDto, MentorProfileUpdate } from "./mentor-profile.types";
import { NotFoundError, ValidationError } from "../../http/errors";
import { centsToMajorAmount, majorAmountToCents, PLATFORM_CURRENCY } from "../../domain/money";
import type { PlatformSettingsService } from "../operator/platform-settings.service";

const SESSION_LENGTHS = [25, 50] as const;
type SessionLength = typeof SESSION_LENGTHS[number];

export class MentorService {
  private readonly mentorRepository: MentorRepositoryPort;
  private readonly platformSettingsService: PlatformSettingsService;

  constructor({ mentorRepository, platformSettingsService }: { mentorRepository: MentorRepositoryPort; platformSettingsService: PlatformSettingsService }) {
    this.mentorRepository = mentorRepository;
    this.platformSettingsService = platformSettingsService;
  }

  list(): Promise<Mentor[]> {
    return this.mentorRepository.findAll();
  }

  listPublishedProfiles(): Promise<MentorProfilePublicBaseDto[]> {
    return this.mentorRepository.findPublishedProfiles();
  }

  register(input: NewMentor): Promise<Mentor> {
    return this.mentorRepository.create(input);
  }

  async profile(userId: string): Promise<MentorProfileOwnerDto> {
    const profile = await this.mentorRepository.findProfileByUserId(userId);
    if (!profile) throw new NotFoundError("Mentor profile not found");
    return { id: profile.id, publicWorkUrl: profile.publicWorkUrl ?? null, bio: profile.bio ?? null, sessionChannel: profile.sessionChannel ?? null, stackTags: profile.stackTags ?? [], slug: profile.slug ?? null, publishedAt: profile.publishedAt ?? null, lastPublishedAvailabilityAt: profile.lastPublishedAvailabilityAt ?? null, prices: this.pricesFromProfile(profile), readiness: { publicWorkUrl: Boolean(profile.publicWorkUrl), bio: Boolean(profile.bio?.trim()), sessionChannel: Boolean(profile.sessionChannel?.trim()) } };
  }
  async updateProfile(userId: string, input: MentorProfileUpdate): Promise<MentorProfileOwnerDto> { await this.mentorRepository.updateProfile(userId, { ...input, publicWorkUrl: input.publicWorkUrl === "" ? null : input.publicWorkUrl, sessionChannel: input.sessionChannel === "" ? null : input.sessionChannel }); return this.profile(userId); }
  async publishProfile(userId: string): Promise<MentorProfileOwnerDto> { await this.mentorRepository.publishProfile(userId); return this.profile(userId); }
  async unpublishProfile(userId: string): Promise<MentorProfileOwnerDto> { await this.mentorRepository.unpublishProfile(userId); return this.profile(userId); }
  async publicProfile(slug: string): Promise<MentorProfilePublicDto> {
    const profile = await this.mentorRepository.findPublicProfile(slug);
    if (!profile) throw new NotFoundError("Mentor page not found");
    return {
      slug: profile.slug, displayName: profile.displayName, publicWorkUrl: profile.publicWorkUrl, bio: profile.bio, stackTags: profile.stackTags,
      prices: this.pricesFromProfile(profile), isBookable: this.isBookable(profile),
    };
  }

  priceConfiguration(userId: string) {
    return this.mentorRepository.findProfileByUserId(userId).then((profile) => {
      if (!profile) throw new NotFoundError("Mentor profile not found");
      return { prices: this.pricesFromProfile(profile), priceBounds: this.platformSettingsService.getOrNull()?.priceBounds ?? null };
    });
  }

  async updatePrices(userId: string, input: { price25: string; price50: string }) {
    const { priceBounds, currency } = this.platformSettingsService.get();
    const price25Cents = majorAmountToCents(input.price25);
    const price50Cents = majorAmountToCents(input.price50);
    this.assertPriceInBounds("price25", price25Cents, priceBounds.p25);
    this.assertPriceInBounds("price50", price50Cents, priceBounds.p50);
    const profile = await this.mentorRepository.updatePrices(userId, price25Cents, price50Cents);
    return { prices: { price25Cents: profile.price25Cents ?? null, price50Cents: profile.price50Cents ?? null, currency }, priceBounds };
  }

  async getPriceFor(mentorId: string, length: SessionLength): Promise<{ amountCents: number; currency: "EUR" }> {
    if (!SESSION_LENGTHS.includes(length)) throw new ValidationError("Choose a supported session length");
    const profile = await this.mentorRepository.findProfileById(mentorId);
    if (!profile) throw new NotFoundError("Mentor profile not found");
    if (!this.isBookable(profile)) throw new ValidationError("This mentor is not bookable yet");
    return { amountCents: length === 25 ? profile.price25Cents! : profile.price50Cents!, currency: PLATFORM_CURRENCY };
  }

  isBookable(profile: Pick<MentorProfile, "publishedAt" | "sessionChannel" | "price25Cents" | "price50Cents">): boolean {
    const settings = this.platformSettingsService.getOrNull();
    if (!settings || !profile.publishedAt || !profile.sessionChannel?.trim() || profile.price25Cents == null || profile.price50Cents == null) return false;
    return this.isWithin(profile.price25Cents, settings.priceBounds.p25) && this.isWithin(profile.price50Cents, settings.priceBounds.p50);
  }

  private pricesFromProfile(profile: Pick<MentorProfile, "price25Cents" | "price50Cents">) {
    if (profile.price25Cents == null && profile.price50Cents == null) return null;
    return { price25Cents: profile.price25Cents ?? null, price50Cents: profile.price50Cents ?? null, currency: PLATFORM_CURRENCY };
  }

  private isWithin(value: number, bounds: { minCents: number; maxCents: number }) {
    return value >= bounds.minCents && value <= bounds.maxCents;
  }

  private assertPriceInBounds(field: "price25" | "price50", value: number, bounds: { minCents: number; maxCents: number }) {
    if (value <= 0 || !this.isWithin(value, bounds)) {
      throw new ValidationError("Price is outside the configured bounds", {
        [field]: [`Enter an amount between €${centsToMajorAmount(bounds.minCents)} and €${centsToMajorAmount(bounds.maxCents)}`],
      });
    }
  }
}
