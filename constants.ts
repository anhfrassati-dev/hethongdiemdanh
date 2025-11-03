
import React from 'react';
import { Class, AttendanceRecord, AttendanceStatus } from './types';

export const INITIAL_CLASSES: Class[] = [
  {
    id: 'C001',
    name: 'Lớp 12A1',
    tuitionFee: 100000,
    students: [
      { id: 'S001', name: 'Nguyễn Văn An', age: 17, gender: 'male', avatarUrl: 'https://picsum.photos/seed/S001/100/100', parent: { name: 'Nguyễn Văn A', phone: '0901234567', email: 'phuhuynh.an@email.com' } },
      { id: 'S002', name: 'Trần Thị Bình', age: 17, gender: 'female', avatarUrl: 'https://picsum.photos/seed/S002/100/100', parent: { name: 'Trần Văn B', phone: '0902345678', email: 'phuhuynh.binh@email.com' } },
      { id: 'S003', name: 'Lê Minh Cường', age: 18, gender: 'male', avatarUrl: 'https://picsum.photos/seed/S003/100/100' },
      { id: 'S004', name: 'Phạm Thị Dung', age: 17, gender: 'female', avatarUrl: 'https://picsum.photos/seed/S004/100/100' },
      { id: 'S005', name: 'Hoàng Văn Em', age: 18, gender: 'male', avatarUrl: 'https://picsum.photos/seed/S005/100/100' },
      { id: 'S006', name: 'Vũ Thị Giang', age: 17, gender: 'female', avatarUrl: 'https://picsum.photos/seed/S006/100/100' },
    ]
  },
  {
    id: 'C002',
    name: 'Lớp 11B2',
    tuitionFee: 90000,
    students: [
      { id: 'S007', name: 'Đỗ Minh Hải', age: 16, gender: 'male', avatarUrl: 'https://picsum.photos/seed/S007/100/100' },
      { id: 'S008', name: 'Bùi Thu Hương', age: 16, gender: 'female', avatarUrl: 'https://picsum.photos/seed/S008/100/100', parent: { name: 'Bùi Văn H', phone: '0903456789', email: 'phuhuynh.huong@email.com' } },
      { id: 'S009', name: 'Ngô Gia Khánh', age: 16, gender: 'male', avatarUrl: 'https://picsum.photos/seed/S009/100/100' },
    ]
  }
];

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
    {
        classId: 'C001',
        date: new Date(Date.now() - 86400000).toISOString().slice(0, 10), // Yesterday
        records: [
            { studentId: 'S001', status: AttendanceStatus.PRESENT },
            { studentId: 'S002', status: AttendanceStatus.PRESENT },
            { studentId: 'S003', status: AttendanceStatus.ABSENT },
            { studentId: 'S004', status: AttendanceStatus.PRESENT },
            { studentId: 'S005', status: AttendanceStatus.LATE },
            { studentId: 'S006', status: AttendanceStatus.PRESENT },
        ]
    },
    {
        classId: 'C001',
        date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10), // Day before yesterday
        records: [
            { studentId: 'S001', status: AttendanceStatus.PRESENT },
            { studentId: 'S002', status: AttendanceStatus.LATE },
            { studentId: 'S003', status: AttendanceStatus.PRESENT },
            { studentId: 'S004', status: AttendanceStatus.PRESENT },
            { studentId: 'S005', status: AttendanceStatus.PRESENT },
            { studentId: 'S006', status: AttendanceStatus.ABSENT },
        ]
    }
];

export const STATUS_MAP: { [key in AttendanceStatus]: { text: string; color: string; hoverColor: string; icon: React.ReactNode; } } = {
    [AttendanceStatus.PRESENT]: { text: 'Có mặt', color: 'bg-green-500', hoverColor: 'hover:bg-green-600', icon: null },
    [AttendanceStatus.ABSENT]: { text: 'Vắng', color: 'bg-red-500', hoverColor: 'hover:bg-red-600', icon: null },
    [AttendanceStatus.LATE]: { text: 'Đi trễ', color: 'bg-amber-500', hoverColor: 'hover:bg-amber-600', icon: null },
};