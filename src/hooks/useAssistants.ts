
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Assistant {
  id: string;
  assistant_id: string;
  business_owner_id: string;
  is_active: boolean;
  is_muted: boolean;
  store_access: string[];
  created_at: string;
  updated_at: string;
}

export const useAssistants = (businessOwnerId: string) => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAssistants = async () => {
    try {
      setLoading(true);
      console.log('Fetching assistants for businessOwnerId:', businessOwnerId);
      
      // Check if user has Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user, using demo mode');
        // Demo mode - no assistants for now
        setAssistants([]);
        return;
      }

      console.log('Authenticated user found, querying database');
      const { data, error } = await supabase
        .from('assistants')
        .select('*')
        .eq('business_owner_id', businessOwnerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database query error:', error);
        throw error;
      }

      console.log('Database assistants loaded:', data);
      setAssistants(data || []);
    } catch (error: any) {
      console.error('Error fetching assistants:', error);
      toast({
        title: "Error",
        description: "Failed to load assistants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useAssistants useEffect triggered, businessOwnerId:', businessOwnerId);
    if (businessOwnerId) {
      fetchAssistants();
    }
  }, [businessOwnerId]);

  return {
    assistants,
    loading,
    refetch: fetchAssistants
  };
};
