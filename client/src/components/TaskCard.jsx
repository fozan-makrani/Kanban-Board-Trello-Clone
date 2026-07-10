import { memo } from "react";
import { Draggable } from "@hello-pangea/dnd";

const PRIORITY_STYLES = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

const COLUMN_ORDER = ["todo", "in-progress", "done"];

const TaskCard = ({ task, index, onEdit, onDelete, onMove }) => {
  const currentColumnIndex = COLUMN_ORDER.indexOf(task.column);
  const canMoveBack = currentColumnIndex > 0;
  const canMoveForward = currentColumnIndex < COLUMN_ORDER.length - 1;

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`
            bg-white rounded-lg border border-slate-200 p-3 mb-2.5 shadow-sm
            hover:shadow-md transition-shadow
            ${snapshot.isDragging ? "shadow-lg ring-2 ring-indigo-300 rotate-1" : ""}
          `}
        >
          <div className="flex items-start gap-2 mb-2">
            {/* Dedicated drag handle — only this element triggers drag.
                Keeps buttons/text tap-safe on touch devices, and gives
                users a clear visual affordance for where to grab. */}
            <button
              {...provided.dragHandleProps}
              className="shrink-0 mt-0.5 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing touch-none"
              aria-label="Drag to move task"
              title="Drag to move"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <circle cx="5" cy="3" r="1.3" />
                <circle cx="11" cy="3" r="1.3" />
                <circle cx="5" cy="8" r="1.3" />
                <circle cx="11" cy="8" r="1.3" />
                <circle cx="5" cy="13" r="1.3" />
                <circle cx="11" cy="13" r="1.3" />
              </svg>
            </button>

            <h3 className="flex-1 text-sm font-medium text-slate-800 break-words">
              {task.title}
            </h3>

            <span
              className={`shrink-0 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${PRIORITY_STYLES[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="text-xs text-slate-500 mb-2.5 break-words line-clamp-2 pl-6">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between pl-6">
            <span className="text-[11px] text-slate-400 truncate max-w-[90px]">
              {task.assignee}
            </span>

            <div className="flex items-center gap-1 shrink-0">
              {canMoveBack && (
                <button
                  onClick={() =>
                    onMove(task, COLUMN_ORDER[currentColumnIndex - 1])
                  }
                  className="text-slate-400 hover:text-indigo-600 p-1.5"
                  title="Move to previous column"
                  aria-label="Move to previous column"
                >
                  ←
                </button>
              )}
              {canMoveForward && (
                <button
                  onClick={() =>
                    onMove(task, COLUMN_ORDER[currentColumnIndex + 1])
                  }
                  className="text-slate-400 hover:text-indigo-600 p-1.5"
                  title="Move to next column"
                  aria-label="Move to next column"
                >
                  →
                </button>
              )}
              <button
                onClick={() => onEdit(task)}
                className="text-slate-400 hover:text-indigo-600 p-1.5"
                title="Edit task"
                aria-label="Edit task"
              >
                ✎
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="text-slate-400 hover:text-red-600 p-1.5"
                title="Delete task"
                aria-label="Delete task"
              >
                🗑
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default memo(TaskCard);