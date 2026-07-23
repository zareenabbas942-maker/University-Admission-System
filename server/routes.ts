import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, generateId, saveData } from './db';
import { authenticateToken, requireAdmin, generateToken, AuthRequest } from './middleware';

export const router = Router();

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

// Sign Up
router.post('/auth/signup', async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, role = 'student', cnic, phone, profileImage, academicDetails } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required fields.' });
      return;
    }

    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      res.status(400).json({ message: 'An account with this email address already exists.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      _id: generateId(),
      name,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'student',
      cnic: cnic || '',
      phone: phone || '',
      profileImage: profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      academicDetails: academicDetails || {
        matricMarks: 0,
        matricTotal: 1100,
        interMarks: 0,
        interTotal: 1100,
        testMarks: 0,
        testTotal: 100
      },
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveData(db);

    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'Account registered successfully.',
      token,
      user: userWithoutPassword
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to sign up.', error: err.message });
  }
});

// Login
router.post('/auth/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials. User not found.' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
      return;
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Logged in successfully.',
      token,
      user: userWithoutPassword
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Login failed.', error: err.message });
  }
});

// Get Current User Profile
router.get('/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = db.users.find((u) => u._id === req.user?.id);
  if (!user) {
    res.status(404).json({ message: 'User not found.' });
    return;
  }
  const { password, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// Update Profile & Academic Details
router.put('/auth/profile', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const userIndex = db.users.findIndex((u) => u._id === req.user?.id);
    if (userIndex === -1) {
      res.status(404).json({ message: 'User profile not found.' });
      return;
    }

    const { name, cnic, phone, profileImage, academicDetails } = req.body;
    const user = db.users[userIndex];

    if (name) user.name = name;
    if (cnic) user.cnic = cnic;
    if (phone) user.phone = phone;
    if (profileImage) user.profileImage = profileImage;
    if (academicDetails) {
      user.academicDetails = {
        ...user.academicDetails,
        ...academicDetails
      };
    }

    db.users[userIndex] = user;
    saveData(db);

    const { password, ...updatedUser } = user;
    res.json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update profile.', error: err.message });
  }
});


// ==========================================
// 2. DEPARTMENT ROUTES (CRUD)
// ==========================================

// Get all departments
router.get('/departments', (_req: AuthRequest, res: Response) => {
  res.json({ departments: db.departments });
});

// Get single department
router.get('/departments/:id', (req: AuthRequest, res: Response) => {
  const dept = db.departments.find((d) => d._id === req.params.id);
  if (!dept) {
    res.status(404).json({ message: 'Department not found.' });
    return;
  }
  res.json({ department: dept });
});

// Admin Add Department
router.post('/departments', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const { name, code, category, description, totalSeats, feePerSemester, eligibilityPercentage, durationYears, coverImage, requirements } = req.body;

    if (!name || !code || !totalSeats || !feePerSemester || !eligibilityPercentage) {
      res.status(400).json({ message: 'Please provide all required department details.' });
      return;
    }

    const newDept = {
      _id: generateId(),
      name,
      code: code.toUpperCase(),
      category: category || 'Computer Science',
      description: description || 'Academic program at University.',
      totalSeats: Number(totalSeats),
      availableSeats: Number(totalSeats),
      feePerSemester: Number(feePerSemester),
      eligibilityPercentage: Number(eligibilityPercentage),
      durationYears: Number(durationYears) || 4,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
      requirements: requirements || ['Minimum required percentage', 'Document verification']
    };

    db.departments.push(newDept);
    saveData(db);

    res.status(201).json({ message: 'Department created successfully.', department: newDept });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to create department.', error: err.message });
  }
});

// Admin Edit Department
router.put('/departments/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const idx = db.departments.findIndex((d) => d._id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ message: 'Department not found.' });
      return;
    }

    const current = db.departments[idx];
    const { name, code, category, description, totalSeats, availableSeats, feePerSemester, eligibilityPercentage, durationYears, coverImage, requirements } = req.body;

    const updatedDept = {
      ...current,
      name: name ?? current.name,
      code: code ? code.toUpperCase() : current.code,
      category: category ?? current.category,
      description: description ?? current.description,
      totalSeats: totalSeats !== undefined ? Number(totalSeats) : current.totalSeats,
      availableSeats: availableSeats !== undefined ? Number(availableSeats) : current.availableSeats,
      feePerSemester: feePerSemester !== undefined ? Number(feePerSemester) : current.feePerSemester,
      eligibilityPercentage: eligibilityPercentage !== undefined ? Number(eligibilityPercentage) : current.eligibilityPercentage,
      durationYears: durationYears !== undefined ? Number(durationYears) : current.durationYears,
      coverImage: coverImage ?? current.coverImage,
      requirements: requirements ?? current.requirements
    };

    db.departments[idx] = updatedDept;
    saveData(db);

    res.json({ message: 'Department updated successfully.', department: updatedDept });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update department.', error: err.message });
  }
});

// Admin Delete Department
router.delete('/departments/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const idx = db.departments.findIndex((d) => d._id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ message: 'Department not found.' });
      return;
    }

    db.departments.splice(idx, 1);
    saveData(db);

    res.json({ message: 'Department deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to delete department.', error: err.message });
  }
});


// ==========================================
// 3. APPLICATION ROUTES
// ==========================================

// Student Submit Application
router.post('/applications', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { departmentId, academicDetails } = req.body;
    const userId = req.user?.id;

    const user = db.users.find((u) => u._id === userId);
    if (!user) {
      res.status(404).json({ message: 'Student profile not found.' });
      return;
    }

    const dept = db.departments.find((d) => d._id === departmentId);
    if (!dept) {
      res.status(404).json({ message: 'Target department not found.' });
      return;
    }

    // Check duplicate
    const existingApp = db.applications.find(
      (a) => a.studentId === userId && a.departmentId === departmentId
    );
    if (existingApp) {
      res.status(400).json({ message: `You have already applied for ${dept.name}.` });
      return;
    }

    const academics = academicDetails || user.academicDetails || {
      matricMarks: 0,
      matricTotal: 1100,
      interMarks: 0,
      interTotal: 1100,
      testMarks: 0,
      testTotal: 100
    };

    // Aggregate formula (30% Matric + 70% Inter)
    const matricPct = (academics.matricMarks / (academics.matricTotal || 1100)) * 100;
    const interPct = (academics.interMarks / (academics.interTotal || 1100)) * 100;
    const testPct = academics.testMarks && academics.testTotal ? (academics.testMarks / academics.testTotal) * 100 : 0;

    let aggregate = 0;
    if (testPct > 0) {
      // 20% Matric, 50% Inter, 30% Test
      aggregate = parseFloat((matricPct * 0.2 + interPct * 0.5 + testPct * 0.3).toFixed(2));
    } else {
      // 30% Matric, 70% Inter
      aggregate = parseFloat((matricPct * 0.3 + interPct * 0.7).toFixed(2));
    }

    const newApp = {
      _id: generateId(),
      studentId: user._id,
      studentName: user.name,
      studentEmail: user.email,
      cnic: user.cnic || 'N/A',
      phone: user.phone || 'N/A',
      departmentId: dept._id,
      departmentName: dept.name,
      departmentCode: dept.code,
      academicDetails: academics,
      calculatedAggregate: aggregate,
      status: 'pending',
      feeStatus: 'unpaid',
      submittedAt: new Date().toISOString(),
      reviewNotes: 'Application submitted and queued for verification.'
    };

    db.applications.push(newApp);
    saveData(db);

    res.status(201).json({
      message: 'Application submitted successfully.',
      application: newApp
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to submit application.', error: err.message });
  }
});

// Student View My Applications
router.get('/applications/my', authenticateToken, (req: AuthRequest, res: Response) => {
  const myApps = db.applications.filter((a) => a.studentId === req.user?.id);
  res.json({ applications: myApps });
});

// Admin View All Applications
router.get('/applications/admin', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  res.json({ applications: db.applications });
});

// Admin Review / Update Application Status
router.put('/applications/:id/status', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const { status, reviewNotes } = req.body;
    const appIndex = db.applications.findIndex((a) => a._id === req.params.id);

    if (appIndex === -1) {
      res.status(404).json({ message: 'Application not found.' });
      return;
    }

    const app = db.applications[appIndex];
    if (status) app.status = status;
    if (reviewNotes !== undefined) app.reviewNotes = reviewNotes;

    // Generate fee challan number if approved
    if (status === 'approved' && !app.challanNumber) {
      app.challanNumber = `CHAL-2026-${app.departmentCode}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    db.applications[appIndex] = app;
    saveData(db);

    res.json({ message: 'Application status updated.', application: app });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update application.', error: err.message });
  }
});

// Pay Fee Challan
router.put('/applications/:id/pay-fee', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const appIndex = db.applications.findIndex((a) => a._id === req.params.id);
    if (appIndex === -1) {
      res.status(404).json({ message: 'Application not found.' });
      return;
    }

    const app = db.applications[appIndex];
    app.feeStatus = 'paid';
    app.status = 'approved';

    // Reduce available seats
    const deptIdx = db.departments.findIndex((d) => d._id === app.departmentId);
    if (deptIdx !== -1 && db.departments[deptIdx].availableSeats > 0) {
      db.departments[deptIdx].availableSeats -= 1;
    }

    db.applications[appIndex] = app;
    saveData(db);

    res.json({ message: 'Fee payment processed successfully! Admission confirmed.', application: app });
  } catch (err: any) {
    res.status(500).json({ message: 'Payment processing failed.', error: err.message });
  }
});


// ==========================================
// 4. MERIT LIST & FORMULA CALCULATOR
// ==========================================

// Calculate Aggregate Formula Preview
router.post('/merit-list/calculate', (req: AuthRequest, res: Response) => {
  const { matricMarks, matricTotal = 1100, interMarks, interTotal = 1100, testMarks = 0, testTotal = 100, formula } = req.body;

  const wMatric = formula?.matric ?? 30;
  const wInter = formula?.inter ?? 70;
  const wTest = formula?.test ?? 0;

  const mPct = (Number(matricMarks) / Number(matricTotal)) * 100;
  const iPct = (Number(interMarks) / Number(interTotal)) * 100;
  const tPct = Number(testMarks) > 0 ? (Number(testMarks) / Number(testTotal)) * 100 : 0;

  const totalWeight = wMatric + wInter + wTest;
  const normMatric = (wMatric / totalWeight);
  const normInter = (wInter / totalWeight);
  const normTest = (wTest / totalWeight);

  const aggregate = (mPct * normMatric) + (iPct * normInter) + (tPct * normTest);

  res.json({
    matricPercentage: parseFloat(mPct.toFixed(2)),
    interPercentage: parseFloat(iPct.toFixed(2)),
    testPercentage: parseFloat(tPct.toFixed(2)),
    calculatedAggregate: parseFloat(aggregate.toFixed(2)),
    formulaUsed: `${wMatric}% Matric + ${wInter}% Inter ${wTest > 0 ? '+ ' + wTest + '% Test' : ''}`
  });
});

// Admin Auto-Generate Merit List
router.post('/merit-list/generate', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const { departmentId, listNumber = 1, formula = { matric: 30, inter: 70, test: 0 }, publishImmediately = false } = req.body;

    const dept = db.departments.find((d) => d._id === departmentId);
    if (!dept) {
      res.status(404).json({ message: 'Department not found.' });
      return;
    }

    // Get all applicants for this department
    const deptApps = db.applications.filter((a) => a.departmentId === departmentId);

    if (deptApps.length === 0) {
      res.status(400).json({ message: `No applicants found for ${dept.name}.` });
      return;
    }

    // Re-calculate aggregates based on formula
    const wM = formula.matric / 100;
    const wI = formula.inter / 100;
    const wT = (formula.test || 0) / 100;

    const rankedApps = deptApps.map((app) => {
      const mPct = (app.academicDetails.matricMarks / (app.academicDetails.matricTotal || 1100)) * 100;
      const iPct = (app.academicDetails.interMarks / (app.academicDetails.interTotal || 1100)) * 100;
      const tPct = app.academicDetails.testMarks && app.academicDetails.testTotal ? (app.academicDetails.testMarks / app.academicDetails.testTotal) * 100 : 0;

      const agg = parseFloat(((mPct * wM) + (iPct * wI) + (tPct * wT)).toFixed(2));
      return { ...app, calculatedAggregate: agg };
    });

    // Sort descending by aggregate
    rankedApps.sort((a, b) => b.calculatedAggregate - a.calculatedAggregate);

    const totalSeats = dept.totalSeats || 50;
    const selectedStudents = rankedApps.map((app, index) => ({
      studentId: app.studentId,
      studentName: app.studentName,
      cnic: app.cnic,
      rank: index + 1,
      aggregate: app.calculatedAggregate,
      status: index < totalSeats ? ('selected' as const) : ('waiting' as const),
      applicationId: app._id
    }));

    const cutoffAggregate = selectedStudents.length > 0 ? selectedStudents[Math.min(selectedStudents.length - 1, totalSeats - 1)].aggregate : 0;

    // Check if Merit List for this listNumber already exists
    const existingIndex = db.meritLists.findIndex((m) => m.departmentId === departmentId && m.listNumber === listNumber);

    const newMeritList = {
      _id: existingIndex !== -1 ? db.meritLists[existingIndex]._id : generateId(),
      departmentId: dept._id,
      departmentName: dept.name,
      listNumber: Number(listNumber) as 1 | 2 | 3,
      formulaWeightage: formula,
      cutoffAggregate,
      totalSeats,
      selectedStudents,
      isPublished: Boolean(publishImmediately),
      generatedAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      db.meritLists[existingIndex] = newMeritList;
    } else {
      db.meritLists.push(newMeritList);
    }

    // Auto update application statuses to shortlisted for selected students
    selectedStudents.forEach((st) => {
      if (st.status === 'selected') {
        const appIdx = db.applications.findIndex((a) => a._id === st.applicationId);
        if (appIdx !== -1 && db.applications[appIdx].status === 'pending') {
          db.applications[appIdx].status = 'shortlisted';
        }
      }
    });

    saveData(db);

    res.json({
      message: `${listNumber}${listNumber === 1 ? 'st' : listNumber === 2 ? 'nd' : 'rd'} Merit List generated successfully!`,
      meritList: newMeritList
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to generate merit list.', error: err.message });
  }
});

// Get Published Merit Lists (Public View)
router.get('/merit-list/public', (_req: AuthRequest, res: Response) => {
  const published = db.meritLists.filter((m) => m.isPublished);
  res.json({ meritLists: published });
});

// Admin Get All Merit Lists
router.get('/merit-list/all', authenticateToken, requireAdmin, (_req: AuthRequest, res: Response) => {
  res.json({ meritLists: db.meritLists });
});

// Admin Toggle Publish/Unpublish
router.put('/merit-list/:id/toggle-publish', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const idx = db.meritLists.findIndex((m) => m._id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ message: 'Merit list not found.' });
    return;
  }

  db.meritLists[idx].isPublished = !db.meritLists[idx].isPublished;
  saveData(db);

  res.json({
    message: `Merit List is now ${db.meritLists[idx].isPublished ? 'Published to Public Portal' : 'Unpublished (Draft)'}.`,
    meritList: db.meritLists[idx]
  });
});


// ==========================================
// 5. ANNOUNCEMENTS
// ==========================================

router.get('/announcements', (_req: AuthRequest, res: Response) => {
  res.json({ announcements: db.announcements });
});

router.post('/announcements', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { title, content, category, isImportant } = req.body;
  if (!title || !content) {
    res.status(400).json({ message: 'Title and content are required.' });
    return;
  }

  const newAnn = {
    _id: generateId(),
    title,
    content,
    category: category || 'General',
    date: new Date().toISOString().split('T')[0],
    isImportant: Boolean(isImportant)
  };

  db.announcements.unshift(newAnn);
  saveData(db);

  res.status(201).json({ message: 'Announcement created.', announcement: newAnn });
});


// ==========================================
// 6. DASHBOARD ANALYTICS
// ==========================================

router.get('/analytics', authenticateToken, requireAdmin, (_req: AuthRequest, res: Response) => {
  const totalApplications = db.applications.length;
  const totalDepartments = db.departments.length;
  const totalSeats = db.departments.reduce((acc, d) => acc + (d.totalSeats || 0), 0);
  const acceptedStudents = db.applications.filter((a) => a.status === 'approved').length;
  const pendingApprovals = db.applications.filter((a) => a.status === 'pending').length;
  const rejectedStudents = db.applications.filter((a) => a.status === 'rejected').length;
  const shortlistedStudents = db.applications.filter((a) => a.status === 'shortlisted').length;
  const paidChallans = db.applications.filter((a) => a.feeStatus === 'paid').length;

  const totalRevenue = db.applications
    .filter((a) => a.feeStatus === 'paid')
    .reduce((sum, a) => {
      const dept = db.departments.find((d) => d._id === a.departmentId);
      return sum + (dept ? dept.feePerSemester : 1000);
    }, 0);

  res.json({
    analytics: {
      totalApplications,
      totalDepartments,
      totalSeats,
      acceptedStudents,
      pendingApprovals,
      rejectedStudents,
      shortlistedStudents,
      paidChallans,
      totalRevenue
    }
  });
});
