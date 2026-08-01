import mongoose, { Schema } from 'mongoose';

// MongoDB / Mongoose Schemas

export const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  cnic: { type: String, default: '' },
  phone: { type: String, default: '' },
  profileImage: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300' },
  academicDetails: {
    matricMarks: { type: Number, default: 0 },
    matricTotal: { type: Number, default: 1100 },
    interMarks: { type: Number, default: 0 },
    interTotal: { type: Number, default: 1100 },
    testMarks: { type: Number, default: 0 },
    testTotal: { type: Number, default: 100 },
    degreeTitle: { type: String, default: 'FSc Pre-Engineering / ICS' },
    passingYear: { type: Number, default: 2025 },
    boardName: { type: String, default: 'FBISE Islamabad' }
  },
  createdAt: { type: Date, default: Date.now }
});

export const DepartmentSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  feePerSemester: { type: Number, required: true },
  eligibilityPercentage: { type: Number, required: true },
  durationYears: { type: Number, default: 4 },
  coverImage: { type: String, required: true },
  requirements: [{ type: String }]
});

export const ApplicationSchema = new Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  cnic: { type: String, required: true },
  phone: { type: String, required: true },
  departmentId: { type: String, required: true },
  departmentName: { type: String, required: true },
  departmentCode: { type: String, required: true },
  academicDetails: {
    matricMarks: Number,
    matricTotal: Number,
    interMarks: Number,
    interTotal: Number,
    testMarks: Number,
    testTotal: Number
  },
  calculatedAggregate: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'shortlisted'], default: 'pending' },
  feeStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  challanNumber: { type: String },
  submittedAt: { type: Date, default: Date.now },
  reviewNotes: { type: String, default: '' }
});

export const MeritListSchema = new Schema({
  departmentId: { type: String, required: true },
  departmentName: { type: String, required: true },
  listNumber: { type: Number, enum: [1, 2, 3], required: true },
  formulaWeightage: {
    matric: { type: Number, default: 30 },
    inter: { type: Number, default: 70 },
    test: { type: Number, default: 0 }
  },
  cutoffAggregate: { type: Number, default: 0 },
  totalSeats: { type: Number, required: true },
  selectedStudents: [{
    studentId: String,
    studentName: String,
    cnic: String,
    rank: Number,
    aggregate: Number,
    status: { type: String, default: 'selected' },
    applicationId: String
  }],
  isPublished: { type: Boolean, default: false },
  generatedAt: { type: Date, default: Date.now }
});

export const AnnouncementSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'General' },
  date: { type: String, required: true },
  isImportant: { type: Boolean, default: false }
});

// Native In-Memory / Persistent Store abstraction with MongoDB Mongo-like API
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data_store.json');

interface LocalStore {
  users: any[];
  departments: any[];
  applications: any[];
  meritLists: any[];
  announcements: any[];
}

function loadData(): LocalStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading data_store.json:', err);
  }
  return { users: [], departments: [], applications: [], meritLists: [], announcements: [] };
}

export function saveData(store: LocalStore) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  } catch (err) {
    console.error('Error writing data_store.json:', err);
  }
}

export let db = loadData();

export function generateId(): string {
  return 'id_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}
// MongoDB Connection
export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(uri);

    console.log("✅ MongoDB Atlas Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}