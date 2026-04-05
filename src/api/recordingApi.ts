// src/api/recordingApi.ts
import api from './axios';

export type StartUploadRequest = {
  mimeType: string;
};

export type StartUploadResponse = {
  recordingId: string;
  storageKey: string;
  uploadUrl: string;
  method: 'PUT';
  mimeType: string;
};

export type UploadedRequest = {
  storageKey: string;
  mimeType: string;
  durationMs: number;
  sampleRate: number;
};

export type StartSttResponse = {
  jobId: string;
  recordingId: string;
  jobType: string;
  status: 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
};

export type JobStatusResponse = {
  jobId: string;
  recordingId: string;
  jobType: string;
  status: 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
};

export const startRecordingUpload = async (
  body: StartUploadRequest,
): Promise<StartUploadResponse> => {
  const res = await api.post('/recordings/upload', body);
  return res.data;
};

export const notifyRecordingUploaded = async (
  recordingId: string,
  body: UploadedRequest,
): Promise<void> => {
  await api.post(`/recordings/${recordingId}/uploaded`, body);
};

export const startRecordingStt = async (recordingId: string) => {
  const response = await api.post(`/recordings/${recordingId}/stt`);
  return response.data;
};

export const getJobStatus = async (
  jobId: string,
): Promise<JobStatusResponse> => {
  const res = await api.get(`/jobs/${jobId}`);
  return res.data;
};

export type SaveRecordingMetadataRequest = {
  hospitalName: string;
  diseaseName?: string;
  doctorName?: string;
  departmentName?: string;
  consultedAt?: string;
  title?: string;
};

export type SaveRecordingMetadataResponse = {
  recordingId: string;
  title: string;
  memo: string | null;
  createdAt: string;
  status: string;
  hospitalName: string | null;
  diseaseName: string | null;
  doctorName: string | null;
  departmentName: string | null;
  consultedAt: string | null;
};

export const saveRecordingMetadata = async (
  recordingId: string,
  body: SaveRecordingMetadataRequest,
) => {
  console.log('📤 [metadata 요청]', {
    url: `/recordings/${recordingId}/metadata`,
    body,
  });

  const res = await api.patch(`/recordings/${recordingId}/metadata`, body);

  console.log('📥 [metadata 응답]', res.data);

  return res.data;
};

type RecentRecordingApiItem = {
  recordingId: string;
  date: string;
  intro: string;
  title: string | null;
};

type RecentRecordingApiResponse = {
  status: number;
  message: string;
  data: RecentRecordingApiItem[];
};

export const getRecentRecordings = async () => {
  const response = await api.get<RecentRecordingApiResponse>('/recordings/recent');

  return response.data.data.map(item => ({
    id: item.recordingId,
    date: item.date,
    title: item.title,
    description: item.intro,
  }));
};