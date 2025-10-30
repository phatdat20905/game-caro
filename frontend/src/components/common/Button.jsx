// src/components/common/Button.jsx
export default function Button({ children, onClick, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4';
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg focus:ring-purple-300',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-7 py-3.5 text-lg',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}