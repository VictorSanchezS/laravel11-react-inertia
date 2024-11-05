// resources/js/Components/KanbanBoard.jsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

const KanbanBoard = ({ initialProjects }) => {
  const [columns, setColumns] = useState({
    pending: initialProjects.filter(project => project.status === 'pending'),
    inProgress: initialProjects.filter(project => project.status === 'in_progress'),
    completed: initialProjects.filter(project => project.status === 'completed'),
  });

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
        return;
    }

    const sourceColumn = [...columns[source.droppableId]];
    const [movedProject] = sourceColumn.splice(source.index, 1);
    const destinationColumn = [...columns[destination.droppableId]];

    const statusMapping = {
        pending: 'pending',
        inProgress: 'in_progress',
        completed: 'completed',
    };

    movedProject.status = statusMapping[destination.droppableId];

    try {
        await axios.patch(`/api/projects/${movedProject.id}/status`, {
            name: movedProject.name,
            status: movedProject.status,
        });
    } catch (error) {
        console.error("Error updating project status", error);
        // Opcional: manejar la reversión en caso de error
        destinationColumn.splice(destination.index, 0, movedProject); // Revertir movimiento
        sourceColumn.splice(source.index, 0, movedProject); // Revertir movimiento
    }

    destinationColumn.splice(destination.index, 0, movedProject);

    setColumns({
        ...columns,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destinationColumn,
    });
};


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 py-4 bg-gray dark:bg-gray-900 min-h-screen">
        {Object.entries(columns).map(([columnId, projects]) => (
          <Droppable droppableId={columnId} key={columnId}>
            {(provided) => (
              <div
                className="flex-1 bg-gray dark:bg-gray-800 rounded-lg shadow-md p-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h3
                  className={`text-xl font-bold mb-4 text-center capitalize ${
                    columnId === 'pending'
                      ? 'text-amber-500'
                      : columnId === 'inProgress'
                      ? 'text-blue-500'
                      : 'text-green-500'
                  }`}
                >
                  {columnId === 'pending' ? 'Pending' : columnId === 'inProgress' ? 'In Progress' : 'Completed'}
                </h3>

                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          className="bg-blue-50 bg-gray dark:bg-gray-400 border border-blue-200 p-4 rounded-lg shadow-sm"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <h4 className="font-semibold text-lg text-gray-800">{project.name}</h4>
                          <p className="text-gray-500 text-xs mt-2">Due: {new Date(project.due_date).toLocaleString()}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
