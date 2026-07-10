import Board from './pages/Board';
import UserSwitcher from './components/UserSwitcher';

function App() {
  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
        <span className="font-bold text-slate-800 text-lg">📋 KanbanBoard</span>
        <UserSwitcher />
      </header>
      <main className="flex-1 overflow-hidden">
        <Board />
      </main>
    </div>
  );
}

export default App;
