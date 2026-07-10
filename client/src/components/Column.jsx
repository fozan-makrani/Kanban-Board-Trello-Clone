import { memo } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const COLUMN_META = {
  todo: { label: 'To Do', accent: 'border-t-slate-400' },
  'in-progress': { label: 'In Progress', accent: 'border-t-amber-400' },
  done: { label: 'Done', accent: 'border-t-emerald-400' },
};

const Column = ({ columnId, tasks, onEdit, onDelete, onMove }) => {
  const meta = COLUMN_META[columnId];

  return (
    <div className="flex-1 min-w-[260px] sm:min-w-[280px] bg-slate-50 rounded-xl border-t-4 border border-slate-200 flex flex-col max-h-full">
      <div className={`px-3 py-3 border-t-4 -mt-[1px] -mx-[1px] rounded-t-xl ${meta.accent}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">{meta.label}</h2>
          <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 px-2.5 pb-2.5 pt-1 overflow-y-auto min-h-[120px] transition-colors
              ${snapshot.isDraggingOver ? 'bg-indigo-50/50' : ''}
            `}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <p className="text-xs text-slate-400 text-center py-6">
                Drop tasks here or add a new one
              </p>
            )}
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onMove}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default memo(Column);
