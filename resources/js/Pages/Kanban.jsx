import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import KanbanBoard from "@/Components/KanbanBoardProjects";
import React from "react";
export default function Kanban({ auth, projects }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Projects Kanban
                    </h2>
                </div>
            }
        >
            <div className="py-3">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <KanbanBoard initialProjects={projects} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
