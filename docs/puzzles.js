// 자동 생성 파일 — tools/build.mjs 가 private/ 원본에서 만든다. 직접 고치지 말 것.
export const PUZZLES = [
 {
  "id": "turtle-soup",
  "title": "바다거북 수프",
  "level": 2,
  "tags": [
   "원조",
   "죽음 있음"
  ],
  "story": "바닷가 식당에서 한 남자가 바다거북 수프를 주문했다. 한 숟갈 떠먹은 그는 주방장을 불러 \"이게 정말 바다거북 수프입니까?\" 하고 물었다. 주방장이 그렇다고 하자, 남자는 값을 치르고 집에 돌아가 스스로 목숨을 끊었다.",
  "sceneNote": "바닷가 식당 창가 자리. 탁자 위에 한 숟갈만 뜬 수프 그릇과 숟가락, 계산서. 창밖으로 바다와 작은 섬. 맞은편 의자는 비어 있다. 벽에 장식용 구명튜브.",
  "scene": "<rect width=\"400\" height=\"190\" class=\"db\" opacity=\".45\"/><rect x=\"96\" y=\"20\" width=\"284\" height=\"152\" class=\"p\"/><circle cx=\"146\" cy=\"56\" r=\"17\" class=\"b\"/><rect x=\"96\" y=\"98\" width=\"284\" height=\"74\" class=\"da\"/><path d=\"M276 98 q12 -18 28 -9 q12 -10 24 9 z\" class=\"a\"/><path d=\"M280 98 q10 -14 24 -7 q10 -8 20 7 z\" class=\"b off\"/><path d=\"M112 122 q8 -5 16 0 t16 0 M200 142 q8 -5 16 0 t16 0 M300 128 q8 -5 16 0 t16 0 M150 160 q8 -5 16 0 t16 0\" class=\"sa w1\"/><path d=\"M96 98 H380\" class=\"sa w1\"/><rect x=\"96\" y=\"20\" width=\"284\" height=\"152\" class=\"sa w3\"/><path d=\"M238 20 V172\" class=\"sa\"/><path d=\"M46 22 V56\" class=\"sa\"/><circle cx=\"46\" cy=\"82\" r=\"26\" class=\"b\"/><circle cx=\"46\" cy=\"82\" r=\"19.5\" class=\"sa\" style=\"stroke-width:13;stroke-dasharray:15.3 15.3\"/><circle cx=\"46\" cy=\"82\" r=\"13\" class=\"p\"/><circle cx=\"46\" cy=\"82\" r=\"26\" class=\"sa w1\"/><circle cx=\"46\" cy=\"82\" r=\"13\" class=\"sa w1\"/><path d=\"M150 190 V134 q46 -16 92 0 V190\" class=\"a\"/><rect y=\"188\" width=\"400\" height=\"112\" class=\"b\"/><rect y=\"188\" width=\"400\" height=\"112\" class=\"da\" opacity=\".3\"/><path d=\"M0 188 H400\" class=\"sa w3\"/><ellipse cx=\"200\" cy=\"250\" rx=\"72\" ry=\"12\" class=\"a\" opacity=\".3\"/><path d=\"M138 214 q62 64 124 0 z\" class=\"a\"/><ellipse cx=\"200\" cy=\"214\" rx=\"62\" ry=\"13\" class=\"p\"/><ellipse cx=\"200\" cy=\"215\" rx=\"55\" ry=\"9.5\" class=\"b\"/><ellipse cx=\"200\" cy=\"215\" rx=\"55\" ry=\"9.5\" class=\"db\"/><ellipse cx=\"184\" cy=\"213\" rx=\"7\" ry=\"2.2\" class=\"p\"/><ellipse cx=\"216\" cy=\"217\" rx=\"4\" ry=\"1.6\" class=\"p\"/><ellipse cx=\"200\" cy=\"214\" rx=\"62\" ry=\"13\" class=\"sa\"/><path d=\"M276 250 L336 236\" class=\"sa w3\"/><ellipse cx=\"270\" cy=\"252\" rx=\"11\" ry=\"6\" class=\"a\" transform=\"rotate(-13 270 252)\"/><g transform=\"translate(316 256) rotate(7)\"><rect width=\"62\" height=\"34\" class=\"p\"/><rect width=\"62\" height=\"34\" class=\"sa w1\"/><path d=\"M8 10h42M8 18h28M8 26h36\" class=\"sa w1\"/></g>",
  "spots": [
   {
    "id": "bowl",
    "label": "수프 그릇",
    "text": "국물이 거의 그대로다. 숟가락 자국은 딱 한 번."
   },
   {
    "id": "island",
    "label": "창밖의 섬",
    "text": "작은 무인도. 종업원 말로는 남자가 주문하기 전부터 한참 그 섬 쪽만 보고 있었다."
   },
   {
    "id": "bill",
    "label": "계산서",
    "text": "\"바다거북 수프 1\". 남자는 거스름돈도 받지 않고 나갔다."
   },
   {
    "id": "ring",
    "label": "벽의 구명튜브",
    "text": "식당 장식품. 남자는 들어오면서 그걸 한참 쓰다듬었다."
   }
  ],
  "starters": [
   "수프에 무언가 잘못된 게 있었나요?",
   "주방장이 거짓말을 했나요?",
   "남자는 혼자 왔나요?"
  ],
  "photo": "img/turtle-soup.jpg",
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "mirror-clock",
  "title": "거꾸로 가는 시계",
  "level": 1,
  "tags": [
   "죽음 없음"
  ],
  "story": "할머니가 꾸리는 작은 가게의 벽시계는 숫자가 모두 좌우로 뒤집혀 붙어 있고, 바늘도 반대로 돈다. 그런데 이 가게 손님들은 그 시계를 보고 단 한 번도 시간을 잘못 읽은 적이 없다.",
  "sceneNote": "작은 가게 안. 벽 한가운데 숫자가 좌우로 뒤집힌 둥근 시계. 그 아래 시계를 등지고 놓인 등받이 높은 가죽 의자. 오른쪽 선반에 가위, 빗, 개켜 둔 흰 천. 왼쪽에 유리창. 바닥에 가는 털 같은 것이 조금 흩어져 있다.",
  "scene": "<rect width=\"400\" height=\"300\" class=\"db\" opacity=\".4\"/><rect y=\"252\" width=\"400\" height=\"48\" class=\"da\" opacity=\".5\"/><path d=\"M0 252 H400\" class=\"sa\"/><rect x=\"18\" y=\"40\" width=\"86\" height=\"120\" class=\"p\"/><rect x=\"18\" y=\"40\" width=\"86\" height=\"120\" class=\"da\" opacity=\".35\"/><rect x=\"18\" y=\"40\" width=\"86\" height=\"120\" class=\"sa w3\"/><path d=\"M61 40 V160\" class=\"sa\"/><circle cx=\"200\" cy=\"84\" r=\"52\" class=\"p\"/><circle cx=\"200\" cy=\"84\" r=\"44\" class=\"b\" opacity=\".35\"/><circle cx=\"200\" cy=\"84\" r=\"52\" class=\"sa w3\"/><g transform=\"translate(400 0) scale(-1 1)\"><text x=\"191\" y=\"51\" font-size=\"14\">12</text><text x=\"234\" y=\"89\" font-size=\"14\">3</text><text x=\"196\" y=\"129\" font-size=\"14\">6</text><text x=\"158\" y=\"89\" font-size=\"14\">9</text><path d=\"M200 84 L223 69\" class=\"sa w3\"/><path d=\"M200 84 L200 44\" class=\"sa\"/></g><circle cx=\"200\" cy=\"84\" r=\"4\" class=\"a\"/><rect x=\"170\" y=\"128\" width=\"60\" height=\"20\" rx=\"8\" class=\"a\"/><rect x=\"164\" y=\"148\" width=\"72\" height=\"62\" rx=\"10\" class=\"a\"/><rect x=\"152\" y=\"204\" width=\"96\" height=\"20\" rx=\"8\" class=\"a\"/><rect x=\"144\" y=\"194\" width=\"16\" height=\"22\" rx=\"5\" class=\"b\"/><rect x=\"240\" y=\"194\" width=\"16\" height=\"22\" rx=\"5\" class=\"b\"/><rect x=\"194\" y=\"224\" width=\"12\" height=\"22\" class=\"a\"/><ellipse cx=\"200\" cy=\"250\" rx=\"36\" ry=\"6\" class=\"a\"/><path d=\"M176 236 h-24 v8\" class=\"sa\"/><rect x=\"298\" y=\"128\" width=\"92\" height=\"6\" class=\"a\"/><circle cx=\"314\" cy=\"120\" r=\"5\" class=\"sa w1\"/><circle cx=\"325\" cy=\"120\" r=\"5\" class=\"sa w1\"/><path d=\"M317 115 l12 -24 M322 115 l-8 -24\" class=\"sa w1\"/><rect x=\"338\" y=\"106\" width=\"22\" height=\"6\" class=\"a\"/><path d=\"M340 112v7M344 112v7M348 112v7M352 112v7M356 112v7\" class=\"sa w1\"/><rect x=\"364\" y=\"104\" width=\"22\" height=\"24\" class=\"p\"/><rect x=\"364\" y=\"104\" width=\"22\" height=\"24\" class=\"db\"/><rect x=\"364\" y=\"104\" width=\"22\" height=\"24\" class=\"sa w1\"/><path d=\"M118 270 q6 -4 10 0 M138 280 q5 -3 9 1 M244 282 q6 -3 10 0 M272 268 q4 -4 9 -1 M96 286 q5 -4 9 0\" class=\"sa w1\"/>",
  "spots": [
   {
    "id": "clock",
    "x": 50,
    "y": 28,
    "label": "벽시계",
    "text": "숫자가 모두 좌우로 뒤집혔다. 3이 왼쪽, 9가 오른쪽에 있다. 바늘은 시계 반대 방향으로 돈다."
   },
   {
    "id": "chair",
    "x": 50,
    "y": 60,
    "label": "가죽 의자",
    "text": "등받이가 높고 발판과 팔걸이가 달렸다. 의자는 시계를 등지고 놓여 있다."
   },
   {
    "id": "shelf",
    "x": 86,
    "y": 37,
    "label": "선반",
    "text": "가위 세 자루, 빗, 하얗게 개켜 둔 천."
   },
   {
    "id": "floor",
    "x": 30,
    "y": 91,
    "label": "바닥",
    "text": "의자 둘레만 유난히 자주 쓸어 반질반질하다."
   }
  ],
  "starters": [
   "할머니가 실수로 시계를 거꾸로 걸었나요?",
   "손님들은 시계를 직접 쳐다보나요?",
   "이 가게는 물건을 파는 곳인가요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "board-night",
  "title": "무인도에 세 번",
  "level": 1,
  "tags": [
   "죽음 없음"
  ],
  "story": "그날 밤 여자는 서울을 통째로 잃었고, 무인도에 세 번이나 갇혔으며, 가진 돈도 바닥났다. 그런데 잠들기 전 그녀는 일기장에 \"올해 가장 행복한 날\"이라고 적었다.",
  "sceneNote": "밤의 거실 바닥을 위에서 본 그림. 가운데 펼쳐진 정사각형 게임판과 작은 집 모양 말들. 주사위 두 개, 알록달록한 지폐 더미. 왼쪽 위 소파에 펼친 일기장. 오른쪽 위 현관 쪽에 아직 풀지 않은 큰 가방.",
  "scene": "<rect width=\"400\" height=\"300\" class=\"db\" opacity=\".5\"/><path d=\"M0 64 H400 M0 128 H400 M0 192 H400 M0 256 H400\" class=\"sa w1\" opacity=\".35\"/><rect x=\"-12\" y=\"-12\" width=\"132\" height=\"60\" rx=\"14\" class=\"a\"/><g transform=\"translate(30 14) rotate(-8)\"><rect width=\"56\" height=\"34\" class=\"p\"/><path d=\"M28 0 V34\" class=\"sa w1\"/><path d=\"M6 10h16M6 16h14M6 22h16M34 10h16M34 16h12\" class=\"sa w1\"/><path d=\"M38 24 q4 -6 8 0 q-4 6 -8 0\" class=\"sa w1\"/><rect width=\"56\" height=\"34\" class=\"sa w1\"/></g><g transform=\"translate(200 150) rotate(-6)\"><rect x=\"-86\" y=\"-86\" width=\"172\" height=\"172\" class=\"p\"/><rect x=\"-86\" y=\"-86\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"db\"/><rect x=\"-86\" y=\"-86\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"-86\" y=\"-61.42857142857143\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"da\"/><rect x=\"-86\" y=\"-61.42857142857143\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"-86\" y=\"-36.857142857142854\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"p\"/><rect x=\"-86\" y=\"-36.857142857142854\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"-86\" y=\"-12.285714285714278\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"db\"/><rect x=\"-86\" y=\"-12.285714285714278\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"-86\" y=\"12.285714285714292\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"da\"/><rect x=\"-86\" y=\"12.285714285714292\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"-86\" y=\"36.85714285714286\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"p\"/><rect x=\"-86\" y=\"36.85714285714286\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"-86\" y=\"61.428571428571445\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"db\"/><rect x=\"-86\" y=\"61.428571428571445\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"-61.42857142857143\" y=\"-86\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"da\"/><rect x=\"-61.42857142857143\" y=\"-86\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"-61.42857142857143\" y=\"61.428571428571445\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"da\"/><rect x=\"-61.42857142857143\" y=\"61.428571428571445\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"-36.857142857142854\" y=\"-86\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"p\"/><rect x=\"-36.857142857142854\" y=\"-86\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"-36.857142857142854\" y=\"61.428571428571445\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"p\"/><rect x=\"-36.857142857142854\" y=\"61.428571428571445\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"-12.285714285714278\" y=\"-86\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"db\"/><rect x=\"-12.285714285714278\" y=\"-86\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"-12.285714285714278\" y=\"61.428571428571445\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"db\"/><rect x=\"-12.285714285714278\" y=\"61.428571428571445\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"12.285714285714292\" y=\"-86\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"da\"/><rect x=\"12.285714285714292\" y=\"-86\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"12.285714285714292\" y=\"61.428571428571445\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"da\"/><rect x=\"12.285714285714292\" y=\"61.428571428571445\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"36.85714285714286\" y=\"-86\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"p\"/><rect x=\"36.85714285714286\" y=\"-86\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"36.85714285714286\" y=\"61.428571428571445\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"p\"/><rect x=\"36.85714285714286\" y=\"61.428571428571445\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"61.428571428571445\" y=\"-86\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"db\"/><rect x=\"61.428571428571445\" y=\"-86\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"61.428571428571445\" y=\"-61.42857142857143\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"da\"/><rect x=\"61.428571428571445\" y=\"-61.42857142857143\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"61.428571428571445\" y=\"-36.857142857142854\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"p\"/><rect x=\"61.428571428571445\" y=\"-36.857142857142854\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"61.428571428571445\" y=\"-12.285714285714278\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"db\"/><rect x=\"61.428571428571445\" y=\"-12.285714285714278\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"61.428571428571445\" y=\"12.285714285714292\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"da\"/><rect x=\"61.428571428571445\" y=\"12.285714285714292\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"61.428571428571445\" y=\"36.85714285714286\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"p\"/><rect x=\"61.428571428571445\" y=\"36.85714285714286\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><rect x=\"61.428571428571445\" y=\"61.428571428571445\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"db\"/><rect x=\"61.428571428571445\" y=\"61.428571428571445\" width=\"24.571428571428573\" height=\"24.571428571428573\" class=\"sa w1\"/><circle r=\"34\" class=\"b\"/><circle r=\"34\" class=\"da\" opacity=\".5\"/><circle r=\"34\" class=\"sa\"/><path d=\"M-74 -60 l6 -6 l6 6 v6 h-12 z M38 -78 l6 -6 l6 6 v6 h-12 z M-60 64 l6 -6 l6 6 v6 h-12 z\" class=\"a\"/><rect x=\"-86\" y=\"-86\" width=\"172\" height=\"172\" class=\"sa w3\"/></g><g transform=\"translate(300 212) rotate(18)\"><rect width=\"26\" height=\"26\" rx=\"4\" class=\"p\"/><rect width=\"26\" height=\"26\" rx=\"4\" class=\"sa\"/><circle cx=\"8\" cy=\"8\" r=\"2.6\" class=\"a\"/><circle cx=\"13\" cy=\"13\" r=\"2.6\" class=\"a\"/><circle cx=\"18\" cy=\"18\" r=\"2.6\" class=\"a\"/></g><g transform=\"translate(334 238) rotate(-12)\"><path d=\"M0 4 a4 4 0 0 1 4 -4 h18 l4 4 v18 a4 4 0 0 1 -4 4 h-18 a4 4 0 0 1 -4 -4 z\" class=\"p\"/><path d=\"M0 4 a4 4 0 0 1 4 -4 h18 l4 4 v18 a4 4 0 0 1 -4 4 h-18 a4 4 0 0 1 -4 -4 z\" class=\"sa\"/><circle cx=\"8\" cy=\"18\" r=\"2.6\" class=\"a\"/><circle cx=\"18\" cy=\"8\" r=\"2.6\" class=\"a\"/></g><g transform=\"translate(30 200)\"><rect width=\"54\" height=\"28\" class=\"b\" transform=\"rotate(-14)\"/><rect x=\"10\" y=\"6\" width=\"54\" height=\"28\" class=\"da\" transform=\"rotate(8)\"/><rect x=\"6\" y=\"14\" width=\"54\" height=\"28\" class=\"p\" transform=\"rotate(-4)\"/><rect x=\"6\" y=\"14\" width=\"54\" height=\"28\" class=\"sa w1\" transform=\"rotate(-4)\"/><text x=\"16\" y=\"36\" font-size=\"9\">100,000</text></g><rect x=\"318\" y=\"44\" width=\"78\" height=\"54\" rx=\"10\" class=\"a\"/><path d=\"M336 46 q21 -26 42 0\" class=\"sa w3\"/><rect x=\"351\" y=\"22\" width=\"12\" height=\"11\" class=\"p\"/><rect x=\"351\" y=\"22\" width=\"12\" height=\"11\" class=\"sa w1\"/>",
  "spots": [
   {
    "id": "dice",
    "x": 80,
    "y": 75,
    "label": "주사위",
    "text": "주사위 두 개. 하나는 모서리가 살짝 깨져 있다."
   },
   {
    "id": "money",
    "x": 15,
    "y": 72,
    "label": "지폐 더미",
    "text": "알록달록한 지폐. 한 장에 \"100,000\"이라고 적혀 있는데, 종이가 너무 얇다."
   },
   {
    "id": "bag",
    "x": 89,
    "y": 22,
    "label": "현관의 가방",
    "text": "커다란 가방, 아직 풀지 않았다. 손잡이에 종이 띠가 감겨 있다."
   },
   {
    "id": "diary",
    "x": 15,
    "y": 10,
    "label": "일기장",
    "text": "\"올해 가장 행복한 날\" 아래, 삐뚤빼뚤한 작은 손바닥 그림이 함께 그려져 있다."
   }
  ],
  "starters": [
   "여자가 실제로 재산을 잃었나요?",
   "그날 여자는 혼자였나요?",
   "서울과 무인도는 실제 장소인가요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "noodle-window",
  "title": "창가의 국수 한 그릇",
  "level": 2,
  "tags": [
   "죽음 없음"
  ],
  "story": "작은 국숫집 사장은 15년 동안 문을 닫을 때마다 창가 자리에 국수 한 그릇을 차려 놓고, 가게 불을 켜 둔 채 퇴근했다. 오늘 아침 출근해 보니 그 그릇이 처음으로 깨끗이 비워져 있었다. 사장은 그날로 가게 문을 영영 닫았다.",
  "sceneNote": "밤의 작은 국숫집 창가. 창 아래 탁자에 빈 국수 그릇 하나와 가지런한 젓가락. 천장에 켜진 전등. 왼쪽 벽에 빛바랜 아이 사진 액자와 날짜에 동그라미 친 달력. 창밖은 어두운 골목.",
  "scene": "<rect width=\"400\" height=\"300\" class=\"db\" opacity=\".35\"/><rect x=\"150\" y=\"24\" width=\"234\" height=\"152\" class=\"a\"/><rect x=\"150\" y=\"24\" width=\"234\" height=\"152\" class=\"da\"/><rect x=\"176\" y=\"120\" width=\"10\" height=\"14\" class=\"b\"/><rect x=\"194\" y=\"120\" width=\"10\" height=\"14\" class=\"b\"/><rect x=\"340\" y=\"96\" width=\"12\" height=\"16\" class=\"b\"/><rect x=\"150\" y=\"24\" width=\"234\" height=\"152\" class=\"sa w3\"/><path d=\"M267 24 V176\" style=\"fill:none;stroke:var(--paper);stroke-width:4;stroke-linecap:round\"/><path d=\"M112 0 V36\" class=\"sa\"/><circle cx=\"112\" cy=\"66\" r=\"50\" class=\"db\"/><path d=\"M90 40 h44 l-9 -14 h-26 z\" class=\"a\"/><circle cx=\"112\" cy=\"44\" r=\"6\" class=\"b\"/><rect x=\"22\" y=\"70\" width=\"58\" height=\"70\" class=\"p\"/><rect x=\"28\" y=\"76\" width=\"46\" height=\"58\" class=\"db\"/><circle cx=\"51\" cy=\"93.8\" r=\"7.2\" class=\"a\"/><path d=\"M41.1 128 q0 -26 9.9 -26 q9.9 0 9.9 26 z\" class=\"a\"/><path d=\"M36 128 q15 10 30 0 z\" class=\"b\"/><rect x=\"22\" y=\"70\" width=\"58\" height=\"70\" class=\"sa w3\"/><rect x=\"30\" y=\"160\" width=\"52\" height=\"60\" class=\"p\"/><rect x=\"30\" y=\"160\" width=\"52\" height=\"12\" class=\"a\"/><path d=\"M30 184 H82 M30 196 H82 M30 208 H82 M43 172 V220 M56 172 V220 M69 172 V220\" class=\"sa w1\"/><circle cx=\"62\" cy=\"202\" r=\"8\" class=\"sb w3\"/><rect x=\"30\" y=\"160\" width=\"52\" height=\"60\" class=\"sa w1\"/><rect x=\"110\" y=\"196\" width=\"290\" height=\"14\" class=\"a\"/><rect x=\"136\" y=\"210\" width=\"10\" height=\"90\" class=\"a\"/><rect x=\"368\" y=\"210\" width=\"10\" height=\"90\" class=\"a\"/><rect y=\"272\" width=\"400\" height=\"28\" class=\"da\" opacity=\".45\"/><path d=\"M212 174 q38 40 76 0 z\" class=\"b\"/><ellipse cx=\"250\" cy=\"174\" rx=\"38\" ry=\"7\" class=\"p\"/><ellipse cx=\"250\" cy=\"174\" rx=\"38\" ry=\"7\" class=\"sa\"/><path d=\"M216 166 L284 158 M218 170 L286 163\" class=\"sa\"/>",
  "spots": [
   {
    "id": "bowl",
    "label": "창가의 그릇",
    "text": "국물 한 방울 남지 않았다. 젓가락이 그릇 위에 가지런히 놓여 있다."
   },
   {
    "id": "lamp",
    "label": "전등",
    "text": "가게 문을 닫은 뒤에도 이 등만은 15년 동안 매일 밤 켜져 있었다."
   },
   {
    "id": "photo",
    "label": "벽의 사진",
    "text": "빛바랜 사진 속 아이가 이 가게에서 국수를 먹으며 웃고 있다."
   },
   {
    "id": "calendar",
    "label": "달력",
    "text": "오늘 날짜에 동그라미. 옆에 작게 \"15\"라고 적혀 있다."
   }
  ],
  "starters": [
   "사장은 누군가를 기다리고 있었나요?",
   "국수를 먹은 건 사람인가요?",
   "사장에게 나쁜 일이 생겼나요?"
  ],
  "photo": "img/noodle-window.jpg",
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "silent-applause",
  "title": "박수 없는 앙코르",
  "level": 2,
  "tags": [
   "죽음 없음"
  ],
  "story": "피아니스트의 연주가 끝났지만 300석 객석에서는 박수 소리가 한 번도 나지 않았다. 피아니스트는 무대 위에서 눈물을 흘리며 기뻐했고, 그날 공연은 대성공으로 기록됐다.",
  "sceneNote": "공연장 무대 정면. 가운데 그랜드 피아노와 의자에 앉은 연주자. 무대 오른쪽 끝에 조명을 받으며 서 있는 사람. 아래쪽 객석에 사람들의 뒷모습, 그중 몇은 둥근 풍선을 안고 있다. 객석 앞 바닥에 넓은 판이 깔려 있다.",
  "scene": "<rect width=\"400\" height=\"300\" class=\"da\"/><path d=\"M0 0 H70 q-10 80 6 172 H0 Z\" class=\"a\"/><path d=\"M400 0 H330 q10 80 -6 172 H400 Z\" class=\"a\"/><path d=\"M0 0 H400 V20 q-25 12 -50 0 q-25 12 -50 0 q-25 12 -50 0 q-25 12 -50 0 q-25 12 -50 0 q-25 12 -50 0 q-25 12 -50 0 q-25 12 -50 0 Z\" class=\"a\"/><path d=\"M150 0 L104 172 H236 Z\" class=\"p\"/><path d=\"M150 0 L104 172 H236 Z\" class=\"db\"/><path d=\"M346 0 L300 172 H376 Z\" class=\"p\"/><path d=\"M346 0 L300 172 H376 Z\" class=\"db\"/><path d=\"M40 172 H360 L400 206 H0 Z\" class=\"b\"/><path d=\"M0 206 H400\" class=\"sa w3\"/><path d=\"M118 152 H226 q16 0 16 -14 q0 -18 -30 -22 q-40 -6 -60 -24 L118 92 Z\" class=\"a\"/><path d=\"M120 92 L190 54 L204 98\" class=\"sa w3\"/><rect x=\"124\" y=\"152\" width=\"7\" height=\"22\" class=\"a\"/><rect x=\"212\" y=\"152\" width=\"7\" height=\"22\" class=\"a\"/><rect x=\"108\" y=\"128\" width=\"40\" height=\"6\" class=\"p\"/><rect x=\"72\" y=\"160\" width=\"40\" height=\"8\" class=\"a\"/><circle cx=\"92\" cy=\"122.1\" r=\"8.4\" class=\"a\"/><path d=\"M80.45 162 q0 -26 11.55 -26 q11.55 0 11.55 26 z\" class=\"a\"/><circle cx=\"338\" cy=\"132.1\" r=\"8.4\" class=\"a\"/><path d=\"M326.45 172 q0 -26 11.55 -26 q11.55 0 11.55 26 z\" class=\"a\"/><path d=\"M328 142 l-12 -20 M348 142 l12 -20\" class=\"sa w3\"/><rect x=\"18\" y=\"212\" width=\"364\" height=\"10\" class=\"ga\"/><circle cx=\"30\" cy=\"246\" r=\"11\" class=\"a\"/><path d=\"M14 268 q16 -18 32 0\" class=\"a\"/><circle cx=\"70\" cy=\"246\" r=\"11\" class=\"a\"/><path d=\"M54 268 q16 -18 32 0\" class=\"a\"/><circle cx=\"102\" cy=\"246\" r=\"11\" class=\"a\"/><path d=\"M86 268 q16 -18 32 0\" class=\"a\"/><circle cx=\"142\" cy=\"246\" r=\"11\" class=\"a\"/><path d=\"M126 268 q16 -18 32 0\" class=\"a\"/><circle cx=\"174\" cy=\"246\" r=\"11\" class=\"a\"/><path d=\"M158 268 q16 -18 32 0\" class=\"a\"/><circle cx=\"214\" cy=\"246\" r=\"11\" class=\"a\"/><path d=\"M198 268 q16 -18 32 0\" class=\"a\"/><circle cx=\"246\" cy=\"246\" r=\"11\" class=\"a\"/><path d=\"M230 268 q16 -18 32 0\" class=\"a\"/><circle cx=\"286\" cy=\"246\" r=\"11\" class=\"a\"/><path d=\"M270 268 q16 -18 32 0\" class=\"a\"/><circle cx=\"318\" cy=\"246\" r=\"11\" class=\"a\"/><path d=\"M302 268 q16 -18 32 0\" class=\"a\"/><circle cx=\"358\" cy=\"246\" r=\"11\" class=\"a\"/><path d=\"M342 268 q16 -18 32 0\" class=\"a\"/><circle cx=\"14\" cy=\"282\" r=\"12\" class=\"a\"/><circle cx=\"53\" cy=\"282\" r=\"12\" class=\"a\"/><circle cx=\"86\" cy=\"282\" r=\"12\" class=\"a\"/><circle cx=\"125\" cy=\"282\" r=\"12\" class=\"a\"/><circle cx=\"158\" cy=\"282\" r=\"12\" class=\"a\"/><circle cx=\"197\" cy=\"282\" r=\"12\" class=\"a\"/><circle cx=\"230\" cy=\"282\" r=\"12\" class=\"a\"/><circle cx=\"269\" cy=\"282\" r=\"12\" class=\"a\"/><circle cx=\"302\" cy=\"282\" r=\"12\" class=\"a\"/><circle cx=\"341\" cy=\"282\" r=\"12\" class=\"a\"/><circle cx=\"374\" cy=\"282\" r=\"12\" class=\"a\"/><circle cx=\"118\" cy=\"228\" r=\"10\" class=\"b\"/><path d=\"M118 238 v10\" class=\"sa w1\"/><circle cx=\"262\" cy=\"230\" r=\"9\" class=\"b\"/><path d=\"M262 239 v9\" class=\"sa w1\"/><circle cx=\"190\" cy=\"262\" r=\"10\" class=\"b\"/>",
  "spots": [
   {
    "id": "side",
    "x": 84.5,
    "y": 45,
    "label": "무대 오른쪽 사람",
    "text": "조명을 받으며 서 있다. 연주 내내 두 손을 쉴 새 없이 움직였다."
   },
   {
    "id": "balloon",
    "x": 29.5,
    "y": 76,
    "label": "풍선",
    "text": "관객 여럿이 부푼 풍선을 꼭 끌어안고 있다. 터뜨리려는 건 아닌 것 같다."
   },
   {
    "id": "floor",
    "x": 70,
    "y": 72,
    "label": "객석 앞 바닥",
    "text": "넓은 판이 깔려 있다. 신발을 벗고 그 위에 발을 올린 관객이 많다."
   },
   {
    "id": "pianist",
    "x": 23,
    "y": 42,
    "label": "피아니스트",
    "text": "마지막 음을 치고 객석을 돌아본 채 한참 그대로 있었다."
   }
  ],
  "starters": [
   "관객들은 공연이 마음에 들었나요?",
   "객석에 사람이 정말 있었나요?",
   "박수를 치면 안 되는 규칙이 있었나요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "winter-fan",
  "title": "한겨울의 선풍기",
  "level": 2,
  "tags": [
   "죽음 없음"
  ],
  "story": "한겨울 밤, 남자는 창문을 열고 선풍기를 튼 채 잠들었다. 가족들은 \"선풍기 틀고 자면 죽는다\"며 말렸다. 다음 날 아침, 온 가족이 남자 덕분에 목숨을 건졌다.",
  "sceneNote": "겨울밤 방 안. 바닥에 이불을 덮고 자는 가족 셋. 왼쪽에 한 뼘 열린 창문, 밖은 눈. 오른쪽에 창 쪽으로 바람을 보내는 선풍기. 벽 위쪽에 보일러 온도 조절기. 오른쪽 끝에 닫힌 다용도실 문.",
  "scene": "<rect width=\"400\" height=\"300\" class=\"da\" opacity=\".55\"/><rect y=\"196\" width=\"400\" height=\"104\" class=\"b\" opacity=\".9\"/><path d=\"M30 212 q5 -6 0 -12 t0 -12 M370 214 q5 -6 0 -12 t0 -12 M100 290 q5 -6 0 -12 t0 -12\" class=\"sa w1\"/><rect x=\"26\" y=\"38\" width=\"112\" height=\"112\" class=\"a\"/><circle cx=\"44\" cy=\"58\" r=\"2.4\" class=\"p\"/><circle cx=\"70\" cy=\"84\" r=\"2\" class=\"p\"/><circle cx=\"52\" cy=\"112\" r=\"2.4\" class=\"p\"/><circle cx=\"90\" cy=\"54\" r=\"2\" class=\"p\"/><circle cx=\"118\" cy=\"98\" r=\"2.4\" class=\"p\"/><circle cx=\"104\" cy=\"130\" r=\"2\" class=\"p\"/><circle cx=\"36\" cy=\"138\" r=\"2\" class=\"p\"/><rect x=\"26\" y=\"38\" width=\"112\" height=\"112\" class=\"sa w3\"/><path d=\"M70 38 V150\" style=\"fill:none;stroke:var(--paper);stroke-width:4;stroke-linecap:round\"/><path d=\"M84 38 V150\" style=\"fill:none;stroke:var(--paper);stroke-width:2;stroke-linecap:round\"/><path d=\"M20 150 q20 -8 40 0 q20 -8 40 0 q20 -8 44 0 V158 H20 Z\" class=\"p\"/><path d=\"M20 150 q20 -8 40 0 q20 -8 40 0 q20 -8 44 0\" class=\"sa w1\"/><rect x=\"104\" y=\"226\" width=\"40\" height=\"18\" rx=\"8\" class=\"p\"/><rect x=\"164\" y=\"222\" width=\"40\" height=\"18\" rx=\"8\" class=\"p\"/><rect x=\"226\" y=\"228\" width=\"34\" height=\"16\" rx=\"8\" class=\"p\"/><circle cx=\"124\" cy=\"226\" r=\"12\" class=\"a\"/><circle cx=\"184\" cy=\"222\" r=\"12\" class=\"a\"/><circle cx=\"243\" cy=\"228\" r=\"9\" class=\"a\"/><path d=\"M112 290 V244 q30 -14 60 -4 q30 -14 60 0 q24 -10 52 4 V290 Z\" class=\"p\"/><path d=\"M112 290 V244 q30 -14 60 -4 q30 -14 60 0 q24 -10 52 4 V290 Z\" class=\"db\"/><path d=\"M112 290 V244 q30 -14 60 -4 q30 -14 60 0 q24 -10 52 4 V290\" class=\"sa\"/><path d=\"M330 150 V240\" class=\"sa w3\"/><ellipse cx=\"330\" cy=\"244\" rx=\"26\" ry=\"6\" class=\"a\"/><circle cx=\"330\" cy=\"128\" r=\"30\" class=\"p\"/><ellipse cx=\"330\" cy=\"112\" rx=\"8\" ry=\"14\" class=\"b\"/><ellipse cx=\"316\" cy=\"136\" rx=\"8\" ry=\"14\" class=\"b\" transform=\"rotate(120 316 136)\"/><ellipse cx=\"344\" cy=\"136\" rx=\"8\" ry=\"14\" class=\"b\" transform=\"rotate(-120 344 136)\"/><circle cx=\"330\" cy=\"128\" r=\"30\" class=\"sa\"/><circle cx=\"330\" cy=\"128\" r=\"4\" class=\"a\"/><path d=\"M294 112 q-70 -14 -150 -4 M294 130 q-70 -6 -150 4 M294 148 q-70 2 -150 14\" class=\"sa w1 dash\"/><rect x=\"296\" y=\"30\" width=\"38\" height=\"26\" rx=\"3\" class=\"p\"/><rect x=\"296\" y=\"30\" width=\"38\" height=\"26\" rx=\"3\" class=\"sa\"/><text x=\"304\" y=\"49\" font-size=\"14\" class=\"hand\">31</text><rect x=\"364\" y=\"70\" width=\"36\" height=\"126\" class=\"a\"/><circle cx=\"370\" cy=\"134\" r=\"2.5\" class=\"b\"/>",
  "spots": [
   {
    "id": "thermo",
    "x": 79,
    "y": 14.5,
    "label": "보일러 조절기",
    "text": "설정은 22도인데 화면에 \"31\"이 깜빡인다."
   },
   {
    "id": "window",
    "x": 20,
    "y": 30,
    "label": "창문",
    "text": "한 뼘만 열려 있다. 창틀에 눈이 쌓였다."
   },
   {
    "id": "fan",
    "x": 82.5,
    "y": 52,
    "label": "선풍기",
    "text": "회전을 끄고 창 쪽으로만 바람을 보낸다. 남자가 일부러 방향을 맞춰 놓았다."
   },
   {
    "id": "door",
    "x": 95.5,
    "y": 42,
    "label": "다용도실 문",
    "text": "문틈으로 희미하게 웅웅거리는 소리가 난다. 안에 보일러가 있다."
   }
  ],
  "starters": [
   "남자는 위험을 미리 알고 있었나요?",
   "그날 밤 집에 불이 났나요?",
   "선풍기가 아니었어도 결과는 같았나요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "best-photo",
  "title": "아빠가 제일 잘 나온 사진",
  "level": 2,
  "tags": [
   "죽음 있음"
  ],
  "story": "엄마는 해마다 같은 날, 아빠가 한 명도 보이지 않는 가족사진을 꺼내 돋보기로 한참 들여다본다. 그러고는 늘 \"이게 아빠가 제일 잘 나온 사진이야\"라고 말한다.",
  "sceneNote": "식탁 위에 세워 둔 액자. 사진 속에는 교문 앞에서 웃는 엄마와, 선글라스를 끼고 꽃다발을 든 딸. 액자 앞에 돋보기, 오른쪽에 찻잔 두 개, 왼쪽에 흰 국화 한 송이가 꽂힌 작은 병.",
  "scene": "<rect width=\"400\" height=\"300\" class=\"db\" opacity=\".35\"/><rect y=\"214\" width=\"400\" height=\"86\" class=\"b\"/><rect y=\"214\" width=\"400\" height=\"86\" class=\"da\" opacity=\".25\"/><path d=\"M0 214 H400\" class=\"sa w3\"/><rect x=\"118\" y=\"22\" width=\"164\" height=\"198\" class=\"a\"/><rect x=\"130\" y=\"34\" width=\"140\" height=\"174\" class=\"p\"/><rect x=\"142\" y=\"94\" width=\"14\" height=\"114\" class=\"da\"/><rect x=\"244\" y=\"94\" width=\"14\" height=\"114\" class=\"da\"/><path d=\"M142 94 H258\" class=\"sa\"/><rect x=\"168\" y=\"76\" width=\"64\" height=\"16\" class=\"p\"/><rect x=\"168\" y=\"76\" width=\"64\" height=\"16\" class=\"sa w1\"/><text x=\"182\" y=\"88\" font-size=\"10\">졸업식</text><circle cx=\"180\" cy=\"158.6\" r=\"10.4\" class=\"a\"/><path d=\"M165.7 208 q0 -26 14.3 -26 q14.3 0 14.3 26 z\" class=\"a\"/><path d=\"M168 152 q12 -16 24 0 v12 h-24z\" class=\"a\"/><circle cx=\"224\" cy=\"171.9\" r=\"7.6\" class=\"a\"/><path d=\"M213.55 208 q0 -26 10.45 -26 q10.45 0 10.45 26 z\" class=\"a\"/><rect x=\"214\" y=\"168\" width=\"8\" height=\"5\" rx=\"2\" class=\"a\"/><rect x=\"226\" y=\"168\" width=\"8\" height=\"5\" rx=\"2\" class=\"a\"/><path d=\"M222 170 h4\" class=\"sa w1\"/><circle cx=\"217\" cy=\"169\" r=\"1.2\" class=\"b\"/><circle cx=\"229\" cy=\"169\" r=\"1.2\" class=\"b\"/><circle cx=\"240\" cy=\"186\" r=\"6\" class=\"b\"/><circle cx=\"246\" cy=\"180\" r=\"5\" class=\"b\"/><circle cx=\"249\" cy=\"190\" r=\"5\" class=\"db\"/><path d=\"M238 192 l-6 12\" class=\"sa w1\"/><rect x=\"118\" y=\"22\" width=\"164\" height=\"198\" class=\"sa w3\"/><circle cx=\"112\" cy=\"252\" r=\"22\" class=\"p\"/><circle cx=\"112\" cy=\"252\" r=\"22\" class=\"da\" opacity=\".25\"/><circle cx=\"112\" cy=\"252\" r=\"22\" class=\"sa w3\"/><path d=\"M128 268 L158 290\" class=\"sa\" style=\"stroke-width:8\"/><path d=\"M300 228 h30 l-4 22 h-22 z\" class=\"p\"/><path d=\"M300 228 h30 l-4 22 h-22 z\" class=\"sa\"/><path d=\"M330 234 q10 2 0 10\" class=\"sa w1\"/><ellipse cx=\"315\" cy=\"230\" rx=\"13\" ry=\"3\" class=\"b\"/><path d=\"M344 232 h30 l-4 22 h-22 z\" class=\"p\"/><path d=\"M344 232 h30 l-4 22 h-22 z\" class=\"sa\"/><path d=\"M374 238 q10 2 0 10\" class=\"sa w1\"/><ellipse cx=\"359\" cy=\"234\" rx=\"13\" ry=\"3\" class=\"b\"/><path d=\"M44 214 q-6 -20 0 -34 h20 q6 14 0 34 z\" class=\"da\"/><path d=\"M44 214 q-6 -20 0 -34 h20 q6 14 0 34 z\" class=\"sa w1\"/><path d=\"M54 180 q0 -30 -2 -48\" class=\"sa\"/><ellipse cx=\"63\" cy=\"122\" rx=\"7\" ry=\"3.4\" class=\"p\" transform=\"rotate(0 63 122)\"/><ellipse cx=\"59.77817459305202\" cy=\"129.77817459305203\" rx=\"7\" ry=\"3.4\" class=\"p\" transform=\"rotate(45 59.77817459305202 129.77817459305203)\"/><ellipse cx=\"52\" cy=\"133\" rx=\"7\" ry=\"3.4\" class=\"p\" transform=\"rotate(90 52 133)\"/><ellipse cx=\"44.22182540694798\" cy=\"129.77817459305203\" rx=\"7\" ry=\"3.4\" class=\"p\" transform=\"rotate(135 44.22182540694798 129.77817459305203)\"/><ellipse cx=\"41\" cy=\"122\" rx=\"7\" ry=\"3.4\" class=\"p\" transform=\"rotate(180 41 122)\"/><ellipse cx=\"44.22182540694798\" cy=\"114.22182540694797\" rx=\"7\" ry=\"3.4\" class=\"p\" transform=\"rotate(225 44.22182540694798 114.22182540694797)\"/><ellipse cx=\"52\" cy=\"111\" rx=\"7\" ry=\"3.4\" class=\"p\" transform=\"rotate(270 52 111)\"/><ellipse cx=\"59.77817459305202\" cy=\"114.22182540694797\" rx=\"7\" ry=\"3.4\" class=\"p\" transform=\"rotate(315 59.77817459305202 114.22182540694797)\"/><ellipse cx=\"63\" cy=\"122\" rx=\"7\" ry=\"3.4\" class=\"sa w1\" transform=\"rotate(0 63 122)\"/><ellipse cx=\"59.77817459305202\" cy=\"129.77817459305203\" rx=\"7\" ry=\"3.4\" class=\"sa w1\" transform=\"rotate(45 59.77817459305202 129.77817459305203)\"/><ellipse cx=\"52\" cy=\"133\" rx=\"7\" ry=\"3.4\" class=\"sa w1\" transform=\"rotate(90 52 133)\"/><ellipse cx=\"44.22182540694798\" cy=\"129.77817459305203\" rx=\"7\" ry=\"3.4\" class=\"sa w1\" transform=\"rotate(135 44.22182540694798 129.77817459305203)\"/><ellipse cx=\"41\" cy=\"122\" rx=\"7\" ry=\"3.4\" class=\"sa w1\" transform=\"rotate(180 41 122)\"/><ellipse cx=\"44.22182540694798\" cy=\"114.22182540694797\" rx=\"7\" ry=\"3.4\" class=\"sa w1\" transform=\"rotate(225 44.22182540694798 114.22182540694797)\"/><ellipse cx=\"52\" cy=\"111\" rx=\"7\" ry=\"3.4\" class=\"sa w1\" transform=\"rotate(270 52 111)\"/><ellipse cx=\"59.77817459305202\" cy=\"114.22182540694797\" rx=\"7\" ry=\"3.4\" class=\"sa w1\" transform=\"rotate(315 59.77817459305202 114.22182540694797)\"/><circle cx=\"52\" cy=\"122\" r=\"5\" class=\"b\"/>",
  "spots": [
   {
    "id": "loupe",
    "x": 28,
    "y": 84,
    "label": "돋보기",
    "text": "렌즈에 손자국이 많다. 엄마는 늘 사진 속 딸의 얼굴 쪽에 대고 본다."
   },
   {
    "id": "girl",
    "x": 56,
    "y": 57,
    "label": "사진 속 딸",
    "text": "졸업 꽃다발을 든 딸이 반짝이는 선글라스를 끼고 있다."
   },
   {
    "id": "cups",
    "x": 84,
    "y": 79,
    "label": "찻잔 두 개",
    "text": "찻잔이 두 개. 하나는 손대지 않은 채 식어 간다."
   },
   {
    "id": "flower",
    "x": 13,
    "y": 41,
    "label": "흰 국화",
    "text": "흰 국화 한 송이. 해마다 이날에만 사 온다."
   }
  ],
  "starters": [
   "아빠는 지금 살아 계신가요?",
   "사진에 아빠가 정말 하나도 안 나오나요?",
   "엄마는 사진에서 무언가를 찾고 있나요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "falling-turtle",
  "title": "들판의 거북",
  "level": 2,
  "tags": [
   "죽음 있음"
  ],
  "story": "바람이 센 날, 넓은 들판 한가운데서 한 남자가 머리를 크게 다쳐 숨진 채 발견됐다. 주변 수십 미터 안에는 다른 사람의 발자국도, 나무도, 건물도 없었다. 남자 곁에서는 거북 한 마리가 천천히 기어가고 있었다.",
  "sceneNote": "넓은 들판. 쓰러진 남자 옆을 작은 거북이 기어간다. 왼쪽 멀리 둥글고 하얀 바위들과 깨진 껍데기 조각. 남자에게서 열 걸음쯤 떨어진 곳에 뒤집힌 모자. 하늘 높이 원을 그리며 도는 작은 점 하나.",
  "scene": "<path d=\"M30 70 q10 -14 26 -6 q12 -12 26 2 q14 0 12 12 H30 Z\" class=\"da\" opacity=\".55\"/><path d=\"M180 50 q10 -12 22 -5 q10 -10 22 2 q12 0 10 10 H180 Z\" class=\"da\" opacity=\".45\"/><ellipse cx=\"312\" cy=\"46\" rx=\"36\" ry=\"12\" class=\"sa w1 dash\"/><path d=\"M300 44 q6 -5 12 0 q6 -5 12 0\" class=\"sa\"/><path d=\"M0 150 q100 -12 200 0 t200 0 V300 H0 Z\" class=\"b\"/><path d=\"M0 150 q100 -12 200 0 t200 0 V300 H0 Z\" class=\"da\" opacity=\".45\"/><path d=\"M0 150 q100 -12 200 0 t200 0\" class=\"sa\"/><path d=\"M20 200 l3 -10 M25 200 l-1 -12 M29 200 l-4 -9\" class=\"sa w1\"/><path d=\"M60 230 l3 -10 M65 230 l-1 -12 M69 230 l-4 -9\" class=\"sa w1\"/><path d=\"M110 280 l3 -10 M115 280 l-1 -12 M119 280 l-4 -9\" class=\"sa w1\"/><path d=\"M250 200 l3 -10 M255 200 l-1 -12 M259 200 l-4 -9\" class=\"sa w1\"/><path d=\"M300 280 l3 -10 M305 280 l-1 -12 M309 280 l-4 -9\" class=\"sa w1\"/><path d=\"M360 196 l3 -10 M365 196 l-1 -12 M369 196 l-4 -9\" class=\"sa w1\"/><path d=\"M380 260 l3 -10 M385 260 l-1 -12 M389 260 l-4 -9\" class=\"sa w1\"/><path d=\"M210 290 l3 -10 M215 290 l-1 -12 M219 290 l-4 -9\" class=\"sa w1\"/><path d=\"M150 190 l3 -10 M155 190 l-1 -12 M159 190 l-4 -9\" class=\"sa w1\"/><path d=\"M90 175 l3 -10 M95 175 l-1 -12 M99 175 l-4 -9\" class=\"sa w1\"/><ellipse cx=\"48\" cy=\"170\" rx=\"24\" ry=\"13\" class=\"p\"/><ellipse cx=\"48\" cy=\"170\" rx=\"24\" ry=\"13\" class=\"db\" opacity=\".6\"/><ellipse cx=\"48\" cy=\"170\" rx=\"24\" ry=\"13\" class=\"sa w1\"/><ellipse cx=\"92\" cy=\"178\" rx=\"16\" ry=\"9\" class=\"p\"/><ellipse cx=\"92\" cy=\"178\" rx=\"16\" ry=\"9\" class=\"sa w1\"/><ellipse cx=\"22\" cy=\"192\" rx=\"14\" ry=\"8\" class=\"p\"/><ellipse cx=\"22\" cy=\"192\" rx=\"14\" ry=\"8\" class=\"sa w1\"/><path d=\"M66 184 l6 -4 l4 5 z M74 168 l5 -2 l2 5 z M36 186 l5 -5 l3 6 z\" class=\"a\"/><circle cx=\"150\" cy=\"238\" r=\"13\" class=\"a\"/><ellipse cx=\"146\" cy=\"232\" rx=\"4.5\" ry=\"2.6\" class=\"p\"/><path d=\"M164 230 h84 q12 0 12 10 v2 q0 10 -12 10 h-84 z\" class=\"a\"/><path d=\"M200 252 l-14 14 M222 252 l10 16\" class=\"sa w3\"/><path d=\"M258 236 h28 M258 248 h26\" class=\"sa w3\"/><ellipse cx=\"214\" cy=\"272\" rx=\"17\" ry=\"10\" class=\"a\"/><ellipse cx=\"214\" cy=\"272\" rx=\"17\" ry=\"10\" class=\"b\"/><path d=\"M206 266 l6 5 l-3 6\" style=\"fill:none;stroke:var(--paper);stroke-width:1.6;stroke-linecap:round\"/><circle cx=\"234\" cy=\"274\" r=\"5\" class=\"a\"/><path d=\"M200 280 l-4 5 M226 281 l4 5\" class=\"sa\"/><path d=\"M318 212 h34 l-5 14 h-24 z\" class=\"a\"/><ellipse cx=\"335\" cy=\"212\" rx=\"24\" ry=\"5\" class=\"a\"/>",
  "spots": [
   {
    "id": "turtle",
    "x": 53.5,
    "y": 91,
    "label": "거북",
    "text": "등껍질에 금이 갔지만 거북은 멀쩡히 걷는다."
   },
   {
    "id": "hat",
    "x": 84,
    "y": 70,
    "label": "뒤집힌 모자",
    "text": "남자의 모자가 열 걸음 떨어진 곳에 뒤집혀 있다. 바람에 날아간 것 같다."
   },
   {
    "id": "speck",
    "x": 78,
    "y": 14,
    "label": "하늘의 점",
    "text": "아주 높은 곳에서 점 하나가 원을 그리며 돈다."
   },
   {
    "id": "rocks",
    "x": 12,
    "y": 56,
    "label": "하얀 바위들",
    "text": "둥글고 하얀 바위들. 주변에 깨진 껍데기 조각이 흩어져 있다."
   }
  ],
  "starters": [
   "누군가 남자를 해쳤나요?",
   "남자는 높은 곳에서 떨어졌나요?",
   "거북이 이 일과 관련 있나요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "midnight-piano",
  "title": "자정의 피아노",
  "level": 3,
  "tags": [
   "죽음 있음",
   "범인 있음"
  ],
  "story": "자정부터 30분 동안 아파트 위층에서 피아노 소리가 들렸다. 다음 날 아침 그 집에 혼자 사는 피아노 선생이 숨진 채 발견됐는데, 사망 추정 시각은 전날 밤 10시였다. 피아노 소리를 들은 이웃은 다섯 명이나 된다.",
  "sceneNote": "밤의 거실. 화면이 켜진 디지털 피아노와 의자, 보면대 위 손으로 그린 악보. 왼쪽 벽시계는 12시. 바닥에 쓰러진 사람. 오른쪽 아래 탁자 위 찻잔 두 개와 레슨 일정표. 오른쪽 위 창밖으로 맞은편 아파트 불빛.",
  "scene": "<rect width=\"400\" height=\"300\" class=\"da\"/><rect width=\"400\" height=\"300\" class=\"a\" opacity=\".22\"/><rect x=\"262\" y=\"24\" width=\"120\" height=\"96\" class=\"a\"/><rect x=\"272\" y=\"34\" width=\"12\" height=\"12\" class=\"b\"/><rect x=\"338\" y=\"34\" width=\"12\" height=\"12\" class=\"b\"/><rect x=\"294\" y=\"56\" width=\"12\" height=\"12\" class=\"b\"/><rect x=\"360\" y=\"56\" width=\"12\" height=\"12\" class=\"b\"/><rect x=\"316\" y=\"78\" width=\"12\" height=\"12\" class=\"b\"/><rect x=\"272\" y=\"100\" width=\"12\" height=\"12\" class=\"b\"/><rect x=\"338\" y=\"100\" width=\"12\" height=\"12\" class=\"b\"/><path d=\"M262 24 H382 V120 H262 Z M322 24 V120\" style=\"fill:none;stroke:var(--paper);stroke-width:3;stroke-linecap:round\"/><circle cx=\"70\" cy=\"60\" r=\"28\" class=\"p\"/><circle cx=\"70\" cy=\"60\" r=\"28\" class=\"sa w3\"/><path d=\"M70 60 V36 M70 60 V40\" class=\"sa w3\"/><path d=\"M70 36 v0 M94 60 h-4 M46 60 h4 M70 84 v-4\" class=\"sa\"/><path d=\"M150 150 L160 102 H270 L280 150\" class=\"a\"/><rect x=\"168\" y=\"106\" width=\"94\" height=\"40\" class=\"p\"/><path d=\"M172 114 H258 M172 119 H258 M172 124 H258 M172 132 H258 M172 137 H258 M172 142 H258\" class=\"sa w1\"/><circle cx=\"184\" cy=\"122\" r=\"2.4\" class=\"a\"/><circle cx=\"198\" cy=\"118\" r=\"2.4\" class=\"a\"/><circle cx=\"214\" cy=\"137\" r=\"2.4\" class=\"a\"/><circle cx=\"232\" cy=\"134\" r=\"2.4\" class=\"a\"/><circle cx=\"246\" cy=\"116\" r=\"2.4\" class=\"a\"/><rect x=\"120\" y=\"150\" width=\"190\" height=\"26\" class=\"a\"/><rect x=\"126\" y=\"153\" width=\"178\" height=\"12\" class=\"p\"/><path d=\"M136 153v12M146 153v12M156 153v12M166 153v12M176 153v12M186 153v12M196 153v12M206 153v12M216 153v12M226 153v12M236 153v12M246 153v12M256 153v12M266 153v12M276 153v12M286 153v12M296 153v12\" class=\"sa w1\"/><rect x=\"196\" y=\"136\" width=\"40\" height=\"13\" class=\"b\"/><text x=\"201\" y=\"146\" font-size=\"9\">00:00</text><rect x=\"128\" y=\"176\" width=\"8\" height=\"70\" class=\"a\"/><rect x=\"294\" y=\"176\" width=\"8\" height=\"70\" class=\"a\"/><rect x=\"170\" y=\"214\" width=\"90\" height=\"10\" class=\"a\"/><rect x=\"176\" y=\"224\" width=\"6\" height=\"22\" class=\"a\"/><rect x=\"248\" y=\"224\" width=\"6\" height=\"22\" class=\"a\"/><path d=\"M0 246 H400\" class=\"sa w1\"/><circle cx=\"78\" cy=\"262\" r=\"11\" class=\"a\"/><path d=\"M90 256 h72 q10 0 10 8 v2 q0 8 -10 8 h-72 z\" class=\"a\"/><path d=\"M110 274 l-8 14 M140 274 l12 12\" class=\"sa w3\"/><rect x=\"300\" y=\"228\" width=\"96\" height=\"8\" class=\"b\"/><rect x=\"306\" y=\"236\" width=\"6\" height=\"30\" class=\"b\"/><rect x=\"384\" y=\"236\" width=\"6\" height=\"30\" class=\"b\"/><path d=\"M310 214 h18 l-3 14 h-12 z\" class=\"p\"/><path d=\"M310 214 h18 l-3 14 h-12 z\" class=\"sa w1\"/><path d=\"M336 214 h18 l-3 14 h-12 z\" class=\"p\"/><path d=\"M336 214 h18 l-3 14 h-12 z\" class=\"sa w1\"/><rect x=\"362\" y=\"210\" width=\"30\" height=\"18\" class=\"p\" transform=\"rotate(-6 377 219)\"/><path d=\"M366 216 h20 M366 221 h14\" class=\"sa w1\" transform=\"rotate(-6 377 219)\"/>",
  "spots": [
   {
    "id": "screen",
    "x": 54,
    "y": 49,
    "label": "피아노 화면",
    "text": "작은 화면에 \"00:00\"과 재생 표시가 떠 있다."
   },
   {
    "id": "score",
    "x": 62.5,
    "y": 38,
    "label": "보면대의 악보",
    "text": "손으로 그린 악보. 제목 칸은 지워져 있고, 구석에 30년 전 날짜가 적혀 있다."
   },
   {
    "id": "cups",
    "x": 81,
    "y": 72,
    "label": "찻잔 두 개",
    "text": "찻잔이 두 개. 선생 말고 손님이 한 명 있었다."
   },
   {
    "id": "schedule",
    "x": 94.5,
    "y": 70,
    "label": "레슨 일정표",
    "text": "어제 칸: \"22:00 서진 — 마지막 레슨\""
   }
  ],
  "starters": [
   "자정에 선생이 직접 피아노를 쳤나요?",
   "선생은 누군가에게 살해됐나요?",
   "피아노 소리를 들은 이웃 중에 범인이 있나요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": true
   },
   {
    "id": "f5",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "last-message",
  "title": "마지막 문자",
  "level": 2,
  "tags": [
   "죽음 있음"
  ],
  "story": "장례식 다음 날 아침, 아내의 휴대폰에 세상을 떠난 남편의 번호로 문자가 왔다. \"잘 도착했어. 꽃집에 들러 줘.\" 아내는 경찰 대신 꽃집으로 향했다.",
  "sceneNote": "이른 아침 아파트 거실 식탁. 새 문자 알림이 뜬 휴대폰, 날짜에 작은 하트를 그린 달력, 현관의 흰 국화 화환, 남편 이름이 적힌 약봉투.",
  "spots": [
   {
    "id": "phone",
    "label": "휴대폰",
    "text": "화면에 새 문자 한 통. 보낸 사람은 \"여보\"."
   },
   {
    "id": "calendar",
    "label": "달력",
    "text": "오늘 날짜에 작은 하트가 그려져 있다."
   },
   {
    "id": "wreath",
    "label": "흰 국화 화환",
    "text": "장례식장에서 가져온 화환이 아직 현관에 있다."
   },
   {
    "id": "pills",
    "label": "약봉투",
    "text": "남편 이름이 적힌 약봉투가 식탁에 그대로 남아 있다."
   }
  ],
  "starters": [
   "남편은 정말 세상을 떠났나요?",
   "누군가 남편 휴대폰을 쓰고 있나요?",
   "꽃집이 중요한 장소인가요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "dark-reading",
  "title": "불 꺼진 방의 독서",
  "level": 1,
  "tags": [
   "죽음 없음"
  ],
  "story": "동네 전체가 정전된 밤, 아홉 살 아이는 불 꺼진 방에서 두꺼운 책 한 권을 처음부터 끝까지 읽었다. 다음 날 엄마는 아이의 담임 선생님께 고맙다는 편지를 썼다.",
  "sceneNote": "정전된 밤의 아이 방. 창밖 동네가 깜깜하다. 책상 위에 켜지지 않은 초와 성냥, 펼쳐진 아주 두꺼운 책. 아이는 그림자로만 보이고 두 손바닥을 책장 위에 얹고 있다.",
  "spots": [
   {
    "id": "candle",
    "label": "초와 성냥",
    "text": "초는 켜지지 않았고 성냥도 한 개비도 쓰지 않았다."
   },
   {
    "id": "book",
    "label": "두꺼운 책",
    "text": "크고 두꺼운 책인데 표지에 제목 글씨가 보이지 않는다."
   },
   {
    "id": "hands",
    "label": "아이의 손",
    "text": "두 손바닥을 책장 위에 펴서 얹고 있다."
   },
   {
    "id": "window",
    "label": "창밖",
    "text": "동네 전체가 정전으로 깜깜하다."
   }
  ],
  "starters": [
   "아이가 손전등이나 촛불을 썼나요?",
   "아이는 책 내용을 외우고 있었나요?",
   "책이 특별한 책인가요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "stage-gun",
  "title": "매일 밤 쓰러지는 배우",
  "level": 3,
  "tags": [
   "죽음 있음",
   "범인 있음"
  ],
  "story": "배우 한도윤은 석 달째 매일 밤 9시, 무대에서 총에 맞아 쓰러졌다. 오늘 밤 그는 쓰러진 뒤 다시 일어나지 않았고, 관객들은 그 어느 때보다 큰 기립박수를 보냈다.",
  "sceneNote": "연극 무대. 스포트라이트 아래 정장 차림의 남자가 쓰러져 있고 옆에 검은 리볼버가 떨어져 있다. 붉은 막이 내려오는 중이고, 어두운 객석에서 관객들이 일어서 박수를 친다. 무대 옆 어둠 속에 누군가의 그림자.",
  "spots": [
   {
    "id": "curtain",
    "label": "붉은 막",
    "text": "막이 내려오는 중이다. 쓰러진 남자 주변 바닥에 검붉은 얼룩이 번져 있다."
   },
   {
    "id": "gun",
    "label": "리볼버",
    "text": "검은 소품 리볼버. 총구에서 연기가 가늘게 피어오른다."
   },
   {
    "id": "audience",
    "label": "객석",
    "text": "관객 대부분이 일어서서 손뼉을 치고 있다."
   },
   {
    "id": "wings",
    "label": "무대 옆 그림자",
    "text": "무대 옆 어둠 속에서 누군가 쓰러진 배우를 지켜보고 있다."
   }
  ],
  "starters": [
   "배우가 정말로 죽었나요?",
   "총을 쏜 배우가 범인인가요?",
   "관객들은 무슨 일이 일어났는지 알았나요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": true
   },
   {
    "id": "f5",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "morning-knock",
  "title": "아침 일곱 시의 노크",
  "level": 1,
  "tags": [
   "죽음 있음"
  ],
  "story": "매일 아침 7시, 누군가 할아버지 집 부엌 창문을 세 번 두드렸다. 할아버지가 세상을 떠난 뒤에도 두드림은 하루도 빠짐없이 계속됐다. 그 소리를 들은 손녀는 울다가 웃었다.",
  "sceneNote": "이른 겨울 아침 오래된 시골집 부엌. 7시를 가리키는 벽시계, 김 서린 부엌 창문과 바깥쪽이 긁힌 창틀, 식탁 위 할아버지의 컵과 돋보기, 창밖 감나무의 새 둥지.",
  "spots": [
   {
    "id": "window",
    "label": "부엌 창문",
    "text": "창틀 바깥쪽이 군데군데 작게 긁혀 있다."
   },
   {
    "id": "clock",
    "label": "벽시계",
    "text": "7시 정각을 가리킨다."
   },
   {
    "id": "cup",
    "label": "식탁",
    "text": "할아버지가 쓰던 컵 하나와 돋보기."
   },
   {
    "id": "tree",
    "label": "창밖 나무",
    "text": "감나무 가지에 새 둥지가 하나 보인다."
   }
  ],
  "starters": [
   "사람이 창문을 두드렸나요?",
   "두드리는 시간이 매일 같나요?",
   "할아버지가 생전에 하던 일과 관련 있나요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "typo-note",
  "title": "맞춤법 틀린 유서",
  "level": 3,
  "tags": [
   "죽음 있음",
   "범인 있음"
  ],
  "story": "은퇴한 국어 교사 윤 선생이 서재에서 숨진 채 발견됐다. 책상 위에는 출력한 유서 한 장과 그의 서명이 있었다. 형사는 유서를 한 번 읽어 보고 곧바로 타살 수사를 시작했다.",
  "sceneNote": "밤의 서재. 녹색 탁상등 아래 책상에 출력한 유서 한 장과 서명, 뚜껑 열린 빨간 펜, 찻잔 두 개. 벽을 채운 국어사전과 맞춤법 책. 안락의자에 기대 움직이지 않는 노인.",
  "spots": [
   {
    "id": "note",
    "label": "유서",
    "text": "컴퓨터로 써서 출력한 한 장짜리 유서. 끝에 손으로 쓴 서명이 있다."
   },
   {
    "id": "pen",
    "label": "빨간 펜",
    "text": "뚜껑이 열린 빨간 펜이 유서 옆에 놓여 있다."
   },
   {
    "id": "cups",
    "label": "찻잔 두 개",
    "text": "찻잔이 두 개. 하나에는 차가 조금 남아 있다."
   },
   {
    "id": "shelf",
    "label": "책장",
    "text": "국어사전과 맞춤법 책이 빼곡하다."
   }
  ],
  "starters": [
   "유서는 윤 선생이 직접 쓴 건가요?",
   "유서의 내용이 중요한가요?",
   "그날 밤 서재에 손님이 있었나요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "milk-promise",
  "title": "우유 한 팩의 약속",
  "level": 1,
  "tags": [
   "죽음 없음"
  ],
  "story": "매일 밤 11시, 한 할아버지가 편의점에 와서 우유 한 팩을 사고는 계산대에 그대로 두고 나갔다. 알바생은 그 우유를 냉장고 맨 아래 칸에 넣어 두었다. 어느 날 밤 11시 반, 알바생은 일하다 말고 119에 전화를 걸었다.",
  "sceneNote": "밤 11시 30분 동네 편의점 계산대. 계산이 끝난 우유 한 팩과 영수증, 11시 30분을 가리키는 벽시계, 계산대 위 휴대폰, 유리문 밖 가로등 아래 텅 빈 골목.",
  "spots": [
   {
    "id": "milk",
    "label": "계산대 위 우유",
    "text": "오늘은 계산된 우유가 없다. 어제 날짜 영수증만 남아 있다."
   },
   {
    "id": "clock",
    "label": "벽시계",
    "text": "밤 11시 30분."
   },
   {
    "id": "phone",
    "label": "알바생 휴대폰",
    "text": "통화 버튼을 누르려는 참이다."
   },
   {
    "id": "door",
    "label": "유리문 밖",
    "text": "가로등 아래 아무도 없는 골목."
   }
  ],
  "starters": [
   "할아버지는 우유를 마시나요?",
   "오늘 밤 할아버지가 편의점에 왔나요?",
   "할아버지와 알바생은 가족인가요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "air-holes",
  "title": "숨구멍 뚫린 상자",
  "level": 1,
  "tags": [
   "죽음 없음"
  ],
  "story": "택배 기사는 배달할 상자 하나를 들어 보고는 배달을 멈추고 동물병원으로 차를 돌렸다. 상자에서는 아무 소리도 나지 않았다.",
  "sceneNote": "한여름 오후 택배 트럭 짐칸. 상자들 사이에서 기사가 테이프를 칭칭 감은 갈색 상자 하나를 조심스럽게 수평으로 들고 있다. 상자 옆면에 작은 구멍들.",
  "spots": [
   {
    "id": "box",
    "label": "갈색 상자",
    "text": "평범한 상자인데 테이프가 지나치게 많이 감겨 있다."
   },
   {
    "id": "holes",
    "label": "상자 옆면",
    "text": "연필 굵기의 작은 구멍이 몇 개 뚫려 있다."
   },
   {
    "id": "hands",
    "label": "기사의 손",
    "text": "상자가 기울지 않게 아주 조심스럽게 들고 있다."
   },
   {
    "id": "heat",
    "label": "짐칸",
    "text": "한여름이라 짐칸 안이 찜통처럼 덥다."
   }
  ],
  "starters": [
   "상자 안에 위험한 물건이 있었나요?",
   "상자 안에 살아 있는 것이 있었나요?",
   "소리가 나지 않은 게 중요한가요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "second-wedding",
  "title": "두 번째 결혼식",
  "level": 2,
  "tags": [
   "죽음 없음"
  ],
  "story": "여자는 결혼 40주년에 같은 남자와 두 번째 결혼식을 올렸다. 식이 끝나자 신랑은 신부에게 정중하게 물었다. \"처음 뵙겠습니다. 성함이 어떻게 되시죠?\" 신부는 행복하게 웃었다.",
  "sceneNote": "큰 창 너머로 정원이 보이는 작은 강당의 소박한 결혼식. 흰 드레스의 할머니와 양복 차림의 할아버지가 손을 잡고 있고, 할아버지는 신부를 낯선 사람 보듯 본다. 휠체어 하객들, 숫자 40 초가 꽂힌 작은 케이크.",
  "spots": [
   {
    "id": "cake",
    "label": "케이크",
    "text": "작은 케이크 위에 숫자 40 모양 초."
   },
   {
    "id": "guests",
    "label": "하객석",
    "text": "휠체어를 탄 하객이 많고, 같은 옷을 입은 직원들이 보인다."
   },
   {
    "id": "hands",
    "label": "두 사람의 손",
    "text": "반지를 낀 할아버지 손가락이 약간 떨린다."
   },
   {
    "id": "window",
    "label": "창밖",
    "text": "넓은 정원과 산책하는 어르신들."
   }
  ],
  "starters": [
   "신랑이 장난을 친 건가요?",
   "두 사람은 이혼했다가 재혼했나요?",
   "신랑이 아픈가요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "last-medal",
  "title": "꼴찌의 메달",
  "level": 1,
  "tags": [
   "죽음 없음"
  ],
  "story": "마라톤 대회에서 마지막으로 결승선에 들어온 남자에게 관중 전체가 일어나 박수를 쳤다. 그날 우승자는 자기 금메달을 벗어 그 남자의 목에 걸어 주었다.",
  "sceneNote": "해 질 녘 도심 마라톤 결승선. 무릎이 흙투성이인 지친 주자가 마지막으로 들어오고, 우승자가 그의 목에 금메달을 걸어 준다. 일어서서 박수 치는 관중, 뒤편의 기록 시계.",
  "spots": [
   {
    "id": "clock",
    "label": "기록 시계",
    "text": "4시간 51분. 우승 기록보다 두 시간 넘게 늦다."
   },
   {
    "id": "knees",
    "label": "남자의 무릎",
    "text": "양 무릎에 흙이 잔뜩 묻고 살짝 까져 있다."
   },
   {
    "id": "crowd",
    "label": "관중",
    "text": "모두 일어서 있다. 장내 방송이 뭔가를 알린 직후다."
   },
   {
    "id": "medal",
    "label": "금메달",
    "text": "우승자가 자기 메달을 벗어 걸어 주고 있다."
   }
  ],
  "starters": [
   "남자는 원래 느린 선수인가요?",
   "경기 중에 무슨 일이 있었나요?",
   "남자와 우승자는 아는 사이인가요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "taxi-3am",
  "title": "새벽 세 시의 손님",
  "level": 1,
  "tags": [
   "죽음 없음"
  ],
  "story": "새벽 3시, 택시 기사는 목적지를 말하지 않는 손님을 태우고 30분을 달렸다. 내릴 때 요금은 받지 않았고, 일주일 뒤 기사는 경찰서에서 감사장을 받았다.",
  "sceneNote": "새벽 3시 택시 안, 운전석에서 본 모습. 꺼진 미터기, 룸미러에 비친 분홍 꽃무늬 잠옷 차림의 작은 노인, 거치대의 휴대폰, 창밖 텅 빈 도로.",
  "spots": [
   {
    "id": "mirror",
    "label": "룸미러",
    "text": "뒷좌석에 꽃무늬 잠옷 차림의 작은 할머니가 두리번거린다."
   },
   {
    "id": "meter",
    "label": "미터기",
    "text": "꺼져 있다."
   },
   {
    "id": "phone",
    "label": "기사의 휴대폰",
    "text": "통화 기록 맨 위에 낯선 번호."
   },
   {
    "id": "road",
    "label": "창밖",
    "text": "새벽 3시의 텅 빈 도로."
   }
  ],
  "starters": [
   "손님은 강도였나요?",
   "손님은 목적지를 몰랐나요?",
   "기사와 손님은 아는 사이인가요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "runaway-bride",
  "title": "신랑의 미소",
  "level": 2,
  "tags": [
   "죽음 없음"
  ],
  "story": "결혼식 시작 10분 전, 신부가 사라졌다. 신랑은 경찰에 신고하지 않았다. 대신 마이크를 잡고 하객들에게 사과한 뒤, 준비된 식사를 끝까지 대접하고 환하게 웃었다.",
  "sceneNote": "웨딩홀. 턱시도 차림의 신랑이 무대에서 마이크를 들고 차분히 웃고, 원형 테이블의 하객들은 당황해 서로를 본다. 신랑 뒤 큰 창 너머로 작은 차 한 대가 주차장을 빠져나간다.",
  "spots": [
   {
    "id": "groom",
    "label": "신랑",
    "text": "마이크를 들고 차분하다. 어딘가 안도한 얼굴이다."
   },
   {
    "id": "guests",
    "label": "하객석",
    "text": "양가 부모님 자리만 유난히 소란스럽다."
   },
   {
    "id": "window",
    "label": "창밖",
    "text": "작은 차 한 대가 주차장을 빠져나가고 있다."
   },
   {
    "id": "room",
    "label": "신부 대기실",
    "text": "거울 앞 의자가 비어 있고, 부케만 남아 있다."
   }
  ],
  "starters": [
   "신부가 납치됐나요?",
   "신부가 스스로 떠났나요?",
   "신랑은 신부가 떠날 걸 알았나요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "phishing-grandma",
  "title": "끝까지 속은 할머니",
  "level": 2,
  "tags": [
   "죽음 없음",
   "범인 있음"
  ],
  "story": "보이스피싱 전화를 받은 할머니는 수상하다는 걸 알면서도 40분 동안 끝까지 속는 척했다. 다음 날, 전화를 건 사기범이 경찰서에 제 발로 찾아와 자수했다.",
  "sceneNote": "해 질 녘 오래된 주택 거실. 유선 전화기 옆에 앉은 할머니가 손수건을 꼭 쥐고 젖은 눈으로 희미하게 웃는다. 냉장고에 붙은 아이의 크레파스 그림, 오래된 벽 달력.",
  "spots": [
   {
    "id": "phone",
    "label": "유선 전화기",
    "text": "방금 끊었다. 액정에 통화 시간 40분."
   },
   {
    "id": "hands",
    "label": "할머니의 손",
    "text": "손수건을 꼭 쥐고 있다."
   },
   {
    "id": "drawing",
    "label": "냉장고",
    "text": "삐뚤빼뚤한 아이 그림. \"할머니 사랑해요\"라는 글씨가 바랬다."
   },
   {
    "id": "calendar",
    "label": "달력",
    "text": "3년 전 달력이 아직 걸려 있다. 한 날짜에 동그라미."
   }
  ],
  "starters": [
   "할머니가 돈을 보냈나요?",
   "할머니는 사기라는 걸 알았나요?",
   "사기범과 할머니는 아는 사이인가요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "snowman-wallet",
  "title": "녹아내린 눈사람",
  "level": 1,
  "tags": [
   "죽음 없음",
   "범인 있음"
  ],
  "story": "아파트 놀이터의 눈사람이 녹아 갈 무렵, 경비원이 그 앞에서 112에 신고했다. 사흘 뒤, 일주일째 잡히지 않던 동네 소매치기가 붙잡혔다.",
  "sceneNote": "날이 풀린 해 질 녘의 아파트 놀이터. 반쯤 녹아 기울어진 눈사람, 젖은 땅에 떨어진 당근 코, 손전등으로 눈사람 배를 비추는 경비원, 물이 떨어지는 그네.",
  "spots": [
   {
    "id": "snowman",
    "label": "눈사람",
    "text": "몸통이 절반쯤 녹아 기울어 있다. 배 부분이 유난히 울퉁불퉁하다."
   },
   {
    "id": "carrot",
    "label": "당근 코",
    "text": "젖은 땅에 떨어져 있다."
   },
   {
    "id": "flashlight",
    "label": "경비원의 손전등",
    "text": "눈사람 배를 비추고 있다."
   },
   {
    "id": "board",
    "label": "놀이터 게시판",
    "text": "빛바랜 경고문이 붙어 있다."
   }
  ],
  "starters": [
   "눈사람 안에 무언가 있었나요?",
   "눈사람을 만든 건 아이들인가요?",
   "돈과 관련 있나요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "secret-hole-in-one",
  "title": "아무도 모르는 홀인원",
  "level": 1,
  "tags": [
   "죽음 없음"
  ],
  "story": "김 부장은 골프를 친 지 20년 만에 처음으로 홀인원을 했다. 그런데 그는 그 사실을 가족에게도 회사에도 끝까지 말하지 않았다.",
  "sceneNote": "안개 낀 평일 이른 아침의 텅 빈 골프장 그린. 컵 안에 들어간 흰 골프공과 깃발, 근처 카트에 걸린 정장 재킷과 넥타이, 좌석 위에서 알림이 계속 뜨는 휴대폰. 주변엔 아무도 없다.",
  "spots": [
   {
    "id": "ball",
    "label": "골프공",
    "text": "홀 컵 안에 공이 정확히 들어가 있다."
   },
   {
    "id": "jacket",
    "label": "정장 재킷",
    "text": "카트에 정장 재킷과 넥타이가 걸려 있다."
   },
   {
    "id": "phone",
    "label": "휴대폰",
    "text": "회사 단체방 알림이 쌓여 있다. 맨 위는 \"부장님 몸은 좀 괜찮으세요?\""
   },
   {
    "id": "course",
    "label": "코스",
    "text": "평일 아침이라 주변에 아무도 없다."
   }
  ],
  "starters": [
   "홀인원이 가짜인가요?",
   "그날 김 부장은 혼자 쳤나요?",
   "그 시간에 김 부장은 다른 곳에 있어야 했나요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "blood-type",
  "title": "헌혈의 집",
  "level": 2,
  "tags": [
   "죽음 없음"
  ],
  "story": "스무 살 청년은 생애 첫 헌혈을 마치고 받은 헌혈증을 한참 들여다보았다. 그날 밤 그는 부모님께 물었다. \"저 입양된 거, 언제 말해 주실 생각이었어요?\"",
  "sceneNote": "밤의 식탁에 혼자 앉은 이십 대 청년. 작은 헌혈증 카드를 쥐고 있고, 팔꿈치 안쪽에 반창고. 식탁 위 세 식구 가족사진, 반쯤 열린 서랍 안 서류들.",
  "spots": [
   {
    "id": "card",
    "label": "헌혈증",
    "text": "손에 쥔 작은 카드. 엄지로 혈액형 칸을 문지르고 있다."
   },
   {
    "id": "bandage",
    "label": "팔의 반창고",
    "text": "팔꿈치 안쪽에 작은 반창고."
   },
   {
    "id": "photo",
    "label": "가족사진",
    "text": "식탁 위 세 식구 사진. 청년은 아빠도 엄마도 닮지 않았다는 말을 자주 들었다."
   },
   {
    "id": "drawer",
    "label": "서랍",
    "text": "부모님 건강검진 결과지가 반쯤 보인다."
   }
  ],
  "starters": [
   "헌혈하다가 무슨 일이 있었나요?",
   "헌혈증에 적힌 내용이 중요한가요?",
   "누가 그에게 사실을 알려 줬나요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "freezer",
  "title": "한여름의 동사",
  "level": 3,
  "tags": [
   "죽음 있음",
   "범인 있음"
  ],
  "story": "35도가 넘는 한여름 밤, 식당 주방장 박 씨가 얼어 죽은 채 발견됐다. 문은 밖에서 잠겨 있지 않았고, 그는 문 바로 앞에 쓰러져 있었다.",
  "sceneNote": "새벽 5시 식당 주방. 스테인리스 조리대 사이, 반쯤 열린 대형 냉동 창고의 묵직한 은색 문에서 냉기가 흘러나온다. 영하 25도를 가리키는 온도 표시, 문 앞 바닥에 흩어진 성에 조각, 문 안쪽에 보이는 흰 조리복 팔.",
  "spots": [
   {
    "id": "door",
    "label": "냉동 창고 문",
    "text": "묵직한 은색 문. 바깥에 잠금장치는 없다."
   },
   {
    "id": "temp",
    "label": "온도 표시",
    "text": "영하 25도."
   },
   {
    "id": "floor",
    "label": "문 앞 바닥",
    "text": "성에 조각이 흩어져 있다."
   },
   {
    "id": "clock",
    "label": "주방 시계",
    "text": "새벽 5시. 아침 준비조가 막 출근했다."
   }
  ],
  "starters": [
   "박 씨는 실내에서 죽었나요?",
   "문이 잠겨 있었나요?",
   "사고인가요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "empty-tank",
  "title": "텅 빈 어항",
  "level": 1,
  "tags": [
   "죽음 없음",
   "범인 있음"
  ],
  "story": "부잣집 거실 어항에서 한 마리에 수백만 원짜리 열대어 열 마리가 하룻밤 새 모두 사라졌다. 의심받던 가정부는 무죄였다. 범인은 집 안에 있었고, 아무 벌도 받지 않았다.",
  "sceneNote": "아침의 고급스러운 거실. 물과 수초, 기포만 남은 큰 유리 어항과 살짝 열린 뚜껑, 어항 앞 작은 어린이 의자, 대리석 바닥 위로 욕실 쪽까지 이어진 물방울 자국.",
  "spots": [
   {
    "id": "tank",
    "label": "빈 어항",
    "text": "물과 수초만 남았다. 뚜껑이 살짝 열려 있다."
   },
   {
    "id": "stool",
    "label": "작은 의자",
    "text": "어항 앞에 어린이용 의자 하나."
   },
   {
    "id": "drops",
    "label": "바닥",
    "text": "어항에서 욕실 쪽으로 물방울이 점점이 이어진다."
   },
   {
    "id": "tv",
    "label": "거실 TV",
    "text": "어젯밤 켜 둔 채 잠든 흔적. 리모컨이 소파에 있다."
   }
  ],
  "starters": [
   "도둑이 들었나요?",
   "범인은 가족인가요?",
   "물고기가 죽었나요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "dry-shoes",
  "title": "마른 구두",
  "level": 2,
  "tags": [
   "죽음 있음",
   "범인 있음"
  ],
  "story": "폭우가 쏟아진 밤 10시, 오피스텔에서 한 남자가 살해됐다. 그 시각 30분을 걸어 퇴근하고 있었다는 용의자의 구두는 바짝 말라 있었다. 형사는 그 구두 하나로 그를 범인으로 지목했다.",
  "sceneNote": "폭우 치는 밤 경찰서 조사실. 용의자의 광이 나는 마른 가죽 구두를 트렌치코트 차림의 형사가 내려다본다. 창밖 세찬 빗줄기, 문 옆 우산꽂이의 젖은 우산.",
  "spots": [
   {
    "id": "shoes",
    "label": "구두",
    "text": "광이 나는 가죽 구두. 밑창까지 바짝 말라 있다."
   },
   {
    "id": "window",
    "label": "창밖",
    "text": "빗줄기가 유리창을 세차게 때린다."
   },
   {
    "id": "umbrella",
    "label": "우산꽂이",
    "text": "형사의 젖은 우산 하나."
   },
   {
    "id": "statement",
    "label": "진술서",
    "text": "\"밤 10시엔 비를 맞으며 걸어서 퇴근 중이었다.\""
   }
  ],
  "starters": [
   "구두가 중요한가요?",
   "용의자의 알리바이가 거짓인가요?",
   "날씨가 중요한가요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "cancelled-policy",
  "title": "불나기 전날의 보험",
  "level": 2,
  "tags": [
   "죽음 없음",
   "범인 있음"
  ],
  "story": "보험 설계사 오 씨는 자기 고객의 화재보험 계약을 회사에 정지해 달라고 요청했다. 바로 다음 날 밤, 정말로 그 집에 불이 났다. 고객은 체포됐고, 오 씨는 회사에서 상을 받았다.",
  "sceneNote": "밤, 작은 불이 막 꺼진 단독 주택 거실. 그을린 벽에 액자를 걸었던 자국만 하얗게 남았고 가구는 그대로다. 창밖 마당에 빨간 휘발유 통, 이미 도착해 있는 경찰차 두 대, 현관의 소방관.",
  "spots": [
   {
    "id": "walls",
    "label": "그을린 벽",
    "text": "가구는 그대로인데 벽에 걸려 있던 액자는 하나도 없다."
   },
   {
    "id": "can",
    "label": "휘발유 통",
    "text": "마당에 빨간 휘발유 통이 굴러다닌다."
   },
   {
    "id": "police",
    "label": "경찰차",
    "text": "불이 나자마자 경찰차 두 대가 이미 집 앞에 와 있었다."
   },
   {
    "id": "firefighter",
    "label": "소방관",
    "text": "불은 금방 꺼졌다. 다친 사람은 없다."
   }
  ],
  "starters": [
   "설계사가 불을 질렀나요?",
   "집주인이 불을 질렀나요?",
   "경찰은 미리 알고 있었나요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "acrostic",
  "title": "세로로 읽는 반성문",
  "level": 2,
  "tags": [
   "죽음 없음",
   "범인 있음"
  ],
  "story": "숙제를 매일 안 해 오던 열 살 아이가 반성문을 써서 냈다. 반성문을 끝까지 읽은 담임 선생님은 아이를 혼내지 않고, 교무실로 가 곧장 경찰에 신고했다.",
  "sceneNote": "방과 후 오후 4시 반의 텅 빈 교실. 한 책상 위에 공책을 찢어 쓴 열한 줄짜리 반성문, 줄마다 첫 글자가 유난히 진하다. 옆 가방에 꽂힌 다 푼 문제집. 벽시계는 4시 반.",
  "spots": [
   {
    "id": "letter",
    "label": "반성문",
    "text": "공책을 찢어 쓴 열한 줄. 줄마다 첫 글자만 꾹꾹 눌러 썼다."
   },
   {
    "id": "bag",
    "label": "아이 가방",
    "text": "빈칸 하나 없이 다 푼 숙제 공책이 꽂혀 있다."
   },
   {
    "id": "sleeves",
    "label": "아이 옷",
    "text": "한여름인데 긴소매 옷을 입고 다닌다."
   },
   {
    "id": "clock",
    "label": "교실 시계",
    "text": "방과 후 4시 반. 아이는 늘 집에 늦게 가고 싶어 했다."
   }
  ],
  "starters": [
   "반성문에 숨은 뜻이 있나요?",
   "아이가 무슨 잘못을 저질렀나요?",
   "가족과 관련 있나요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 },
 {
  "id": "upside-painting",
  "title": "거꾸로 걸린 그림",
  "level": 2,
  "tags": [
   "죽음 없음",
   "범인 있음"
  ],
  "story": "빈집에 도둑이 들었지만 사라진 물건은 하나도 없었다. 그런데 집주인은 거실에 걸린 추상화를 보자마자 곧바로 경찰에 신고했다.",
  "sceneNote": "밤, 고급 아파트 거실. 금빛 액자에 든 붉고 푸른 커다란 추상화가 살짝 기울어 걸려 있고, 그 위 벽에 못 자국 하나, 아래 바닥에 금빛 액자 부스러기. 옆 유리 장식장의 명품 시계와 보석은 그대로.",
  "spots": [
   {
    "id": "painting",
    "label": "추상화",
    "text": "붉고 푸른 큰 추상화. 액자가 살짝 기울었다."
   },
   {
    "id": "nail",
    "label": "벽",
    "text": "그림 위쪽 벽지에 못 자국이 하나 더 있다."
   },
   {
    "id": "chips",
    "label": "바닥",
    "text": "그림 아래에 금빛 액자 부스러기가 떨어져 있다."
   },
   {
    "id": "cabinet",
    "label": "장식장",
    "text": "명품 시계와 보석이 하나도 손대지 않은 채 그대로다."
   }
  ],
  "starters": [
   "정말 아무것도 사라지지 않았나요?",
   "그림이 중요한가요?",
   "집주인이 그림을 거꾸로 걸었나요?"
  ],
  "facts": [
   {
    "id": "f1",
    "need": true
   },
   {
    "id": "f2",
    "need": true
   },
   {
    "id": "f3",
    "need": true
   },
   {
    "id": "f4",
    "need": false
   }
  ],
  "clues": 3
 }
];
