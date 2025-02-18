export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    country?: string;
    tags?: string[];
    platform?: string;
  }