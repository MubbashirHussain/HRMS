import { Employee } from "@/app/(authenticated)/employees/employee";
import { InputConfig } from "@/components/section/formModal";

export const EmployeedummyData: Employee[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Engineering",
    joiningDate: "2022-01-15",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    department: "Marketing",
    joiningDate: "2021-11-01",
    status: "Active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    department: "Sales",
    joiningDate: "2023-03-20",
    status: "Pending",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice.brown@example.com",
    department: "HR",
    joiningDate: "2022-08-01",
    status: "Inactive",
  },
  {
    id: "5",
    name: "Michael Davis",
    email: "michael.davis@example.com",
    department: "Engineering",
    joiningDate: "2023-05-10",
    status: "Active",
  },
];

export const EmployeeInputFormConfig:any = {
  heading: "Edit Employee Details",
  inputs: [
    {
      type: "text",
      label: "Employee Name",
      name: "employeeName",
      placeholder: "Enter employee name",
      isDisabled: true,
    },
    {
      type: "text",
      label: "Employee ID",
      name: "employeeId",
      placeholder: "Enter employee ID",
      isDisabled: true,
    },
    {
      type: "text",
      label: "Department",
      name: "department",
      placeholder: "Enter department",
    },
    {
      type: "text",
      label: "Designation",
      name: "designation",
      placeholder: "Enter designation",
    },
    {
      type: "number",
      label: "Salary",
      name: "salary",
      placeholder: "Enter salary",
    },
    {
      type: "date",
      label: "Pay Date",
      name: "payDate",
      placeholder: "Select pay date",
    },
    {
      type: "select",
      label: "Status",
      name: "status",
      options: [
        { label: "Pending", value: "Pending" },
        { label: "Paid", value: "Paid" },
      ],
      placeholder: "Select Status",
    },
    {
      type: "number",
      label: "Deductions",
      name: "deductions",
      placeholder: "Enter deductions",
    },
  ],
};
