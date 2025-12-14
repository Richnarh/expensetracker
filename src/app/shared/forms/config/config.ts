export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea' | 'email' | 'date' | 'datetime' | 'tel' | 'password';
  required?: boolean;
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  value?: any;
}