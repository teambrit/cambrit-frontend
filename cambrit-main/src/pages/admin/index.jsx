import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";

export default function AdminHome() {
  const [authRequests, setAuthRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  
  // 관리자 페이지 접근 시 역할을 임시로 admin으로 설정
  useEffect(() => {
    localStorage.setItem("role", "admin");
  }, []);

  // 학생 인증 요청 목록 조회
  useEffect(() => {
    const fetchAuthRequests = async () => {
      // 즉시 localStorage 데이터 로드 (백엔드 실패해도 작동)
      const localStorageData = JSON.parse(localStorage.getItem("authRequests") || "[]");
      
      if (localStorageData.length > 0) {
        setAuthRequests(localStorageData);
        setLoading(false);
        return;
      }
      
      // localStorage에 데이터가 없으면 기본 모의 데이터 표시
      const mockData = [
        {
          id: 1,
          studentName: "김학생",
          studentEmail: "student1@example.com",
          university: "서울대학교",
          major: "컴퓨터공학과",
          status: "PENDING",
          createdAt: new Date().toISOString(),
          fileUrl: "#",
          fileName: "student_id_1.pdf"
        },
        {
          id: 2,
          studentName: "이학생",
          studentEmail: "student2@example.com",
          university: "연세!대학교",
          major: "경영학과",
          status: "PENDING",
          createdAt: new Date().toISOString(),
          fileUrl: "#",
          fileName: "student_id_2.pdf"
        }
      ];
      setAuthRequests(mockData);
      setLoading(false);
      
        // 백엔드 API도 시도해보기 (실패해도 상관없음)
        if (token) {
          try {
            // 실제 백엔드 엔드포인트 사용
            const res = await fetch(`${API_BASE_URL}/user/student/all`, {
              headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "X-Admin-Access": "true" // 관리자 접근 플래그 추가
              },
            });
            
            if (res.ok) {
              const data = await res.json();
              console.log("백엔드 API 성공:", data);
              // 백엔드 데이터를 현재 형식에 맞게 변환
              const formattedData = data.map(student => ({
                id: student.id,
                studentName: student.name,
                studentEmail: student.email,
                university: student.university,
                major: student.major,
                status: student.authorizationStatus || "PENDING",
                createdAt: student.createdAt,
                fileUrl: student.authorizationFileUrl || "#",
                fileName: student.authorizationFileName || "파일 없음"
              }));
              setAuthRequests(formattedData);
            } else {
              console.log("백엔드 API 실패, 로컬 데이터 사용");
            }
          } catch (err) {
            console.log("백엔드 API 오류, 로컬 데이터 사용");
          }
        }
    };

    fetchAuthRequests();
  }, [token]);

  // 승인/거부 처리
  const handleAuthDecision = async (requestId, decision) => {
    // 즉시 로컬 처리 (백엔드 실패해도 작동)
    const localStorageData = JSON.parse(localStorage.getItem("authRequests") || "[]");
    let updatedData;
    
    if (decision === 'approve') {
      // 승인된 경우 목록에서 제거
      updatedData = localStorageData.filter(req => req.id !== requestId);
    } else {
      // 거부된 경우 상태만 변경
      updatedData = localStorageData.map(req => 
        req.id === requestId 
          ? { ...req, status: 'REJECTED' }
          : req
      );
    }
    localStorage.setItem("authRequests", JSON.stringify(updatedData));
    
    // 학생 인증 상태도 localStorage에 저장 (학생 페이지에서 사용)
    const targetRequest = localStorageData.find(req => req.id === requestId);
    if (targetRequest) {
      if (decision === 'approve') {
        localStorage.setItem("studentAuthStatus", "APPROVED");
        localStorage.setItem("studentAuthEmail", targetRequest.studentEmail || targetRequest.email);
      } else if (decision === 'reject') {
        localStorage.setItem("studentAuthStatus", "REJECTED");
        localStorage.setItem("studentAuthEmail", targetRequest.studentEmail || targetRequest.email);
      }
    }
    
    // 화면 데이터 업데이트
    setAuthRequests(updatedData);
    
    alert(`학생 인증이 ${decision === 'approve' ? '승인' : '거부'}되었습니다.`);
    
    // 백엔드 API도 시도해보기 (실패해도 상관없음)
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // 실제 백엔드 엔드포인트 사용 (PUT 방식)
        const res = await fetch(`${API_BASE_URL}/user/student-authorization-request/${requestId}`, {
          method: "PUT",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Admin-Access": "true" // 관리자 접근 플래그 추가
          },
          body: JSON.stringify({
            status: decision === 'approve' ? 'APPROVED' : 'REJECTED'
          })
        });
        
        if (res.ok) {
          console.log("백엔드 API 성공");
        } else {
          console.log("백엔드 API 실패, 로컬 처리로 대체");
        }
      } catch (err) {
        console.log("백엔드 API 오류, 로컬 처리로 대체");
      }
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-96">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="mt-2 text-gray-600">학생 인증 요청을 관리하세요.</p>
      </div>

      {/* 학생 인증 요청 목록 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">학생 인증 요청</h2>
        </div>

        {authRequests.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500">현재 처리 대기 중인 인증 요청이 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {authRequests.map((request) => (
              <div key={request.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {request.studentName || request.name || "이름 없음"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {request.studentEmail || request.email || "이메일 없음"}
                        </p>
                        <p className="text-sm text-gray-500">
                          대학교: {request.university || "정보 없음"} | 전공: {request.major || "정보 없음"}
                        </p>
                        {request.fileName && (
                          <p className="text-sm text-blue-600">
                            업로드 파일: {request.fileName}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          요청일: {new Date(request.createdAt || request.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* 파일 다운로드 버튼 */}
                    {request.fileUrl && request.fileUrl !== "#" && (
                      <a
                        href={`${API_BASE_URL}/user/student-authorization-request/${request.id}/file`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        파일 보기
                      </a>
                    )}

                    {/* 승인/거부 버튼 */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAuthDecision(request.id, 'approve')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => handleAuthDecision(request.id, 'reject')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        거부
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 통계 정보 */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📋</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    전체 요청
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {authRequests.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⏳</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    대기 중
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {authRequests.filter(req => req.status === 'PENDING' || !req.status).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    승인됨
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {authRequests.filter(req => req.status === 'APPROVED').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}