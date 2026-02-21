import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Users, Search, Shield, TrendingUp, Building2, Mail } from "lucide-react";

interface UserProfile {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  roles: string[];
  email?: string;
}

const roleConfig: Record<string, { color: string; icon: typeof Shield }> = {
  admin: { color: "bg-red-500/15 text-red-600 border-red-500/30", icon: Shield },
  investor: { color: "bg-blue-500/15 text-blue-600 border-blue-500/30", icon: TrendingUp },
  business_owner: { color: "bg-green-500/15 text-green-600 border-green-500/30", icon: Building2 },
};

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    const fetchUsers = async () => {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("user_id, full_name, phone, created_at"),
        supabase.from("user_roles").select("user_id, role"),
      ]);

      const profiles = profilesRes.data ?? [];
      const roles = rolesRes.data ?? [];

      const userMap = new Map<string, UserProfile>();
      profiles.forEach((p) => {
        userMap.set(p.user_id, {
          user_id: p.user_id,
          full_name: p.full_name,
          phone: p.phone,
          created_at: p.created_at,
          roles: [],
        });
      });

      roles.forEach((r) => {
        const u = userMap.get(r.user_id);
        if (u) {
          u.roles.push(r.role);
        } else {
          userMap.set(r.user_id, {
            user_id: r.user_id,
            full_name: null,
            phone: null,
            created_at: "",
            roles: [r.role],
          });
        }
      });

      setUsers(Array.from(userMap.values()));
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !(u.full_name?.toLowerCase().includes(q)) &&
        !(u.user_id.toLowerCase().includes(q)) &&
        !(u.phone?.toLowerCase().includes(q))
      ) return false;
    }
    if (roleFilter !== "all" && !u.roles.includes(roleFilter)) return false;
    return true;
  });

  const roleFilters = ["all", "investor", "business_owner", "admin"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground text-sm mt-1">View and manage platform users.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary/50 border-border h-10"
          />
        </div>
        <div className="flex gap-2">
          {roleFilters.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border capitalize transition-all ${
                roleFilter === r
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/50"
              }`}
            >
              {r === "all" ? "All" : r.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Users
            <Badge variant="secondary" className="text-xs">{filtered.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">No users found.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((u, i) => (
                <motion.div
                  key={u.user_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl border border-border bg-secondary/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                      {u.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{u.full_name ?? "No name"}</h4>
                      <p className="text-xs text-muted-foreground font-mono">{u.user_id.slice(0, 8)}…</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {u.roles.map((role) => {
                      const rc = roleConfig[role];
                      return (
                        <Badge key={role} className={`text-[10px] capitalize border ${rc?.color ?? ""}`}>
                          {role.replace("_", " ")}
                        </Badge>
                      );
                    })}
                    {u.created_at && (
                      <span className="text-xs text-muted-foreground">
                        Joined {new Date(u.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
