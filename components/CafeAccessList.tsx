// app/components/CafeAccessList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getCafeAccessRecords } from '@/services/CafeAccessService'; // Adjust path
import { CafeAccessRecord } from '@/types/cafe';

export default function CafeAccessList() {
  const [records, setRecords] = useState<CafeAccessRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        // Call the centralized service function
        const data = await getCafeAccessRecords();
        setRecords(data);
      } catch (err) {
        // Set the error state based on the thrown error
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []); // Empty array runs only once on component mount

  if (loading) {
    return <div className="p-4">Loading cafe access records...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4 text-black">
      <h1 className="text-xl font-bold mb-4">Cafe Access Records ({records.length})</h1>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">ID</th>
            <th className="border p-2 text-left">Student Name</th>
            <th className="border p-2 text-left">Scannable Code</th>
            <th className="border p-2 text-left">Breakfast</th>
            <th className="border p-2 text-left">Lunch</th>
            <th className="border p-2 text-left">Dinner</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.cafeAccessId} className="hover:bg-gray-50">
              <td className="border p-2">{record.cafeAccessId}</td>
              <td className="border p-2">{record.studentName}</td>
              <td className="border p-2 font-mono text-sm">{record.scannableIdCode}</td>
              <td className={`border p-2 ${record.hasAccessedBreakfast ? 'text-green-600' : 'text-red-600'}`}>
                {record.hasAccessedBreakfast ? '✅' : '❌'}
              </td>
              <td className={`border p-2 ${record.hasAccessedLunch ? 'text-green-600' : 'text-red-600'}`}>
                {record.hasAccessedLunch ? '✅' : '❌'}
              </td>
              <td className={`border p-2 ${record.hasAccessedDinner ? 'text-green-600' : 'text-red-600'}`}>
                {record.hasAccessedDinner ? '✅' : '❌'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}