export default function Cell({ value, onClick, isWinning }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-8 h-8 rounded flex items-center justify-center text-2xl font-bold transition
        ${value === 'X' ? 'text-blue-600' : value === 'O' ? 'text-red-600' : ''}
        ${isWinning ? 'bg-yellow-400 scale-110' : 'bg-amber-100 hover:bg-amber-200'}
      `}
    >
      {value}
    </button>
  );
}