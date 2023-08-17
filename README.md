# 🚩 마라톤 대회 결과 기록 시스템. 마라마라톤, mrmrthon!

<br>

## ⚒️ 아키텍쳐
![fian_diagram](https://github.com/cs-devops-bootcamp/devops-04-Final-Team2/assets/126468493/1810e67b-7339-4ee7-b6b8-ba21218f0ecc)<br>
> 1. 개발자가 새로운 버전을 릴리즈하면 Github Action을 통해 자동화가되어 진행됩니다. S3에 정적 웹페이지 파일 업로드, ECR 이미지 Push, 새 태스크 정의 생성, ECS 서비스 업데이트, 람다 함수 배포가 포함됩니다.
> 2. 각 서비스의 CloudWatch지표를 매트릭으로하여 Grafana Dashboard에 표시됩니다.
> 3. 사용자가 Roue53을 통해 도메인으로 접속하면 CloudFront를 통해 S3에 업로드된 정적 웹페이지가 나타납니다.
> 4. User서버에 api요청을 보내 CRUD작업을 처리합니다. 해당 작업에 대한 결과로 user_db에 접속하여 값을 사용합니다. 그 중 로그인 작업에 성공하면 토큰을 발급합니다.
> 5. Header에 토큰을 포함하여 Main 서버에 api요청을 보내 CRUD작업을 처리합니다. 해당 작업에 대한 결과로 main_db와 user_db에 접속하여 값을 사용합니다. 각 작업에 따라 토큰 값이 사용됩니다.
> 6. main_db의 official_record 테이블에 값이 추가되면, 이를 트리거로 official_record_lambda가 작동합니다. 해당 람다는 추가된 값에 대한 내용을 SNS로 전달합니다.
> 7. SNS를 구독중인 SQS에 포인트 값 변동 메세지가 전달됩니다. 해당 SQS를 트리거로 point_increase_lambda가 작동합니다. 해당 람다는 SQS를 통해 받은 메세지 값으로 user_db에 포인트를 추가합니다.
> 8. SNS를 구독 중인 webhook_lambda에 점수 추가 완료 메세지가 전달됩니다. 해당 람다는 discord를 통해 포인트 추가 완료 알람을 전송합니다.
<br>

## 🔍 개요
> - 개인 사용자와 대회주최자를 위한 마라톤 결과 기록 시스템입니다.<br>
> - 개인 사용자는 자신의 기록을 입력하고 관리하며, 대회 주최자는 대회에 참가하는 개인 사용자들의 기록을 관리할 수 있습니다.
> - 개인 사용자와 대회 주최자는 각각의 권한에 따라 기록 조회, 입력, 수정, 삭제를 수행할 수 있습니다.
> - 이를 통해 사용자들은 편리하게 마라톤 결과를 기록하고 관리할 수 있습니다.<br>
<br>

## 📑 인프라 소개
> 1. **가용성, 내결함성, 확장성, 보안성이 고려된 서비스**
>     - Auto scailing, JWT, ALB, CloudFront, Route53를 활용하여 서비스 구성을 강화하였습니다.
> 3. **CI/CD 파이프라인**
>    - GitHub Actions을 활용하여 CI/CD 파이프라인을 구축하였습니다.<br>
> 4. **2개의 데이터베이스**
>    - 유저 데이터를 저장하고 있는 유저 데이터베이스(user_db)와 메인 데이터베이스(main_db)로 구성하였습니다.<br>
> 5. **느슨한 결합**
>    - Lambda, SQS를 사용하여 서비스 간 느슨한 결합을 구현하였습니다.<br>
> 6. **시각화된 모니터링 시스템**
>    - Grafana를 활용하여 시스템의 상태를 시각화하고 모니터링할 수 있는 시스템을 구축하였습니다.
<br>

## ✔️ 주요 기능 소개
> 1. **개인 사용자와 대회 주최자는 로그인 기능을 통해 토큰을 발급받습니다. (https://www.mrmrthon.click)**
>    - '0'인 경우, 개인 사용자 / '1'인 경우, 대회 주최자로 분리
>      - user_db의 GET /users/login 엔드포인트에서 user_type 값을 확인
>      - 주최자인 경우 "주최자님 환영합니다", 개인 사용자인 경우 "개인 사용자님 환영합니다" 라는 메시지와 함께 토큰이 반환
> 2. **인증된 개인 사용자**
>    - 특정 마라톤 대회에 참가 신청 및 취소
>    - 자신의 비공식 기록 입력, 조회, 삭제
>    - 공식 개인 점수 조회
> 3. **대회 주최자**
>    - 참가자 조회
>    - 참가자들에 대한 공식 기록 입력, 조회, 삭제
>    - 대회별 참가자들의 점수 추가
>    - 새로운 마라톤 생성, 마라톤 수정, 마라톤 삭제
> 4. **테이블 별 주요 기능**<br>
>  ![20230627_093610](https://github.com/cs-devops-bootcamp/devops-04-Final-Team2/assets/126468493/550c102c-ef78-4540-9b2a-b4ef0ea80e10)<br>
> 5. **CI/CD**
>    - GitHub Action을 통해 ECR,ECS,Lambda 자동화
> 6. **모니터링**
>    - ECS&RDS : CPU Utilization, Memorey Utilization
>    - RDS : CPU Utilization
>    - Lambda : Duration
>    - SQS : Number Of Messages
>    - DLQ : Count of DLQ Message
>    - DynamoDB : Write Capacity Utilization, Read Capacity Utilization
<br>

## 🙋‍♀️ 나의 역할
- RDS MySQL, DynamoDB를 사용한 데이터베이스 구현
    - 데이터베이스를 구성하고 테이블과 테스트 데이터를 만들었다. 
      ![image](https://github.com/parknahye/mrmrthon/assets/127065825/635b444c-0c51-4bc6-a932-4bfd70d16a14)

- DynamoDB 연동  Rest API 개발
    - aws-sdk 를 사용하여 DynamoDB 연동하였다.
    - 기능별 다양한 CRUD API를 개발하였다
    - api list

      ![image](https://github.com/parknahye/mrmrthon/assets/127065825/4242ed5e-dd0b-476b-a995-0053923f5a43)

- official_record_lamda 람다 함수 구현
    - DynamoDB을 트리거로 하여 테이블인 official_record 테이블에 데이터가 insert 가 되면 sqs를 통하여 point_increase_lamda 람다로 값을 전달하도록 느슨한 결합으로 구현하였다.

- 웹훅 구현
    - sns를 사용하여 웹훅을 만들어 디스코드로 알림 메시지가 오도록 개발하였다.
      ![image](https://github.com/parknahye/mrmrthon/assets/127065825/b298664e-a2d9-4d06-81c6-0767d39c66a9)
      
- 모니터링 시스템 구현
    - AWS Cloud Watch 의 서비스를 Grafana로 import 하여 구현하였다.
      ![image](https://github.com/parknahye/mrmrthon/assets/127065825/ff3aa59a-8cc1-4744-ab73-31a98f52d8fe)

- IaC 작성
    - 테라폼 코드로 IaC를 작성하여 인프라 개발을 간편하게 만들었다.

## 🏃‍♀️ Install Dependencies

```
npm install express
npm install jsonwebtoken
npm start
```
- express: ^4.18.2
- aws-sdk: ^2.1399.0
- jsonwebtoken: ^9.0.0
- mysql: ^2.18.1
