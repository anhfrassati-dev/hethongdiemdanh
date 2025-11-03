
import React, { useState, useMemo } from 'react';
import { Class, AttendanceRecord, User } from '../types';
import Header from './Header';
import { PlusIcon, UsersIcon, BookOpenIcon, PencilIcon, TrashIcon, SearchIcon } from './icons/DashboardIcons';
import ClassManagerModal from './ClassManagerModal';

interface DashboardProps {
    user: User | null;
    onLogout: () => void;
    onSelectClass: (classId: string) => void;
    classes: Class[];
    setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
    attendanceRecords: AttendanceRecord[];
    onDeleteClass: (classId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onSelectClass, classes, setClasses, attendanceRecords, onDeleteClass }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<Class | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const openAddNewModal = () => {
        setEditingClass(null);
        setIsModalOpen(true);
    };

    const openEditModal = (classData: Class) => {
        setEditingClass(classData);
        setIsModalOpen(true);
    };
    
    const todayString = new Date().toISOString().slice(0, 10);
    const attendanceSummary = useMemo(() => {
        const summary = new Map<string, { present: number, total: number }>();
        const todayRecords = attendanceRecords.filter(r => r.date === todayString);

        classes.forEach(c => {
            const record = todayRecords.find(r => r.classId === c.id);
            if (record) {
                const presentCount = record.records.filter(s => s.status === 'present' || s.status === 'late').length;
                summary.set(c.id, { present: presentCount, total: c.students.length });
            } else {
                 summary.set(c.id, { present: 0, total: c.students.length });
            }
        });
        return summary;
    }, [classes, attendanceRecords, todayString]);

    const filteredAndSortedClasses = useMemo(() => {
        const sorted = [...classes].sort((a, b) => a.name.localeCompare(b.name));

        if (!searchQuery.trim()) {
            return sorted;
        }

        const lowercasedQuery = searchQuery.toLowerCase();
        return sorted.filter(c => 
            c.name.toLowerCase().includes(lowercasedQuery) || 
            c.students.some(s => s.name.toLowerCase().includes(lowercasedQuery))
        );
    }, [classes, searchQuery]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header user={user} onLogout={onLogout} />
            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Bảng điều khiển</h1>
                    <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-full sm:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm lớp hoặc học sinh..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <button onClick={openAddNewModal} className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-600 hover:to-violet-600 transition-all duration-300">
                            <PlusIcon className="w-5 h-5"/>
                            <span>Thêm lớp mới</span>
                        </button>
                    </div>
                </div>
                
                {filteredAndSortedClasses.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                        <BookOpenIcon className="w-16 h-16 mx-auto text-slate-400"/>
                        <h2 className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-200">
                            {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có lớp học nào'}
                        </h2>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                            {searchQuery ? 'Hãy thử một từ khóa tìm kiếm khác.' : 'Hãy bắt đầu bằng cách thêm một lớp học mới.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedClasses.map(c => {
                            const summary = attendanceSummary.get(c.id);
                            return (
                                <div key={c.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg flex flex-col transition hover:shadow-xl hover:-translate-y-1">
                                    <div className="p-6 flex-grow">
                                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{c.name}</h2>
                                        <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400">
                                            <UsersIcon className="w-5 h-5"/>
                                            <span>{c.students.length} học sinh</span>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Điểm danh hôm nay:</h3>
                                            <p className="text-lg font-bold mt-1">
                                                {summary ? <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">{`${summary.present} / ${summary.total}`}</span> : <span className="text-sm text-slate-400">Chưa điểm danh</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 flex justify-between items-center rounded-b-xl">
                                        <div className="flex gap-2">
                                            <button onClick={() => openEditModal(c)} className="p-2 text-slate-500 hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition" aria-label="Edit class">
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => onDeleteClass(c.id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition" aria-label="Delete class">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <button onClick={() => onSelectClass(c.id)} className="px-4 py-2 bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:from-indigo-600 hover:to-violet-600 transition">
                                            Điểm danh
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
            {isModalOpen && (
                <ClassManagerModal
                    classData={editingClass}
                    onClose={() => setIsModalOpen(false)}
                    setClasses={setClasses}
                />
            )}
        </div>
    );
};

export default Dashboard;