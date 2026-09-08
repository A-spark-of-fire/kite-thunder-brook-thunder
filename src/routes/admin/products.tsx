import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ProductArt } from "@/components/brand/product-art";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { adminListProducts, adminSaveProduct } from "@/lib/server/admin";
import type { Product } from "@/lib/types";
import { inr } from "@/lib/utils";

export const Route = createFileRoute("/admin/products")({ component: AdminProductsPage });

const EMPTY = { name: "", sizeLabel: "", sizeMl: 0, unitPrice: 0, description: "", artKey: "jar20", isActive: true, sortOrder: 0 };

function AdminProductsPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-products"], queryFn: () => adminListProducts() });
  const [editing, setEditing] = useState<Partial<Product> & typeof EMPTY>(EMPTY);
  const save = useMutation({
    mutationFn: () => adminSaveProduct({
      data: {
        id: editing.id, name: editing.name, sizeLabel: editing.sizeLabel,
        sizeMl: Number(editing.sizeMl) || 0, unitPrice: Number(editing.unitPrice) || 0,
        description: editing.description, artKey: editing.artKey, isActive: Boolean(editing.isActive),
        sortOrder: Number(editing.sortOrder) || 0,
      },
    }),
    onSuccess: async () => {
      toast.success("Product saved"); setEditing(EMPTY);
      await qc.invalidateQueries({ queryKey: ["admin-products"] });
      await qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Products</h1>
      <ul className="space-y-2">
        {(q.data ?? []).map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => setEditing({ ...EMPTY, ...p })} className="flex w-full items-center gap-3 rounded-3xl border border-line bg-paper p-3 text-left">
              <ProductArt artKey={p.artKey} className="size-16 rounded-2xl" />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{p.name}</span>
                <span className="text-sm text-muted">{p.sizeLabel} · {inr(p.unitPrice)} · {p.isActive ? "Active" : "Hidden"}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Card className="space-y-3">
        <p className="font-display font-semibold">{editing.id ? "Edit product" : "Add product"}</p>
        <Field label="Name"><Input value={editing.name} onChange={(e) => setEditing((s) => ({ ...s, name: e.target.value }))} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Size label"><Input value={editing.sizeLabel} onChange={(e) => setEditing((s) => ({ ...s, sizeLabel: e.target.value }))} /></Field>
          <Field label="Price (₹)"><Input type="number" min={0} value={editing.unitPrice} onChange={(e) => setEditing((s) => ({ ...s, unitPrice: Number(e.target.value) }))} /></Field>
        </div>
        <Field label="Description"><Textarea value={editing.description} onChange={(e) => setEditing((s) => ({ ...s, description: e.target.value }))} /></Field>
        <Field label="Artwork">
          <select className="h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm" value={editing.artKey} onChange={(e) => setEditing((s) => ({ ...s, artKey: e.target.value }))}>
            <option value="jar20">20L jar</option><option value="jar10">10L jar</option><option value="bottle5">5L bottle</option><option value="pack1">Bottle pack</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={editing.isActive} onChange={(e) => setEditing((s) => ({ ...s, isActive: e.target.checked }))} /> Visible to customers
        </label>
        <div className="flex gap-2">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? "Saving…" : "Save product"}</Button>
          {editing.id ? <Button variant="secondary" onClick={() => setEditing(EMPTY)}>Cancel</Button> : null}
        </div>
      </Card>
    </div>
  );
}
