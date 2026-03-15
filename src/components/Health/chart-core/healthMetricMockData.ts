// src/components/Health/chart-core/healthMetricMockData.ts

export type BloodPressureRecord = {
  xLabel: string;
  systolic: number;
  diastolic: number;
};

export const bloodPressureMockRecords: BloodPressureRecord[] =
  Array.from({ length: 10 }).map((_, i) => ({
    xLabel: String(i + 1),
    systolic: 115 + Math.round(Math.random() * 25),
    diastolic: 75 + Math.round(Math.random() * 15),
  }));


export type BloodSugarRecord = {
  xLabel: string;
  glucose: number;
};

export const bloodSugarMockRecords: BloodSugarRecord[] =
  Array.from({ length: 10 }).map((_, i) => ({
    xLabel: String(i + 1),
    glucose: 85 + Math.round(Math.random() * 40),
  }));