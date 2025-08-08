'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availability: string;
  time: string;
}

export default function PatientDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('https://6888ed05adf0e59551bbf1a6.mockapi.io/v1/doctors');
        const data = await res.json();
        setDoctors(data);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* Header with Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">
          Available Doctors
        </h1>
        <button
          onClick={() => router.push('/patient/prescriptions')}
          className="bg-green-400 hover:bg-green-500 text-white font-medium py-2 px-4 rounded transition"
        >
          Show Prescriptions
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : doctors.length === 0 ? (
        <p className="text-center text-gray-600">No doctors available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow duration-300 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {doctor.name}
              </h2>
              <p className="text-gray-600 mb-1">
                <strong>Specialization:</strong> {doctor.specialization}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Availability:</strong> {doctor.availability}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Time:</strong> {doctor.time}
              </p>
              <button
                onClick={() => router.push(`/patient/appointment/${doctor.id}`)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
 