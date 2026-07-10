const ErrorBanner = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 font-medium shrink-0"
        >
          Dismiss
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
