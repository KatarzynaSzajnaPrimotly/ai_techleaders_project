export const APP_NAME = "DevMentor";

export type { Mentor, MentorRepository, NewMentor } from "./mentor";
export { MentorService } from "./mentor-service";
export { MentorAlreadyExistsError, MentorValidationError } from "./errors";
export { FEATURED_TUTORS, SUBJECTS, type Tutor, type TutorBadge } from "./catalog";
