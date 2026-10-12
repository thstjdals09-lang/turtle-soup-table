// 자동 생성 파일 — tools/build.mjs 가 private/puzzles.mjs 에서 만든다. 직접 고치지 말 것.
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
    "x": 50,
    "y": 72,
    "label": "수프 그릇",
    "text": "국물이 거의 그대로다. 숟가락 자국은 딱 한 번."
   },
   {
    "id": "island",
    "x": 75.5,
    "y": 28,
    "label": "창밖의 섬",
    "text": "작은 무인도. 종업원 말로는 남자가 주문하기 전부터 한참 그 섬 쪽만 보고 있었다."
   },
   {
    "id": "bill",
    "x": 86,
    "y": 90,
    "label": "계산서",
    "text": "\"바다거북 수프 1\". 남자는 거스름돈도 받지 않고 나갔다."
   },
   {
    "id": "ring",
    "x": 11.5,
    "y": 27,
    "label": "벽의 구명튜브",
    "text": "식당 장식품. 남자는 들어오면서 그걸 한참 쓰다듬었다."
   }
  ],
  "starters": [
   "수프에 무언가 잘못된 게 있었나요?",
   "주방장이 거짓말을 했나요?",
   "남자는 혼자 왔나요?"
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
    "x": 62.5,
    "y": 60,
    "label": "창가의 그릇",
    "text": "국물 한 방울 남지 않았다. 젓가락이 그릇 위에 가지런히 놓여 있다."
   },
   {
    "id": "lamp",
    "x": 28,
    "y": 15,
    "label": "전등",
    "text": "가게 문을 닫은 뒤에도 이 등만은 15년 동안 매일 밤 켜져 있었다."
   },
   {
    "id": "photo",
    "x": 12.5,
    "y": 35,
    "label": "벽의 사진",
    "text": "빛바랜 사진 속 아이가 이 가게에서 국수를 먹으며 웃고 있다."
   },
   {
    "id": "calendar",
    "x": 14,
    "y": 64,
    "label": "달력",
    "text": "오늘 날짜에 동그라미. 옆에 작게 \"15\"라고 적혀 있다."
   }
  ],
  "starters": [
   "사장은 누군가를 기다리고 있었나요?",
   "국수를 먹은 건 사람인가요?",
   "사장에게 나쁜 일이 생겼나요?"
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
 }
];
