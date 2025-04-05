import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { EmployeeService, EmployeeInterface } from './employee.service';
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeCService: EmployeeService) {}

  @Get()
  getAllEmployees(): EmployeeInterface[] {
    return this.employeeCService.getAllEmployees();
  }

  @Get('/highestPaid')
  getHighestPaidEmployee(): EmployeeInterface {
    return this.employeeCService.getHighestPaidEmployee();
  }

  @Get('/:id')
  getEmployeeById(@Param('id', ParseIntPipe) id: number): EmployeeInterface {
    return this.employeeCService.getEmployeeById(id);
  }

  @Post()
  addEmployee(@Body() employee: EmployeeInterface): EmployeeInterface {
    return this.employeeCService.addEmployee(employee);
  }

  @Put('/:id')
  updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() employee: EmployeeInterface,
  ): EmployeeInterface {
    return this.employeeCService.updateEmployee(id, employee);
  }

  @Delete('/:id')
  deleteEmployee(@Param('id', ParseIntPipe) id: number): EmployeeInterface {
    return this.employeeCService.deleteEmployee(id);
  }
}
