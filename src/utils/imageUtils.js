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
  return `data:image/jpeg;base64,${imageData}`;
};
