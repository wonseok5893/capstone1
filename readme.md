# AchaParking (공유 주차 시스템)

## Stack 
    - node (Express)
    - mongodb (Mongoose)
    - jwt (Json Web Token)
     
### Android - API server(Local, Test) - Heroku (server) 

BASE_URL = https://achaparking.herokuapp.com

## 기능     
  
### 1. 예약 및 어플리케이션 기능 

- 토큰 인증 - /api/auth  => jwt토큰 인증 후에 해당 사용자가 인증되면 노출되어도 위험하지 않는 필요한 해당 사용자 정보를 MainActivy로 전송.  
- 공유 주차장 등록 - /api/sharedLocation/enroll => 배정자 등록신청시에 사진 이미지파일을 받아옴 => 사용자 검증 후 db에 배정자 신청 등록  
- 회원 예약 등록 - /api/reservation/enroll =>해당 공유주차장에 예약이 가능한지 검증(가능 공유 시간 검증, 예약 시간 검증, 공유 중지 검증, 포인트 검증) 후 예약 등록  
- 비회원 예약 등록 - /api/reservation/notUser/enroll =>예약 가능한지 검증 후 예약 등록  
- 옵션에 맞는 마커 정보 - /api/allSharedLocation =>MainActivity에서 (맵을 보고 있을 때) 5초에 한번 씩 마커 위치 정보 전송     
-  해당 공유 주차장 예약 내역 - /api/reserveList => 
해당 공유 주차장 예약 정보 전송  
-  주소 검색 - /api/getAddress => getAddress함수 실행 – kakao 주소검색 api를 이용한 web팝업창 랜더링   
-  해당 공유 주차장의 가능 시간 정보 - /api/locationInfo => 
해당 공유주차장 가능 시간, 공유하는 날짜 정보 전송   
-  공유 시간 설정 불러오기 - /api/shareInfo =>  내 공유 주차장 공유시간, 공유 날짜 정보 전송 -  동기화하기 위한 정보 )   
-  공유 시간 설정 수정 - /api/sendShareInfo =>  내 공유 주차장 공유 시간, 공유 날짜 정보 수정 정보 저장  
-  오늘 공유 on/off  - /api/sharingSwitch =>   오늘 지금 시간 이후에 내 공유 주차장 예약 존재 유무 검증 후  off  하거나 on -> 오늘 공유 날짜 정보 수정   
-  불법주차 신고시 제일 가까운 공유주차장 정보 제공 - /api/illegal/change =>  불법 주차 신고시 해당 예약 위치를 기반으로 가장 가깝고 예약 가능한지 검증 후 조건에 맞는 공유주차장 정보를 전송  

### 사용자 기능  
1) 로그인 - /user/login => 아이디 비밀번호 검증 후 토큰 발급, 관리자 시 ip검증 후 토큰 발급     
-  회원가입 - /user/join => 입력값 검증 후 회원 정보 저장  
-  비밀번호 변경 - /user/changePassword => 입력값 검증 후 회원 비밀번호 변경 후 저장  
-  나의 예약 내역 -/user/myReservation => 내 예약내역 정보들 전송  
-  차량등록 -/user/carEnroll => 내 차량 정보 저장   
-  차량삭제 -/user/carDelete => 내 차량 정보 삭제  
-  포인트 충전 -/user/chargePoint => 포인트 정보 충전 후   
-  예약 취소 -/user/deleteReservation => 예약 취소시 포인트 환급 후, db에 해당하는 관련된 정보 삭제  
-  방문목적 리뷰 -/user/visitPurpose => 회원/비회원 구분 후 정보 저장 후 해당 사용자가 회원일 경우 포인트 5% 페이백  
-  내 공유주차장 예약 내역 -/user/mySharingParkingLot => 내 공유 주차장에 예약한 모든 현재 예약, 지난 예약 정보 전송  
-  비회원 예약 내역 조회 - /user/notUser/reservation => 핸드폰 번호를 통해 비회원 예약 정보 조회 후 전송    

### 공통 / 관리자 -   
- 공지사항 가져오기 - /notices => 공지사항 정보 전송  
- 이미지파일 업로드 - /upload => 이미지 파일 저장  
- 관리자 공지사항 - /admin/notices => 관리자 검증, ip 검증 후 공지사항 정보   
- 관리자 사용자관리 - /admin/users => 관리자 검증, ip 검증 후 사용자 정보 조회 후 전송  
- 관리자 공유주차장 배정 등록 - /admin/sharedLocation/enroll => 관리자가 배정자 등록 신청 수락 시 데이터 저장  
-  관리자 공유주차장 배정 미등록 - /admin/unCheckedList => 관리자가 등록하지 않은 검증되지 않은 배정자 등록 신청 정보 전송  
- 관리자 권한으로 사용자 정보 수정 - /admin/editPassword – 사용자 비밀번호 조회 및수정
/admin/editPhone – 사용자 핸드폰 번호 조회 및 수정  