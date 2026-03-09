// src/components/Home/Record/modals/ConsentModal.tsx
import React from 'react';
import ConfirmModal from '../../../common/ConfirmModal';

type Props = {
  visible: boolean;
  onAgree: () => void;
  onDisagree: () => void;
};

const ConsentModal: React.FC<Props> = ({ visible, onAgree, onDisagree }) => {
  return (
    <ConfirmModal
      visible={visible}
      title={`병원 측의 녹음 동의를 받으셨나요?`}
      message={`의료 상담 내용은 개인정보 보호를 위해\n병원 측의 동의가 필요합니다.`}
      cancelText="비동의"
      confirmText="동의"
      onCancel={onDisagree}
      onConfirm={onAgree}
      onBackdropPress={onDisagree}
    />
  );
};

export default ConsentModal;