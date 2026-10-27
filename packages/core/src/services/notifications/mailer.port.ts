export interface MailMessage {
  to: string;
  subject: string;
  text: string;
}

export interface MailerPort {
  send(message: MailMessage): Promise<void>;
}
