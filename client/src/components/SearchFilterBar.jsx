import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchFilter, setPriorityFilter } from '../features/tasks/tasksSlice';
import useDebounce from '../hooks/useDebounce';

const SearchFilterBar = () => {
  const dispatch = useDispatch();
  const priorityFilter = useSelector((state) => state.tasks.filters.priority);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    dispatch(setSearchFilter(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
      <div className="relative flex-1 sm:max-w-xs">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <select
        value={priorityFilter}
        onChange={(e) => dispatch(setPriorityFilter(e.target.value))}
        className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
      >
        <option value="all">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
};

export default SearchFilterBar;
