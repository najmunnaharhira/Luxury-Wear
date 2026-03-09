import { useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import ProductImageUpload from "@/components/admin/ProductImageUpload";
import { useToast } from "@/hooks/use-toast";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  Product,
  ProductInsert,
} from "@/hooks/useProducts";

const emptyForm: ProductInsert = {
  name: "",
  price: "",
  original_price: "",
  description: "",
  details: [],
  images: [],
  sizes: [],
  category: "",
  is_new: false,
  is_sale: false,
};

const AdminProducts = () => {
  const { data: products = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductInsert>(emptyForm);
  const [detailsText, setDetailsText] = useState("");
  
  const [sizesText, setSizesText] = useState("");

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDetailsText("");
    
    setSizesText("");
    setIsFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      original_price: product.original_price ?? "",
      description: product.description,
      details: product.details,
      images: product.images,
      sizes: product.sizes,
      category: product.category,
      is_new: product.is_new,
      is_sale: product.is_sale,
    });
    setDetailsText(product.details.join("\n"));
    
    setSizesText(product.sizes.join(", "));
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ProductInsert = {
      ...form,
      details: detailsText.split("\n").map((s) => s.trim()).filter(Boolean),
      images: form.images,
      sizes: sizesText.split(",").map((s) => s.trim()).filter(Boolean),
      original_price: form.original_price || null,
    };

    try {
      if (editingId) {
        await updateProduct.mutateAsync({ id: editingId, ...payload });
        toast({ title: "Product updated" });
      } else {
        await createProduct.mutateAsync(payload);
        toast({ title: "Product created" });
      }
      setIsFormOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast({ title: "Product deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <h2 className="font-display text-3xl font-semibold text-foreground mb-8">Products</h2>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-3xl font-semibold text-foreground">Products</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background font-body text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-xl font-semibold text-foreground">
                {editingId ? "Edit Product" : "New Product"}
              </h3>
              <button type="button" onClick={() => setIsFormOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Price *</label>
                <input
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="€299"
                  className="w-full px-3 py-2 bg-background border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Original Price</label>
                <input
                  value={form.original_price ?? ""}
                  onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                  placeholder="€450"
                  className="w-full px-3 py-2 bg-background border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Category *</label>
                <input
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Boots"
                  className="w-full px-3 py-2 bg-background border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_new}
                    onChange={(e) => setForm({ ...form, is_new: e.target.checked })}
                    className="accent-foreground"
                  />
                  New
                </label>
                <label className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_sale}
                    onChange={(e) => setForm({ ...form, is_sale: e.target.checked })}
                    className="accent-foreground"
                  />
                  Sale
                </label>
              </div>

              <div className="col-span-2">
                <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
                />
              </div>

              <div className="col-span-2">
                <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Details (one per line)</label>
                <textarea
                  value={detailsText}
                  onChange={(e) => setDetailsText(e.target.value)}
                  rows={3}
                  placeholder={"100% Italian leather\nMade in Italy"}
                  className="w-full px-3 py-2 bg-background border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
                />
              </div>

              <div className="col-span-2">
                <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Images</label>
                <ProductImageUpload
                  images={form.images}
                  onChange={(imgs) => setForm({ ...form, images: imgs })}
                />
              </div>

              <div className="col-span-2">
                <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Sizes (comma-separated)</label>
                <input
                  value={sizesText}
                  onChange={(e) => setSizesText(e.target.value)}
                  placeholder="35, 36, 37, 38, 39, 40"
                  className="w-full px-3 py-2 bg-background border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createProduct.isPending || updateProduct.isPending}
                className="px-4 py-2 bg-foreground text-background font-body text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {createProduct.isPending || updateProduct.isPending ? "Saving…" : editingId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="text-left px-4 py-3 font-body text-xs tracking-widest uppercase text-muted-foreground">Image</th>
              <th className="text-left px-4 py-3 font-body text-xs tracking-widest uppercase text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 font-body text-xs tracking-widest uppercase text-muted-foreground">Category</th>
              <th className="text-left px-4 py-3 font-body text-xs tracking-widest uppercase text-muted-foreground">Price</th>
              <th className="text-left px-4 py-3 font-body text-xs tracking-widest uppercase text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 font-body text-xs tracking-widest uppercase text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border hover:bg-card/50 transition-colors">
                <td className="px-4 py-3">
                  {product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-accent" />
                  )}
                </td>
                <td className="px-4 py-3 font-body text-sm text-foreground">{product.name}</td>
                <td className="px-4 py-3 font-body text-sm text-muted-foreground">{product.category}</td>
                <td className="px-4 py-3 font-body text-sm text-foreground">{product.price}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 font-body text-xs ${product.is_new ? "bg-foreground text-background" : "bg-accent text-accent-foreground"}`}>
                    {product.is_new ? "New" : product.is_sale ? "Sale" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(product)}
                      className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
