import React from 'react';
import { X, Printer, Download, GraduationCap, CheckCircle, Building } from 'lucide-react';
import { Application, Department } from '../types';

interface FeeChallanModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  department: Department | null;
  onMarkAsPaid?: (appId: string) => void;
}

export const FeeChallanModal: React.FC<FeeChallanModalProps> = ({
  isOpen,
  onClose,
  application,
  department,
  onMarkAsPaid
}) => {
  if (!isOpen || !application) return null;

  const challanNo = application.challanNumber || `CHAL-2026-${application.departmentCode}-` + Math.floor(1000 + Math.random() * 9000);
  const tuitionFee = department ? department.feePerSemester : 1200;
  const admissionFee = 150;
  const securityDeposit = 100;
  const totalAmount = tuitionFee + admissionFee + securityDeposit;

  const handlePrint = () => {
    window.print();
  };

  const renderChallanCopy = (copyType: 'BANK COPY' | 'UNIVERSITY COPY' | 'STUDENT COPY') => (
    <div className="border-2 border-slate-700 bg-white text-slate-900 p-4 rounded-xl shadow-sm text-xs font-sans space-y-3 relative">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-300 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-900 text-white flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-indigo-950 uppercase">APEX UNIVERSITY</h3>
            <p className="text-[10px] text-slate-600 font-semibold">Official Bank Fee Deposit Challan</p>
          </div>
        </div>
        <div className="text-right">
          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-[10px] uppercase">
            {copyType}
          </span>
          <p className="text-[10px] text-slate-500 mt-0.5">Due: Aug 15, 2026</p>
        </div>
      </div>

      {/* Bank Deposit Box */}
      <div className="bg-slate-100 p-2 rounded border border-slate-300 text-[10px] space-y-0.5">
        <p className="font-bold text-slate-800 flex items-center gap-1">
          <Building className="w-3 h-3 text-indigo-800" /> Allied Bank Ltd / HBL (Account No: 001004592001)
        </p>
        <p className="text-slate-600">Branch: University Campus Branch, Lahore (Code: 0142)</p>
      </div>

      {/* Student Meta */}
      <div className="grid grid-cols-2 gap-1.5 text-[11px] border-b border-slate-200 pb-2">
        <div>
          <span className="text-slate-500 block text-[10px]">Challan No:</span>
          <span className="font-bold text-indigo-900">{challanNo}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Student Name:</span>
          <span className="font-bold text-slate-900">{application.studentName}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">CNIC / B-Form:</span>
          <span className="font-medium text-slate-800">{application.cnic}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Department:</span>
          <span className="font-bold text-slate-800">{application.departmentName}</span>
        </div>
      </div>

      {/* Fee Table */}
      <table className="w-full text-left text-[11px] border-collapse">
        <thead>
          <tr className="border-b border-slate-300 text-slate-600">
            <th className="py-1">Description</th>
            <th className="py-1 text-right">Amount ($)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-slate-700">
          <tr>
            <td className="py-1">Tuition Fee (Semester 1)</td>
            <td className="py-1 text-right font-medium">${tuitionFee}</td>
          </tr>
          <tr>
            <td className="py-1">Admission Registration Fee</td>
            <td className="py-1 text-right font-medium">${admissionFee}</td>
          </tr>
          <tr>
            <td className="py-1">Refundable Library Deposit</td>
            <td className="py-1 text-right font-medium">${securityDeposit}</td>
          </tr>
          <tr className="font-bold text-indigo-950 text-xs bg-indigo-50/60">
            <td className="py-1.5 pl-1">Total Payable Amount</td>
            <td className="py-1.5 pr-1 text-right">${totalAmount}</td>
          </tr>
        </tbody>
      </table>

      {/* Barcode Mock */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-200">
        <div className="font-mono text-[9px] text-slate-400 tracking-widest bg-slate-100 px-2 py-1 rounded">
          ||||| | |||| ||| |||||| | ||||||| {challanNo}
        </div>
        <div className="text-[10px] text-slate-500 italic">
          Bank Officer Sign & Stamp
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Official Admission Fee Challan & Form</h2>
              <p className="text-xs text-slate-400">Application Reference: {application._id.substring(0, 10)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>

            {application.feeStatus !== 'paid' && onMarkAsPaid && (
              <button
                onClick={() => onMarkAsPaid(application._id)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/30"
              >
                <CheckCircle className="w-4 h-4" /> Mark Fee as Paid
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Section */}
        <div className="p-6 bg-slate-950 max-h-[80vh] overflow-y-auto">
          {application.feeStatus === 'paid' && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <p className="font-bold text-sm">Fee Paid & Admission Confirmed!</p>
                  <p className="text-xs text-emerald-300/80">Your roll number and class timetable will be sent via SMS/Email.</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase">
                PAID
              </span>
            </div>
          )}

          {/* 3 Copy Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderChallanCopy('BANK COPY')}
            {renderChallanCopy('UNIVERSITY COPY')}
            {renderChallanCopy('STUDENT COPY')}
          </div>
        </div>
      </div>
    </div>
  );
};
