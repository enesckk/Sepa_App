/**
 * Mock surveys data
 * This file contains sample survey data for development and testing
 */

export interface Survey {
  id: string;
  title: string;
  description?: string;
  reward: number; // golbucks_reward
  status?: 'draft' | 'active' | 'closed' | 'archived';
  expires_at?: string;
  questions?: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'rating' | 'yes_no';
  options?: string[];
  is_required?: boolean;
}

export interface SurveyOption {
  id: string;
  text: string;
}

