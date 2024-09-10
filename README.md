# PAi (Personal AI Assistant)

AI 챗봇 메이트와 함께하는 통합 일정 관리 서비스입니다.

#### 제공하는 기능

- AI 챗봇 메이트가 작성하고, 추천해주는 Todo List
- AI 챗봇과 나눴던 대화를 바탕으로 그날의 일기 작성
- 기록한 Todo List와 일기를 빠르고 쉽게 캘린더에서 확인
- 지도 기반 위치 정보를 추가하고, 시간까지 설정하는 상세한 일정 기록

🔗 [PAi 사이트 바로가기](https://ai-todo-app-beta.vercel.app/)

![00메인](https://github.com/user-attachments/assets/90766825-557c-418f-8087-1d418ce9e1ef)

<br />

## 📅 프로젝트 진행 기간

- 2024.07.16 ~ 2024.08.20

<br />

## 👨🏻‍💻 팀소개

<div align="center" dir="auto">
<table>
<thead>
<tr>
<th align="center"><strong>복예린 [팀장/FE]</strong></th>
<th align="center"><strong>선지원 [부팀장/FE]</strong></th>
<th align="center"><strong>김도희 [팀원/FE]</strong></th>
<th align="center"><strong>양윤성 [팀원/FE]</strong></th>
<th align="center"><strong>김용 [팀원/FE]</strong></th>
<th align="center"><strong>김지유 [팀원/Designer]</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td align="center"><a href="https://github.com/yeliinbb"><img src="https://avatars.githubusercontent.com/u/156063434?v=4" height="150" width="150" style="max-width: 80%;"> <br> yeliinbb</a></td>
<td align="center"><a href="https://github.com/oneieo"><img src="https://avatars.githubusercontent.com/u/114726736?v=4" height="150" width="150" style="max-width: 80%;"> <br> oneieo</a></td>
<td align="center"><a href="https://github.com/iamheroine"><img src="https://avatars.githubusercontent.com/u/155044540?v=4" height="150" width="150" style="max-width: 80%;"> <br> iamheroine</a></td>
<td align="center"><a href="https://github.com/RyanYang99"><img src="https://avatars.githubusercontent.com/u/50831567?v=4" height="150" width="150" style="max-width: 80%;"> <br> RyanYang99</a></td>
<td align="center"><a href="https://github.com/R-KIMYONG"><img src="https://avatars.githubusercontent.com/u/160477257?v=4" height="150" width="150" style="max-width: 80%;"> <br> R-KIMYONG</a></td>
<td align="center"><a href="https://github.com/su9us"><img src="https://avatars.githubusercontent.com/u/166360643?v=4" height="150" width="150" style="max-width: 80%;"> <br> su9us</a></td>
</tr>
</tbody>
<thead>
<tr>
<th align="center"><strong>팀장/FE</strong></th>
<th align="center"><strong>부팀장/FE</strong></th>
<th align="center"><strong>팀원/FE</strong></th>
<th align="center"><strong>팀원/FE</strong></th>
<th align="center"><strong>팀원/FE</strong></th>
<th align="center"><strong>팀원/Designer</strong></th>
</tr>
</thead>
</table>
</div>

<br />

## 💻 기술 스택

### Environment

<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/visual%20studio%20code-007ACC?style=for-the-badge&logo=visual%20studio%20code&logoColor=white">

### Config

<img src="https://img.shields.io/badge/yarn-2C8EBB?style=for-the-badge&logo=vercel&logoColor=white">

### Development

<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=black">
<img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white">
<img src="https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white">
<img src="https://img.shields.io/badge/zustand-F3DF49?style=for-the-badge&logo=zustand&logoColor=white">
<img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">

### Database

<img src="https://img.shields.io/badge/supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white">

### Deploy

<img src="https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">

<br />

## Architecture

![architecture](https://github.com/user-attachments/assets/4abcb567-07da-406e-8d12-9787e7ee8e96)

<br />

## ⚙️ 주요기능

#### 회원가입, 로그인

- 이메일을 통한 회원가입 및 로그인 지원
- 구글, 카카오 등 소셜 로그인 기능 제공
- 비밀번호 찾기 및 재설정 지원

#### 랜딩페이지

- 서비스 및 기능을 소개하는 ~~이미지 활용

#### 메인 페이지

- 배너 이미지를 통해 서비스 주요 기능 소개
- FAB 버튼을 통해 빠르게 투두리스트 작성 및 다이어리 작성 페이지로 이동
- 채팅 페이지 이동 버튼 제공

#### 채팅 페이지

- AI 챗봇(assistant)
  - 사용자 응답 기반 투두리스트 작성 및 선호도에 기반한 추천
  - 생성된 목록 투두리스트에 저장
- AI 챗봇(friend)
  - 친구처럼 대화하며 일기 작성
  - 작성한 일기 다이어리에 저장
- STT(음성 인식) 기능을 통해 투두리스트 및 일기 작성 (Web Speech API)
- 채팅 기록 및 검색을 통해 이전 대화 기록 조회

#### 투두 페이지

- 투두 생성, 조회, 수정, 삭제 (CRUD) 기능
- 투두리스트 검색 기능 제공
- 투두 세부 정보 (시간, 장소) 추가 기능 (Kakao Map API)

#### 다이어리 페이지

- 다이어리 CRUD 기능 제공
- Quill 에디터 활용해 상세한 일기 작성 가능

#### 마이페이지

- 투두리스트 진척도 확인 가능
- 프로필 조회 및 변경 기능 제공
- 회원탈퇴 및 로그아웃 기능 지원
