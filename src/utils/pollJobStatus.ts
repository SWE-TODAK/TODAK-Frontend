import { getJobStatus, JobStatusResponse } from '../api/recordingApi';

const pollJobUntilDone= async (
  jobId: string,
  intervalMs: number = 2000,
  timeoutMs: number = 180000,
): Promise<JobStatusResponse> => {
  const startTime = Date.now();

  while (true) {
    const result = await getJobStatus(jobId);

    console.log('job status:', result);

    if (result.status === 'SUCCEEDED') {
      return result;
    }

    if (result.status === 'FAILED') {
      throw new Error('텍스트 변환 작업 실패');
    }

    if (Date.now() - startTime > timeoutMs) {
      throw new Error('텍스트 변환 작업 시간이 초과되었습니다.');
    }

    await new Promise<void>(resolve =>
      setTimeout(() => resolve(), intervalMs),
    );
  }
};

export default pollJobUntilDone;