import React, { useState, useMemo } from "react";
import { Copy, Upload, Download, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ComponentCard } from "@/types/promptBuilder";

interface PromptPreviewProps {
  basePrompt: string;
  onBasePromptChange: (prompt: string) => void;
  cards: ComponentCard[];
  onCardsImport: (cards: ComponentCard[]) => void;
  onClearAll: () => void;
}

const PromptPreview: React.FC<PromptPreviewProps> = ({
  basePrompt,
  onBasePromptChange,
  cards,
  onCardsImport,
  onClearAll,
}) => {
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState("");
  const [showImport, setShowImport] = useState(false);
  const { toast } = useToast();

  const assembledPrompt = useMemo(() => {
    let prompt = basePrompt.trim();

    const exampleCards = cards.filter(
      (card) => card.type === "example" && card.content.trim()
    );
    const hookCards = cards.filter(
      (card) => card.type === "hook" && card.content.trim()
    );
    const themeCards = cards.filter(
      (card) => card.type === "theme" && card.content.trim()
    );
    const topicCards = cards.filter(
      (card) => card.type === "topic" && card.content.trim()
    );
    const audienceCards = cards.filter(
      (card) => card.type === "audience" && card.content.trim()
    );
    const ctaCards = cards.filter(
      (card) => card.type === "cta" && card.content.trim()
    );
    const durationCards = cards.filter(
      (card) => card.type === "duration" && card.content.trim()
    );
    const toneCards = cards.filter(
      (card) => card.type === "tone" && card.content.trim()
    );
    const customCards = cards.filter(
      (card) => card.type === "custom" && card.content.trim()
    );

    if (topicCards.length > 0) {
      prompt += "\n\nReel Topic:\n";
      topicCards.forEach((card) => {
        prompt += `${card.content.trim()}\n`;
      });
    }

    if (audienceCards.length > 0) {
      prompt += "\n\nTarget Audience:\n";
      audienceCards.forEach((card) => {
        prompt += `${card.content.trim()}\n`;
      });
    }

    if (exampleCards.length > 0) {
      prompt += "\n\nHere are some examples of my previous reels:\n";
      exampleCards.forEach((card, index) => {
        const label = card.label?.trim() || `Example ${index + 1}`;
        prompt += `\n${label}:\n${card.content.trim()}\n`;
        if (index < exampleCards.length - 1) prompt += "---\n";
      });
    }

    if (hookCards.length > 0) {
      prompt += "\n\nThe main hook for this new reel is:\n";
      hookCards.forEach((card) => {
        prompt += `${card.content.trim()}\n`;
      });
    }

    if (themeCards.length > 0) {
      prompt += "\n\nThe theme or analogy to use is:\n";
      themeCards.forEach((card) => {
        prompt += `${card.content.trim()}\n`;
      });
    }

    if (customCards.length > 0) {
      prompt += "\n\nAdditional instructions:\n";
      customCards.forEach((card) => {
        prompt += `- ${card.content.trim()}\n`;
      });
    }

    if (durationCards.length > 0) {
      prompt += "\n\nVideo Duration:\n";
      durationCards.forEach((card) => {
        prompt += `${card.content.trim()}\n`;
      });
    }

    if (toneCards.length > 0) {
      prompt += "\n\nTone & Style:\n";
      toneCards.forEach((card) => {
        prompt += `${card.content.trim()}\n`;
      });
    }

    if (ctaCards.length > 0) {
      prompt += "\n\nCall to Action:\n";
      ctaCards.forEach((card) => {
        prompt += `${card.content.trim()}\n`;
      });
    }

    return prompt;
  }, [basePrompt, cards]);

  const promptData = useMemo(
    () => ({
      basePrompt,
      cards,
    }),
    [basePrompt, cards]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(assembledPrompt);
      setCopied(true);
      toast({
        title: "Prompt Copied! ✨",
        description:
          "Your assembled prompt is ready to paste into your AI tool.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please select and copy the text manually.",
        variant: "destructive",
      });
    }
  };

  const handleClearAll = () => {
    onClearAll();
    toast({
      title: "All Cleared! 🗑️",
      description: "All components and base prompt have been reset.",
    });
  };

  const handleExportJSON = async () => {
    try {
      const jsonData = JSON.stringify(promptData, null, 2);
      await navigator.clipboard.writeText(jsonData);
      toast({
        title: "JSON Exported! 📋",
        description: "Prompt data copied as JSON. Save it to import later!",
      });
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "Could not copy JSON data.",
        variant: "destructive",
      });
    }
  };

  const handleImportJSON = () => {
    try {
      const data = JSON.parse(importText);
      if (data.basePrompt && data.cards) {
        onBasePromptChange(data.basePrompt);
        onCardsImport(data.cards);
        setImportText("");
        setShowImport(false);
        toast({
          title: "Prompt Imported! 🎉",
          description: "Your saved prompt has been loaded successfully.",
        });
      } else {
        throw new Error("Invalid format");
      }
    } catch (err) {
      toast({
        title: "Import Failed",
        description: "Please check your JSON format and try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveToStorage = () => {
    const dataToSave = {
      basePrompt,
      cards,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("reelcraft-manual-save", JSON.stringify(dataToSave));
    toast({
      title: "Saved to Browser! 💾",
      description: "Your prompt has been manually saved locally.",
    });
  };

  const handleLoadFromStorage = () => {
    const savedData = localStorage.getItem("reelcraft-manual-save");
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.basePrompt && data.cards) {
          onBasePromptChange(data.basePrompt);
          onCardsImport(data.cards);
          toast({
            title: "Loaded from Browser! 📂",
            description: "Your manually saved prompt has been restored.",
          });
        }
      } catch (err) {
        toast({
          title: "Load Failed",
          description: "Could not load saved data.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "No Saved Data",
        description: "No manually saved prompt found in browser storage.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-charcoal border-dashed p-6 sticky top-6">
      <div className="space-y-6">
        <div>
          <label
            htmlFor="base-prompt"
            className="block text-sm font-heading font-semibold text-charcoal mb-2"
          >
            Base System Prompt
          </label>
          <Textarea
            id="base-prompt"
            value={basePrompt}
            onChange={(e) => onBasePromptChange(e.target.value)}
            className="min-h-[150px] font-body border-charcoal/30 rounded-lg"
            placeholder="Enter your base system prompt..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="assembled-prompt"
              className="block text-sm font-heading font-semibold text-charcoal"
            >
              Your Assembled AI Prompt
            </label>
            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                className={`
                  transition-all duration-200 rounded-lg px-3 py-1 text-sm font-body font-medium
                  ${
                    copied
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-teal-primary hover:bg-teal-dark text-white"
                  }
                  hover:scale-105 border-2 border-charcoal shadow-lg
                `}
              >
                <Copy className="w-4 h-4 mr-1" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
          <Textarea
            id="assembled-prompt"
            value={assembledPrompt}
            readOnly
            className="min-h-[300px] font-mono text-sm border-charcoal/30 rounded-lg bg-gray-50"
            placeholder="Your assembled prompt will appear here as you add components..."
          />
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleSaveToStorage}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-body font-medium rounded-xl px-3 py-2 transition-all duration-200 hover:scale-105 border-2 border-purple-300 shadow-lg text-sm"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button
              onClick={handleLoadFromStorage}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-body font-medium rounded-xl px-3 py-2 transition-all duration-200 hover:scale-105 border-2 border-purple-300 shadow-lg text-sm"
            >
              <Upload className="w-4 h-4 mr-1" />
              Load
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleExportJSON}
              className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-body font-medium rounded-xl px-4 py-2 transition-all duration-200 hover:scale-105 border-2 border-purple-300 shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button
              onClick={() => setShowImport(!showImport)}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-body font-medium rounded-xl px-4 py-2 transition-all duration-200 hover:scale-105 border-2 border-purple-300 shadow-lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import JSON
            </Button>
          </div>
          {showImport && (
            <div className="space-y-2">
              <Textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste your exported JSON here..."
                className="min-h-[100px] font-mono text-sm border-charcoal/30 rounded-lg"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleImportJSON}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-body font-medium rounded-lg px-4 py-2"
                >
                  Import Prompt
                </Button>
                <Button
                  onClick={() => {
                    setShowImport(false);
                    setImportText("");
                  }}
                  variant="outline"
                  className="px-4 py-2 rounded-lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          <Button
            onClick={handleClearAll}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-body font-medium rounded-xl px-4 py-2 transition-all duration-200 hover:scale-105 border-2 border-purple-300 shadow-lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear All & Reset
          </Button>
        </div>

        <div className="text-xs text-gray-500 font-body text-center">
          <p>
            🎯 {cards.length} component{cards.length !== 1 ? "s" : ""} added
          </p>
          <p>📝 {assembledPrompt.length} characters total</p>
          <p>💾 Auto-saved to browser storage</p>
        </div>
      </div>
    </div>
  );
};

export default PromptPreview;
