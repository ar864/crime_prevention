import { useEffect, useState } from "react";

// Helper SVGs for the UI
const UsersIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);

const ReportsIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);

const ShieldIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);

export default function AdminPage({ incidents, handleDelete, token, user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    async function loadUsers() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "";
        const response = await fetch(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to load users");
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUsers(false);
      }
    }
    if (token) loadUsers();
  }, [token]);

  async function handleDeleteUser(userId, username) {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) return;
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || "Failed to delete user");
      
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="ap-wrapper">
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --ap-bg: #f8fafc;
          --ap-surface: #ffffff;
          --ap-text-main: #0f172a;
          --ap-text-muted: #64748b;
          --ap-border: #e2e8f0;
          --ap-primary: #0ea5e9;
          --ap-primary-hover: #0284c7;
          --ap-danger: #ef4444;
          --ap-danger-bg: #fef2f2;
          --ap-danger-hover: #dc2626;
        }
        
        .ap-wrapper {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          background-color: var(--ap-bg);
          font-family: 'Inter', system-ui, sans-serif;
          margin: 0;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000; /* overlay above everything */
        }

        .ap-sidebar {
          width: 280px;
          background: var(--ap-surface);
          border-right: 1px solid var(--ap-border);
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          box-shadow: 2px 0 10px rgba(0,0,0,0.02);
        }

        .ap-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--ap-primary);
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 2.5rem;
        }

        .ap-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .ap-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          color: var(--ap-text-muted);
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .ap-nav-item:hover {
          background: #f1f5f9;
          color: var(--ap-text-main);
        }

        .ap-nav-item.active {
          background: var(--ap-primary);
          color: white;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
        }

        .ap-user-profile {
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1px solid var(--ap-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .ap-user-info p { margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--ap-text-main); }
        .ap-user-info span { font-size: 0.8rem; color: var(--ap-text-muted); }
        
        .ap-logout-btn {
          background: none;
          border: none;
          color: var(--ap-text-muted);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
        }
        .ap-logout-btn:hover { background: #f1f5f9; color: var(--ap-danger); }

        .ap-main {
          flex: 1;
          padding: 2.5rem 3rem;
          overflow-y: auto;
        }

        .ap-header {
          margin-bottom: 2.5rem;
        }

        .ap-header h1 {
          font-size: 2rem;
          color: var(--ap-text-main);
          margin: 0 0 0.5rem 0;
          font-weight: 700;
        }

        .ap-header p {
          color: var(--ap-text-muted);
          margin: 0;
          font-size: 1.05rem;
        }

        .ap-stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .ap-stat-card {
          background: var(--ap-surface);
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid var(--ap-border);
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .ap-stat-icon {
          width: 54px;
          height: 54px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #f0f9ff;
          color: var(--ap-primary);
        }

        .ap-stat-info span {
          display: block;
          color: var(--ap-text-muted);
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .ap-stat-info strong {
          font-size: 1.75rem;
          color: var(--ap-text-main);
          font-weight: 700;
        }

        .ap-table-container {
          background: var(--ap-surface);
          border-radius: 16px;
          border: 1px solid var(--ap-border);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .ap-table-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--ap-border);
          background: #fdfdfd;
        }

        .ap-table-header h2 {
          margin: 0;
          font-size: 1.15rem;
          color: var(--ap-text-main);
        }

        table.ap-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .ap-table th {
          background: #f8fafc;
          padding: 1rem 1.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ap-text-muted);
          border-bottom: 1px solid var(--ap-border);
        }

        .ap-table td {
          padding: 1.25rem 1.5rem;
          font-size: 0.925rem;
          color: var(--ap-text-main);
          border-bottom: 1px solid var(--ap-border);
          vertical-align: middle;
        }

        .ap-table tr:last-child td { border-bottom: none; }
        .ap-table tr:hover { background: #f8fafc; }

        .ap-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .ap-badge-admin { background: #fee2e2; color: #b91c1c; }
        .ap-badge-user { background: #dcfce7; color: #15803d; }
        
        .ap-badge-low { background: #fef9c3; color: #854d0e; }
        .ap-badge-high { background: #fee2e2; color: #b91c1c; }
        .ap-badge-neutral { background: #f1f5f9; color: #475569; }

        .ap-delete-btn {
          background: var(--ap-danger-bg);
          color: var(--ap-danger);
          border: 1px solid #fecaca;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ap-delete-btn:hover {
          background: var(--ap-danger-hover);
          color: white;
        }
      `}} />

      {/* Sidebar */}
      <aside className="ap-sidebar">
        <div className="ap-logo">
          <ShieldIcon />
          <span>AdminPortal</span>
        </div>
        
        <nav className="ap-nav">
          <div 
            className={`ap-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <UsersIcon /> User Directory
          </div>
          <div 
            className={`ap-nav-item ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <ReportsIcon /> Incident Reports
          </div>
        </nav>

        <div className="ap-user-profile">
          <div className="ap-user-info">
            <p>{user?.username}</p>
            <span>System Administrator</span>
          </div>
          <button className="ap-logout-btn" onClick={onLogout} title="Logout">
            <LogoutIcon />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ap-main">
        <div className="ap-header">
          <h1>{activeTab === "users" ? "User Directory" : "Incident Management"}</h1>
          <p>
            {activeTab === "users" 
              ? "Manage system access and review registered accounts." 
              : "Review and moderate active community safety reports."}
          </p>
        </div>

        {/* Global Stats */}
        <div className="ap-stats-row">
          <div className="ap-stat-card">
            <div className="ap-stat-icon"><UsersIcon /></div>
            <div className="ap-stat-info">
              <span>Total Users</span>
              <strong>{users.length}</strong>
            </div>
          </div>
          <div className="ap-stat-card">
            <div className="ap-stat-icon" style={{background: '#fef2f2', color: '#ef4444'}}><ReportsIcon /></div>
            <div className="ap-stat-info">
              <span>Total Reports</span>
              <strong>{incidents.length}</strong>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="ap-table-container">
          <div className="ap-table-header">
            <h2>{activeTab === "users" ? "All Users" : "Recent Reports"}</h2>
          </div>
          
          {activeTab === "users" ? (
             <table className="ap-table">
               <thead>
                 <tr>
                   <th>Username</th>
                   <th>Access Level</th>
                   <th>Date Joined</th>
                   <th style={{textAlign: 'right'}}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {loadingUsers ? (
                   <tr><td colSpan="4" style={{textAlign: 'center'}}>Loading users...</td></tr>
                 ) : users.length === 0 ? (
                   <tr><td colSpan="4" style={{textAlign: 'center'}}>No users found.</td></tr>
                 ) : (
                   users.map((u, i) => (
                     <tr key={u._id || i}>
                       <td style={{fontWeight: 600}}>{u.username}</td>
                       <td>
                         <span className={`ap-badge ${u.role === 'admin' ? 'ap-badge-admin' : 'ap-badge-user'}`}>
                           {u.role}
                         </span>
                       </td>
                       <td>{new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                       <td style={{textAlign: 'right'}}>
                         {u.username !== user?.username && (
                           <button className="ap-delete-btn" onClick={() => handleDeleteUser(u._id, u.username)}>Delete</button>
                         )}
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
          ) : (
             <table className="ap-table">
               <thead>
                 <tr>
                   <th>Title</th>
                   <th>Category</th>
                   <th>Severity</th>
                   <th>Location</th>
                   <th>Date Reported</th>
                   <th style={{textAlign: 'right'}}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {incidents.length === 0 ? (
                   <tr><td colSpan="6" style={{textAlign: 'center'}}>No incidents reported.</td></tr>
                 ) : (
                   incidents.map((item) => (
                     <tr key={item._id}>
                       <td style={{fontWeight: 600}}>{item.title}</td>
                       <td><span className="ap-badge ap-badge-neutral">{item.category}</span></td>
                       <td>
                         <span className={`ap-badge ${item.severity > 3 ? 'ap-badge-high' : 'ap-badge-low'}`}>
                           Level {item.severity}
                         </span>
                       </td>
                       <td style={{color: 'var(--ap-text-muted)'}}>{item.location?.area || "Unknown"}</td>
                       <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                       <td style={{textAlign: 'right'}}>
                         <button className="ap-delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
          )}
        </div>
      </main>
    </div>
  );
}
