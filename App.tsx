import React, { useState, useCallback, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Attendance from './components/Attendance';
import { Class, AttendanceRecord, User } from './types';
import { auth, db } from './services/firebase'; // Dịch vụ mô phỏng

type Page = 'dashboard' | 'attendance';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading để kiểm tra auth
  
  const [page, setPage] = useState<Page>('dashboard');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const [classes, setClasses] = useState<Class[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Lắng nghe thay đổi trạng thái đăng nhập
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        // Lấy dữ liệu của người dùng từ DB mô phỏng
        const userData = await db.getUserData(currentUser.uid);
        setClasses(userData.classes);
        setAttendanceRecords(userData.attendanceRecords);
        setPage('dashboard');
      } else {
        // Reset state khi người dùng đăng xuất
        setUser(null);
        setClasses([]);
        setAttendanceRecords([]);
        setSelectedClassId(null);
      }
      setLoading(false);
    });
    return () => unsubscribe(); // Hủy lắng nghe khi component unmount
  }, []);

  const handleLogout = useCallback(async () => {
    await auth.signOut();
  }, []);

  const handleSelectClass = useCallback((classId: string) => {
    setSelectedClassId(classId);
    setPage('attendance');
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setSelectedClassId(null);
    setPage('dashboard');
  }, []);
  
  // Hàm để lưu dữ liệu lên DB mô phỏng
  const saveData = useCallback(async (updatedClasses: Class[], updatedRecords: AttendanceRecord[]) => {
    if (user) {
        setClasses(updatedClasses);
        setAttendanceRecords(updatedRecords);
        await db.saveUserData(user.uid, { classes: updatedClasses, attendanceRecords: updatedRecords });
    }
  }, [user]);
  
  const handleSetClasses = useCallback((newClasses: Class[] | ((prev: Class[]) => Class[])) => {
      const updatedClasses = newClasses instanceof Function ? newClasses(classes) : newClasses;
      saveData(updatedClasses, attendanceRecords);
  }, [classes, attendanceRecords, saveData]);

  const handleSetAttendanceRecords = useCallback((newRecords: AttendanceRecord[] | ((prev: AttendanceRecord[]) => AttendanceRecord[])) => {
      const updatedRecords = newRecords instanceof Function ? newRecords(attendanceRecords) : newRecords;
      saveData(classes, updatedRecords);
  }, [classes, attendanceRecords, saveData]);

  const handleDeleteClass = useCallback((classId: string) => {
    if(window.confirm('Bạn có chắc chắn muốn xóa lớp học này không? Mọi dữ liệu điểm danh liên quan cũng sẽ bị xóa vĩnh viễn.')) {
        const updatedClasses = classes.filter(c => c.id !== classId);
        const updatedRecords = attendanceRecords.filter(r => r.classId !== classId);
        saveData(updatedClasses, updatedRecords);
    }
  }, [classes, attendanceRecords, saveData]);


  const selectedClass = classes.find(c => c.id === selectedClassId);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen" role="status" aria-label="Loading">
          <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      );
    }
  
    if (!user) {
      return <Login />;
    }

    switch (page) {
      case 'attendance':
        if (selectedClass) {
          return (
            <Attendance 
              classData={selectedClass} 
              user={user}
              onLogout={handleLogout} 
              onBack={handleBackToDashboard}
              attendanceRecords={attendanceRecords}
              setAttendanceRecords={handleSetAttendanceRecords}
            />
          );
        }
        // Fallback to dashboard if class not found
        handleBackToDashboard();
        return null;
      case 'dashboard':
      default:
        return (
          <Dashboard 
            user={user}
            onLogout={handleLogout} 
            onSelectClass={handleSelectClass}
            classes={classes}
            setClasses={handleSetClasses}
            attendanceRecords={attendanceRecords}
            onDeleteClass={handleDeleteClass}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans">
      {renderContent()}
    </div>
  );
};

export default App;