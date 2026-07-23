import bcrypt from 'bcryptjs';
import { db, generateId, saveData } from './db';

export async function seedInitialData() {
  // Check if admin user exists
  let admin = db.users.find((u) => u.role === 'admin');
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    admin = {
      _id: generateId(),
      name: 'Dr. Sarah Ahmed (Registrar)',
      email: 'admin@university.edu',
      password: hashedPassword,
      role: 'admin',
      cnic: '35202-1234567-1',
      phone: '+92 300 8889900',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      createdAt: new Date().toISOString()
    };
    db.users.push(admin);
  }

  // Check if demo student exists
  let student = db.users.find((u) => u.email === 'student@university.edu');
  if (!student) {
    const hashedPassword = await bcrypt.hash('student123', 10);
    student = {
      _id: generateId(),
      name: 'Ali Raza',
      email: 'student@university.edu',
      password: hashedPassword,
      role: 'student',
      cnic: '35201-9876543-1',
      phone: '+92 300 1234567',
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
      academicDetails: {
        matricMarks: 1020,
        matricTotal: 1100,
        interMarks: 1010,
        interTotal: 1100,
        testMarks: 88,
        testTotal: 100,
        degreeTitle: 'FSc Pre-Engineering',
        passingYear: 2025,
        boardName: 'FBISE Islamabad'
      },
      createdAt: new Date().toISOString()
    };
    db.users.push(student);
  }

  // Seed Departments if empty
  if (db.departments.length === 0) {
    const departments = [
      {
        _id: generateId(),
        name: 'Department of Computer Science',
        code: 'BSCS',
        category: 'Computer Science',
        description: 'Comprehensive 4-year degree in modern software development, algorithms, full-stack engineering, and cloud computing.',
        totalSeats: 60,
        availableSeats: 18,
        feePerSemester: 1250,
        eligibilityPercentage: 60,
        durationYears: 4,
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
        requirements: ['Minimum 60% in FSc Pre-Engineering / ICS', 'Valid Entry Test Score', 'CNIC / B-Form Copy']
      },
      {
        _id: generateId(),
        name: 'Department of Artificial Intelligence',
        code: 'BSAI',
        category: 'Computer Science',
        description: 'Cutting-edge program covering machine learning, deep neural networks, computer vision, and natural language processing.',
        totalSeats: 50,
        availableSeats: 12,
        feePerSemester: 1350,
        eligibilityPercentage: 65,
        durationYears: 4,
        coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800',
        requirements: ['Minimum 65% in FSc Pre-Engineering / ICS', 'Maths proficiency required', 'Entry Test Score']
      },
      {
        _id: generateId(),
        name: 'Department of Electrical Engineering',
        code: 'BSEE',
        category: 'Engineering',
        description: 'PEC accredited engineering degree focused on smart power grids, embedded robotics, signal processing, and microelectronics.',
        totalSeats: 80,
        availableSeats: 25,
        feePerSemester: 1400,
        eligibilityPercentage: 60,
        durationYears: 4,
        coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
        requirements: ['Minimum 60% in FSc Pre-Engineering', 'UET / ECAT Entry Test']
      },
      {
        _id: generateId(),
        name: 'Department of Business Administration',
        code: 'BBA',
        category: 'Business',
        description: 'Premier business management program developing future entrepreneurs, marketing strategists, and financial analysts.',
        totalSeats: 100,
        availableSeats: 34,
        feePerSemester: 1100,
        eligibilityPercentage: 50,
        durationYears: 4,
        coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
        requirements: ['Minimum 50% in FA / FSc / ICom / A-Levels', 'University Aptitude Test']
      },
      {
        _id: generateId(),
        name: 'Department of Medicine & Surgery (MBBS)',
        code: 'MBBS',
        category: 'Medical',
        description: 'PMC recognized 5-year clinical medicine degree program with state-of-the-art teaching hospital rotation.',
        totalSeats: 120,
        availableSeats: 8,
        feePerSemester: 2500,
        eligibilityPercentage: 70,
        durationYears: 5,
        coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        requirements: ['Minimum 70% in FSc Pre-Medical', 'MDCAT Mandatory', 'Physical fitness clearance']
      },
      {
        _id: generateId(),
        name: 'Department of Cyber Security',
        code: 'BSCYBER',
        category: 'Computer Science',
        description: 'Specialized track in offensive and defensive security, cryptography, network forensics, and ethical hacking.',
        totalSeats: 45,
        availableSeats: 15,
        feePerSemester: 1300,
        eligibilityPercentage: 60,
        durationYears: 4,
        coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
        requirements: ['Minimum 60% in FSc Pre-Eng / ICS', 'Entry test clearance']
      }
    ];

    db.departments.push(...departments);
  }

  // Seed sample applications
  if (db.applications.length === 0) {
    const bscsDept = db.departments.find(d => d.code === 'BSCS');
    const bsaiDept = db.departments.find(d => d.code === 'BSAI');

    if (bscsDept && student) {
      // Calculate aggregate: 30% Matric + 70% Inter
      const matricPct = (1020 / 1100) * 100;
      const interPct = (1010 / 1100) * 100;
      const agg = parseFloat((matricPct * 0.3 + interPct * 0.7).toFixed(2));

      db.applications.push({
        _id: generateId(),
        studentId: student._id,
        studentName: student.name,
        studentEmail: student.email,
        cnic: student.cnic,
        phone: student.phone,
        departmentId: bscsDept._id,
        departmentName: bscsDept.name,
        departmentCode: bscsDept.code,
        academicDetails: student.academicDetails,
        calculatedAggregate: agg,
        status: 'approved',
        feeStatus: 'unpaid',
        challanNumber: 'CHAL-2026-BSCS-0089',
        submittedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        reviewNotes: 'Eligible & Verified. Fee Challan Issued.'
      });
    }

    if (bsaiDept && student) {
      const matricPct = (1020 / 1100) * 100;
      const interPct = (1010 / 1100) * 100;
      const agg = parseFloat((matricPct * 0.3 + interPct * 0.7).toFixed(2));

      db.applications.push({
        _id: generateId(),
        studentId: student._id,
        studentName: student.name,
        studentEmail: student.email,
        cnic: student.cnic,
        phone: student.phone,
        departmentId: bsaiDept._id,
        departmentName: bsaiDept.name,
        departmentCode: bsaiDept.code,
        academicDetails: student.academicDetails,
        calculatedAggregate: agg,
        status: 'shortlisted',
        feeStatus: 'unpaid',
        submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        reviewNotes: 'Shortlisted for 1st Merit List.'
      });
    }

    // Add extra demo applicants for merit list presentation
    const mockApplicants = [
      { name: 'Fatima Noor', cnic: '35201-1122334-2', matric: 1060, inter: 1050, test: 92, email: 'fatima@gmail.com' },
      { name: 'Usman Ghani', cnic: '35202-4455667-1', matric: 1040, inter: 1030, test: 90, email: 'usman@gmail.com' },
      { name: 'Zainab Bibi', cnic: '35201-9988776-2', matric: 1010, inter: 990, test: 84, email: 'zainab@gmail.com' },
      { name: 'Hamza Khan', cnic: '35203-3322110-1', matric: 980, inter: 960, test: 80, email: 'hamza@gmail.com' },
      { name: 'Sana Malik', cnic: '35202-7766554-2', matric: 950, inter: 940, test: 78, email: 'sana@gmail.com' },
    ];

    mockApplicants.forEach(app => {
      const matricPct = (app.matric / 1100) * 100;
      const interPct = (app.inter / 1100) * 100;
      const agg = parseFloat((matricPct * 0.3 + interPct * 0.7).toFixed(2));
      const bscs = db.departments.find(d => d.code === 'BSCS');

      if (bscs) {
        db.applications.push({
          _id: generateId(),
          studentId: generateId(),
          studentName: app.name,
          studentEmail: app.email,
          cnic: app.cnic,
          phone: '+92 321 ' + Math.floor(1000000 + Math.random() * 9000000),
          departmentId: bscs._id,
          departmentName: bscs.name,
          departmentCode: bscs.code,
          academicDetails: {
            matricMarks: app.matric,
            matricTotal: 1100,
            interMarks: app.inter,
            interTotal: 1100,
            testMarks: app.test,
            testTotal: 100
          },
          calculatedAggregate: agg,
          status: 'approved',
          feeStatus: 'paid',
          challanNumber: 'CHAL-2026-BSCS-' + Math.floor(1000 + Math.random() * 9000),
          submittedAt: new Date(Date.now() - 86400000 * Math.floor(Math.random() * 10)).toISOString(),
          reviewNotes: 'Verified and Shortlisted'
        });
      }
    });
  }

  // Seed sample published Merit List
  if (db.meritLists.length === 0) {
    const bscs = db.departments.find(d => d.code === 'BSCS');
    if (bscs) {
      const bscsApps = db.applications.filter(a => a.departmentCode === 'BSCS');
      bscsApps.sort((a, b) => b.calculatedAggregate - a.calculatedAggregate);

      const selected = bscsApps.slice(0, 5).map((app, index) => ({
        studentId: app.studentId,
        studentName: app.studentName,
        cnic: app.cnic,
        rank: index + 1,
        aggregate: app.calculatedAggregate,
        status: index < 3 ? 'selected' : 'waiting',
        applicationId: app._id
      }));

      db.meritLists.push({
        _id: generateId(),
        departmentId: bscs._id,
        departmentName: bscs.name,
        listNumber: 1,
        formulaWeightage: { matric: 30, inter: 70, test: 0 },
        cutoffAggregate: selected.length > 0 ? selected[selected.length - 1].aggregate : 85.0,
        totalSeats: bscs.totalSeats,
        selectedStudents: selected,
        isPublished: true,
        generatedAt: new Date().toISOString()
      });
    }
  }

  // Seed Announcements
  if (db.announcements.length === 0) {
    db.announcements.push(
      {
        _id: generateId(),
        title: 'Fall 2026 Admissions Open for All Undergraduate Programs',
        content: 'Applications are officially invited for BS Computer Science, AI, Electrical Engineering, Business Administration, and MBBS programs. Last date to apply is August 15, 2026.',
        category: 'Admission',
        date: '2026-07-20',
        isImportant: true
      },
      {
        _id: generateId(),
        title: '1st Merit List Published for BSCS & BSAI Programs',
        content: 'The first official merit list for BS Computer Science and BS Artificial Intelligence has been published. Selected candidates are advised to deposit their fee challans before August 5, 2026.',
        category: 'Merit List',
        date: '2026-07-21',
        isImportant: true
      },
      {
        _id: generateId(),
        title: 'Merit & Need-Based Scholarship Test Schedule',
        content: 'Scholarship entry tests for top applicants will be conducted on August 10, 2026. Up to 100% fee waivers are available for candidates securing >90% aggregate.',
        category: 'General',
        date: '2026-07-18',
        isImportant: false
      }
    );
  }

  saveData(db);
}
