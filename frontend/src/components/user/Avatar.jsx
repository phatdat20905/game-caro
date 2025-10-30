// src/components/user/Avatar.jsx
export default function Avatar({ src, size = 'md', online = false }) {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="relative">
      <img
        src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${src}`}
        alt="avatar"
        className={`${sizes[size]} rounded-full border-2 border-white shadow-md object-cover`}
      />
      {online && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      )}
    </div>
  );
}