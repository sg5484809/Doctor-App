'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Patient {
  id: string;
  name: string;
  appointmentDate: string;
}

interface Prescription {
  id: string;
  patientId: string;
  medicines: string[];
  dosage: string;
  duration: string;
  notes: string;
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedPrescriptions = localStorage.getItem('prescriptions');
    if (storedPrescriptions) {
      setPrescriptions(JSON.parse(storedPrescriptions));
    }

    const storedAppointments = localStorage.getItem('appointments');
    if (storedAppointments) {
      setPatients(JSON.parse(storedAppointments));
    }
  }, []);

  const getPatientName = (id: string) => {
    const patient = patients.find((p) => p.id === id);
    return patient ? patient.name : 'Unknown Patient';
  };

  const handleView = (id: string) => {
    router.push(`/patient/prescriptions/${id}`);
  };

  const handleDownload = (id: string) => {
    router.push(`/patient/prescriptions/download/${id}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">
          All Prescriptions
        </h1>
        <button
          onClick={() => router.push('/patient/dashboard')}
          className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded transition"
        >
          Back to Dashboard
        </button>
      </div>

      {prescriptions.length === 0 ? (
        <p className="text-gray-600">No prescriptions found.</p>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-green-700">
                  {getPatientName(p.patientId)}
                </h3>
                <p className="text-gray-800">
                  <strong>Medicines:</strong> {p.medicines.join(', ')}
                </p>
                <p className="text-gray-800">
                  <strong>Dosage:</strong> {p.dosage}
                </p>
                <p className="text-gray-800">
                  <strong>Duration:</strong> {p.duration}
                </p>
                <p className="text-gray-800">
                  <strong>Notes:</strong> {p.notes || 'None'}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleView(p.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  View
                </button>
                <button
                  onClick={() => handleDownload(p.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
