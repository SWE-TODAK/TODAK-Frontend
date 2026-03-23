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