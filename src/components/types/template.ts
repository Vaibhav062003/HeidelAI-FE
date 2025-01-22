export interface WhatsAppTemplate {
  id?: string; 
  name: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  category: 'MARKETING' | 'UTILITY' | 'VERIFICATION';
  language: string;
  header?: {
    type: 'none' | 'text' | 'media';
    content?: string;
  };
  template?: 'custom' | 'catalogue';
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