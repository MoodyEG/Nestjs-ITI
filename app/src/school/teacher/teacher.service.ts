import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';

export interface TeacherInterface {
  id?: string;
  name: string;
  age: number;
  salary: number;
  subjects?: string[];
  schoolId: Types.ObjectId;
}

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
  ) {}

  async getAllTeachers(): Promise<TeacherInterface[]> {
    const teachers = await this.teacherModel.find().exec();
    return teachers.map((teacher) => this.mapToInterface(teacher));
  }

  async getTeacherById(id: string): Promise<TeacherInterface> {
    const teacher = await this.teacherModel.findById(id).exec();
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }
    return this.mapToInterface(teacher);
  }

  async addTeacher(teacher: TeacherInterface): Promise<TeacherInterface> {
    const newTeacher = new this.teacherModel({
      name: teacher.name,
      age: teacher.age,
      salary: teacher.salary,
      subjects: teacher.subjects || [],
      schoolId: new Types.ObjectId(teacher.schoolId),
    });

    const savedTeacher = await newTeacher.save();
    return this.mapToInterface(savedTeacher);
  }

  async updateTeacher(
    id: string,
    teacher: TeacherInterface,
  ): Promise<TeacherInterface> {
    // Create an update object
    const updateData: TeacherInterface = { ...teacher };

    // Convert schoolId to ObjectId if it exists
    if (teacher.schoolId) {
      updateData.schoolId = new Types.ObjectId(teacher.schoolId);
    }

    const updatedTeacher = await this.teacherModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedTeacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }

    return this.mapToInterface(updatedTeacher);
  }

  async deleteTeacher(id: string): Promise<TeacherInterface> {
    const deletedTeacher = await this.teacherModel.findByIdAndDelete(id).exec();

    if (!deletedTeacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }

    return this.mapToInterface(deletedTeacher);
  }

  async getHighestPaidTeacher(): Promise<TeacherInterface> {
    const teachers = await this.teacherModel
      .find()
      .sort({ salary: -1 })
      .limit(1)
      .exec();

    if (teachers.length === 0) {
      throw new NotFoundException('No teachers found');
    }

    return this.mapToInterface(teachers[0]);
  }

  async getTeachersBySchoolId(schoolId: string): Promise<TeacherInterface[]> {
    const objId = new Types.ObjectId(schoolId);
    const teachers = await this.teacherModel.find({ schoolId: objId }).exec();
    return teachers.map((teacher) => this.mapToInterface(teacher));
  }

  async countTeachersBySchoolId(schoolId: string): Promise<number> {
    const objId = new Types.ObjectId(schoolId);
    return await this.teacherModel.countDocuments({ schoolId: objId }).exec();
  }

  private mapToInterface(teacher: TeacherDocument): TeacherInterface {
    return {
      id: teacher._id.toString(),
      name: teacher.name,
      age: teacher.age,
      salary: teacher.salary,
      subjects: teacher.subjects,
      schoolId: teacher.schoolId,
    };
  }
}
