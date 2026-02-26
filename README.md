---

# 👗 OOTD (Outfit Of The Day)

> 오늘의 스타일을 공유하고 소통하는 SNS 스타일 웹 서비스
> Built with React, Redux, Express, PostgreSQL

📌 Repository: GitHub - osj1405/OOTD

---

## 🧾 프로젝트 소개

**OOTD (Outfit Of The Day)** 는 사용자가 자신의 스타일(오늘의 착장)을 공유하고,
다른 사용자들의 스타일을 피드 형태로 확인할 수 있는 웹 애플리케이션입니다.

단순한 UI 구현을 넘어,
**JWT 기반 인증 시스템, REST API 설계, PostgreSQL 연동까지 직접 구현한 풀스택 프로젝트**입니다.

---

## 🎯 프로젝트 목표

* React 기반 SPA 구조 설계
* Redux Toolkit을 활용한 전역 상태 관리
* Express 서버 직접 구축 및 RESTful API 구현
* PostgreSQL을 이용한 사용자/게시글 데이터 관리
* JWT 기반 인증 시스템 구현
* Supabase Auth 연동

---

## 🏗️ 기술 스택

### 🖥 Frontend

* React
* Redux Toolkit
* React Router DOM
* Axios
* Supabase Auth
* Zod (입력값 검증)
* UUID

### 🗄 Backend

* Node.js
* Express
* PostgreSQL
* bcrypt (비밀번호 해싱)
* jsonwebtoken (JWT 인증)
* cors

---

## 🧩 시스템 아키텍처

```
[ React Client ]
        ↓ (Axios)
[ Express API Server ]
        ↓
[ PostgreSQL DB ]
```

* 클라이언트는 SPA 구조로 동작
* REST API를 통해 서버와 통신
* 서버는 DB와 연결되어 사용자 및 게시글 데이터 처리
* JWT 기반 인증으로 보호된 API 접근

---

## ✨ 주요 기능

### 👤 사용자 인증

* 회원가입 / 로그인 / 로그아웃
* bcrypt를 이용한 비밀번호 암호화
* JWT 발급 및 검증
* Supabase Auth 연동

### 📝 게시글 (OOTD) 기능

* 스타일 게시글 작성 (이미지 + 텍스트)
* 게시글 조회 (피드 형태)
* 게시글 삭제
* 사용자별 게시글 관리

### 🔐 보안

* 토큰 기반 인증 시스템
* CORS 설정을 통한 안전한 통신
* 비밀번호 해싱 처리

---

## 📂 프로젝트 구조

```
OOTD
 ├── client
 │   ├── src
 │   │   ├── components
 │   │   ├── pages
 │   │   ├── store
 │   │   ├── api
 │   │   └── utils
 │   └── package.json
 │
 └── server
     ├── routes
     ├── controllers
     ├── middleware
     ├── db
     └── package.json
```

---

## 🚀 실행 방법

### 1️⃣ 클라이언트 실행

```bash
cd client
npm install
npm start
```

### 2️⃣ 서버 실행

```bash
cd server
npm install
node index.js
```

### 3️⃣ PostgreSQL 설정

* PostgreSQL 설치 후 DB 생성
* 환경 변수(.env)에 DB 연결 정보 입력

---

## ⚙️ 환경 변수 예시

### server/.env

```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=ootd
JWT_SECRET=your_jwt_secret
```

---

## 🧠 개발 중 겪은 문제 & 해결

### 1️⃣ JWT 인증 흐름 설계

Supabase 인증과 Express JWT 인증을 동시에 사용하면서
토큰 관리 흐름이 충돌하는 문제가 발생했습니다.

➡ 해결

* Supabase는 인증 UI 처리
* Express는 내부 API 보호용 JWT 검증 구조로 역할 분리

---

### 2️⃣ 전역 상태 관리 문제

로그인 후 상태 유지 및 피드 갱신 시
Redux 상태 동기화 문제가 발생

➡ 해결

* Redux Toolkit slice 분리
* 비동기 thunk 로직 정리
* 로그인/로그아웃 시 상태 초기화 처리

---

## 📈 향후 개선 방향

* 댓글 기능 추가
* 좋아요 기능 구현
* 이미지 업로드 클라우드 스토리지 연동
* 반응형 UI 개선
* 무한 스크롤 적용
* Refresh Token 기반 인증 고도화

---

## 👩‍💻 개발자

**오수진**
Frontend & Backend Fullstack Development

---

## 💡 프로젝트를 통해 얻은 것

* 인증 시스템 전체 흐름 이해
* REST API 설계 경험
* DB 모델링 및 CRUD 구현 경험
* 상태 관리 아키텍처 설계 경험
* 클라이언트-서버 통신 구조 설계 경험

---
