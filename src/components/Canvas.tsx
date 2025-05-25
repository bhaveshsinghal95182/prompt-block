
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ComponentCardItem from './ComponentCardItem';
import { ComponentCard } from '@/types/promptBuilder';

interface CanvasProps {
  cards: ComponentCard[];
  onAddCard: (type: ComponentCard['type']) => void;
  onUpdateCard: (id: string, updates: Partial<ComponentCard>) => void;
  onRemoveCard: (id: string) => void;
  onMoveCard: (fromIndex: number, toIndex: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  cards,
  onAddCard,
  onUpdateCard,
  onRemoveCard,
  onMoveCard
}) => {
  const cardTypeLabels = {
    example: '🎬 Example Reel Script',
    hook: '🎣 Main Hook',
    theme: '🎨 Theme / Analogy',
    topic: '📚 Reel Topic',
    audience: '👥 Target Audience',
    cta: '📢 Call to Action',
    duration: '⏱️ Video Duration',
    tone: '🎭 Tone & Style',
    custom: '⚙️ Custom Instruction'
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-purple-600 border-dashed p-6 min-h-[600px] relative shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-purple-800">
          Prompt Canvas
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-body font-medium rounded-xl px-4 py-2 transition-all duration-200 hover:scale-105 border-2 border-purple-300 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Component
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-56 bg-white border-2 border-purple-300 rounded-xl shadow-xl z-50"
            align="end"
          >
            {Object.entries(cardTypeLabels).map(([type, label]) => (
              <DropdownMenuItem
                key={type}
                onClick={() => onAddCard(type as ComponentCard['type'])}
                className="cursor-pointer font-body hover:bg-pink-100 rounded-lg m-1"
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-violet-200 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-12 h-12 text-violet-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-heading font-semibold text-purple-800 mb-2">
            Start Building Your Prompt
          </h3>
          <p className="text-gray-600 font-body max-w-md">
            Add components to build your AI prompt visually. Think of each component as a building block that helps craft the perfect reel.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {cards.map((card, index) => (
            <ComponentCardItem
              key={card.id}
              card={card}
              index={index}
              onUpdate={onUpdateCard}
              onRemove={onRemoveCard}
              onMove={onMoveCard}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Canvas;
