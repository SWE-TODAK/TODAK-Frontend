import ReactNativeBlobUtil from 'react-native-blob-util';

type UploadToS3Params = {
  uploadUrl: string;
  filePath: string;
  mimeType: string;
};

const uploadToS3 = async ({
  uploadUrl,
  filePath,
  mimeType,
}: UploadToS3Params) => {
  const normalizedPath = filePath.startsWith('file://')
    ? filePath.replace('file://', '')
    : filePath;

  console.log('S3 uploadUrl:', uploadUrl);
  console.log('S3 filePath:', normalizedPath);
  console.log('S3 mimeType:', mimeType);

  const res = await ReactNativeBlobUtil.fetch(
    'PUT',
    uploadUrl,
    {
      'Content-Type': 'audio/wav',
    },
    ReactNativeBlobUtil.wrap(normalizedPath),
  );

  const status = res.info().status;

  console.log('S3 upload status:', status);
  console.log('S3 upload response text:', res.text());

  if (status !== 200) {
    throw new Error(`S3 업로드 실패: ${status}`);
  }

  console.log('S3 upload success');
};

export default uploadToS3;