/**
 * BLOB 데이터나 Base64 문자열을 data URI로 변환하는 함수
 * @param {string} imageData - 이미지 데이터 (Base64 문자열, data URI, 또는 URL)
 * @returns {string} - 포맷팅된 이미지 URL
 */
export const formatImageUrl = (imageData) => {
  if (!imageData) return "";

  // 이미 data URI 형식이거나 URL인 경우 그대로 반환
  if (imageData.startsWith("data:") || imageData.startsWith("http")) {
    return imageData;
  }

  // Base64 문자열인 경우 data URI로 변환
  // SVG 여부 확인 (base64 디코딩 후 <svg 태그 확인)
  try {
    const decoded = atob(imageData.substring(0, Math.min(100, imageData.length)));
    if (decoded.trim().startsWith("<svg") || decoded.includes("<svg")) {
      return `data:image/svg+xml;base64,${imageData}`;
    }
  } catch (e) {
    // base64 디코딩 실패 시 무시
  }

  // 기본적으로 JPEG로 처리
  return `data:image/jpeg;base64,${imageData}`;
};
