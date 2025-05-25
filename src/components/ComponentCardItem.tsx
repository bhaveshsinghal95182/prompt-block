
import React, { useState } from 'react';
import { X, Play, Lightbulb, Target, Users, Megaphone, Clock, Palette, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ComponentCard } from '@/types/promptBuilder';

interface ComponentCardItemProps {
  card: ComponentCard;
  index: number;
  onUpdate: (id: string, updates: Partial<ComponentCard>) => void;
  onRemove: (id: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}

const ComponentCardItem: React.FC<ComponentCardItemProps> = ({
  card,
  index,
  onUpdate,
  onRemove
}) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(card.id), 200);
  };

  const getCardConfig = (type: ComponentCard['type']) => {
    const configs = {
      example: {
        title: 'Example Reel Script',
        icon: <Play className="w-5 h-5" />,
        color: 'border-pink-400 bg-gradient-to-br from-pink-50 to-pink-100',
        placeholder: 'Paste or type your example reel script here...'
      },
      hook: {
        title: 'Main Hook',
        icon: <Target className="w-5 h-5" />,
        color: 'border-violet-400 bg-gradient-to-br from-violet-50 to-violet-100',
        placeholder: 'Enter your compelling hook here...'
      },
      theme: {
        title: 'Theme / Analogy',
        icon: <Palette className="w-5 h-5" />,
        color: 'border-cyan-400 bg-gradient-to-br from-cyan-50 to-cyan-100',
        placeholder: 'Describe the theme or analogy to use...'
      },
      topic: {
        title: 'Reel Topic',
        icon: <BookOpen className="w-5 h-5" />,
        color: 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-emerald-100',
        placeholder: 'What is the main topic of your reel? (e.g., React Hooks, Marketing Tips)...'
      },
      audience: {
        title: 'Target Audience',
        icon: <Users className="w-5 h-5" />,
        color: 'border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100',
        placeholder: 'Describe your target audience (e.g., beginner developers, small business owners)...'
      },
      cta: {
        title: 'Call to Action',
        icon: <Megaphone className="w-5 h-5" />,
        color: 'border-red-400 bg-gradient-to-br from-red-50 to-red-100',
        placeholder: 'What action do you want viewers to take? (e.g., follow for more tips, check the link in bio)...'
      },
      duration: {
        title: 'Video Duration',
        icon: <Clock className="w-5 h-5" />,
        color: 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100',
        placeholder: 'Specify the target duration (e.g., 30 seconds, 60 seconds, 90 seconds)...'
      },
      tone: {
        title: 'Tone & Style',
        icon: <Palette className="w-5 h-5" />,
        color: 'border-indigo-400 bg-gradient-to-br from-indigo-50 to-indigo-100',
        placeholder: 'Describe the desired tone (e.g., professional, casual, energetic, educational)...'
      },
      custom: {
        title: 'Custom Instruction',
        icon: <Lightbulb className="w-5 h-5" />,
        color: 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100',
        placeholder: 'Add any specific instructions...'
      }
    };
    return configs[type];
  };

  const config = getCardConfig(card.type);

  return (
    <div 
      className={`
        relative rounded-xl border-2 p-4 transition-all duration-200 
        ${config.color} 
        ${isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        hover:shadow-lg transform hover:-translate-y-1
        animate-bounce-in
      `}
      style={{
        borderStyle: 'dashed',
        borderWidth: '2px'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-gray-700">
            {config.icon}
          </div>
          <h3 className="font-heading font-semibold text-gray-800">
            {config.title}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-1"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {card.type === 'example' && (
        <div className="mb-3">
          <Input
            value={card.label || ''}
            onChange={(e) => onUpdate(card.id, { label: e.target.value })}
            placeholder="Label (e.g., 'Pub/Sub Tutorial')"
            className="font-body border-gray-300 rounded-lg"
          />
        </div>
      )}

      <Textarea
        value={card.content}
        onChange={(e) => onUpdate(card.id, { content: e.target.value })}
        placeholder={config.placeholder}
        className="min-h-[120px] font-body border-gray-300 rounded-lg resize-y"
        rows={card.type === 'example' ? 8 : 4}
      />
    </div>
  );
};

export default ComponentCardItem;
