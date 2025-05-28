import { useState, useEffect } from "react";
import { Star, ExternalLink, Loader2 } from "lucide-react";

export const GitHubStarsButton = ({ username, repository, className = "" }) => {
  const [stars, setStars] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.github.com/repos/${username}/${repository}`
        );

        if (!response.ok) {
          throw new Error("Repository not found");
        }

        const data = await response.json();
        setStars(data.stargazers_count);
        setError(null);
      } catch (err) {
        setError(err.message);
        setStars(0);
      } finally {
        setLoading(false);
      }
    };

    if (username && repository) {
      fetchStars();
    }
  }, [username, repository]);

  const formatStarCount = (count) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "k";
    }
    return count.toString();
  };

  const handleClick = () => {
    window.open(`https://github.com/${username}/${repository}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className={`
    inline-flex items-center justify-center px-4 py-2
    bg-gradient-to-br from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600
    text-white 
    text-sm font-medium
    border border-green-600 
    rounded-md shadow-sm
    transition-all duration-200
    hover:scale-105 hover:shadow-lg 
    focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-gray-100 
    disabled:opacity-60 disabled:cursor-not-allowed 
    ${className}
  `}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span>Loading...</span>
        </>
      ) : error ? (
        <span>Error</span> // Or a more descriptive error message
      ) : (
        <div className="flex items-center gap-x-3">
          <div className="flex flex-col items-center justify-center">
            <Star className="w-5 h-5 fill-current text-purple-50" />{" "}
            {/* Softer icon color, or text-white */}
            <span className="text-xs font-semibold mt-0.5 text-amber-100">
              {" "}
              {/* Lighter count text */}
              {formatStarCount(stars) || "0"}
            </span>
          </div>
          <div className="w-px h-8 bg-green-600 opacity-60"></div>{" "}
          {/* Muted divider */}
          <span className="font-semibold">Star on GitHub</span>
        </div>
      )}
    </button>
  );
};
