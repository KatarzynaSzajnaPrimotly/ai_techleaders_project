import type { Role } from "@devmentor/core";

/** The default landing page for each single-role account type. */
export function homeFor(role: Role): string {
  switch (role) {
    case "mentee":
      return "/home";
    case "mentor":
      return "/mentor";
    case "operator":
      return "/admin/mentors";
  }
}
