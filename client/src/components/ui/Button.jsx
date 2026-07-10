const VARIANTS = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-400',
  danger: 'bg-red-50 hover:bg-red-100 text-red-600 focus:ring-red-400',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-300',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...rest
}) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-1.5 text-sm' : 'px-4 py-2 text-sm';

  return (
    <button
      disabled={disabled}
      className={`
        ${sizeClasses} ${VARIANTS[variant]}
        rounded-lg font-medium transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
