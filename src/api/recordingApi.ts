// src/api/recordingApi.ts
import api from './axios';

////////////////////////////////////////////////////////////////
// 1) 녹음 업로드 / STT 처리 관련
// - 녹음 파일 업로드 시작
// - 업로드 완료 알림
// - STT 작업 시작
// - STT 작업 상태 조회
////////////////////////////////////////////////////////////////

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

// 녹음 업로드 시작
// 사용 화면: 녹음 업로드 시작 로직
export const startRecordingUpload = async (
  body: StartUploadRequest,
): Promise<StartUploadResponse> => {
  const res = await api.post('/recordings/upload', body);
  return res.data;
};

// 녹음 파일 업로드 완료 후 백엔드에 업로드 완료 알림
// 사용 화면: 녹음 업로드 완료 처리 로직
export const notifyRecordingUploaded = async (
  recordingId: string,
  body: UploadedRequest,
): Promise<void> => {
  await api.post(`/recordings/${recordingId}/uploaded`, body);
};

// STT 작업 시작
// 사용 화면: 업로드 후 STT 시작 로직
export const startRecordingStt = async (recordingId: string) => {
  const response = await api.post(`/recordings/${recordingId}/stt`);
  return response.data;
};

// STT job 상태 조회
// 사용 화면: 요약 생성/변환 진행 상태 polling
export const getJobStatus = async (
  jobId: string,
): Promise<JobStatusResponse> => {
  const res = await api.get(`/jobs/${jobId}`);
  return res.data;
};

////////////////////////////////////////////////////////////////
// 2) 녹음 메타데이터 저장 관련
// - 병원명, 진단명, 의사명, 진료과, 진료일, 제목 저장
////////////////////////////////////////////////////////////////

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

// 녹음 메타데이터 저장
// 사용 화면: 녹음 후 병원/질환/의사/제목 등 정보 저장 화면
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

////////////////////////////////////////////////////////////////
// 3) 홈 화면 - 최근 진료 기록 간단 조회
// - MainScreen / 홈의 최근 진료 카드용
////////////////////////////////////////////////////////////////

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

// 홈 화면의 최근 진료 기록 조회
// 사용 화면: MainScreen, RecentRecordsSection, RecentRecordsCard
export const getRecentRecordings = async () => {
  const response = await api.get<RecentRecordingApiResponse>('/recordings/recent');

  return response.data.data.map(item => ({
    id: item.recordingId,
    date: item.date,
    title: item.title,
    description: item.intro,
  }));
};

////////////////////////////////////////////////////////////////
// 4) 내 진료 목록 조회
// - Mycare 목록 화면용
// - 날짜별 그룹, 검색, 필터에 사용
////////////////////////////////////////////////////////////////

type MyRecordingListItem = {
  recordingId: string;
  date: string;
  hospitalName: string;
  visitTime: string;
  department: string;
  doctorName: string;
  summary: string;
};

type MyRecordingListResponse = {
  status: number;
  message: string;
  data: MyRecordingListItem[];
};

// Mycare 목록 화면에서 사용하는 프론트용 타입
export type MycareRecord = {
  id: string;
  dateLabel: string;
  clinicName: string;
  timeLabel: string;
  deptName: string;
  doctorName: string;
  diseaseName: string;
  summary: string;
  fullText: string;
  memo: string;
  hasAudio: boolean;
};

// 내 진료 목록 조회
// 사용 화면: Mycare.tsx
export const getMyRecordingList = async (): Promise<MycareRecord[]> => {
  const response = await api.get<MyRecordingListResponse>('/recordings/list/my');

  console.log('📥 내 진료 목록 원본 응답:', response.data);

  const mapped = response.data.data.map(item => ({
    id: item.recordingId,
    dateLabel: item.date,
    clinicName: item.hospitalName ?? '',
    timeLabel: item.visitTime ?? '',
    deptName: item.department ?? '',
    doctorName: item.doctorName ?? '',
    diseaseName: '',
    summary: item.summary ?? '',
    fullText: '',
    memo: '',
    hasAudio: false,
  }));

  console.log('📦 내 진료 목록 변환 데이터:', mapped);

  return mapped;
};

////////////////////////////////////////////////////////////////
// 5) 진료 상세 조회
// - MycareDetail 화면용
// - 진단명, 전체 STT 텍스트, 메모, 오디오 존재 여부 사용
////////////////////////////////////////////////////////////////

type RecordingDetailApiData = {
  recordingId: string;
  date: string;
  hospitalName: string;
  visitTime: string;
  department: string;
  doctorName: string;
  diagnosisName: string;
  summary: string;
  fullTranscription: string;
  audioUrl: string | null;
  memo: string | null;
};

type RecordingDetailApiResponse = {
  status: number;
  message: string;
  data: RecordingDetailApiData;
};

// 상세 화면에서 사용하는 프론트용 타입
export type RecordingDetail = {
  id: string;
  dateLabel: string;
  clinicName: string;
  timeLabel: string;
  deptName: string;
  doctorName: string;
  diseaseName: string;
  summary: string;
  fullText: string;
  memo: string;
  hasAudio: boolean;
  audioUrl?: string | null;
};

// 진료 상세 조회
// 사용 화면: MycareDetail.tsx
export const getRecordingDetail = async (
  recordingId: string,
): Promise<RecordingDetail> => {
  const response = await api.get<RecordingDetailApiResponse>(
    `/recordings/${recordingId}`,
  );

  console.log('📥 녹음 상세 원본 응답:', response.data);

  const item = response.data.data;

  const mapped: RecordingDetail = {
    id: item.recordingId,
    dateLabel: item.date,
    clinicName: item.hospitalName ?? '',
    timeLabel: item.visitTime ?? '',
    deptName: item.department ?? '',
    doctorName: item.doctorName ?? '',
    diseaseName: item.diagnosisName ?? '',
    summary: item.summary ?? '',
    fullText: item.fullTranscription ?? '',
    memo: item.memo ?? '',
    hasAudio: !!item.audioUrl,
    audioUrl: item.audioUrl,
  };

  console.log('📦 녹음 상세 변환 데이터:', mapped);

  return mapped;
};

////////////////////////////////////////////////////////////////
// 6) 진료 기록 삭제
// - MycareDetail의 휴지통 버튼 -> 삭제 확인 모달 confirm 시 사용
////////////////////////////////////////////////////////////////

type DeleteRecordingResponse = {
  status: number;
  message: string;
};

// 진료 기록 삭제
// 사용 화면: MycareDetail.tsx (trash 버튼 / 삭제 confirm)
export const deleteRecording = async (
  recordingId: string,
): Promise<DeleteRecordingResponse> => {
  const response = await api.delete<DeleteRecordingResponse>(
    `/recordings/${recordingId}`,
  );
  return response.data;
};