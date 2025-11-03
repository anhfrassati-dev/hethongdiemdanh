
import React from 'react';
import { Student, AttendanceStatus, Gender } from '../types';
import { CheckIcon, XIcon, ClockIcon } from './icons/StatusIcons';

interface StudentRowProps {
  student: Student;
  status?: AttendanceStatus;
  onStatusChange: (studentId: string, newStatus: AttendanceStatus) => void;
  viewMode: 'attendance' | 'stats';
  stats?: { present: number; absent: number; late: number };
  tuitionFee: number;
}

const StatusButton: React.FC<{
  label: string;
  status: AttendanceStatus;
  currentStatus?: AttendanceStatus;
  onClick: () => void;
}> = ({ label, status, currentStatus, onClick }) => {
  const isActive = status === currentStatus;
  const baseClasses = "w-full sm:w-24 px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800";

  const statusClasses = {
    [AttendanceStatus.PRESENT]: {
      active: 'bg-green-500 text-white shadow-md',
      inactive: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-green-200 dark:hover:bg-green-900/50',
      ring: 'focus:ring-green-500'
    },
    [AttendanceStatus.ABSENT]: {
      active: 'bg-red-500 text-white shadow-md',
      inactive: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-200 dark:hover:bg-red-900/50',
      ring: 'focus:ring-red-500'
    },
    [AttendanceStatus.LATE]: {
      active: 'bg-amber-500 text-white shadow-md',
      inactive: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-amber-200 dark:hover:bg-amber-900/50',
      ring: 'focus:ring-amber-500'
    },
  };

  const classes = `${baseClasses} ${isActive ? statusClasses[status].active : statusClasses[status].inactive} ${statusClasses[status].ring}`;

  return (
    <button onClick={onClick} className={classes}>
      {label}
    </button>
  );
};

const genderMap: Record<Gender, string> = {
    male: 'Nam',
    female: 'Nữ',
    other: 'Khác'
};

const StudentRow: React.FC<StudentRowProps> = ({ student, status, onStatusChange, viewMode, stats, tuitionFee }) => {
  
  const totalAttended = (stats?.present || 0) + (stats?.late || 0);
  const totalTuition = totalAttended * tuitionFee;

  return (
    <div className="flex flex-col sm:flex-row items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
      <div className="flex items-center w-full sm:w-1/2 lg:w-2/5 mb-4 sm:mb-0">
        <img src={student.avatarUrl} alt={student.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-100">{student.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {student.age} tuổi - {genderMap[student.gender]}
            {student.parent?.name && <span className="italic"> - PH: {student.parent.name}</span>}
          </p>
        </div>
      </div>
      <div className="w-full sm:w-1/2 lg:w-3/5 flex justify-start sm:justify-end">
        {viewMode === 'attendance' ? (
          <div className="flex flex-row sm:items-center gap-2 w-full sm:w-auto">
            <StatusButton label="Có mặt" status={AttendanceStatus.PRESENT} currentStatus={status} onClick={() => onStatusChange(student.id, AttendanceStatus.PRESENT)} />
            <StatusButton label="Vắng" status={AttendanceStatus.ABSENT} currentStatus={status} onClick={() => onStatusChange(student.id, AttendanceStatus.ABSENT)} />
            <StatusButton label="Đi trễ" status={AttendanceStatus.LATE} currentStatus={status} onClick={() => onStatusChange(student.id, AttendanceStatus.LATE)} />
          </div>
        ) : (
          <div className="w-full text-sm">
            <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400" title="Có mặt">
                    <CheckIcon className="w-4 h-4" />
                    <span className="font-semibold">{stats?.present || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400" title="Đi trễ">
                    <ClockIcon className="w-4 h-4" />
                    <span className="font-semibold">{stats?.late || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400" title="Vắng">
                    <XIcon className="w-4 h-4" />
                    <span className="font-semibold">{stats?.absent || 0}</span>
                </div>
            </div>
            <div className="mt-2 text-slate-600 dark:text-slate-300 font-semibold">
                Tổng học phí: <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">{totalTuition.toLocaleString('vi-VN')} VNĐ</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRow;