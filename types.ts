export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
}

export type Gender = 'male' | 'female' | 'other';

export interface Parent {
  name: string;
  phone: string;
  email: string;
}

export interface Student {
  id: string;
  name:string;
  avatarUrl: string;
  age: number;
  gender: Gender;
  parent?: Parent; // Thêm thông tin phụ huynh
}

export interface Class {
  id: string;
  name: string;
  students: Student[];
  tuitionFee: number; // Phí mỗi buổi học
}

export interface AttendanceData {
  studentId: string;
  status: AttendanceStatus;
}

export interface AttendanceRecord {
  classId: string;
  date: string; // YYYY-MM-DD
  records: AttendanceData[];
}

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}