export interface EmailType {
  date: number;
  from: {
    email: string;
    name: string;
  };
  id: string;
  short_description: string;
  subject: string;
  read?: boolean;
  favorite?: boolean;
}

export interface EmailBody {
  id: string;
  subject: string;
  name: string;
  favorite: boolean;
  body: string;
  dateAndTime: number;
}
