import { useState, useEffect } from 'react';
import Header from '../components/Header';
import UserForm from '../components/UserForm';
import UserTable from '../components/UserTable';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // ── Load users on mount ───────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setFetchError('');
        const data = await getUsers();
        if (mounted) setUsers(data);
      } catch (err) {
        if (mounted) setFetchError(err.message || 'Failed to connect to backend');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchUsers();
    return () => { mounted = false; };
  }, []);

  // ── CREATE ────────────────────────────────────────────────────────────────
  // Called by UserForm when adding a new user.
  // After the API responds with the created record, we update React state.
  // NO page reload — only state update triggers a re-render.
  const handleCreate = async (formData) => {
    const createdUser = await createUser(formData);
    setUsers((prev) => [createdUser, ...prev]);
  };

  // ── UPDATE ────────────────────────────────────────────────────────────────
  // Called by UserForm when saving edits.
  // We replace only the matching record in state — other records are untouched.
  const handleUpdate = async (formData) => {
    const updatedUser = await updateUser(editingUser.id, formData);
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setEditingUser(null);
  };

  // ── DELETE ────────────────────────────────────────────────────────────────
  // Called from UserTable when confirming delete.
  // We remove the matching record from state — no page reload needed.
  const handleDelete = async (userId) => {
    await deleteUser(userId);
    setUsers((prev) => prev.filter((user) => user.id !== userId));
    // If we were editing this user, cancel edit
    if (editingUser?.id === userId) setEditingUser(null);
  };

  // ── EDIT ──────────────────────────────────────────────────────────────────
  const handleEdit = (user) => {
    setEditingUser(user);
    // Scroll to form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  // Route submit to create or update depending on mode
  const handleFormSubmit = async (formData) => {
    if (editingUser) {
      await handleUpdate(formData);
    } else {
      await handleCreate(formData);
    }
  };

  return (
    <>
      <Header />

      <main className="p-6">
        {/* Stats bar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="bg-white border border-slate-200/80 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
              <svg className="w-4 h-4" style={{ color: '#004e9f' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Total Users</p>
              <p className="text-slate-800 font-semibold text-lg leading-tight">
                {isLoading ? '—' : users.length}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
              <svg className="w-4 h-4" style={{ color: '#34A853' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Database</p>
              <p className="text-slate-800 font-semibold text-sm leading-tight">SQLite</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fdf4ff' }}>
              <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-xs">API</p>
              <p className="text-slate-800 font-semibold text-sm leading-tight">REST / Express</p>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Form — ~5/12 */}
          <div className="lg:col-span-5">
            <UserForm
              editingUser={editingUser}
              onSubmit={handleFormSubmit}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          {/* RIGHT: Table — ~7/12 */}
          <div className="lg:col-span-7">
            <UserTable
              users={users}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
              error={fetchError}
            />
          </div>
        </div>
      </main>
    </>
  );
}
