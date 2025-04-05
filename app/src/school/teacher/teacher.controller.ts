import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TeacherService, TeacherInterface } from './teacher.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  getAllTeachers(): Promise<TeacherInterface[]> {
    return this.teacherService.getAllTeachers();
  }

  @Get('/highestPaid')
  getHighestPaidTeacher(): Promise<TeacherInterface> {
    return this.teacherService.getHighestPaidTeacher();
  }

  @Get('/:id')
  getTeacherById(@Param('id') id: string): Promise<TeacherInterface> {
    return this.teacherService.getTeacherById(id);
  }

  @Post('/')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        salary: { type: 'number' },
        schoolId: { type: 'string' },
        subjects: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  addTeacher(@Body() teacher: TeacherInterface): Promise<TeacherInterface> {
    return this.teacherService.addTeacher(teacher);
  }

  @Put('/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        salary: { type: 'number' },
        schoolId: { type: 'string' },
        subjects: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  updateTeacher(
    @Param('id') id: string,
    @Body() teacher: TeacherInterface,
  ): Promise<TeacherInterface> {
    return this.teacherService.updateTeacher(id, teacher);
  }

  @Delete('/:id')
  deleteTeacher(@Param('id') id: string): Promise<TeacherInterface> {
    return this.teacherService.deleteTeacher(id);
  }

  @Get('/school/:schoolId')
  getTeachersBySchoolId(
    @Param('schoolId') schoolId: string,
  ): Promise<TeacherInterface[]> {
    return this.teacherService.getTeachersBySchoolId(schoolId);
  }
}
