
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Activity {
  id: string;
  user_id: string;
  action: string;
  product_id: string | null;
  store_id: string | null;
  quantity_change: number | null;
  previous_quantity: number | null;
  new_quantity: number | null;
  details: any;
  timestamp: string;
}

export const useActivities = (userId: string) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchActivities = async () => {
    try {
      setLoading(true);
      console.log('Fetching activities for userId:', userId);
      
      // Check if user has Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user, using demo mode');
        // Demo mode - mock activities
        const mockActivities = [
          {
            id: "1",
            user_id: userId,
            action: "Product removed",
            product_id: "demo-product-1",
            store_id: "demo-store-1",
            quantity_change: -10,
            previous_quantity: 150,
            new_quantity: 140,
            details: { product_name: "Silk Fabric" },
            timestamp: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: "2",
            user_id: userId,
            action: "Product removed",
            product_id: "demo-product-2",
            store_id: "demo-store-1",
            quantity_change: -5,
            previous_quantity: 25,
            new_quantity: 20,
            details: { product_name: "Canvas Material" },
            timestamp: new Date(Date.now() - 7200000).toISOString()
          }
        ];
        setActivities(mockActivities);
        return;
      }

      console.log('Authenticated user found, querying database');
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Database query error:', error);
        throw error;
      }

      console.log('Database activities loaded:', data);
      setActivities(data || []);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      toast({
        title: "Error",
        description: "Failed to load activities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useActivities useEffect triggered, userId:', userId);
    if (userId) {
      fetchActivities();
    }
  }, [userId]);

  return {
    activities,
    loading,
    refetch: fetchActivities
  };
};
