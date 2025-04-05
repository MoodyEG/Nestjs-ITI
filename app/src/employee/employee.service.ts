import { Injectable, NotFoundException } from '@nestjs/common';

export interface EmployeeInterface {
  id: number;
  name: string;
  age: number;
  salary: number;
}

@Injectable()
export class EmployeeService {
  private EMPLOYEES_DATA: EmployeeInterface[] = [
    { id: 1, name: 'Captain Hamada', age: 24, salary: 1000 },
    { id: 2, name: 'Ya3kob 2mr Eldin Debyaza', age: 5, salary: 20 },
    { id: 3, name: 'Zilean', age: 10000, salary: 3000 },
    { id: 4, name: '3m Dahb', age: 60, salary: 4000000000 },
  ];

  getAllEmployees(): EmployeeInterface[] {
    return this.EMPLOYEES_DATA;
  }

  getEmployeeById(id: number): EmployeeInterface {
    const employee = this.EMPLOYEES_DATA.find((employee) => employee.id === id);

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return employee;
  }

  addEmployee(employee: EmployeeInterface): EmployeeInterface {
    const newId =
      this.EMPLOYEES_DATA.length === 0
        ? 1
        : Math.max(...this.EMPLOYEES_DATA.map((emp) => emp.id)) + 1;

    const newEmployee = {
      id: newId,
      name: employee.name,
      age: employee.age,
      salary: employee.salary,
    };

    this.EMPLOYEES_DATA.push(newEmployee);

    return newEmployee;
  }

  updateEmployee(id: number, employee: EmployeeInterface): EmployeeInterface {
    const employeeIndex = this.EMPLOYEES_DATA.findIndex((emp) => emp.id === id);

    if (employeeIndex === -1) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    this.EMPLOYEES_DATA[employeeIndex] = {
      ...this.EMPLOYEES_DATA[employeeIndex],
      ...employee,
      id: id,
    };

    return this.EMPLOYEES_DATA[employeeIndex];
  }

  deleteEmployee(id: number): EmployeeInterface {
    const employeeIndex = this.EMPLOYEES_DATA.findIndex((emp) => emp.id === id);

    if (employeeIndex === -1) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    const deletedEmployee = this.EMPLOYEES_DATA.splice(employeeIndex, 1);

    return deletedEmployee[0];
  }

  getHighestPaidEmployee(): EmployeeInterface {
    return this.EMPLOYEES_DATA.reduce((prev, current) =>
      prev.salary > current.salary ? prev : current,
    );
  }
}
