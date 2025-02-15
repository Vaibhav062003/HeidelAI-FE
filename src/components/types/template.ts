export interface WhatsAppTemplate {
  id?: string; 
  type: string;
  name: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  header?: {
    type: 'none' | 'text' | 'media';
    content?: string;
  };
  template?: 'custom' | 'catalog' | 'one-time_Passcode';
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
  components?: WhatsAppTemplateComponent[];
}



export interface WhatsAppTemplateComponent {
  type?: 'body' | 'footer' | 'button';
  text?: string;
    example?: {
      body_text?: string[];
    };
  }