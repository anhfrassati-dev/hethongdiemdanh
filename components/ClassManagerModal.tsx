
import React, { useState } from 'react';
import { Class, Student, Gender, Parent } from '../types';
import { XIcon } from './icons/StatusIcons';
import { TrashIcon, PlusIcon } from './icons/DashboardIcons';

interface ClassManagerModalProps {
    classData: Class | null;
    onClose: () => void;
    setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
}

const ClassManagerModal: React.FC<ClassManagerModalProps> = ({ classData, onClose, setClasses }) => {
    const [name, setName] = useState(classData?.name || '');
    const [tuitionFee, setTuitionFee] = useState(classData?.tuitionFee || 0);
    const [students, setStudents] = useState<Student[]>(classData?.students || []);
    
    // State for new student form
    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentAge, setNewStudentAge] = useState<number | ''>('');
    const [newStudentGender, setNewStudentGender] = useState<Gender>('male');
    const [newParentName, setNewParentName] = useState('');
    const [newParentPhone, setNewParentPhone] = useState('');
    const [newParentEmail, setNewParentEmail] = useState('');

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (newStudentName.trim() && newStudentAge !== '' && Number(newStudentAge) > 0) {
            
            const parentInfo: Parent | undefined = (newParentName.trim() || newParentPhone.trim() || newParentEmail.trim()) 
                ? {
                    name: newParentName.trim(),
                    phone: newParentPhone.trim(),
                    email: newParentEmail.trim(),
                  }
                : undefined;

            const newStudent: Student = {
                id: `S${Date.now()}`,
                name: newStudentName.trim(),
                age: Number(newStudentAge),
                gender: newStudentGender,
                avatarUrl: `https://picsum.photos/seed/S${Date.now()}/100/100`,
                parent: parentInfo
            };
            setStudents([...students, newStudent]);
            // Reset form
            setNewStudentName('');
            setNewStudentAge('');
            setNewStudentGender('male');
            setNewParentName('');
            setNewParentPhone('');
            setNewParentEmail('');
        }
    };

    const handleDeleteStudent = (studentId: string) => {
        setStudents(students.filter(s => s.id !== studentId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        if (classData) { // Editing existing class
            setClasses(prev => prev.map(c => c.id === classData.id ? { ...c, name, students, tuitionFee } : c));
        } else { // Adding new class
            const newClass: Class = {
                id: `C${Date.now()}`,
                name,
                students,
                tuitionFee
            };
            setClasses(prev => [...prev, newClass]);
        }
        onClose();
    };

    const genderMap: Record<Gender, string> = {
        male: 'Nam',
        female: 'Nữ',
        other: 'Khác'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{classData ? 'Chỉnh sửa lớp học' : 'Thêm lớp học mới'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                        <XIcon className="w-6 h-6 text-slate-500" />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <form onSubmit={handleSubmit} id="class-form" className="p-6 space-y-6">
                        <div>
                            <label htmlFor="className" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên lớp học</label>
                            <input type="text" id="className" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label htmlFor="tuitionFee" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Học phí mỗi buổi (VNĐ)</label>
                            <input type="number" id="tuitionFee" value={tuitionFee} onChange={e => setTuitionFee(Number(e.target.value))} min="0" required className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Danh sách học sinh</h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {[...students].sort((a, b) => a.name.localeCompare(b.name)).map(student => (
                                    <div key={student.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-md">
                                        <div className="flex items-center gap-3">
                                            <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <p className="text-slate-800 dark:text-slate-200 font-medium">{student.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{student.age} tuổi - {genderMap[student.gender]}</p>
                                                {student.parent && <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">PH: {student.parent.name} - {student.parent.phone}</p>}
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => handleDeleteStudent(student.id)} className="p-1.5 text-slate-500 hover:text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition" aria-label={`Xóa ${student.name}`}>
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {students.length === 0 && <p className="text-center text-slate-500 py-4">Chưa có học sinh nào.</p>}
                            </div>
                        </div>
                    </form>
                    <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Thêm học sinh mới</h3>
                        <form onSubmit={handleAddStudent} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Thông tin học sinh</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <input type="text" value={newStudentName} onChange={e => setNewStudentName(e.target.value)} placeholder="Tên học sinh..." required className="col-span-3 sm:col-span-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                        <input type="number" value={newStudentAge} onChange={e => setNewStudentAge(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Tuổi" min="1" required className="col-span-3 sm:col-span-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                    </div>
                                    <select value={newStudentGender} onChange={e => setNewStudentGender(e.target.value as Gender)} className="mt-2 w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                        <option value="other">Khác</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Thông tin phụ huynh (tùy chọn)</label>
                                    <div className="space-y-2">
                                        <input type="text" value={newParentName} onChange={e => setNewParentName(e.target.value)} placeholder="Tên phụ huynh..." className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                        <input type="tel" value={newParentPhone} onChange={e => setNewParentPhone(e.target.value)} placeholder="SĐT phụ huynh..." className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                        <input type="email" value={newParentEmail} onChange={e => setNewParentEmail(e.target.value)} placeholder="Email phụ huynh..." className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-sm hover:bg-green-600 transition">
                                    <PlusIcon className="w-5 h-5"/>
                                    <span>Thêm học sinh</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                 <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4 flex-shrink-0">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition">Hủy</button>
                    <button type="submit" form="class-form" onClick={handleSubmit} className="px-6 py-2 bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-600 hover:to-violet-600 transition">Lưu thay đổi</button>
                </div>
            </div>
        </div>
    );
};

export default ClassManagerModal;