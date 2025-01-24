export interface WhatsAppTemplate {
  id?: string; 
  name: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  type:string;
  language: string;
  header?: {
    type: 'none' | 'text' | 'media';
    content?: string;
  };
  template?: 'custom' | 'catalog' | 'one-time_Passcode' | 'pre-approved_utility' | 'pre-approved_auth';
  body: string;
  footer?: string;
  button?: {
    id: string;
    type: 'reply' | 'url' | 'phone' | 'copy';
    text: string;
    content?: string;
  };
  variable?: {
    id: string;
    name: string;
    type: 'text' | 'number';
    example: string;
    section: 'body'
  }[];
}