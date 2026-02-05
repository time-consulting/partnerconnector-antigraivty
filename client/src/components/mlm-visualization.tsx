import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Network, 
  Users, 
  User, 
  Crown,
  ChevronDown,
  ChevronRight,
  Building,
  Search,
  Filter
} from "lucide-react";

interface TreeUser {
  id: string;
  name: string;
  email: string;
  partnerId: string;
  parentPartnerId: string | null;
  directRecruits: number;
  totalDownline: number;
  totalReferrals: number;
  totalCommissions: number;
}

interface MlmVisualizationProps {
  userId?: string;
}

export default function MlmVisualization({ userId }: MlmVisualizationProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "roots" | "connected">("all");

  // Fetch all users with MLM data
  const { data: allUsers = [], isLoading } = useQuery<TreeUser[]>({
    queryKey: ['/api/admin/mlm-tree-data'],
  });

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // Get children of a user
  const getChildren = (userId: string) => {
    return allUsers.filter(u => u.parentPartnerId === userId);
  };

  // Get root users (no parent or parent not in system)
  const getRootUsers = () => {
    return allUsers.filter(u => !u.parentPartnerId || !allUsers.find(parent => parent.id === u.parentPartnerId));
  };

  // Filter users based on search and filter type
  const getFilteredRoots = () => {
    let roots = getRootUsers();

    if (filterType === "roots") {
      // Already filtered to roots
    } else if (filterType === "connected") {
      roots = roots.filter(u => u.directRecruits > 0);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      // Filter roots that match search or have children matching search
      roots = roots.filter(u => 
        u.name.toLowerCase().includes(search) ||
        u.partnerId.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        hasMatchingDescendant(u.id, search)
      );
    }

    return roots;
  };

  // Check if user or any descendant matches search
  const hasMatchingDescendant = (userId: string, search: string): boolean => {
    const children = getChildren(userId);
    return children.some(child => 
      child.name.toLowerCase().includes(search) ||
      child.partnerId.toLowerCase().includes(search) ||
      child.email.toLowerCase().includes(search) ||
      hasMatchingDescendant(child.id, search)
    );
  };

  // Check if user matches search
  const matchesSearch = (user: TreeUser): boolean => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return user.name.toLowerCase().includes(search) ||
           user.partnerId.toLowerCase().includes(search) ||
           user.email.toLowerCase().includes(search);
  };

  const renderUserNode = (user: TreeUser, depth = 0) => {
    const children = getChildren(user.id);
    const isExpanded = expandedNodes.has(user.id);
    const hasChildren = children.length > 0;
    const isRoot = depth === 0;
    const highlight = matchesSearch(user);

    return (
      <div key={user.id} className="mb-1">
        <div 
          className={`border rounded-lg p-3 transition-all duration-200 hover:shadow-md ${
            highlight ? 'bg-yellow-50 border-yellow-300' : 'bg-white border-gray-200'
          }`}
          style={{ marginLeft: depth * 32 }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Expand/Collapse Button */}
              {hasChildren ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(user.id)}
                  className="p-1 h-7 w-7 shrink-0"
                  data-testid={`button-expand-${user.partnerId}`}
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              ) : (
                <div className="w-7 h-7 shrink-0" />
              )}
              
              {/* User Icon */}
              {isRoot ? (
                <Crown className="w-5 h-5 text-yellow-600 shrink-0" />
              ) : (
                <User className="w-5 h-5 text-gray-500 shrink-0" />
              )}
              
              {/* User Info */}
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 truncate">{user.name}</div>
                <div className="text-xs text-gray-500 truncate">{user.partnerId}</div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Users className="w-3 h-3" />
                  <span>{user.directRecruits} direct</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Building className="w-3 h-3" />
                  <span>{user.totalReferrals} deals</span>
                </div>
              </div>
              
              {user.totalCommissions > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  £{user.totalCommissions.toFixed(0)}
                </Badge>
              )}
            </div>
          </div>

          {/* Show direct recruits count */}
          {hasChildren && !isExpanded && (
            <div className="mt-2 ml-9 text-xs text-gray-500">
              {children.length} direct recruit{children.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Render children when expanded */}
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {children.map(child => renderUserNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredRoots = getFilteredRoots();
  const totalNetworkSize = allUsers.length;
  const totalRootsCount = getRootUsers().length;

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Network className="w-6 h-6 text-purple-600" />
            MLM Referral Tree
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading network tree...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Network className="w-6 h-6 text-purple-600" />
          MLM Referral Tree
        </CardTitle>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-blue-600 font-medium">Total Partners</div>
            <div className="text-2xl font-bold text-blue-700">{totalNetworkSize}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs text-green-600 font-medium">Root Partners</div>
            <div className="text-2xl font-bold text-green-700">{totalRootsCount}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xs text-purple-600 font-medium">Active Trees</div>
            <div className="text-2xl font-bold text-purple-700">
              {getRootUsers().filter(u => u.directRecruits > 0).length}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Search and Filter */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, partner ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-tree"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
              data-testid="button-filter-all"
            >
              <Filter className="w-4 h-4 mr-1" />
              All
            </Button>
            <Button
              variant={filterType === "roots" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("roots")}
              data-testid="button-filter-roots"
            >
              Roots Only
            </Button>
            <Button
              variant={filterType === "connected" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("connected")}
              data-testid="button-filter-connected"
            >
              With Teams
            </Button>
          </div>
        </div>

        {/* Tree Display */}
        <div className="space-y-1 max-h-[600px] overflow-y-auto">
          {filteredRoots.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Network className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700 mb-1">No Partners Found</h3>
              <p className="text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search term' : 'No partners in the network yet'}
              </p>
            </div>
          ) : (
            <>
              {filteredRoots.map(root => renderUserNode(root, 0))}
            </>
          )}
        </div>

        {/* Quick Actions */}
        {filteredRoots.length > 0 && (
          <div className="mt-6 flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {filteredRoots.length} root partner{filteredRoots.length !== 1 ? 's' : ''}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const allIds = new Set<string>();
                  const addIds = (userId: string) => {
                    allIds.add(userId);
                    getChildren(userId).forEach(child => addIds(child.id));
                  };
                  filteredRoots.forEach(root => addIds(root.id));
                  setExpandedNodes(allIds);
                }}
                data-testid="button-expand-all"
              >
                <ChevronDown className="w-4 h-4 mr-1" />
                Expand All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpandedNodes(new Set())}
                data-testid="button-collapse-all"
              >
                <ChevronRight className="w-4 h-4 mr-1" />
                Collapse All
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}