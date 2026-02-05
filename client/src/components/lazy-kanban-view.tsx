import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
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
  ClipboardListIcon,
  EditIcon,
  FileTextIcon
} from "lucide-react";
import type { Lead } from "@shared/schema";

// Kanban columns configuration
const KANBAN_COLUMNS = [
  { 
    id: "uploaded", 
    title: "My Leads", 
    count: 0,
    color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  },
  { 
    id: "contacted", 
    title: "Contacted", 
    count: 0,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  },
  { 
    id: "interested", 
    title: "Submitted", 
    count: 0,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
  },
  { 
    id: "quoted", 
    title: "Quote Received", 
    count: 0,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
  },
  { 
    id: "converted", 
    title: "Agreed", 
    count: 0,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
  },
];

// Priority colors
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "low": return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

// Draggable Lead Card Component
function LeadCard({ lead, onEditDetails }: { lead: Lead; onEditDetails: (lead: Lead) => void }) {
  const { toast } = useToast();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Handler for quick actions
  const handleCall = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (lead.contactPhone) {
      window.location.href = `tel:${lead.contactPhone}`;
    } else {
      toast({
        title: "No Phone Number",
        description: "This lead doesn't have a phone number.",
        variant: "destructive",
      });
    }
  }, [lead.contactPhone, toast]);

  const handleEmail = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (lead.contactEmail) {
      window.location.href = `mailto:${lead.contactEmail}?subject=Follow up from ${lead.businessName}`;
    } else {
      toast({
        title: "No Email Address",
        description: "This lead doesn't have an email address.",
        variant: "destructive",
      });
    }
  }, [lead.contactEmail, lead.businessName, toast]);

  const handleQuoteRequest = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEditDetails(lead);
  }, [lead, onEditDetails]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm cursor-pointer
        hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all
        ${isDragging ? 'opacity-50' : ''}
      `}
      data-testid={`lead-card-${lead.id}`}
      onClick={() => onEditDetails(lead)}
    >
      <div className="space-y-3">
        {/* Drag handle area */}
        <div {...attributes} {...listeners} className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
              {lead.businessName}
            </h3>
            {lead.priority && (
              <Badge 
                className={`${getPriorityColor(lead.priority)} text-xs`}
                variant="secondary"
              >
                {lead.priority}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <UserIcon className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{lead.contactName}</span>
            </div>
            
            {lead.contactEmail && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <MailIcon className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{lead.contactEmail}</span>
              </div>
            )}
            
            {lead.contactPhone && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <PhoneIcon className="h-3 w-3 flex-shrink-0" />
                <span>{lead.contactPhone}</span>
              </div>
            )}
            
            {lead.businessType && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <BuildingIcon className="h-3 w-3 flex-shrink-0" />
                <span>{lead.businessType}</span>
              </div>
            )}
            
            {lead.estimatedMonthlyVolume && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <TrendingUpIcon className="h-3 w-3 flex-shrink-0" />
                <span>{lead.estimatedMonthlyVolume}</span>
              </div>
            )}
          </div>

          {lead.notes && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
              <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                {lead.notes}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'No date'}
            </div>
            {lead.leadSource && (
              <span className="capitalize">{lead.leadSource.replace('_', ' ')}</span>
            )}
          </div>
        </div>

        {/* Quick Actions - Non-draggable */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
          <div className="flex items-center justify-between gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:text-green-400"
              onClick={(e) => { e.stopPropagation(); handleCall(e); }}
              data-testid={`button-call-${lead.id}`}
              disabled={!lead.contactPhone}
              title={lead.contactPhone ? `Call ${lead.contactPhone}` : "No phone number"}
            >
              <PhoneIcon className="h-3 w-3" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
              onClick={(e) => { e.stopPropagation(); handleEmail(e); }}
              data-testid={`button-email-${lead.id}`}
              disabled={!lead.contactEmail}
              title={lead.contactEmail ? `Email ${lead.contactEmail}` : "No email address"}
            >
              <MailIcon className="h-3 w-3" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 dark:hover:text-purple-400"
              onClick={(e) => { e.stopPropagation(); handleQuoteRequest(e); }}
              data-testid={`button-quote-${lead.id}`}
              title="Request Quote"
            >
              <FileTextIcon className="h-3 w-3" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                onEditDetails(lead);
              }}
              data-testid={`button-edit-${lead.id}`}
              title="Edit Details"
            >
              <EditIcon className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Kanban Column Component
function KanbanColumn({ 
  column, 
  leads, 
  isLoading,
  onEditDetails
}: { 
  column: typeof KANBAN_COLUMNS[0], 
  leads: Lead[], 
  isLoading: boolean,
  onEditDetails: (lead: Lead) => void
}) {
  const columnLeads = leads.filter(lead => lead.status === column.id);
  
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  
  return (
    <div className="flex-shrink-0 w-80">
      <Card className={`h-full transition-colors ${isOver ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''}`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-sm">
            <span>{column.title}</span>
            <Badge className={column.color} variant="secondary">
              {columnLeads.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollArea className="h-[600px] pr-4">
            <div ref={setNodeRef} className="min-h-full">
              <SortableContext
                items={columnLeads.map(lead => lead.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3" data-testid={`column-${column.id}`}>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-32 w-full rounded-lg" />
                    ))
                  ) : columnLeads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <ClipboardListIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">No leads yet</p>
                      {isOver && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                          Drop lead here
                        </p>
                      )}
                    </div>
                  ) : (
                    columnLeads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} onEditDetails={onEditDetails} />
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

interface LazyKanbanViewProps {
  leads: Lead[];
  isLoading: boolean;
  onEditDetails: (lead: Lead) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export default function LazyKanbanView({ 
  leads, 
  isLoading, 
  onEditDetails, 
  onDragEnd 
}: LazyKanbanViewProps) {
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

  const activeLead = activeId ? leads.find(lead => lead.id === activeId) : null;

  return (
    <div className="space-y-6" data-testid="kanban-view">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto">
          <div className="flex gap-6 pb-4 min-w-max">
            {KANBAN_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                leads={leads}
                isLoading={isLoading}
                onEditDetails={onEditDetails}
              />
            ))}
          </div>
        </div>
        
        <DragOverlay>
          {activeLead ? (
            <LeadCard lead={activeLead} onEditDetails={onEditDetails} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}