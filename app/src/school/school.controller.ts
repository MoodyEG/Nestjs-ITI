import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { SchoolService, SchoolInterface } from './school.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get()
  getAllSchools(): Promise<SchoolInterface[]> {
    return this.schoolService.getAllSchools();
  }

  @Get('/mostAndLeastTeachers')
  mostAndLeastTeachers() {
    return this.schoolService.mostAndLeastTeachers();
  }

  @Get('/:id')
  getSchoolById(@Param('id') id: string): Promise<SchoolInterface> {
    return this.schoolService.getSchoolById(id);
  }

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        place: { type: 'string' },
      },
    },
  })
  addSchool(@Body() school: SchoolInterface): Promise<SchoolInterface> {
    return this.schoolService.addSchool(school);
  }

  @Put('/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        place: { type: 'string' },
      },
    },
  })
  updateSchool(
    @Param('id') id: string,
    @Body() school: SchoolInterface,
  ): Promise<SchoolInterface> {
    return this.schoolService.updateSchool(id, school);
  }

  @Delete('/:id')
  deleteSchool(@Param('id') id: string): Promise<SchoolInterface> {
    return this.schoolService.deleteSchool(id);
  }
}
