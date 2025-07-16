
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
      console.log('Fetching products for userId:', userId, 'storeId:', storeId);
      
      // Check if user has Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user, using demo mode');
        // Demo mode - use localStorage
        const storedProducts = localStorage.getItem('demo_products');
        if (storedProducts) {
          const allProducts = JSON.parse(storedProducts);
          const filteredProducts = storeId 
            ? allProducts.filter((p: Product) => p.storeId === storeId)
            : allProducts.filter((p: Product) => p.ownerId === userId);
          console.log('Demo products loaded:', filteredProducts);
          setProducts(filteredProducts);
        } else {
          console.log('No demo products found');
          setProducts([]);
        }
        return;
      }

      console.log('Authenticated user found, querying database');
      let query = supabase
        .from('products')
        .select('*')
        .eq('owner_id', userId);

      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Database query error:', error);
        throw error;
      }

      console.log('Database products loaded:', data);

      const mappedProducts: Product[] = data.map(product => ({
        id: product.id,
        name: product.name,
        color: product.color,
        category: product.category,
        form: product.form,
        description: product.description || '',
        quantity: product.quantity,
        storeId: product.store_id,
        ownerId: product.owner_id,
        lastUpdated: new Date(product.updated_at || product.created_at)
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
      console.log('Adding product:', productData);
      
      // Check if user has Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('Adding product in demo mode');
        // Demo mode - use localStorage
        const newProduct: Product = {
          id: `demo-product-${Date.now()}`,
          ...productData,
          lastUpdated: new Date()
        };

        const storedProducts = localStorage.getItem('demo_products');
        const allProducts = storedProducts ? JSON.parse(storedProducts) : [];
        allProducts.push(newProduct);
        localStorage.setItem('demo_products', JSON.stringify(allProducts));
        
        setProducts(prev => [newProduct, ...prev]);
        
        toast({
          title: "Success",
          description: "Product added successfully (Demo Mode)",
        });

        return newProduct;
      }

      console.log('Adding product to database');
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
          owner_id: productData.ownerId
        })
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }

      console.log('Product added to database:', data);

      const newProduct: Product = {
        id: data.id,
        name: data.name,
        color: data.color,
        category: data.category,
        form: data.form,
        description: data.description || '',
        quantity: data.quantity,
        storeId: data.store_id,
        ownerId: data.owner_id,
        lastUpdated: new Date(data.updated_at || data.created_at)
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
      console.log('Updating product quantity:', productId, 'to:', newQuantity);
      
      // Check if user has Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('Updating product quantity in demo mode');
        // Demo mode - use localStorage
        const storedProducts = localStorage.getItem('demo_products');
        if (storedProducts) {
          const allProducts = JSON.parse(storedProducts);
          const updatedProducts = allProducts.map((p: Product) => 
            p.id === productId 
              ? { ...p, quantity: newQuantity, lastUpdated: new Date() }
              : p
          );
          localStorage.setItem('demo_products', JSON.stringify(updatedProducts));
          
          setProducts(prev => prev.map(product => 
            product.id === productId 
              ? { ...product, quantity: newQuantity, lastUpdated: new Date() }
              : product
          ));

          toast({
            title: "Success",
            description: "Product quantity updated (Demo Mode)",
          });
        }
        return;
      }

      console.log('Updating product quantity in database');
      const { data, error } = await supabase
        .from('products')
        .update({ quantity: newQuantity })
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      console.log('Product quantity updated in database:', data);

      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, quantity: newQuantity, lastUpdated: new Date(data.updated_at || Date.now()) }
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
    console.log('useProducts useEffect triggered, userId:', userId, 'storeId:', storeId);
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
