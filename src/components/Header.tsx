import { Lightbulb } from "lucide-react";
import { GitHubStarsButton } from "./github-stars";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 border-b-2 border-purple-300 border-dashed shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Lightbulb
                className="w-8 h-8 text-yellow-300 animate-pulse"
                strokeWidth={2.5}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-white">
                Block Prompt
              </h1>
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-sm text-purple-100 font-body italic">
              Build AI prompts like Lego blocks ✨
            </p>
          </div>

          <GitHubStarsButton
            username={`bhaveshsinghal95182`}
            repository={`prompt-block`}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
