
export interface ComponentCard {
  id: string;
  type: 'example' | 'hook' | 'theme' | 'custom' | 'topic' | 'audience' | 'cta' | 'duration' | 'tone';
  content: string;
  label?: string; // For example cards
}

export type CardType = ComponentCard['type'];
