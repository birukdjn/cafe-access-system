'use client';

import { CafeScanResponse } from '@/types/cafe';

interface ScanResultModalProps {
  result: CafeScanResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ScanResultModal({ result, isOpen, onClose }: ScanResultModalProps) {
  if (!isOpen || !result) return null;

  const isSuccess = result.accessGranted;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">Scan Result</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className={`p-4 rounded-lg mb-4 ${isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center mb-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
              {isSuccess ? (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <h4 className={`text-lg font-semibold ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                {isSuccess ? 'Access Granted ✓' : 'Access Denied ✗'}
              </h4>
              <p className={`${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                {result.message}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {result.studentName && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Student Name:</span>
              <span className="font-semibold">{result.studentName}</span>
            </div>
          )}
          
          {result.studentId && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Student ID:</span>
              <span className="font-semibold">{result.studentId}</span>
            </div>
          )}
          
          {result.grantedMeal && (
            <div className="flex justify-between border-b pb-2">
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

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
          
          {!isSuccess && (
            <button
              onClick={() => {
                onClose();
                // You could add functionality to reset this student's access here
              }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Reset Access
            </button>
          )}
        </div>
      </div>
    </div>
  );
}