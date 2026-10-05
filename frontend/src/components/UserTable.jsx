import { useState } from 'react';

export default function UserTable({ users, onEdit, onDelete, isLoading, error }) {
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDeleteClick = (user) => {
    setConfirmDeleteId(user.id);
  };

  const handleConfirmDelete = async (userId) => {
    setDeletingId(userId);
    setConfirmDeleteId(null);
    try {
      await onDelete(userId);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader count={0} isLoading />
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <svg className="w-8 h-8 text-slate-300 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-slate-400 text-sm">Loading users from database...</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader count={0} />
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-slate-700 font-medium text-sm">Failed to load users</p>
            <p className="text-slate-400 text-xs mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (users.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader count={0} />
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-slate-700 font-medium text-sm">No users yet</p>
            <p className="text-slate-400 text-xs mt-1">Add your first user using the form on the left.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Table ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
      <CardHeader count={users.length} />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Email
              </th>
              <th className="text-right px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className={`group transition-colors duration-100 ${
                  confirmDeleteId === user.id ? 'bg-red-50/60' : 'hover:bg-slate-50/60'
                }`}
              >
                {/* Name */}
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                      style={{ backgroundColor: '#004e9f' }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-slate-800 text-sm font-medium">{user.name}</span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-3.5">
                  <span className="text-slate-500 text-sm">{user.email}</span>
                </td>

                {/* Actions */}
                <td className="px-6 py-3.5">
                  {confirmDeleteId === user.id ? (
                    // Delete confirmation inline
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-red-600 text-xs font-medium">Delete?</span>
                      <button
                        onClick={() => handleConfirmDelete(user.id)}
                        disabled={deletingId === user.id}
                        className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {deletingId === user.id ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                      <button
                        onClick={handleCancelDelete}
                        className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    // Normal action buttons
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        disabled={deletingId === user.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all duration-150 disabled:opacity-40 cursor-pointer"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        disabled={deletingId === user.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-700 hover:bg-red-50 transition-all duration-150 disabled:opacity-40 cursor-pointer"
                      >
                        {deletingId === user.id ? (
                          <>
                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Sub-component: Card Header ────────────────────────────────────────────────
function CardHeader({ count, isLoading }) {
  return (
    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-slate-800 font-semibold text-sm">Users</h2>
          <p className="text-slate-400 text-xs">All records from database</p>
        </div>
      </div>
      {!isLoading && (
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: '#004e9f' }}
        >
          {count} {count === 1 ? 'Record' : 'Records'}
        </span>
      )}
    </div>
  );
}
