
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
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedStores: Store[] = data.map(store => ({
        id: store.id,
        name: store.name,
        location: store.location,
        description: store.description || '',
        ownerId: store.owner_id
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
      const { data, error } = await supabase
        .from('stores')
        .insert({
          name: storeData.name,
          location: storeData.location,
          description: storeData.description,
          owner_id: userId
        })
        .select()
        .single();

      if (error) throw error;

      const newStore: Store = {
        id: data.id,
        name: data.name,
        location: data.location,
        description: data.description || '',
        ownerId: data.owner_id
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
