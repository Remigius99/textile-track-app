
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Download, Search, Filter, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/user";
import * as XLSX from 'xlsx';

interface ActivityLog {
  id: string;
  action: string;
  user_id: string;
  product_id?: string;
  store_id?: string;
  quantity_change?: number;
  previous_quantity?: number;
  new_quantity?: number;
  timestamp: string;
  details?: any;
  user_name?: string;
  product_name?: string;
  store_name?: string;
}

interface ActivityHistoryProps {
  user: User;
}

const ActivityHistory = ({ user }: ActivityHistoryProps) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const { toast } = useToast();

  const fetchActivities = async () => {
    try {
      setLoading(true);
      console.log('Fetching activities for user:', user.id);

      // Check if user has Supabase auth
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        console.log('No authenticated user, using demo mode');
        setActivities([]);
        return;
      }

      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          products (name),
          stores (name)
        `);

      // Apply date filters
      if (dateFrom) {
        query = query.gte('timestamp', dateFrom.toISOString());
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query = query.lte('timestamp', endDate.toISOString());
      }

      const { data, error } = await query.order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }

      console.log('Activities fetched:', data);

      const mappedActivities: ActivityLog[] = data.map(activity => ({
        id: activity.id,
        action: activity.action,
        user_id: activity.user_id,
        product_id: activity.product_id,
        store_id: activity.store_id,
        quantity_change: activity.quantity_change,
        previous_quantity: activity.previous_quantity,
        new_quantity: activity.new_quantity,
        timestamp: activity.timestamp,
        details: activity.details,
        product_name: activity.products?.name,
        store_name: activity.stores?.name
      }));

      setActivities(mappedActivities);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      toast({
        title: "Error",
        description: "Failed to load activity history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [user.id, dateFrom, dateTo]);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = !searchTerm || 
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.store_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === "all" || activity.action.toLowerCase().includes(actionFilter.toLowerCase());
    
    return matchesSearch && matchesAction;
  });

  const exportToExcel = () => {
    try {
      const exportData = filteredActivities.map(activity => ({
        'Date': format(new Date(activity.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        'Action': activity.action,
        'Product': activity.product_name || 'N/A',
        'Store': activity.store_name || 'N/A',
        'Previous Quantity': activity.previous_quantity || 'N/A',
        'New Quantity': activity.new_quantity || 'N/A',
        'Quantity Change': activity.quantity_change || 'N/A',
        'Details': activity.details ? JSON.stringify(activity.details) : 'N/A'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Activity Report");
      
      const fileName = `activity-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast({
        title: "Success",
        description: "Activity report exported successfully",
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: "Error",
        description: "Failed to export report",
        variant: "destructive",
      });
    }
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('added')) return 'default';
    if (action.includes('restocked')) return 'secondary';
    if (action.includes('removed')) return 'destructive';
    return 'outline';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading activity history...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-start md:space-y-0 md:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Activity History</h2>
          <p className="text-sm text-blue-200 mt-1">View and export all inventory activities</p>
        </div>
        <Button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 flex-shrink-0">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export to Excel
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search" className="text-white text-sm">Search</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="action" className="text-white text-sm">Action Type</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">All Actions</SelectItem>
                  <SelectItem value="added" className="text-white hover:bg-slate-700">Product Added</SelectItem>
                  <SelectItem value="restocked" className="text-white hover:bg-slate-700">Restocked</SelectItem>
                  <SelectItem value="removed" className="text-white hover:bg-slate-700">Removed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white text-sm">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1 bg-white/10 border-white/20 text-white hover:bg-white/20",
                      !dateFrom && "text-white/50"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-white text-sm">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1 bg-white/10 border-white/20 text-white hover:bg-white/20",
                      !dateTo && "text-white/50"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities Table */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white">No activities found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead className="text-white">Date & Time</TableHead>
                    <TableHead className="text-white">Action</TableHead>
                    <TableHead className="text-white">Product</TableHead>
                    <TableHead className="text-white">Store</TableHead>
                    <TableHead className="text-white">Previous Qty</TableHead>
                    <TableHead className="text-white">New Qty</TableHead>
                    <TableHead className="text-white">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity) => (
                    <TableRow key={activity.id} className="border-white/10">
                      <TableCell className="text-white text-sm">
                        {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadgeVariant(activity.action)}>
                          {activity.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white text-sm">
                        {activity.product_name || 'N/A'}
                      </TableCell>
                      <TableCell className="text-white text-sm">
                        {activity.store_name || 'N/A'}
                      </TableCell>
                      <TableCell className="text-white text-sm">
                        {activity.previous_quantity ?? 'N/A'}
                      </TableCell>
                      <TableCell className="text-white text-sm">
                        {activity.new_quantity ?? 'N/A'}
                      </TableCell>
                      <TableCell className="text-white text-sm">
                        {activity.quantity_change ? (
                          <span className={activity.quantity_change > 0 ? 'text-green-400' : 'text-red-400'}>
                            {activity.quantity_change > 0 ? '+' : ''}{activity.quantity_change}
                          </span>
                        ) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityHistory;
