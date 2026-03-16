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
  Array.from({ length: 25 }).map((_, i) => ({
    xLabel: String(i + 1),
    glucose: 85 + Math.round(Math.random() * 40),
  }));

  export type LiverRecord = {
    xLabel: string;
    alt: number;
  };

  export const liverMockRecords: LiverRecord[] =
    Array.from({ length: 10 }).map((_, i) => ({
      xLabel: String(i + 1),
      alt: 20 + Math.round(Math.random() * 35),
    }));

  export type KidneyRecord = {
    xLabel: string;
    creatinine: number;
  };

  export const kidneyMockRecords: KidneyRecord[] =
    Array.from({ length: 10 }).map((_, i) => ({
      xLabel: String(i + 1),
      creatinine: 0.7 + Math.random() * 0.8,
    }));


  export type LipidRecord = {
    xLabel: string;
    ldl: number;
    hdl: number;
  };

  export const lipidMockRecords: LipidRecord[] =
    Array.from({ length: 10 }).map((_, i) => ({
      xLabel: String(i + 1),
      ldl: 90 + Math.round(Math.random() * 80),
      hdl: 40 + Math.round(Math.random() * 30),
    }));


  export type BodyRecord = {
    xLabel: string;
    weight: number;
  };

  export const bodyMockRecords: BodyRecord[] =
    Array.from({ length: 10 }).map((_, i) => ({
      xLabel: String(i + 1),
      weight: 60 + Math.round(Math.random() * 15),
    }));