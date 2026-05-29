import { LucideIcon } from 'lucide-react';

export type FeatureStatus = 'Available' | 'In Development' | 'Labs' | 'Vision';

export type Category = 
  | 'Content Creation'
  | 'Gaming'
  | 'Fortnite'
  | 'Roblox'
  | 'Minecraft'
  | 'Education'
  | 'Productivity'
  | 'Discord Tools'
  | 'AI Video'
  | 'Real Life Tools'
  | 'Storytelling'
  | 'Labs'
  | 'Vision';

export interface Feature {
  id: string;
  title: string;
  category: Category;
  description: string;
  tooltipText: string;
  icon: string; // We will map string names to lucide-react icons in components
  status: FeatureStatus;
  progress?: number; // Only for 'In Development'
  votes: number;
  user_has_voted?: boolean; // Added for Supabase integration
}
