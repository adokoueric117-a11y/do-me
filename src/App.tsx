
import { useEffect, useState } from 'react';


type Priority = "Urgente" | "Moyenne" | "Basse";

type Todo = {
  id: number;
  text: string;
  priority: Priority;
};

export default function App() {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("Moyenne");
  
  // Initialisation propre du localStorage
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [filter, setFilter] = useState<Priority | "Tous">("Tous");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addTodo() {
    if (input.trim() === "") return;
    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      priority: priority
    };
    setTodos([newTodo, ...todos]);
    setInput("");
    setPriority("Moyenne");
  }

  const filteredTodos = filter === "Tous" 
    ? todos 
    : todos.filter((t) => t.priority === filter);

  return (
    // Conteneur principal : Colonne, centré, padding pour le confort
    <div className='min-h-screen bg-base-200 p-4 md:p-10 flex flex-col items-center gap-8'>
      
      <h1 className="text-4xl font-bold text-accent">"Do me"</h1>
      <h1 className="text-xl font-bold text-accent">Votre gestionnaire de tâches préférées</h1>

      {/* --- SECTION INPUT --- */}
      <div className='flex flex-wrap md:flex-nowrap w-full max-w-2xl gap-2 bg-base-100 p-4 rounded-3xl shadow-xl'>
        <input 
          type="text"
          className='input input-bordered input-accent flex-1 rounded-2xl'
          placeholder='Ajoutez une tâche...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <select 
          className='select select-bordered select-accent rounded-2xl'
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="Urgente">Urgente</option>
          <option value="Moyenne">Moyenne</option>
          <option value="Basse">Basse</option>
        </select>
        <button className='btn btn-accent rounded-2xl' onClick={addTodo}>Ajouter</button>
      </div>

      {/* --- SECTION FILTRES --- */}
      <div className='flex gap-2 bg-base-300 p-2 rounded-xl'>
        {(["Tous", "Urgente", "Moyenne", "Basse"] as const).map((f) => (
          <button 
            key={f}
            className={`btn btn-sm md:btn-md rounded-lg ${filter === f ? "btn-accent" : "btn-ghost"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* --- AFFICHAGE DES TODOS (GRILLE) --- */}
      <div className='w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <div key={todo.id} className="card bg-base-100 shadow-md border-l-4 border-accent">
              <div className="card-body p-4 flex-row justify-between items-center">
                <div>
                  <p className="font-medium">{todo.text}</p>
                  <div className={`badge badge-sm ${
                    todo.priority === 'Urgente' ? 'badge-error' : 
                    todo.priority === 'Moyenne' ? 'badge-warning' : 'badge-info'
                  }`}>
                    {todo.priority}
                  </div>
                </div>
                <button 
                  className="btn btn-circle btn-xs btn-outline btn-error"
                  onClick={() => setTodos(todos.filter(t => t.id !== todo.id))}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 opacity-50 italic">
            Aucune tâche trouvée...
          </div>
        )}
      </div>
    </div>
  );
}
