
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Store } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

export const useStores = (userId: string) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStores = async () => {
    try {
      setLoading(true);
      console.log('Fetching stores for userId:', userId);
      
      // Check if user has Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user, using demo mode');
        // Demo mode - use localStorage
        const storedStores = localStorage.getItem('demo_stores');
        if (storedStores) {
          const stores = JSON.parse(storedStores);
          console.log('Demo stores loaded:', stores);
          setStores(stores);
        } else {
          console.log('No demo stores found, creating default stores');
          // Initialize with demo stores
          const demoStores: Store[] = [
            {
              id: 'demo-store-1',
              name: 'Store A - NMB Branch',
              location: 'Near NMB Bank, Kariakoo',
              description: 'Main textile store with premium fabrics',
              ownerId: userId,
              isActive: true
            },
            {
              id: 'demo-store-2', 
              name: 'Store B - Msimbazi',
              location: 'Msimbazi Street, Kariakoo',
              description: 'Cotton and silk specialty store',
              ownerId: userId,
              isActive: true
            }
          ];
          localStorage.setItem('demo_stores', JSON.stringify(demoStores));
          setStores(demoStores);
        }
        return;
      }

      console.log('Authenticated user found, querying database');
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database query error:', error);
        throw error;
      }

      console.log('Database stores loaded:', data);

      const mappedStores: Store[] = data.map(store => ({
        id: store.id,
        name: store.name,
        location: store.location,
        description: store.description || '',
        ownerId: store.owner_id,
        isActive: store.is_active ?? true
      }));

      setStores(mappedStores);
    } catch (error: any) {
      console.error('Error fetching stores:', error);
      toast({
        title: "Error",
        description: "Failed to load stores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addStore = async (storeData: Omit<Store, 'id' | 'ownerId'>) => {
    try {
      console.log('Adding store:', storeData);
      
      // Check if user has Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('Adding store in demo mode');
        // Demo mode - use localStorage
        const newStore: Store = {
          id: `demo-store-${Date.now()}`,
          ...storeData,
          ownerId: userId,
          isActive: storeData.isActive ?? true
        };

        const storedStores = localStorage.getItem('demo_stores');
        const allStores = storedStores ? JSON.parse(storedStores) : [];
        allStores.push(newStore);
        localStorage.setItem('demo_stores', JSON.stringify(allStores));
        
        setStores(prev => [newStore, ...prev]);
        
        toast({
          title: "Success",
          description: "Store added successfully (Demo Mode)",
        });

        return newStore;
      }

      console.log('Adding store to database');
      const { data, error } = await supabase
        .from('stores')
        .insert({
          name: storeData.name,
          location: storeData.location,
          description: storeData.description,
          owner_id: userId,
          is_active: storeData.isActive ?? true
        })
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }

      console.log('Store added to database:', data);

      const newStore: Store = {
        id: data.id,
        name: data.name,
        location: data.location,
        description: data.description || '',
        ownerId: data.owner_id,
        isActive: data.is_active ?? true
      };

      setStores(prev => [newStore, ...prev]);
      
      toast({
        title: "Success",
        description: "Store added successfully",
      });

      return newStore;
    } catch (error: any) {
      console.error('Error adding store:', error);
      toast({
        title: "Error",
        description: "Failed to add store",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    console.log('useStores useEffect triggered, userId:', userId);
    if (userId) {
      fetchStores();
    }
  }, [userId]);

  return {
    stores,
    loading,
    addStore,
    refetch: fetchStores
  };
};
