const Textarea = ({ label, error, id, rows = 3, className = '', ...rest }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`
          w-full px-3 py-2 border rounded-lg text-sm resize-none
          focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
          ${error ? 'border-red-400' : 'border-slate-300'}
          ${className}
        `}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Textarea;
