"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Discount {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrderCents: number | null;
  maxUsages: number | null;
  currentUsages: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

function formatCents(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getStatusInfo(d: Discount): { label: string; variant: "success" | "secondary" | "destructive" | "warning" } {
  if (!d.isActive) return { label: "Inactief", variant: "secondary" };
  if (d.expiresAt && new Date(d.expiresAt) < new Date()) return { label: "Verlopen", variant: "destructive" };
  if (d.maxUsages && d.currentUsages >= d.maxUsages) return { label: "Vol", variant: "warning" };
  return { label: "Actief", variant: "success" };
}

const emptyForm = {
  code: "",
  type: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
  value: 0,
  minOrderCents: "",
  maxUsages: "",
  expiresAt: "",
  isActive: true,
};

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDiscounts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/discounts");
      const data = await res.json();
      setDiscounts(data.discounts || []);
    } catch (err) {
      console.error("Failed to fetch discounts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setDialogOpen(true);
  }

  function openEdit(d: Discount) {
    setForm({
      code: d.code,
      type: d.type,
      value: d.value,
      minOrderCents: d.minOrderCents ? String(d.minOrderCents / 100) : "",
      maxUsages: d.maxUsages ? String(d.maxUsages) : "",
      expiresAt: d.expiresAt ? new Date(d.expiresAt).toISOString().split("T")[0] : "",
      isActive: d.isActive,
    });
    setEditingId(d.id);
    setError("");
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    const body = {
      code: form.code,
      type: form.type,
      value: form.value,
      minOrderCents: form.minOrderCents ? Math.round(parseFloat(form.minOrderCents) * 100) : null,
      maxUsages: form.maxUsages ? parseInt(form.maxUsages) : null,
      expiresAt: form.expiresAt || null,
      isActive: form.isActive,
    };

    try {
      const url = editingId
        ? `/api/admin/discounts/${editingId}`
        : "/api/admin/discounts";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Er ging iets mis");
        return;
      }

      setDialogOpen(false);
      fetchDiscounts();
    } catch {
      setError("Er ging iets mis");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/discounts/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      fetchDiscounts();
    } catch {
      console.error("Failed to delete discount");
    } finally {
      setDeleting(false);
    }
  }

  async function toggleActive(d: Discount) {
    try {
      await fetch(`/api/admin/discounts/${d.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !d.isActive }),
      });
      fetchDiscounts();
    } catch {
      console.error("Failed to toggle discount");
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">{discounts.length} kortingscodes</p>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium hover:from-amber-600 hover:to-orange-700 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nieuwe code
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="text-left px-4 py-3 font-medium text-stone-500">Code</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Type</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Waarde</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden md:table-cell">Min. bestelling</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden md:table-cell">Max gebruik</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden lg:table-cell">Gebruik</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden lg:table-cell">Verloopt</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Acties</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-stone-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-stone-300 border-t-amber-500 rounded-full animate-spin" />
                      Laden...
                    </div>
                  </td>
                </tr>
              ) : discounts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-stone-400">
                    Geen kortingscodes gevonden
                  </td>
                </tr>
              ) : (
                discounts.map((d) => {
                  const status = getStatusInfo(d);
                  return (
                    <tr key={d.id} className="border-b border-stone-100 hover:bg-stone-50/50">
                      <td className="px-4 py-3 font-mono font-semibold text-stone-800">
                        {d.code}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {d.type === "PERCENTAGE" ? "Percentage" : "Vast bedrag"}
                      </td>
                      <td className="px-4 py-3 text-stone-800 font-medium">
                        {d.type === "PERCENTAGE" ? `${d.value}%` : formatCents(d.value)}
                      </td>
                      <td className="px-4 py-3 text-stone-600 hidden md:table-cell">
                        {d.minOrderCents ? formatCents(d.minOrderCents) : "-"}
                      </td>
                      <td className="px-4 py-3 text-stone-600 hidden md:table-cell">
                        {d.maxUsages ?? "Onbeperkt"}
                      </td>
                      <td className="px-4 py-3 text-stone-600 hidden lg:table-cell">
                        {d.currentUsages}
                      </td>
                      <td className="px-4 py-3 text-stone-600 hidden lg:table-cell">
                        {d.expiresAt ? formatDate(d.expiresAt) : "Nooit"}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(d)} className="cursor-pointer">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(d)}
                            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(d.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setDialogOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <button
              onClick={() => setDialogOpen(false)}
              className="absolute right-4 top-4 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-semibold text-stone-800 mb-4">
              {editingId ? "Code bewerken" : "Nieuwe kortingscode"}
            </h2>

            {error && (
              <div className="mb-4 bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">
                  Code
                </label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  className="w-full h-10 rounded-lg border border-stone-300 px-3 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="KORTING20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "PERCENTAGE" | "FIXED" }))}
                    className="w-full h-10 rounded-lg border border-stone-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED">Vast bedrag</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">
                    Waarde {form.type === "PERCENTAGE" ? "(%)" : "(centen)"}
                  </label>
                  <input
                    type="number"
                    value={form.value || ""}
                    onChange={(e) => setForm((f) => ({ ...f, value: parseInt(e.target.value) || 0 }))}
                    className="w-full h-10 rounded-lg border border-stone-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    min={1}
                    max={form.type === "PERCENTAGE" ? 100 : undefined}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">
                    Min. bestelling (EUR)
                  </label>
                  <input
                    type="number"
                    value={form.minOrderCents}
                    onChange={(e) => setForm((f) => ({ ...f, minOrderCents: e.target.value }))}
                    className="w-full h-10 rounded-lg border border-stone-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="Optioneel"
                    step="0.01"
                    min={0}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">
                    Max gebruik
                  </label>
                  <input
                    type="number"
                    value={form.maxUsages}
                    onChange={(e) => setForm((f) => ({ ...f, maxUsages: e.target.value }))}
                    className="w-full h-10 rounded-lg border border-stone-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="Onbeperkt"
                    min={1}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">
                  Vervaldatum
                </label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                  className="w-full h-10 rounded-lg border border-stone-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="rounded border-stone-300 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm text-stone-700">Actief</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setDialogOpen(false)}
                className="h-10 px-4 rounded-lg border border-stone-300 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Annuleren
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.code || !form.value}
                className="h-10 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Opslaan..." : editingId ? "Bijwerken" : "Aanmaken"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-2">
              Code verwijderen?
            </h2>
            <p className="text-sm text-stone-500 mb-6">
              Weet je zeker dat je deze kortingscode wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="h-10 px-4 rounded-lg border border-stone-300 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Annuleren
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="h-10 px-4 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Verwijderen..." : "Verwijderen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
