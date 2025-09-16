// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const posts = [
  {
    id: 1,
    title: '고려대학교 컴퓨터학과 학생 모집',
    href: '#',
    description: '단톡방 홍보',
    pay: '10만원',
    deadline: '2020-03-16',
    company: {
      name: '캠브릿',
      href: '#',
      imageUrl:
        'https://img.albamon.kr/trans/200x80/2016-03-30/1011dud814nvyb1h.gif.png',
    },
  },
]

function Home() {
  return (
    <div>
      <div className="bg-white py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto">
            <h2 className="text-pretty text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">지금 등록된 활동</h2>
            <p className="mt-2 text-lg/8 text-gray-900"></p>
          </div>
          <div className="mx-auto mt-10  grid grid-cols-2 md:grid-cols-4 gap-4">
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.href}
                className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm transition hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="flex justify-center mb-3">
                  <img
                    src={post.company.imageUrl}
                    alt="Company Logo"
                    className="h-12 w-auto object-contain"
                  />
                </div>

                <h5 className="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {post.title}
                </h5>
                <p className="font-normal text-gray-500 dark:text-gray-400">
                  {post.description}
                </p>
                <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
                  {post.pay}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />   {/* 공통 헤더 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}
