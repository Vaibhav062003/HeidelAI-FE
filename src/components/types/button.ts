export type Button = {
  id: string;
  type: 'reply' | 'url' | 'phone' | 'copy';
  text: string;
  content: string;  // Make sure to include this required property
  value: string;
};