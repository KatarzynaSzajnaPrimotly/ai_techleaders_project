import { ConflictError, ForbiddenError } from "../../http/errors";
import type { GithubIdentityPort, GithubUser } from "./github-identity.port";
import type { UserRepositoryPort } from "./user-repository.port";
import type { User } from "./user.types";

const NO_VERIFIED_PRIMARY_EMAIL_MESSAGE = "GitHub account has no verified primary e-mail";
const ACCOUNT_CANNOT_BE_LINKED_MESSAGE = "This account cannot be linked to GitHub";
const EMAIL_ALREADY_LINKED_MESSAGE = "This e-mail is already linked to another GitHub account";

/** Distinguishes the safe, user-correctable GitHub sign-in refusal for callback navigation. */
export class NoVerifiedGithubEmailError extends ForbiddenError {
  constructor() {
    super(NO_VERIFIED_PRIMARY_EMAIL_MESSAGE);
  }
}

export class AccountService {
  private readonly userRepository: UserRepositoryPort;
  private readonly githubIdentity: GithubIdentityPort;

  constructor({ userRepository, githubIdentity }: {
    userRepository: UserRepositoryPort;
    githubIdentity: GithubIdentityPort;
  }) {
    this.userRepository = userRepository;
    this.githubIdentity = githubIdentity;
  }

  async findOrCreateFromGithub(accessToken: string): Promise<User> {
    const githubUser = await this.githubIdentity.getUser(accessToken);
    const linkedUser = await this.userRepository.findByGithubId(githubUser.id);
    if (linkedUser) return linkedUser;

    const emails = await this.githubIdentity.getEmails(accessToken);
    const primaryEmail = emails.find((email) => email.primary && email.verified);
    const email = primaryEmail?.email.trim().toLowerCase();
    if (!email) throw new NoVerifiedGithubEmailError();

    const emailUser = await this.userRepository.findByEmail(email);
    if (emailUser) {
      if (emailUser.githubId === githubUser.id) return emailUser;
      if (emailUser.githubId !== null) throw new ConflictError(EMAIL_ALREADY_LINKED_MESSAGE);
      return this.linkGithubAccount(emailUser, githubUser.id);
    }

    return this.createGithubAccount(githubUser, email);
  }

  private async linkGithubAccount(user: User, githubId: string): Promise<User> {
    let linked: boolean;
    try {
      linked = await this.userRepository.linkGithub(user.id, githubId);
    } catch (error) {
      if (!(error instanceof ConflictError)) throw error;
      const winner = await this.userRepository.findByGithubId(githubId);
      if (winner) return winner;
      throw error;
    }

    if (!linked) {
      const winner = await this.userRepository.findByGithubId(githubId);
      if (winner) return winner;
      throw new ConflictError(ACCOUNT_CANNOT_BE_LINKED_MESSAGE);
    }
    return { ...user, githubId };
  }

  private async createGithubAccount(githubUser: GithubUser, email: string): Promise<User> {
    try {
      return await this.userRepository.create({
        email,
        emailVerifiedAt: new Date(),
        displayName: githubUser.name,
        role: "mentee",
        githubId: githubUser.id,
        githubLogin: githubUser.login,
        avatarUrl: githubUser.avatarUrl,
      });
    } catch (error) {
      if (!(error instanceof ConflictError)) throw error;
      const winner = await this.userRepository.findByGithubId(githubUser.id);
      if (winner) return winner;
      throw error;
    }
  }
}
