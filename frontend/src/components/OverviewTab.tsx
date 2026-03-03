'use client';
import { Overview, TestResult, Medication } from '@/types';

interface OverviewTabProps {
  overview: Overview | Record<string, unknown>;
}

export default function OverviewTab({ overview }: OverviewTabProps) {
  const ov = overview as Overview;

  if (ov.error) {
    return (
      <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        {ov.error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {ov.patient_info && Object.values(ov.patient_info).some(Boolean) && (
        <section>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">👤 Patient Information</h3>
          <div className="grid grid-cols-2 gap-3">
            {ov.patient_info.name && <InfoRow label="Name" value={ov.patient_info.name} />}
            {ov.patient_info.age && <InfoRow label="Age" value={ov.patient_info.age} />}
            {ov.patient_info.gender && <InfoRow label="Gender" value={ov.patient_info.gender} />}
            {ov.patient_info.patient_id && <InfoRow label="Patient ID" value={ov.patient_info.patient_id} />}
          </div>
        </section>
      )}

      {ov.hospital_info && Object.values(ov.hospital_info).some(Boolean) && (
        <section>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">🏥 Hospital / Lab Information</h3>
          <div className="grid grid-cols-2 gap-3">
            {ov.hospital_info.hospital_name && <InfoRow label="Hospital" value={ov.hospital_info.hospital_name} />}
            {ov.hospital_info.referring_doctor && <InfoRow label="Referring Doctor" value={ov.hospital_info.referring_doctor} />}
            {ov.hospital_info.consulting_doctor && <InfoRow label="Consulting Doctor" value={ov.hospital_info.consulting_doctor} />}
            {ov.hospital_info.report_date && <InfoRow label="Report Date" value={ov.hospital_info.report_date} />}
          </div>
        </section>
      )}

      {ov.test_results && ov.test_results.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">🧪 Test Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="text-left p-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Test</th>
                  <th className="text-left p-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Value</th>
                  <th className="text-left p-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Reference Range</th>
                  <th className="text-left p-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {ov.test_results.map((test: TestResult, i: number) => (
                  <tr key={i} className={test.is_abnormal ? 'bg-red-50 dark:bg-red-900/20' : ''}>
                    <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">{test.test_name}</td>
                    <td className={`p-3 border border-gray-200 dark:border-gray-700 font-medium ${test.is_abnormal ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>{test.value}</td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">{test.reference_range}</td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">
                      {test.is_abnormal ? (
                        <span className="text-xs bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full">Abnormal</span>
                      ) : (
                        <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">Normal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {ov.abnormal_findings && ov.abnormal_findings.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">⚠️ Abnormal Findings</h3>
          <ul className="space-y-2">
            {ov.abnormal_findings.map((finding: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <span>•</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {ov.medications && ov.medications.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">💊 Medications</h3>
          <div className="space-y-2">
            {ov.medications.map((med: Medication, i: number) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <InfoRow label="Medicine" value={med.medicine_name} />
                <InfoRow label="Dosage" value={med.dosage} />
                <InfoRow label="Frequency" value={med.frequency} />
                <InfoRow label="Duration" value={med.duration} />
              </div>
            ))}
          </div>
        </section>
      )}

      {!ov.patient_info && !ov.hospital_info && !ov.test_results && !ov.medications && !ov.abnormal_findings && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No structured data extracted.</p>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</p>
    </div>
  );
}
