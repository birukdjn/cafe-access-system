"use client";

import { CafeScanResponse } from "@/types/cafe";

interface ModalProps {
  result: CafeScanResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ScanResultModal({ result, isOpen, onClose }: ModalProps) {
  if (!isOpen || !result) return null;

  const isSuccess = result.accessGranted;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">Scan Result</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* Status Section */}
        <div className={`p-4 rounded-lg mb-4 border ${isSuccess ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
          <p className={`font-semibold ${isSuccess ? "text-green-800" : "text-red-800"}`}>
            {isSuccess ? "Access Granted ✓" : "Access Denied ✗"}
          </p>
          <p className={`${isSuccess ? "text-green-600" : "text-red-600"}`}>
            {result.message}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-3 text-sm">
          {result.studentName && (
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-600">Student Name:</span>
              <span className="font-semibold">{result.studentName}</span>
            </div>
          )}

          {result.studentId && (
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-600">Student ID:</span>
              <span className="font-semibold">{result.studentId}</span>
            </div>
          )}

          {result.grantedMeal && (
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-600">Meal:</span>
              <span className="font-semibold">{result.grantedMeal}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">Scan Time:</span>
            <span className="font-semibold">
              {new Date(result.scanTime).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Close
          </button>

          {!isSuccess && (
            <button
              className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-200"
            >
              Reset Access
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
