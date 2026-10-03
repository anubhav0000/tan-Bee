import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { account } from "../lib/appwrite";
import FileUpload from "../components/FileManagement/FileUpload";
import FileCard from "../components/FileManagement/FileCard";
import { useFiles } from "../hooks/useFiles";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Tan bee" },
      { name: "description", content: "Admin dashboard for Tan bee." },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { files, loading, refetch } = useFiles();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const current = await account.get();
      setUser(current);
    } catch (error) {
      setUser(null);
    }
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await account.createEmailPasswordSession(email, password);
      checkAuth();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <form onSubmit={login} className="glass-card p-8 rounded-lg shadow-md w-96 animate-rise">
          <h2 className="text-2xl font-display text-ice mb-6 text-center">Admin Login</h2>
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full mb-4 p-2 border border-white/10 rounded bg-ink text-ice focus:outline-none focus:border-mint"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full mb-6 p-2 border border-white/10 rounded bg-ink text-ice focus:outline-none focus:border-mint"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-mint/20 text-mint border border-mint/20 py-2 rounded font-medium hover:bg-mint/30 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-rise">
      <div className="border-b border-white/10 pb-4 mb-8 flex justify-between items-center">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-mint mb-2">// SECURE</p>
          <h1 className="text-3xl font-display text-ice">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-ice/60 hidden md:block">Logged in as {user.email}</span>
          <button
            onClick={logout}
            className="text-sm bg-coral/10 border border-coral/20 text-coral px-4 py-2 rounded hover:bg-coral/20 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <FileUpload user={user} onSuccess={() => refetch()} />
        </div>
        <div className="lg:col-span-3">
          <div className="glass-card p-6">
            <h2 className="text-xl font-display text-ice mb-4">Manage Files</h2>
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint"></div>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-lg">
                <p className="text-ice/50">No files uploaded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file: any) => (
                  <FileCard
                    key={file.$id}
                    fileData={file}
                    isAdmin={true}
                    onEdit={(data: any) => console.log("Edit requested for", data)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
