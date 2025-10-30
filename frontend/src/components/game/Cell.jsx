// src/components/game/Cell.jsx

export default function Cell({ value, onClick, isWinning, isLastMove }) {
  const getCellClasses = () => {
    let classes = "w-8 h-8 rounded-lg flex items-center justify-center text-xl sm:text-2xl font-bold transition-all duration-200 transform ";
    
    // Base styling
    if (!value) {
      classes += "bg-white/80 hover:bg-white hover:scale-105 cursor-pointer shadow-sm hover:shadow-md ";
    } else {
      classes += "shadow-inner ";
    }
    
    // Symbol colors
    if (value === 'X') {
      classes += "text-blue-600 bg-blue-50 ";
    } else if (value === 'O') {
      classes += "text-red-600 bg-red-50 ";
    }
    
    // Special states
    if (isLastMove && value) {
      classes += "ring-4 ring-yellow-400 ring-offset-1 animate-pulse-slow ";
    }
    
    if (isWinning) {
      classes += "bg-gradient-to-br from-green-300 to-green-500 scale-110 ring-4 ring-green-600 ";
    }
    
    return classes;
  };

  return (
    <button
      onClick={onClick}
      disabled={!!value}
      className={getCellClasses()}
    >
      {value && (
        <span className="animate-scale-in drop-shadow-lg">
          {value}
        </span>
      )}
    </button>
  );
}