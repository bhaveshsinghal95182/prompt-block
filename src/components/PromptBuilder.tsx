import React, { useState, useCallback, useEffect } from "react";
import Header from "./Header";
import Canvas from "./Canvas";
import PromptPreview from "./PromptPreview";
import { ComponentCard } from "@/types/promptBuilder";
import { generateId } from "@/lib/utils";

const PromptBuilder = () => {
  const [basePrompt, setBasePrompt] =
    useState(`You are ReelCraft AI, an expert at creating engaging short-form video scripts. 

Your task is to create a compelling reel script based on the examples and instructions provided below.

Focus on:
- Strong hook in the first 3 seconds
- Clear, engaging narrative flow
- Call-to-action that encourages engagement
- Professional yet approachable tone`);

  const [cards, setCards] = useState<ComponentCard[]>([]);

  const addCard = useCallback(
    (type: ComponentCard["type"]) => {
      const newCard: ComponentCard = {
        id: generateId(),
        type,
        content: "",
        label:
          type === "example"
            ? `Example Reel ${
                cards.filter((c) => c.type === "example").length + 1
              }`
            : "",
      };
      setCards((prev) => [...prev, newCard]);
    },
    [cards]
  );

  const updateCard = useCallback(
    (id: string, updates: Partial<ComponentCard>) => {
      setCards((prev) =>
        prev.map((card) => (card.id === id ? { ...card, ...updates } : card))
      );
    },
    []
  );

  useEffect(() => {
    const savedData = localStorage.getItem("reelcraft-prompt-data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.basePrompt) {
          setBasePrompt(parsed.basePrompt);
        }
        if (parsed.cards && Array.isArray(parsed.cards)) {
          setCards(parsed.cards);
        }
      } catch (error) {
        console.log("Failed to load saved data from localStorage");
      }
    }
  }, []);

  // Auto-save to localStorage whenever basePrompt or cards change
  useEffect(() => {
    const dataToSave = {
      basePrompt,
      cards,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem("reelcraft-prompt-data", JSON.stringify(dataToSave));
  }, [basePrompt, cards]);

  const removeCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  const moveCard = useCallback((fromIndex: number, toIndex: number) => {
    setCards((prev) => {
      const newCards = [...prev];
      const [movedCard] = newCards.splice(fromIndex, 1);
      newCards.splice(toIndex, 0, movedCard);
      return newCards;
    });
  }, []);

  const handleCardsImport = useCallback((importedCards: ComponentCard[]) => {
    // Regenerate IDs to avoid conflicts
    const cardsWithNewIds = importedCards.map((card) => ({
      ...card,
      id: generateId(),
    }));
    setCards(cardsWithNewIds);
  }, []);

  const handleClearAll = useCallback(() => {
    setCards([]);
    setBasePrompt(`You are ReelCraft AI, an expert at creating engaging short-form video scripts. 

Your task is to create a compelling reel script based on the examples and instructions provided below.

Focus on:
- Strong hook in the first 3 seconds
- Clear, engaging narrative flow
- Call-to-action that encourages engagement
- Professional yet approachable tone`);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-violet-100">
      <Header />
      <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto">
        <div className="flex-1 min-w-0">
          <Canvas
            cards={cards}
            onAddCard={addCard}
            onUpdateCard={updateCard}
            onRemoveCard={removeCard}
            onMoveCard={moveCard}
          />
        </div>
        <div className="w-full lg:w-96">
          <PromptPreview
            basePrompt={basePrompt}
            onBasePromptChange={setBasePrompt}
            cards={cards}
            onCardsImport={handleCardsImport}
            onClearAll={handleClearAll}
          />
        </div>
      </div>
    </div>
  );
};

export default PromptBuilder;
