import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { _mock } from 'src/_mock/_mock';
import type { IKanban, IKanbanColumn, IKanbanTask } from 'src/types/kanban';

// ----------------------------------------------------------------------

// Generate mock kanban board
function generateMockBoard(): IKanban {
  const columns: IKanbanColumn[] = [
    { id: 'column-1', name: 'To Do' },
    { id: 'column-2', name: 'In Progress' },
    { id: 'column-3', name: 'In Review' },
    { id: 'column-4', name: 'Done' },
  ];

  const tasks: Record<string, IKanbanTask[]> = {
    'column-1': Array.from({ length: 5 }, (_, index) => generateMockTask(index, 'column-1')),
    'column-2': Array.from({ length: 4 }, (_, index) => generateMockTask(index + 5, 'column-2')),
    'column-3': Array.from({ length: 3 }, (_, index) => generateMockTask(index + 9, 'column-3')),
    'column-4': Array.from({ length: 6 }, (_, index) => generateMockTask(index + 12, 'column-4')),
  };

  return {
    columns,
    tasks,
  };
}

function generateMockTask(index: number, columnId: string): IKanbanTask {
  const priorities = ['low', 'medium', 'high'];
  const statuses = ['to-do', 'in-progress', 'in-review', 'done'];
  const labels = ['Frontend', 'Backend', 'Design', 'Bug', 'Feature'];

  return {
    id: _mock.id(index),
    name: _mock.taskNames(index),
    status: statuses.find((s) => columnId.includes(s.toLowerCase().replace('-', ''))) || 'to-do',
    priority: priorities[index % priorities.length],
    labels: labels.slice(0, (index % 3) + 1),
    description: index % 2 === 0 ? _mock.description(index) : undefined,
    attachments: index % 3 === 0 ? [_mock.image.cover(index)] : [],
    comments: Array.from({ length: index % 3 }, (_, commentIndex) => ({
      id: _mock.id(index + commentIndex + 100),
      name: _mock.fullName(index + commentIndex),
      message: _mock.sentence(index + commentIndex),
      avatarUrl: _mock.image.avatar(index + commentIndex),
      createdAt: _mock.time(index + commentIndex),
      messageType: commentIndex % 2 === 0 ? 'text' : 'image',
    })),
    assignee: Array.from({ length: (index % 3) + 1 }, (_, assigneeIndex) => ({
      id: _mock.id(index + assigneeIndex + 200),
      name: _mock.fullName(index + assigneeIndex),
      role: _mock.role(index + assigneeIndex),
      email: _mock.email(index + assigneeIndex),
      status: 'active',
      address: _mock.fullAddress(index + assigneeIndex),
      avatarUrl: _mock.image.avatar(index + assigneeIndex),
      phoneNumber: _mock.phoneNumber(index + assigneeIndex),
      lastActivity: _mock.time(index + assigneeIndex),
    })),
    due: [_mock.time(index), _mock.time(index + 7)],
    reporter: {
      id: _mock.id(index + 300),
      name: _mock.fullName(index),
      avatarUrl: _mock.image.avatar(index),
    },
  };
}

// ----------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const board = generateMockBoard();

    return NextResponse.json({
      board,
    });
  } catch (error) {
    console.error('Get kanban board error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    // Handle different endpoints
    if (endpoint === 'create-column') {
      const { columnData } = body;
      return NextResponse.json({
        success: true,
        column: columnData,
      });
    }

    if (endpoint === 'create-task') {
      const { columnId, taskData } = body;
      return NextResponse.json({
        success: true,
        columnId,
        task: taskData,
      });
    }

    if (endpoint === 'move-column') {
      const { updateColumns } = body;
      return NextResponse.json({
        success: true,
        columns: updateColumns,
      });
    }

    // Default: create column
    return NextResponse.json({
      success: true,
      data: body,
    });
  } catch (error) {
    console.error('Kanban POST error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (endpoint === 'update-column') {
      const { columnId, columnName } = body;
      return NextResponse.json({
        success: true,
        columnId,
        columnName,
      });
    }

    if (endpoint === 'update-task') {
      const { columnId, taskData } = body;
      return NextResponse.json({
        success: true,
        columnId,
        task: taskData,
      });
    }

    return NextResponse.json({
      success: true,
      data: body,
    });
  } catch (error) {
    console.error('Kanban PUT error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const columnId = searchParams.get('columnId');

    // In a real app, you would delete the column from a database
    return NextResponse.json({
      success: true,
      columnId,
    });
  } catch (error) {
    console.error('Kanban DELETE error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

