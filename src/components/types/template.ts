export interface WhatsAppTemplate {
  id?: string;

  type: 'USER_CREATED' | 'PREBUILT';

  name: string;
  code: string;

  status: 'APPROVED' | 'PENDING' | 'REJECTED';

  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;

  topic?: string;
  usecase?: string;
  industry?: string[];

  template?: 'custom' | 'catalog' | 'one-time_Passcode';

  header?: {
    type: 'none' | 'text' | 'media' | 'location';
    content?: string;
  };

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
    section: 'body';
  }[];

  body_params?: string[];
  body_param_types?: ('TEXT' | 'NUMBER')[];


  cards?: {
    type: string;
    title: string;
    description: string;
  }[];

  example?: {
    header_text?: string[];
    body_text?: string[][];
    header_handle?: string[];
  };

  components: WhatsAppTemplateComponent[];
}

export interface WhatsAppTemplateComponent {
  type:
  | 'HEADER'
  | 'BODY'
  | 'FOOTER'
  | 'BUTTONS'
  | 'MEDIA'
  | 'LOCATION'
  | 'TEXT'
  | 'CAROUSEL';

  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';

  text?: string;

  buttons?: {
    type: 'PHONE_NUMBER' | 'URL' | 'QUICK_REPLY';
    text: string;
    value?: string;
  }[];

  example?: {
    header_text?: string[];
    body_text?: string[];
    footer_text?: string[];
    header_handle?: string[];
  };

  /** Carousel support */
  cards?: Array<{
    components: WhatsAppTemplateComponent[];
  }>;
}
