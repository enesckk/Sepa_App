/**
 * Mock application issue types data
 * This file contains the issue types that can be selected when creating an application
 */

export interface IssueType {
  id: string;
  label: string;
  icon: string;
}

export const issueTypes: IssueType[] = [
  {
    id: 'complaint',
    label: 'Şikayet',
    icon: '⚠️',
  },
  {
    id: 'request',
    label: 'Talep',
    icon: '📋',
  },
  {
    id: 'marriage',
    label: 'Nikah Başvurusu',
    icon: '💍',
  },
  {
    id: 'muhtar_message',
    label: 'Muhtara Mesaj',
    icon: '💬',
  },
  {
    id: 'other',
    label: 'Diğer',
    icon: '📝',
  },
];

