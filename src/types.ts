export type UserRole = 'student' | 'admin';

export interface AcademicDetails {
  matricMarks: number;
  matricTotal: number;
  interMarks: number;
  interTotal: number;
  testMarks?: number;
  testTotal?: number;
  degreeTitle?: string;
  passingYear?: number;
  boardName?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  cnic: string;
  phone: string;
  profileImage?: string;
  academicDetails?: AcademicDetails;
  createdAt?: string;
}

export interface Department {
  _id: string;
  name: string;
  code: string;
  category: 'Engineering' | 'Computer Science' | 'Business' | 'Medical' | 'Humanities';
  description: string;
  totalSeats: number;
  availableSeats: number;
  feePerSemester: number;
  eligibilityPercentage: number;
  durationYears: number;
  coverImage: string;
  requirements: string[];
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'shortlisted';
export type FeeStatus = 'unpaid' | 'paid';

export interface Application {
  _id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  cnic: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  academicDetails: AcademicDetails;
  calculatedAggregate: number;
  status: ApplicationStatus;
  feeStatus: FeeStatus;
  challanNumber?: string;
  submittedAt: string;
  reviewNotes?: string;
}

export interface SelectedStudentRank {
  studentId: string;
  studentName: string;
  cnic: string;
  rank: number;
  aggregate: number;
  status: 'selected' | 'waiting' | 'admitted';
  applicationId: string;
}

export interface MeritList {
  _id: string;
  departmentId: string;
  departmentName: string;
  listNumber: 1 | 2 | 3;
  formulaWeightage: {
    matric: number;
    inter: number;
    test: number;
  };
  cutoffAggregate: number;
  totalSeats: number;
  selectedStudents: SelectedStudentRank[];
  isPublished: boolean;
  generatedAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  category: 'Admission' | 'Merit List' | 'Exam' | 'General';
  date: string;
  isImportant: boolean;
}

export interface AnalyticsData {
  totalApplications: number;
  totalDepartments: number;
  totalSeats: number;
  acceptedStudents: number;
  pendingApprovals: number;
  rejectedStudents: number;
  shortlistedStudents: number;
  paidChallans: number;
  totalRevenue: number;
}
