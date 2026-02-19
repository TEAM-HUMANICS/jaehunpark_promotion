'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PurchaseModal({ isOpen, onClose }: PurchaseModalProps) {
  // 모달이 열렸을 때 body에 클래스 추가하여 StickyCTA 숨기기
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    facility: '',
    discountCode: 'JAEHUNSEGYM',
    availableTime: '',
    privacyAgree: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [discountCodeError, setDiscountCodeError] = useState('');

  // 할인코드 (실제 운영 시 환경변수나 설정 파일로 관리)
  const VALID_DISCOUNT_CODES = ['K7M9P2X4Q1', 'JAEHUNSEGYM'];

  // 전화번호 자동 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    if (numbers.length <= 11) return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 할인코드 검증
    const trimmedCode = formData.discountCode.trim().toUpperCase();
    if (!VALID_DISCOUNT_CODES.includes(trimmedCode)) {
      setDiscountCodeError('올바른 할인 코드를 입력해주세요.');
      return;
    }
    
    setDiscountCodeError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          discountCode: trimmedCode,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          setFormData({
            name: '',
            phone: '',
            facility: '',
            discountCode: 'JAEHUNSEGYM',
            availableTime: '',
            privacyAgree: false,
          });
          setDiscountCodeError('');
        }, 2000);
      } else {
        alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // 연락처 자동 포맷팅
    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
      return;
    }
    
    // 할인코드 입력 시 에러 메시지 초기화
    if (name === 'discountCode') {
      setDiscountCodeError('');
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 모달 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              className="relative my-auto w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border-2 border-ember-500/50 bg-gradient-to-br from-void-800 to-void-900 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-20 rounded-full p-2 text-chrome-400 transition-colors hover:bg-void-700 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* 스크롤 가능한 콘텐츠 영역 */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {/* 성공 메시지 */}
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center md:p-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                    >
                      <CheckCircle2 className="mx-auto h-16 w-16 text-ember-400" />
                    </motion.div>
                    <h3 className="mt-6 text-2xl font-black text-white">
                      신청이 완료되었습니다!
                    </h3>
                    <p className="mt-2 text-chrome-400">
                      담당 매니저가 곧 연락드리겠습니다.
                    </p>
                  </div>
                ) : (
                  <div className="p-6 md:p-10">
                  {/* 헤더 */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-black text-white md:text-3xl">
                      박재훈 선수 구독자들을 위한
                      <br />
                      <span className="text-ember-400">특별 혜택 신청</span>
                    </h2>
                    <p className="mt-3 text-sm text-chrome-400">
                      아래 정보를 입력해 주시면, 담당 매니저가 연락드려 상담 및 결제 시{' '}
                      <span className="font-bold text-ember-400">박재훈 특별 프로모션 할인</span>을 적용해 드립니다.
                    </p>
                  </div>

                  {/* 폼 */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* 성함 */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white">
                        성함을 남겨주세요 <span className="text-ember-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-void-600 bg-void-900 px-4 py-3 text-white placeholder-chrome-500 focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/50"
                        placeholder="홍길동"
                      />
                    </div>

                    {/* 연락처 */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white">
                        연락처를 남겨주세요 <span className="text-ember-400">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-void-600 bg-void-900 px-4 py-3 text-white placeholder-chrome-500 focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/50"
                        placeholder="000-0000-0000"
                      />
                    </div>

                    {/* 시설명 */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white">
                        운영하고 계신 시설명을 남겨주세요 <span className="text-ember-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="facility"
                        value={formData.facility}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-void-600 bg-void-900 px-4 py-3 text-white placeholder-chrome-500 focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/50"
                        placeholder="시설명을 입력해주세요"
                      />
                    </div>

                    {/* 할인 코드 */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white">
                        박재훈 선수 전용 할인 코드를 남겨주세요 <span className="text-ember-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="discountCode"
                        value={formData.discountCode}
                        onChange={handleChange}
                        required
                        className={`w-full rounded-lg border px-4 py-3 text-white placeholder-chrome-500 focus:outline-none focus:ring-2 ${
                          discountCodeError
                            ? 'border-ember-500 bg-void-900 focus:border-ember-500 focus:ring-ember-500/50'
                            : 'border-void-600 bg-void-900 focus:border-ember-500 focus:ring-ember-500/50'
                        }`}
                        placeholder="할인 코드 입력"
                      />
                      {discountCodeError && (
                        <p className="mt-2 text-sm text-ember-400">{discountCodeError}</p>
                      )}
                    </div>

                    {/* 상담 가능한 시간 */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-white">
                        상담 가능한 시간을 남겨주세요
                      </label>
                      <input
                        type="text"
                        name="availableTime"
                        value={formData.availableTime}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-void-600 bg-void-900 px-4 py-3 text-white placeholder-chrome-500 focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/50"
                        placeholder="예: 평일 오후 2시~6시, 주말 오전 10시~12시"
                      />
                    </div>

                    {/* 개인정보 동의 */}
                    <div className="rounded-lg border border-void-600 bg-void-900/50 p-4">
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          name="privacyAgree"
                          checked={formData.privacyAgree}
                          onChange={handleChange}
                          required
                          className="mt-1 h-4 w-4 flex-shrink-0 rounded border-void-600 bg-void-800 text-ember-500 focus:ring-ember-500"
                        />
                        <div className="flex-1 text-xs text-chrome-400">
                          <span className="font-semibold text-white">개인정보 수집 및 활용 동의</span>
                          <span className="text-ember-400"> *</span>
                          <p className="mt-2 leading-relaxed">
                            (주)휴머닉스는 박재훈 선수 앰버서더 프로모션 진행을 위해 아래와 같이 개인정보를 수집·이용하고자 합니다.
                            <br />
                            <br />
                            <strong>수집 항목:</strong> 성함, 연락처, 운영 시설명
                            <br />
                            <strong>이용 목적:</strong> 박재훈 선수 앰버서더 혜택 적용 대상 확인, 제품 상담 및 견적 안내
                            <br />
                            <strong>보유 기간:</strong> 상담 및 구매 완료 시까지
                            <br />
                            <br />
                            동의를 거부할 권리가 있으나, 거부 시 박재훈 선수 전용 특별 프로모션 할인 혜택 적용 및 상담 예약이 제한될 수 있습니다.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* 제출 버튼 */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-cta-hero w-full rounded-xl px-8 py-4 text-lg font-bold text-white transition-opacity disabled:opacity-50"
                    >
                      {isSubmitting ? '제출 중...' : '특별 혜택 신청하기'}
                    </button>
                  </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
