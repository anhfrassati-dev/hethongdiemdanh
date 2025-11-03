
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Student, AttendanceStatus, Class, AttendanceRecord, AttendanceData, User } from '../types';
import StudentRow from './StudentRow';
import Header from './Header';
import { CheckIcon, XIcon, ClockIcon, ChartBarIcon } from './icons/StatusIcons';

interface AttendanceProps {
  classData: Class;
  user: User | null;
  onLogout: () => void;
  onBack: () => void;
  attendanceRecords: AttendanceRecord[];
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
}

const Attendance: React.FC<AttendanceProps> = ({ classData, user, onLogout, onBack, attendanceRecords, setAttendanceRecords }) => {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));
  const [sessionStatus, setSessionStatus] = useState<Map<string, AttendanceStatus>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'attendance' | 'stats'>('attendance');

  const sortedStudents = useMemo(() => 
    [...classData.students].sort((a, b) => a.name.localeCompare(b.name)),
    [classData.students]
  );

  useEffect(() => {
    const todaysRecord = attendanceRecords.find(r => r.classId === classData.id && r.date === currentDate);
    const initialStatus = new Map<string, AttendanceStatus>();
    if (todaysRecord) {
        todaysRecord.records.forEach(rec => {
            initialStatus.set(rec.studentId, rec.status);
        });
    }
    // Set default for students not in record
    sortedStudents.forEach(student => {
        if (!initialStatus.has(student.id)) {
            initialStatus.set(student.id, AttendanceStatus.PRESENT);
        }
    });
    setSessionStatus(initialStatus);
  }, [currentDate, classData.id, sortedStudents, attendanceRecords]);

  const handleStatusChange = useCallback((studentId: string, newStatus: AttendanceStatus) => {
    setSessionStatus(prev => new Map(prev).set(studentId, newStatus));
  }, []);

  const summary = useMemo(() => {
    const summaryData = { present: 0, absent: 0, late: 0 };
    for (const status of sessionStatus.values()) {
        summaryData[status]++;
    }
    return summaryData;
  }, [sessionStatus]);

  const studentStats = useMemo(() => {
    const stats = new Map<string, { present: number; absent: number; late: number }>();
    classData.students.forEach(student => {
        stats.set(student.id, { present: 0, absent: 0, late: 0 });
    });
    attendanceRecords
        .filter(r => r.classId === classData.id)
        .forEach(record => {
            record.records.forEach(rec => {
                const currentStat = stats.get(rec.studentId);
                if (currentStat) {
                    currentStat[rec.status]++;
                }
            });
        });
    return stats;
  }, [classData, attendanceRecords]);

  const handleSave = () => {
    setIsSaving(true);
    const updatedRecords: AttendanceData[] = Array.from(sessionStatus.entries()).map(([studentId, status]) => ({ studentId, status }));
    
    setAttendanceRecords(prevRecords => {
      const recordIndex = prevRecords.findIndex(r => r.classId === classData.id && r.date === currentDate);
      if (recordIndex > -1) {
        const newRecords = [...prevRecords];
        newRecords[recordIndex] = { ...newRecords[recordIndex], records: updatedRecords };
        return newRecords;
      } else {
        return [...prevRecords, { classId: classData.id, date: currentDate, records: updatedRecords }];
      }
    });

    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} onLogout={onLogout} onBack={onBack}/>
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Điểm danh {classData.name}</h1>
              <p className="text-slate-500 dark:text-slate-400">Học phí: {classData.tuitionFee.toLocaleString('vi-VN')} VNĐ / buổi</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setViewMode(prev => prev === 'attendance' ? 'stats' : 'attendance')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition focus:outline-none focus:ring-2 focus:ring-primary/80">
                <ChartBarIcon className="w-5 h-5" />
                <span>{viewMode === 'attendance' ? 'Xem thống kê' : 'Điểm danh'}</span>
              </button>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>

          {viewMode === 'attendance' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <CheckIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <p className="text-lg font-semibold text-green-800 dark:text-green-200">Có mặt</p>
                </div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{summary.present}</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <XIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  <p className="text-lg font-semibold text-red-800 dark:text-red-200">Vắng</p>
                </div>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{summary.absent}</p>
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/50 p-4 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <ClockIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  <p className="text-lg font-semibold text-amber-800 dark:text-amber-200">Đi trễ</p>
                </div>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">{summary.late}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
             <div className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <div className="flex flex-col sm:flex-row items-center p-4 bg-slate-50 dark:bg-slate-700/50 font-bold text-xs uppercase text-slate-500 dark:text-slate-400">
                    <div className="w-full sm:w-1/2 lg:w-2/5 mb-2 sm:mb-0">Học sinh</div>
                    <div className="w-full sm:w-1/2 lg:w-3/5">{viewMode === 'attendance' ? 'Trạng thái' : 'Thống kê tổng'}</div>
                </div>
                {sortedStudents.map((student) => (
                    <StudentRow 
                        key={student.id} 
                        student={student}
                        status={sessionStatus.get(student.id)}
                        onStatusChange={handleStatusChange} 
                        viewMode={viewMode}
                        stats={studentStats.get(student.id)}
                        tuitionFee={classData.tuitionFee}
                    />
                ))}
             </div>
          </div>
        </div>
      </main>
      
      {viewMode === 'attendance' && (
      <footer className="sticky bottom-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 border-t border-slate-200 dark:border-slate-700 shadow-t-lg">
        <div className="container mx-auto flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving || showSuccess}
              className={`px-6 py-3 font-semibold text-white rounded-lg shadow-md transition-all duration-300 w-40 h-12 flex items-center justify-center ${
                showSuccess
                  ? 'bg-green-500'
                  : isSaving
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-gradient-to-br from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isSaving ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : showSuccess ? (
                'Đã lưu!'
              ) : (
                'Lưu điểm danh'
              )}
            </button>
        </div>
      </footer>
      )}
    </div>
  );
};

export default Attendance;