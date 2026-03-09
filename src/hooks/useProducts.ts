import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: number;
  name: string;
  price: string;
  original_price?: string | null;
  originalPrice?: string | null;
  description: string;
  details: string[];
  images: string[];
  sizes: string[];
  category: string;
  is_new: boolean;
  isNew?: boolean;
  is_sale: boolean;
  isSale?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ProductInsert = {
  name: string;
  price: string;
  original_price?: string | null;
  description: string;
  details: string[];
  images: string[];
  sizes: string[];
  category: string;
  is_new: boolean;
  is_sale: boolean;
};

/** Map DB row to product with camelCase aliases */
const mapProduct = (row: any): Product => ({
  ...row,
  originalPrice: row.original_price,
  isNew: row.is_new,
  isSale: row.is_sale,
});

const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapProduct);
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return mapProduct(data);
    },
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: ProductInsert) => {
      const { data, error } = await supabase
        .from("products")
        .insert(product as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProductInsert> & { id: number }) => {
      const { data, error } = await supabase
        .from("products")
        .update(updates as any)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
};
