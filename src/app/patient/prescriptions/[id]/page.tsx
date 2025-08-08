'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Patient {
  id: string;
  name: string;
  appointmentDate: string;
  age?: string;
  sex?: string;
  weight?: string;
  diagnosis?: string;
}

interface Prescription {
  id: string;
  patientId: string;
  medicines: string[];
  dosage: string;
  duration: string;
  notes: string;
}

export default function PrescriptionViewPage() {
  const params = useParams();
  const router = useRouter();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const storedPrescriptions = localStorage.getItem('prescriptions');
    const storedAppointments = localStorage.getItem('appointments');

    if (storedPrescriptions) {
      const found = JSON.parse(storedPrescriptions).find((p: Prescription) => p.id === params.id);
      setPrescription(found);
      if (storedAppointments && found) {
        const pat = JSON.parse(storedAppointments).find((a: Patient) => a.id === found.patientId);
        setPatient(pat);
      }
    }
  }, [params.id]);

  if (!prescription || !patient) {
    return <p className="p-6 text-gray-600">Prescription not found.</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => router.back()}
        className="mb-4 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
      >
        Back
      </button>

      <div className="relative w-[800px] mx-auto border shadow-lg">
        {/* Background Template */}
        <Image
          src="/doctor_pre.png"
          alt="Prescription Template"
          width={800}
          height={1100}
        />

        {/* Doctor Name & Qualification */}
        <span className="absolute top-[65px] left-[205px] text-[20px] font-bold text-black">
          Dr. Andrew Staton
        </span>
        <span className="absolute top-[95px] left-[205px] text-[14px] text-gray-600 tracking-wide">
          MBBS, MD (Cardiology)
        </span>

        {/* Patient Name */}
        <span className="absolute top-[225px] left-[140px] text-[16px] font-bold text-black">
          Patient Name: {patient.name}
        </span>

        {/* Date */}
        <span className="absolute top-[225px] right-[110px] text-[16px] text-black">
          Date: {patient.appointmentDate}
        </span>

        {/* Medicines */}
        <div className="absolute top-[350px] left-[100px] right-[80px] text-[16px] leading-relaxed text-black font-bold">
          {prescription.medicines.map((med, idx) => (
            <div key={idx}>
              {med} — {prescription.dosage} — {prescription.duration}
            </div>
          ))}
          {prescription.notes && (
            <div className="mt-2 italic">{prescription.notes}</div>
          )}
        </div>
      </div>
    </div>
  );
}
 