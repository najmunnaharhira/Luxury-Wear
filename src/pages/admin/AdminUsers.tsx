import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setUsers(data);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="font-display text-3xl font-semibold text-foreground mb-8">Users</h2>
        <p className="font-body text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-3xl font-semibold text-foreground">Users</h2>
        <span className="font-body text-sm text-muted-foreground">{users.length} total</span>
      </div>

      {users.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <p className="font-body text-muted-foreground">No users yet</p>
        </div>
      ) : (
        <div className="border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="text-left px-4 py-3 font-body text-xs tracking-widest uppercase text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 font-body text-xs tracking-widest uppercase text-muted-foreground">User ID</th>
                <th className="text-left px-4 py-3 font-body text-xs tracking-widest uppercase text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((profile) => (
                <tr key={profile.id} className="border-b border-border hover:bg-card/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent flex items-center justify-center">
                        <span className="font-body text-xs text-accent-foreground uppercase">
                          {(profile.display_name || "U")[0]}
                        </span>
                      </div>
                      <span className="font-body text-sm text-foreground">
                        {profile.display_name || "Anonymous"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-muted-foreground font-mono">
                    {profile.user_id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-muted-foreground">
                    {format(new Date(profile.created_at), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
