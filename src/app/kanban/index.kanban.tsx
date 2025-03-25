'use client'

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { KanbanData, Lead, ColumnId } from '../../../types/kanban';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const KanbanBoard = () => {
  const [data, setData] = useState<KanbanData>({ new: [], inProgress: [], backlogs: [], closed: [] });
  const [newLead, setNewLead] = useState<Partial<Lead>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState<ColumnId>('new');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast()

  const colorVariants = [
    { id: 'new', color: 'bg-blue-100 text-blue-700' },
    { id: 'inProgress', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'backlogs', color: 'bg-purple-100 text-purple-700' },
    { id: 'closed', color: 'bg-green-100 text-green-700' }
] as const

  useEffect(() => {
    fetchBoardData();
  }, []);

  const fetchBoardData = async () => {
    try {
      const response = await fetch('/api/board');
      if (!response.ok) throw new Error('Failed to fetch board data');
      const boardData = await response.json();
      setData(boardData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load board data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateBackend = async (updatedData: KanbanData) => {
    try {
      const response = await fetch('/api/board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error('Failed to update board data');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save board data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const [month, day] = dateStr.split(' ');
    return (
      <span className={`px-2 py-1 mt-3  whitespace-nowrap rounded text-sm ${
        month === 'Feb' ? 'bg-red-100 text-red-700' :
        month === 'Mar' ? 'bg-green-100 text-green-700' :
        'bg-blue-100 text-blue-700'
      }`}>
        {month} {day}
      </span>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newData = { ...data };
    const sourceColumn = newData[source.droppableId as ColumnId];
    const destColumn = newData[destination.droppableId as ColumnId];
    const [removed] = sourceColumn.splice(source.index, 1);
    destColumn.splice(destination.index, 0, removed);

    setData(newData);
    updateBackend(newData);
  };

  const handleAddLead = () => {
    if (newLead.name && newLead.company && newLead.amount) {
      const lead: Lead = {
        id: Date.now().toString(),
        name: newLead.name,
        company: newLead.company,
        amount: Number(newLead.amount),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        avatar: '/placeholder.svg'
      };
      const newData = {
        ...data,
        [activeColumn]: [...data[activeColumn], lead]
      };
      setData(newData);
      updateBackend(newData);
      setNewLead({});
      setIsDialogOpen(false);
    }
  };

  const renderColumn = (title: string, columnId: ColumnId, leads: Lead[]) => (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          title={title}
          className={cn(`flex-1 min-w-[300px] bg-gray-50 rounded-lg p-4 border border-solid`)}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveColumn(columnId)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Lead</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Name"
                    value={newLead.name || ''}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  />
                  <Input
                    placeholder="Company"
                    value={newLead.company || ''}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={newLead.amount || ''}
                    onChange={(e) => setNewLead({ ...newLead, amount: parseInt(e.target.value) })}
                  />
                  <Button onClick={handleAddLead}>Add Lead</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-4">
            {leads.map((lead, index) => (
              <Draggable key={lead.id} draggableId={lead.id} index={index}>
                {(provided) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white cursor-grab"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={lead.avatar} alt={lead.name} />
                            <AvatarFallback>{getInitials(lead.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{lead.name}</h3>
                            <p className="text-sm text-gray-500">{lead.company}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatAmount(lead.amount)}</p>
                          {formatDate(lead.date)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Propfund Leads</h1>
          <div className="flex space-x-2">
            <Button variant="outline">Import</Button>
            <Button>Share</Button>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-scroll pb-4">
          {renderColumn('New', 'new', data.new)}
          {renderColumn('In Progress', 'inProgress', data.inProgress)}
          {renderColumn('Backlogs', 'backlogs', data.backlogs)}
          {renderColumn('Closed', 'closed', data.closed)}
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;

