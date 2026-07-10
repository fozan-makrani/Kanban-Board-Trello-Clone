import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: {
    search: '',
    priority: 'all',
  },
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/tasks');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const res = await api.post('/tasks', taskData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/tasks/${id}`, updates);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const reorderTasks = createAsyncThunk(
  'tasks/reorderTasks',
  async (updates, { rejectWithValue }) => {
    try {
      const res = await api.patch('/tasks/reorder', { updates });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },
    setPriorityFilter: (state, action) => {
      state.filters.priority = action.payload;
    },
    // Optimistic, client-side-only reorder — fired immediately on drag-drop,
    // before the async thunk confirms with the server. This is what makes
    // dragging feel instant instead of waiting on a network round trip.
    applyOptimisticReorder: (state, action) => {
      const { taskId, newColumn, newOrder } = action.payload;
      const task = state.items.find((t) => t._id === taskId);
      if (task) {
        task.column = newColumn;
        task.order = newOrder;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Reorder - reconcile with server's authoritative order once it responds.
      // If this fails, the optimistic update above stays wrong until the next
      // fetch, which is an acceptable tradeoff we'll note in the README.
      .addCase(reorderTasks.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(reorderTasks.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setSearchFilter, setPriorityFilter, applyOptimisticReorder } = tasksSlice.actions;
export default tasksSlice.reducer;
