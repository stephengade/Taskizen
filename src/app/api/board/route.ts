import { NextResponse } from 'next/server';
import { KanbanData } from '../../../../types/kanban';

let boardData: KanbanData = {
  new: [],
  inProgress: [],
  backlogs: [],
  closed: []
};

export async function GET() {
  return NextResponse.json(boardData);
}

export async function POST(request: Request) {
  const updatedData = await request.json();
  boardData = updatedData;
  return NextResponse.json({ message: 'Board updated successfully', status: "ok" });
}

