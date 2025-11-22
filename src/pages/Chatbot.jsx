import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate, Link, useBlocker } from "react-router-dom";
import PostingCard from "../components/chatbot/PostingCard";
import PostingDetailCard from "../components/chatbot/PostingDetailCard";
import ApplicationCard from "../components/chatbot/ApplicationCard";
import UserProfileCard from "../components/chatbot/UserProfileCard";
import BillingCard from "../components/chatbot/BillingCard";
import BillingDetailCard from "../components/chatbot/BillingDetailCard";
import ApplicantCard from "../components/chatbot/ApplicantCard";

export default function Chatbot() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // 사용자 ID 가져오기

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // 페이지 이동 방지
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      messages.length > 0 &&
      currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      const shouldLeave = window.confirm(
        "대화 내용이 삭제될 수 있습니다. 정말 나가시겠습니까?"
      );
      if (shouldLeave) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  // 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/signin");
      return;
    }
  }, [token, navigate]);

  // 페이지 나가기 전 경고
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (messages.length > 0) {
        e.preventDefault();
        e.returnValue = "대화 내용이 삭제될 수 있습니다. 정말 나가시겠습니까?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [messages]);

  // 새 대화 시작
  const startNewChat = () => {
    if (confirm("새 대화를 시작하시겠습니까?")) {
      setSessionId(null);
      setMessages([]);
    }
  };

  // functionResults 렌더링 함수
  const renderFunctionResults = (functionResults) => {
    if (!functionResults || functionResults.length === 0) return null;

    return functionResults.map((result, idx) => {
      const { functionName, data } = result;

      // get_posting_list: 공고 목록 (가로 슬라이딩)
      if (functionName === "get_posting_list" && data?.content) {
        return (
          <div key={idx} className="mt-3">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {data.content.map((posting) => (
                <div key={posting.id} className="flex-shrink-0 w-80">
                  <PostingCard posting={posting} />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              총 {data.content.length}개의 공고
            </p>
          </div>
        );
      }

      // get_posting_detail: 공고 상세
      if (functionName === "get_posting_detail" && data) {
        return (
          <div key={idx} className="mt-3">
            <PostingDetailCard posting={data} />
          </div>
        );
      }

      // create_posting: 공고 생성 결과
      if (functionName === "create_posting" && data) {
        return (
          <div key={idx} className="mt-3">
            <PostingDetailCard posting={data} />
          </div>
        );
      }

      // get_my_applications: 내 지원 내역 (가로 슬라이딩)
      if (functionName === "get_my_applications" && Array.isArray(data)) {
        return (
          <div key={idx} className="mt-3">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {data.map((app) => (
                <div key={app.id} className="flex-shrink-0 w-80">
                  <ApplicationCard application={app} />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                총 {data.length}개의 지원 내역
              </p>
              <Link
                to="/applications"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                지원 목록 페이지 →
              </Link>
            </div>
          </div>
        );
      }

      // get_user_info: 사용자 정보
      if (functionName === "get_user_info" && data) {
        return (
          <div key={idx} className="mt-3">
            <UserProfileCard user={data} />
          </div>
        );
      }

      // update_user_profile, update_company_profile: 프로필 수정 완료 (JSON 출력 안 함)
      if (functionName === "update_user_profile" || functionName === "update_company_profile") {
        return null;
      }

      // apply_to_posting: 공고 지원 완료 (JSON 출력 안 함)
      if (functionName === "apply_to_posting") {
        return null;
      }

      // update_application_status: 지원 상태 변경 완료 (JSON 출력 안 함)
      if (functionName === "update_application_status") {
        return null;
      }

      // get_billing_list: 청구 목록 (기업용, 가로 슬라이딩)
      if (functionName === "get_billing_list" && Array.isArray(data)) {
        return (
          <div key={idx} className="mt-3">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {data.map((billing) => (
                <div key={billing.id} className="flex-shrink-0 w-80">
                  <BillingCard billing={billing} />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                총 {data.length}개의 청구서
              </p>
              <Link
                to="/company/bill"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                청구 목록 페이지 →
              </Link>
            </div>
          </div>
        );
      }

      // get_billing_detail: 청구서 상세
      if (functionName === "get_billing_detail" && data) {
        return (
          <div key={idx} className="mt-3">
            <BillingDetailCard billing={data} />
          </div>
        );
      }

      // get_applications_for_posting: 지원자 목록 (기업용, 가로 슬라이딩)
      if (functionName === "get_applications_for_posting" && Array.isArray(data)) {
        const postingId = data.length > 0 ? data[0].postingId : null;
        return (
          <div key={idx} className="mt-3">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {data.map((applicant) => (
                <div key={applicant.id} className="flex-shrink-0 w-80">
                  <ApplicantCard applicant={applicant} />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                총 {data.length}명의 지원자
              </p>
              {postingId && (
                <Link
                  to={`/company/activity/management/${postingId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  지원자 관리 페이지 →
                </Link>
              )}
            </div>
          </div>
        );
      }

      // 기타: JSON 형태로 표시
      return (
        <div key={idx} className="mt-3 p-3 bg-gray-50 rounded border text-xs">
          <pre className="whitespace-pre-wrap overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      );
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // 사용자 메시지를 UI에 추가
    const userMsg = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // sessionId가 있을 때만 포함
      const requestBody = {
        message: userMessage,
      };
      if (sessionId !== null) {
        requestBody.sessionId = sessionId;
      }

      const res = await fetch(`${API_BASE_URL}/agent/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", res.status, errorText);
        throw new Error(`메시지 전송에 실패했습니다. (${res.status}): ${errorText}`);
      }

      const data = await res.json();
      console.log("API Response:", data);

      // 세션 ID 저장 (첫 메시지인 경우)
      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId);
      }

      // AI 응답을 UI에 추가 (functionResults 포함)
      const newMessage = {
        role: "assistant",
        content: data.message,
        functionResults: data.functionResults || null,
      };

      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI 챗봇</h1>
            <p className="text-sm text-gray-600 mt-1">
              궁금한 것을 물어보세요. 공고 조회, 지원, 프로필 수정 등을
              도와드립니다.
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={startNewChat}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
            >
              새 대화
            </button>
          )}
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-lg mb-2">안녕하세요! 무엇을 도와드릴까요?</p>
              <p className="text-sm text-gray-400">
                예: "공고 목록 보여줘", "내 지원 내역 알려줘", "프로필 수정하고
                싶어"
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-lg px-4 py-3"
                        : "w-full"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    ) : (
                      <div>
                        {/* AI 메시지 텍스트 */}
                        {msg.content && (
                          <div className="bg-white text-gray-900 shadow-sm border rounded-lg px-4 py-3 mb-2">
                            <p className="whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                          </div>
                        )}
                        {/* Function Results 카드 */}
                        {msg.functionResults &&
                          renderFunctionResults(msg.functionResults)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-900 shadow-sm border rounded-lg px-4 py-3">
                    <p className="text-gray-500">입력중...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              전송
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
