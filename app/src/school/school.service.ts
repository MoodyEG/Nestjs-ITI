import { Injectable, NotFoundException } from '@nestjs/common';
import { TeacherService } from './teacher/teacher.service';
import { InjectModel } from '@nestjs/mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Model, Types } from 'mongoose';
import { School, SchoolDocument } from './schemas/school.schema';

export interface SchoolInterface {
  id?: string;
  name: string;
  place: string;
}

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
    private readonly teacherService: TeacherService,
  ) {}

  async getAllSchools(): Promise<SchoolInterface[]> {
    const schools = await this.schoolModel.find().exec();
    return schools.map((school) => this.mapToInterface(school));
  }

  async getSchoolById(id: string): Promise<SchoolInterface> {
    const school = await this.schoolModel.findById(id).exec();
    if (!school) {
      throw new NotFoundException(`School with id ${id} not found`);
    }
    return this.mapToInterface(school);
  }

  async addSchool(school: SchoolInterface): Promise<SchoolInterface> {
    const newSchool = new this.schoolModel({
      name: school.name,
      place: school.place,
    });

    const savedSchool = await newSchool.save();
    return this.mapToInterface(savedSchool);
  }

  async updateSchool(
    id: string,
    school: SchoolInterface,
  ): Promise<SchoolInterface> {
    const updatedSchool = await this.schoolModel
      .findByIdAndUpdate(
        id,
        {
          name: school.name,
          place: school.place,
        },
        { new: true },
      )
      .exec();

    if (!updatedSchool) {
      throw new NotFoundException(`School with id ${id} not found`);
    }

    return this.mapToInterface(updatedSchool);
  }

  async deleteSchool(id: string): Promise<SchoolInterface> {
    const deletedSchool = await this.schoolModel.findByIdAndDelete(id).exec();

    if (!deletedSchool) {
      throw new NotFoundException(`School with id ${id} not found`);
    }

    return this.mapToInterface(deletedSchool);
  }

  async mostAndLeastTeachers(): Promise<{
    mostTeachers: { school: SchoolInterface; teacherCount: number } | null;
    leastTeachers: { school: SchoolInterface; teacherCount: number } | null;
  }> {
    const schools = await this.schoolModel.find().exec();

    if (schools.length === 0) {
      return { mostTeachers: null, leastTeachers: null };
    }

    const schoolsWithTeacherCount = await Promise.all(
      schools.map(async (school) => {
        const teacherCount = await this.teacherService.countTeachersBySchoolId(
          school._id.toString(),
        );
        return {
          school: this.mapToInterface(school),
          teacherCount,
        };
      }),
    );

    schoolsWithTeacherCount.sort((a, b) => a.teacherCount - b.teacherCount);

    const leastTeachers = schoolsWithTeacherCount[0];

    const mostTeachers =
      schoolsWithTeacherCount[schoolsWithTeacherCount.length - 1];

    return { mostTeachers, leastTeachers };
  }

  private mapToInterface(school: SchoolDocument): SchoolInterface {
    return {
      id: school._id.toString(),
      name: school.name,
      place: school.place,
    };
  }
}
