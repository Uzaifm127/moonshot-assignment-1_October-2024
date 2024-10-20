import { EmailType } from "./state";

export interface EmailProps {
  email: EmailType;
  emailItemClick: boolean;
  onEmailClick: () => void;
}
