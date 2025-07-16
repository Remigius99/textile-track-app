import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

export const useProducts = (userId: string, storeId?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*')
        .eq('owner_id', userId);

      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const mappedProducts: Product[] = data.map(product => ({
        id: product.id,
        name: product.name,
        color: product.color,
        category: product.category,
        form: product.form,
        description: product.description || '',
        quantity: product.quantity,
        storeId: product.store_id,
        lastUpdated: new Date(product.updated_at)
      }));

      setProducts(mappedProducts);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'lastUpdated'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          color: productData.color,
          category: productData.category,
          form: productData.form as Database['public']['Enums']['product_form'],
          description: productData.description,
          quantity: productData.quantity,
          store_id: productData.storeId,
          owner_id: userId
        })
        .select()
        .single();

      if (error) throw error;

      const newProduct: Product = {
        id: data.id,
        name: data.name,
        color: data.color,
        category: data.category,
        form: data.form,
        description: data.description || '',
        quantity: data.quantity,
        storeId: data.store_id,
        lastUpdated: new Date(data.updated_at)
      };

      setProducts(prev => [newProduct, ...prev]);
      
      toast({
        title: "Success",
        description: "Product added successfully",
      });

      return newProduct;
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProductQuantity = async (productId: string, newQuantity: number) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ quantity: newQuantity })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, quantity: newQuantity, lastUpdated: new Date(data.updated_at) }
          : product
      ));

      toast({
        title: "Success",
        description: "Product quantity updated",
      });
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product quantity",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProducts();
    }
  }, [userId, storeId]);

  return {
    products,
    loading,
    addProduct,
    updateProductQuantity,
    refetch: fetchProducts
  };
};
