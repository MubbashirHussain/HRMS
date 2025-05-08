"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/base/button";
import { Input } from "@/components/ui/base/input";
import { Badge } from "@/components/ui/base/badge";
import { Plus, Edit, Trash2, Search, Users, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { TableComponent, TableConfig } from "@/components/section/table";
import { EmployeedummyData, EmployeeInputFormConfig } from "@/constaint/dummy/employees";
import FormModal from "@/components/section/formModal";
// Utility for combining class names

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  joiningDate: string;
  status: "Active" | "Inactive" | "Pending";
}

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Employee>>({});

  // Dummy employee data for initial setup and testing
  useEffect(() => {
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      setEmployees(EmployeedummyData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // --- CRUD Operations ---
  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      joiningDate: employee.joiningDate,
      status: employee.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedEmployee) return;

    const updatedEmployee: Employee = {
      ...selectedEmployee,
      name: editFormData.name || selectedEmployee.name,
      email: editFormData.email || selectedEmployee.email,
      department: editFormData.department || selectedEmployee.department,
      joiningDate: editFormData.joiningDate || selectedEmployee.joiningDate,
      status: editFormData.status || selectedEmployee.status,
    };

    setEmployees(
      employees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
    setEditFormData({});
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedEmployee) return;
    setEmployees(employees.filter((emp) => emp.id !== selectedEmployee.id));
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const getStatusBadgeVariant = (status: Employee["status"]) => {
    switch (status) {
      case "Active":
        return "default";
      case "Inactive":
        return "destructive";
      case "Pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const employeeTableConfig: TableConfig<Employee> = {
    headers: [
      { label: "Name", key: "name", isSortable: true },
      { label: "Email", key: "email", isSortable: true },
      { label: "Department", key: "department", isSortable: true },
      { label: "Joining Date", key: "joiningDate", isSortable: true },
      {
        label: "Status",
        key: "status",
        renderCell: (employee) => (
          <Badge
            variant={getStatusBadgeVariant(employee.status)}
            className={twMerge(
              employee.status === "Active" &&
                "bg-green-100 text-green-800 border-green-300",
              employee.status === "Inactive" &&
                "bg-red-100 text-red-800 border-red-300",
              employee.status === "Pending" &&
                "bg-yellow-100 text-yellow-800 border-yellow-300"
            )}
          >
            {employee.status}
          </Badge>
        ),
      },
    ],
    actions: {
      label: "Actions",
      buttons: (employee) => (
        <>
          <Button
            variant="link"
            size="default"
            onClick={() => handleEdit(employee)}
            className="text-blue-500 hover:bg-blue-50/50"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="link"
            size="default"
            onClick={() => handleDelete(employee)}
            className="text-red-500 hover:bg-red-50/50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      ),
    },
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Users className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      {/* Employee Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : (
        <TableComponent
          data={employees}
          config={employeeTableConfig}
          title="Employee List"
          description={`${employees.length} employees found`}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Edit Employee Dialog */}
      <FormModal inputs={EmployeeInputFormConfig.inputs} heading={EmployeeInputFormConfig.heading} />

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {isDeleteDialogOpen && selectedEmployee && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md space-y-4"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Delete Employee
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to delete {selectedEmployee.name}? This
                action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeesPage;
