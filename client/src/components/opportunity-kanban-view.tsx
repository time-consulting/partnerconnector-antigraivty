import { useState, useCallback } from "react";
// import { useToast } from "@/hooks/use-toast"; // Temporarily disabled due to React hook violations
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DndContext, 
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  UserIcon,
  MailIcon,
  PhoneIcon,
  BuildingIcon,
  CalendarIcon,
  TrendingUpIcon,
  DollarSignIcon,
  EditIcon,
  FileTextIcon,
  Trash2Icon
} from "lucide-react";
import type { Opportunity } from "@shared/schema";

// Opportunity Kanban columns configuration - custom lead progression stages
const KANBAN_COLUMNS = [
  { 
    id: "new_contact", 
    title: "New Contact", 
    count: 0,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  },
  { 
    id: "qualified", 
    title: "Qualified", 
    count: 0,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
  },
  { 
    id: "needs_analysis", 
    title: "Needs Analysis", 
    count: 0,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
  },
  { 
    id: "solution_proposed", 
    title: "Solution Proposed", 
    count: 0,
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
  },
  { 
    id: "submit_lead", 
    title: "Submit Lead", 
    count: 0,
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
  },
  { 
    id: "quote_received", 
    title: "Quote Received", 
    count: 0,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
  }
];

// Priority colors for opportunities
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "low": return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

// Draggable Opportunity Card Component
function OpportunityCard({ 
  opportunity, 
  onEditDetails,
  onDelete
}: { 
  opportunity: Opportunity; 
  onEditDetails: (opportunity: Opportunity) => void;
  onDelete: (opportunityId: string) => void;
}) {
  // const { toast } = useToast(); // Temporarily disabled due to React hook violations
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: opportunity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Handler for quick actions
  const handleCall = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (opportunity.contactPhone) {
      window.location.href = `tel:${opportunity.contactPhone}`;
    } else {
      console.log("No phone number available for this opportunity");
    }
  }, [opportunity.contactPhone]);

  const handleEmail = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (opportunity.contactEmail) {
      window.location.href = `mailto:${opportunity.contactEmail}?subject=Follow up regarding ${opportunity.businessName}`;
    } else {
      console.log("No email address available for this opportunity");
    }
  }, [opportunity.contactEmail, opportunity.businessName]);

  const formatCurrency = (value: string) => {
    if (!value) return "—";
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return `£${num.toLocaleString()}`;
  };

  const getContactName = () => {
    const firstName = opportunity.contactFirstName || "";
    const lastName = opportunity.contactLastName || "";
    return `${firstName} ${lastName}`.trim() || "No contact name";
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-gradient-to-br from-white to-slate-50 dark:from-gray-800 dark:to-gray-900 
        rounded-xl border-0 shadow-lg hover:shadow-2xl cursor-pointer
        transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1
        ${isDragging ? 'opacity-50 rotate-3 scale-105' : ''}
        ${isDragging ? 'ring-2 ring-purple-400' : ''}
      `}
      data-testid={`opportunity-card-${opportunity.id}`}
      onClick={() => onEditDetails(opportunity)}
    >
      <div className="p-5 space-y-4">
        {/* Drag handle area */}
        <div {...attributes} {...listeners} className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-1 truncate">
                {opportunity.businessName}
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Active Deal
                </span>
                {opportunity.dealId && (
                  <>
                    <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                      {opportunity.dealId}
                    </span>
                  </>
                )}
              </div>
            </div>
            {opportunity.priority && (
              <Badge 
                className={`${getPriorityColor(opportunity.priority)} text-xs px-2 py-1 rounded-full font-semibold border-0 shadow-sm`}
                variant="secondary"
              >
                {opportunity.priority.toUpperCase()}
              </Badge>
            )}
          </div>

          {/* Contact Information Grid */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="truncate font-medium">{getContactName()}</span>
            </div>
            
            {opportunity.contactEmail && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <MailIcon className="h-3 w-3 flex-shrink-0 ml-2" />
                <span className="truncate">{opportunity.contactEmail}</span>
              </div>
            )}
            
            {opportunity.contactPhone && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <PhoneIcon className="h-3 w-3 flex-shrink-0 ml-2" />
                <span>{opportunity.contactPhone}</span>
              </div>
            )}
            
            {opportunity.businessType && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <BuildingIcon className="h-3 w-3 flex-shrink-0 ml-2" />
                <span>{opportunity.businessType}</span>
              </div>
            )}
          </div>

          {/* Value Information */}
          {(opportunity.estimatedValue || opportunity.currentMonthlyVolume) && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 space-y-2">
              {opportunity.estimatedValue && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSignIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Deal Value</span>
                  </div>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(opportunity.estimatedValue)}
                  </span>
                </div>
              )}

              {opportunity.currentMonthlyVolume && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUpIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Monthly</span>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(opportunity.currentMonthlyVolume)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Stage and Timeline */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {opportunity.stage && (
                <Badge className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 dark:from-indigo-900 dark:to-purple-900 dark:text-indigo-200 text-xs px-2 py-1 rounded-full font-semibold border-0">
                  {opportunity.stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <CalendarIcon className="h-3 w-3" />
              <span className="font-medium">
                {opportunity.expectedCloseDate ? 
                  new Date(opportunity.expectedCloseDate).toLocaleDateString() : 
                  'No date'
                }
              </span>
            </div>
          </div>

          {opportunity.notes && (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg p-3 border-l-3 border-amber-400">
              <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 font-medium">
                {opportunity.notes}
              </p>
            </div>
          )}

          {opportunity.assignedTo && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">Assigned to:</span>
              <span className="truncate bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{opportunity.assignedTo}</span>
            </div>
          )}
        </div>

        {/* Modern Action Buttons - Non-draggable */}
        <div className="border-t border-gradient-to-r from-gray-100 to-slate-200 dark:from-gray-700 dark:to-gray-800 pt-4 mt-4">
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-9 px-2 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 
                        text-green-700 hover:text-green-800 dark:from-green-900/20 dark:to-emerald-900/20 
                        dark:hover:from-green-800/30 dark:hover:to-emerald-800/30 dark:text-green-400 dark:hover:text-green-300
                        rounded-lg border-0 font-semibold transition-all duration-200 transform hover:scale-105"
              onClick={(e) => { e.stopPropagation(); handleCall(e); }}
              data-testid={`button-call-${opportunity.id}`}
              disabled={!opportunity.contactPhone}
              title={opportunity.contactPhone ? `Call ${opportunity.contactPhone}` : "No phone number"}
            >
              <PhoneIcon className="h-4 w-4 mr-1" />
              Call
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="h-9 px-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 
                        text-blue-700 hover:text-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20 
                        dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 dark:text-blue-400 dark:hover:text-blue-300
                        rounded-lg border-0 font-semibold transition-all duration-200 transform hover:scale-105"
              onClick={(e) => { e.stopPropagation(); handleEmail(e); }}
              data-testid={`button-email-${opportunity.id}`}
              disabled={!opportunity.contactEmail}
              title={opportunity.contactEmail ? `Email ${opportunity.contactEmail}` : "No email address"}
            >
              <MailIcon className="h-4 w-4 mr-1" />
              Email
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="h-9 px-2 bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 
                        text-purple-700 hover:text-purple-800 dark:from-purple-900/20 dark:to-violet-900/20 
                        dark:hover:from-purple-800/30 dark:hover:to-violet-800/30 dark:text-purple-400 dark:hover:text-purple-300
                        rounded-lg border-0 font-semibold transition-all duration-200 transform hover:scale-105"
              onClick={(e) => { e.stopPropagation(); onEditDetails(opportunity); }}
              data-testid={`button-proposal-${opportunity.id}`}
              title="Create Proposal"
            >
              <FileTextIcon className="h-4 w-4 mr-1" />
              Proposal
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="h-9 px-2 bg-gradient-to-r from-gray-50 to-slate-100 hover:from-gray-100 hover:to-slate-200 
                        text-gray-700 hover:text-gray-800 dark:from-gray-800/50 dark:to-slate-800/50 
                        dark:hover:from-gray-700/60 dark:hover:to-slate-700/60 dark:text-gray-300 dark:hover:text-gray-200
                        rounded-lg border-0 font-semibold transition-all duration-200 transform hover:scale-105"
              onClick={(e) => {
                e.stopPropagation();
                onEditDetails(opportunity);
              }}
              data-testid={`button-edit-${opportunity.id}`}
              title="Edit Details"
            >
              <EditIcon className="h-4 w-4 mr-1" />
              Edit
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="h-9 px-2 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 
                        text-red-700 hover:text-red-800 dark:from-red-900/20 dark:to-rose-900/20 
                        dark:hover:from-red-800/30 dark:hover:to-rose-800/30 dark:text-red-400 dark:hover:text-red-300
                        rounded-lg border-0 font-semibold transition-all duration-200 transform hover:scale-105"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete the opportunity for ${opportunity.businessName}?`)) {
                  onDelete(opportunity.id);
                }
              }}
              data-testid={`button-delete-${opportunity.id}`}
              title="Delete Opportunity"
            >
              <Trash2Icon className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Kanban Column Component for Opportunities
function OpportunityColumn({ 
  column, 
  opportunities, 
  isLoading,
  onEditDetails,
  onDelete
}: { 
  column: typeof KANBAN_COLUMNS[0], 
  opportunities: Opportunity[], 
  isLoading: boolean,
  onEditDetails: (opportunity: Opportunity) => void,
  onDelete: (opportunityId: string) => void
}) {
  const columnOpportunities = opportunities.filter(opportunity => opportunity.status === column.id);
  
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  
  // Calculate total value for the column
  const totalValue = columnOpportunities.reduce((sum, opp) => {
    const value = parseFloat(opp.estimatedValue || "0");
    return sum + (isNaN(value) ? 0 : value);
  }, 0);
  
  return (
    <div className="flex-shrink-0 w-80">
      <Card className={`h-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${isOver ? 'ring-2 ring-purple-500 bg-purple-50/50 dark:bg-purple-950/50 transform scale-105' : ''}`}>
        {/* Modern Column Header with Gradient */}
        <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-t-xl">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-8 rounded-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  {column.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {columnOpportunities.length} opportunities
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={`${column.color} text-xs px-3 py-1 rounded-full font-semibold border-0`}>
                {columnOpportunities.length}
              </Badge>
              {totalValue > 0 && (
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Value</p>
                  <span className="text-sm text-green-600 dark:text-green-400 font-bold">
                    £{totalValue.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 p-4">
          <ScrollArea className="h-[600px] pr-2">
            <div ref={setNodeRef} className="min-h-full">
              <SortableContext
                items={columnOpportunities.map(opportunity => opportunity.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4" data-testid={`column-${column.id}`}>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-4 animate-pulse">
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))
                  ) : columnOpportunities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center mb-4">
                        <DollarSignIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">No opportunities yet</p>
                      {isOver && (
                        <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg px-4 py-2 border-2 border-dashed border-purple-300 dark:border-purple-700">
                          <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                            Drop opportunity here
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    columnOpportunities.map((opportunity) => (
                      <OpportunityCard key={opportunity.id} opportunity={opportunity} onEditDetails={onEditDetails} onDelete={onDelete} />
                    ))
                  )}
                </div>
              </SortableContext>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

interface OpportunityKanbanViewProps {
  opportunities: Opportunity[];
  isLoading: boolean;
  onEditDetails: (opportunity: Opportunity) => void;
  onDelete: (opportunityId: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export default function OpportunityKanbanView({ 
  opportunities, 
  isLoading, 
  onEditDetails, 
  onDelete,
  onDragEnd 
}: OpportunityKanbanViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    onDragEnd(event);
  };

  const activeOpportunity = activeId ? opportunities.find(opportunity => opportunity.id === activeId) : null;

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 rounded-2xl" data-testid="opportunity-kanban-view">
      {/* Kanban Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-2">
          Sales Pipeline
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Drag opportunities between stages to update their status
        </p>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-8 pb-4 min-w-max px-2">
            {KANBAN_COLUMNS.map((column) => (
              <OpportunityColumn
                key={column.id}
                column={column}
                opportunities={opportunities}
                isLoading={isLoading}
                onEditDetails={onEditDetails}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
        
        <DragOverlay>
          {activeOpportunity ? (
            <div className="transform rotate-6 scale-105">
              <OpportunityCard opportunity={activeOpportunity} onEditDetails={onEditDetails} onDelete={onDelete} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}