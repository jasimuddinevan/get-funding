import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Building2, Plus, Pencil, Trash2, Loader2, Landmark, CreditCard,
} from "lucide-react";

interface PaymentMethod {
  id: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  branch_name: string | null;
  routing_number: string | null;
  swift_code: string | null;
  instructions: string | null;
  is_active: boolean;
  created_at: string;
}

const emptyForm = {
  bank_name: "",
  account_name: "",
  account_number: "",
  branch_name: "",
  routing_number: "",
  swift_code: "",
  instructions: "",
  is_active: true,
};

const PaymentSettings = () => {
  const { user } = useAuth();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchMethods = async () => {
    const { data } = await supabase
      .from("payment_methods")
      .select("*")
      .order("created_at", { ascending: false });
    setMethods((data as PaymentMethod[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchMethods(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (m: PaymentMethod) => {
    setEditing(m);
    setForm({
      bank_name: m.bank_name,
      account_name: m.account_name,
      account_number: m.account_number,
      branch_name: m.branch_name ?? "",
      routing_number: m.routing_number ?? "",
      swift_code: m.swift_code ?? "",
      instructions: m.instructions ?? "",
      is_active: m.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.bank_name.trim() || !form.account_name.trim() || !form.account_number.trim()) {
      toast.error("Bank name, account name, and account number are required.");
      return;
    }
    setSaving(true);

    const payload = {
      bank_name: form.bank_name.trim(),
      account_name: form.account_name.trim(),
      account_number: form.account_number.trim(),
      branch_name: form.branch_name.trim() || null,
      routing_number: form.routing_number.trim() || null,
      swift_code: form.swift_code.trim() || null,
      instructions: form.instructions.trim() || null,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };

    if (editing) {
      const { error } = await supabase.from("payment_methods").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); } else { toast.success("Bank account updated!"); }
    } else {
      const { error } = await supabase.from("payment_methods").insert({ ...payload, created_by: user?.id });
      if (error) { toast.error(error.message); } else { toast.success("Bank account added!"); }
    }

    setSaving(false);
    setDialogOpen(false);
    fetchMethods();
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase.from("payment_methods").delete().eq("id", id);
    if (error) { toast.error(error.message); } else { toast.success("Deleted."); fetchMethods(); }
    setDeleting(null);
  };

  const handleToggle = async (m: PaymentMethod) => {
    await supabase.from("payment_methods").update({ is_active: !m.is_active, updated_at: new Date().toISOString() }).eq("id", m.id);
    fetchMethods();
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Payment Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage bank accounts shown to investors during payment.</p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="w-4 h-4" /> Add Bank Account
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />)}
        </div>
      ) : methods.length === 0 ? (
        <Card className="border-border/40">
          <CardContent className="p-12 text-center">
            <Landmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">No Bank Accounts Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Add bank account details that investors will see when making payments.</p>
            <Button onClick={openAdd} className="gap-2"><Plus className="w-4 h-4" /> Add First Account</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {methods.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`border-border/40 transition-all ${!m.is_active ? "opacity-60" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Landmark className="w-6 h-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display text-lg font-semibold text-foreground">{m.bank_name}</h3>
                          <Badge className={m.is_active
                            ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                            : "bg-muted text-muted-foreground border-border"
                          }>
                            {m.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="space-y-0.5 text-sm">
                          <p className="text-foreground"><span className="text-muted-foreground">Account:</span> {m.account_name}</p>
                          <p className="text-foreground font-mono"><span className="text-muted-foreground">Number:</span> {m.account_number}</p>
                          {m.branch_name && <p className="text-muted-foreground text-xs">Branch: {m.branch_name}</p>}
                          {m.routing_number && <p className="text-muted-foreground text-xs">Routing: {m.routing_number}</p>}
                        </div>
                        {m.instructions && (
                          <p className="text-xs text-muted-foreground mt-2 italic">"{m.instructions}"</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Switch checked={m.is_active} onCheckedChange={() => handleToggle(m)} />
                      <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={() => openEdit(m)}>
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 h-8 border-destructive/30 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(m.id)}
                        disabled={deleting === m.id}
                      >
                        {deleting === m.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Landmark className="w-5 h-5 text-primary" />
              {editing ? "Edit Bank Account" : "Add Bank Account"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="bank_name">Bank Name *</Label>
              <Input id="bank_name" value={form.bank_name} onChange={(e) => setForm(f => ({ ...f, bank_name: e.target.value }))} placeholder="e.g. Dutch Bangla Bank" className="mt-1.5 bg-secondary/50 border-border" maxLength={100} />
            </div>
            <div>
              <Label htmlFor="account_name">Account Holder Name *</Label>
              <Input id="account_name" value={form.account_name} onChange={(e) => setForm(f => ({ ...f, account_name: e.target.value }))} placeholder="e.g. FundBridge Ltd." className="mt-1.5 bg-secondary/50 border-border" maxLength={100} />
            </div>
            <div>
              <Label htmlFor="account_number">Account Number *</Label>
              <Input id="account_number" value={form.account_number} onChange={(e) => setForm(f => ({ ...f, account_number: e.target.value }))} placeholder="e.g. 1234567890123" className="mt-1.5 bg-secondary/50 border-border font-mono" maxLength={50} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="branch_name">Branch</Label>
                <Input id="branch_name" value={form.branch_name} onChange={(e) => setForm(f => ({ ...f, branch_name: e.target.value }))} placeholder="e.g. Gulshan" className="mt-1.5 bg-secondary/50 border-border" maxLength={100} />
              </div>
              <div>
                <Label htmlFor="routing_number">Routing Number</Label>
                <Input id="routing_number" value={form.routing_number} onChange={(e) => setForm(f => ({ ...f, routing_number: e.target.value }))} placeholder="e.g. 090261234" className="mt-1.5 bg-secondary/50 border-border font-mono" maxLength={20} />
              </div>
            </div>
            <div>
              <Label htmlFor="swift_code">SWIFT Code</Label>
              <Input id="swift_code" value={form.swift_code} onChange={(e) => setForm(f => ({ ...f, swift_code: e.target.value }))} placeholder="e.g. DBBLBDDH" className="mt-1.5 bg-secondary/50 border-border font-mono" maxLength={20} />
            </div>
            <div>
              <Label htmlFor="instructions">Payment Instructions</Label>
              <Textarea id="instructions" value={form.instructions} onChange={(e) => setForm(f => ({ ...f, instructions: e.target.value }))} placeholder="e.g. Use your full name as reference..." className="mt-1.5 bg-secondary/50 border-border min-h-[70px]" maxLength={500} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm(f => ({ ...f, is_active: v }))} />
              <Label>Active (visible to investors)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="gap-2" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Landmark className="w-4 h-4" />}
              {saving ? "Saving..." : editing ? "Update" : "Add Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PaymentSettings;
