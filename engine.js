(function(root){

'use strict';

const C=(label,note,delta={},more={})=>({label,note,delta,...more});

const events=[

{id:'first',tag:'第一次開台',title:'觀眾人數：1',body:'你說完練習很久的開場白。聊天室一直安靜，直到一個叫「小雨」的帳號打出：聲音有點小，但我聽得到。',choices:[C('問問小雨，今天過得怎麼樣','讓這一個人，成為值得開台的理由。',{bond:12,joy:8},{flag:'rain'}),C('照著企劃，把節目完成','先練習把自己的內容做好。',{skill:9,joy:3}),C('承認緊張，重新打一次招呼','不完美，也可以是真正的開始。',{bond:6,joy:9})]},

{id:'anniversary',tag:'一週年',title:'今天，換大家對你說謝謝',body:'你翻到第一次開台的錄影。那時的你不知道，竟然真的會有人記住這個日子。',choices:[C('念出觀眾留下的回憶','留下彼此陪伴過的證據。',{bond:13,joy:12},{flag:'memories'}),C('準備一場特別企劃','把這一天變成作品。',{money:-1800,skill:8,joy:6},{fans:160}),C('簡單開台，一起聊天','重要的人，不一定需要盛大的舞台。',{health:7,bond:9,joy:9})]},

{id:'agency',tag:'岔路',title:'一封合作邀請',body:'一間小型團隊邀你加入，提供宣傳與資源，也會分走未來部分收益。它不是保證成功的車票。',choices:[C('加入團隊','往後曝光加成 25%，頻道收益分成 25%。',{network:15,joy:3},{flag:'agency'}),C('保留自由，自己走','自己的步調也值得珍惜。',{joy:9,skill:4},{flag:'indie'}),C('請朋友一起研究條款，再婉拒','釐清自己真正想要的合作。',{money:-800,network:6,skill:7},{flag:'indie'})]},

{id:'rainback',tag:'熟悉的名字',title:'「最近比較忙，但我還在。」',body:'小雨已經一陣子沒出現。今晚熟悉的帳號又亮了：新工作很忙，只能偶爾看回放。',choices:[C('告訴他，生活優先','留一個可以隨時回來的地方。',{bond:12,joy:8},{flag:'home'}),C('整理短版回顧','讓不同生活節奏的人也能跟上。',{skill:7,health:-4,bond:5},{fans:70}),C('試試別的開台時段','接住不同時間的晚安。',{health:-6,network:4},{chance:.5,win:{fans:120},lose:{joy:-3}})]},

{id:'clip',tag:'偶然被看見',title:'那段意外好笑的片段',body:'一段你沒特別在意的片段，被剪成短影片。陌生人開始問：這是誰？',choices:[C('順勢做系列','可能擴散，也可能只是短暫停留。',{health:-8,skill:4},{chance:.6,win:{fans:430,joy:8},lose:{fans:25,joy:-5}}),C('謝謝剪輯者，回到原本節奏','讓新觀眾看到平常的你。',{bond:7,joy:5},{fans:90}),C('付費建立長期剪輯合作','把偶然變成持續的作品。',{money:-1300,network:9,skill:4},{fans:160})]},

{id:'gear',tag:'創作日常',title:'麥克風又開始有雜音',body:'新設備很誘人，但帳戶餘額也很誠實。',choices:[C('換可靠的麥克風','投資每天都用得到的東西。',{money:-2400,skill:8,bond:3}),C('排查線材和設定','不一定要買新東西才能解決。',{health:-4,skill:6}),C('先借朋友的設備','把這份幫忙放在心上。',{network:5,bond:2})]},

{id:'numbers',tag:'低潮',title:'同一時間，少了一半的人',body:'你一直看向角落的數字，漸漸忘了原本想說什麼。',choices:[C('關掉人數顯示','先和眼前的人好好相處。',{joy:10,bond:6},{flag:'boundaries'}),C('分析節目，調整一個地方','用小實驗代替整夜自責。',{skill:9,health:-3}),C('加開幾場追回來','有機會增加曝光，也會消耗自己。',{health:-15,joy:-6},{chance:.45,win:{fans:220},lose:{fans:10}})]},

{id:'sponsor',tag:'工作邀約',title:'第一份有酬合作',body:'品牌寄來合作提案。報酬能解決眼前壓力，但你還沒用過他們的產品。',choices:[C('先試用，再誠實介紹','對觀眾說自己相信的話。',{money:2200,bond:7,network:4},{flag:'trusted'}),C('協商修改宣傳話術','有可能談不成。',{skill:4},{chance:.55,win:{money:3800,bond:4},lose:{joy:-3}}),C('婉拒，留時間給原本內容','今天不接，也不是失敗。',{joy:7,bond:3})]},

{id:'family',tag:'鏡頭之外',title:'「你晚上都在忙什麼？」',body:'家人不明白直播需要那麼多準備。他們擔心你，也不知道該怎麼支持。',choices:[C('找個白天慢慢解釋','讓彼此有機會說完。',{joy:9,health:4}),C('安排不開台的晚餐日','保留螢幕外的關係。',{health:10,joy:6},{flag:'balance'}),C('先做好成果再說','動力與壓力一起增加。',{skill:7,health:-7,joy:-3})]},

{id:'collab',tag:'聯動',title:'資深主播的私訊',body:'對方看過你的內容，邀請你合作。你開心，也擔心自己接不住話。',choices:[C('答應，認真做功課','一起創作，一起成長。',{health:-7,network:10,skill:4},{chance:.7,win:{fans:190,bond:4},lose:{fans:30,joy:-3}}),C('先私下練習','默契需要一些時間。',{network:9,skill:7},{fans:60}),C('婉拒，留下聯絡方式','還沒準備好也能說不。',{health:6,joy:3,network:2})]},

{id:'trend',tag:'流行變了',title:'大家都在玩另一款遊戲',body:'原本的主題不再熱門。你開始懷疑是不是該全部推倒重來。',choices:[C('新主題試播一集','保留原本內容，另外開一扇門。',{skill:5,health:-4},{chance:.55,win:{fans:210},lose:{fans:15,joy:-2}}),C('把舊主題做深入','有人正需要這個角落。',{bond:10,skill:4,joy:5},{fans:35}),C('問觀眾，也問自己','找到下一個交集。',{bond:7,network:4,joy:5})]},

{id:'sleep',tag:'生活提醒',title:'凌晨三點，還在改封面',body:'企劃已經準備得差不多，窗外只剩少數幾盞燈。',choices:[C('存檔，去睡覺','明天的你也需要照顧。',{health:14,joy:5}),C('只改最重要的一處','替完美主義訂截止時間。',{skill:5,health:3},{flag:'boundaries'}),C('今晚做到滿意','作品變好了，疲憊也是真的。',{skill:10,health:-12,joy:-3})]},

{id:'fanart',tag:'禮物',title:'有人畫了你的樣子',body:'線條有點生澀，但對方記得你自己都沒注意的小習慣。',choices:[C('徵得同意後在台上分享','認真說謝謝。',{bond:11,joy:9}),C('私下寫一段感謝','好好接住這份心意。',{bond:8,joy:12}),C('整理作品展示角落','為創作者留下位置。',{skill:4,bond:10,health:-3})]},

{id:'mods',tag:'社群',title:'聊天室需要一點規則',body:'有人開讓別人不舒服的玩笑。你不想破壞氣氛，但沉默也有代價。',choices:[C('說明界線，請版主協助','打造安心的地方。',{bond:10,joy:5,network:4},{flag:'boundaries'}),C('暫停節目，把話說開','花時間換一次理解。',{health:-4,bond:12}),C('直播後逐一溝通','私下處理也需要心力。',{health:-7,bond:5,skill:3})]},

{id:'offline',tag:'邀請',title:'第一次線下聚會',body:'螢幕裡的朋友邀你見面。交通、住宿與停更都需要安排。',choices:[C('安排預算，去見大家','名字有了真實的聲音。',{money:-1800,network:14,joy:8,health:-4}),C('改成線上參與','用適合自己的方式靠近。',{network:7,joy:4}),C('留時間給自己的生活','以後還有別的相遇。',{health:9,joy:5})]},

{id:'idea',tag:'新的企劃',title:'一個有點奇怪的點子',body:'讓觀眾匿名寄來日常小事，再一起替它們取名字。你不知道有沒有人喜歡。',choices:[C('試播一集','給不確定的想法一次機會。',{skill:7,health:-4},{chance:.65,win:{fans:130,bond:8},lose:{fans:10,joy:2}}),C('先請熟客測試','從小一點的地方開始。',{bond:8,skill:5},{fans:40}),C('記下來，等有餘裕','靈感不用立刻變成工作。',{joy:5,health:6})]},

{id:'copy',tag:'被比較',title:'「你是不是在模仿誰？」',body:'你受到很多人影響，也正在找自己的聲音。一句留言讓你在意了一整天。',choices:[C('寫下自己想做的三件事','回到創作的起點。',{joy:9,skill:5}),C('重新設計一個環節','讓影響長成自己的特色。',{skill:11,health:-5}),C('找信任的朋友聊聊','別讓一句話佔滿房間。',{network:6,joy:10})]},

{id:'break',tag:'休息',title:'今天真的沒有力氣',body:'你坐在桌前很久，卻沒有按下開台。待機畫面像在等一個還沒準備好的人。',choices:[C('發一則休息公告','不用包裝疲憊的理由。',{health:20,joy:9,bond:2}),C('改成短短的雜談','誠實說明，提早收台。',{health:7,joy:6,bond:5}),C('照原定企劃完成','記得自己付出的代價。',{health:-13,joy:-8,skill:5},{fans:45})]},

{id:'schedule',tag:'時間分配',title:'白天的工作變忙了',body:'你看著排好的直播表，知道接下來不可能每一件事都做好。',choices:[C('減少場次，保留最愛的一場','慢下來，也是在繼續。',{money:1800,health:9,joy:3,bond:2}),C('改成短節目','重新設計適合現在的節奏。',{skill:8,health:2},{fans:35}),C('暫時兩邊都撐住','休息時間被壓縮。',{money:2600,health:-15,joy:-7},{fans:70})]},

{id:'gift',tag:'觀眾的心意',title:'一筆意料之外的贊助',body:'有人留言：「謝謝你陪我度過那段時間。」這筆支持比平常多了些。',choices:[C('收下，也提醒量力而為','陪伴不需要用金額證明。',{money:1300,bond:10,joy:9},{flag:'trusted'}),C('改善下一場的體驗','讓支持回到大家身上。',{skill:8,bond:7,joy:5}),C('存成休息基金','讓未來不必害怕暫停。',{money:1300,health:5,joy:5})]},

{id:'project',tag:'長期作品',title:'你想留下一個作品',body:'一段影片、一個故事。你想做一件在關台後仍能被看見的東西。',choices:[C('投入時間認真製作','作品需要打磨，也需要預算。',{money:-1600,health:-8,skill:12},{fans:160,flag:'work'}),C('先做小版本','完成第一步，比想得完美更重要。',{skill:7,joy:7},{fans:55,flag:'work'}),C('等生活穩定再開始','想做的事可以等你準備好。',{health:8,joy:3})]},

{id:'quiet',tag:'安靜的一天',title:'今天沒有大事發生',body:'沒有突然爆紅，也沒有出錯。有人說晚安，你也跟著說了晚安。',choices:[C('寫進日記','平凡也值得被留下。',{joy:10,bond:4}),C('回放找一個進步的地方','進步有時只有自己知道。',{skill:7,health:-2}),C('關電腦，好好吃晚餐','你的人生比頻道更寬。',{health:12,joy:6},{flag:'balance'})]},

{id:'newface',tag:'新朋友',title:'「第一次看，這裡在做什麼？」',body:'一位新觀眾走進熟客的聊天。原來很多梗，只有陪了很久的人才懂。',choices:[C('重新介紹這個地方','讓第一次來的人也有位置。',{bond:6,joy:4},{fans:90}),C('做一份新觀眾指南','把熟悉的世界打開一扇門。',{skill:6,health:-3},{fans:110}),C('請熟客幫忙介紹','讓友善成為習慣。',{bond:10,network:4},{fans:45})]},

{id:'move',tag:'人生變動',title:'你要搬家了',body:'直播設備暫時裝進紙箱。這個陪你開了很多次台的角落，要說再見了。',choices:[C('休息整理新的角落','替生活留出轉換時間。',{money:-1200,health:10,joy:7}),C('記錄搬家日常','過渡期也是故事。',{bond:7,skill:4,health:-3},{fans:45}),C('辦舊房間告別直播','好好告別，再迎接開始。',{bond:11,joy:6,health:-4})]}

];



events.push(

{id:'tw_election',tag:'台灣日常 · 選舉季',topics:['時事與政治梗'],title:'聊天室突然開始「凍蒜」',body:'節目進行到一半，聊天室從一張選舉迷因吵到不同立場。有人想聽你的看法，也有人只是想安靜看台。',choices:[C('開一段有規則的時事雜談','可以不同意，但不貼標籤、不追著其他觀眾吵。',{skill:5,health:-6},{chance:.6,win:{fans:160,bond:7},lose:{fans:-45,joy:-5},flag:'politics_open'}),C('說明自己的看法，再回到節目','說的是自己的意見，不要求觀眾跟你一樣。',{joy:6,health:-4},{chance:.5,win:{fans:200,bond:4},lose:{fans:-90,bond:-4},flag:'politics_open'}),C('今天不聊選舉，請版主停止洗版','留下不談政治的休息空間，也可能讓部分觀眾失望。',{bond:5,joy:3},{fans:-15,flag:'politics_boundary'})]},

{id:'tw_manifesto',tag:'政治迷因',topics:['時事與政治梗','迷因與觀眾互動'],title:'你的虛構政見是「週休七日」',body:'觀眾把你的角色做成搞笑競選海報：「當選後每天睡飽再開台！」有人認真問你是不是真的要參選。',choices:[C('做一場明確標示虛構的政見發表','把睡飽、宵夜和不加班變成共同笑點。',{skill:5,health:-4},{chance:.65,win:{fans:180,joy:8},lose:{fans:20},flag:'meme_show'}),C('只在聊天室玩，提醒別冒用真的候選人','保留笑點，也把梗的範圍講清楚。',{bond:8,joy:5}),C('徵求更多不分立場的生活政見','聊天變成一場想像更好生活的小遊戲。',{bond:6,skill:4},{fans:65})]},

{id:'tw_clip',tag:'片段風波',topics:['時事與政治梗'],title:'十秒鐘，少了前後文',body:'你的一句時事玩笑被截成短片，有人把它當成認真表態。原本的節目脈絡沒有跟著被分享。',choices:[C('附完整脈絡，清楚說明原意','把事實、意見與玩笑分開說，不跟陌生人互罵。',{health:-8,skill:6},{chance:.7,win:{bond:8,joy:3},lose:{fans:-65,joy:-5},flag:'clip_explained'}),C('承認玩笑容易誤會，調整表達','不必改變立場，也能對說話方式負責。',{bond:8,skill:5,joy:-3},{fans:-20,flag:'clip_explained'}),C('暫停即興時事，先照原本企劃開台','讓事件降溫，但誤解可能不會自己消失。',{health:5,joy:-4},{fans:-55})]},

{id:'tw_factcheck',tag:'轉傳消息',topics:['時事與政治梗'],title:'「主播，這個新聞真的假的？」',body:'聊天室貼來一張沒有日期與來源的政治截圖，催你立刻評論。光憑這張圖，還無法知道發生了什麼。',choices:[C('先查原始來源，查不到就暫不評論','把確認的內容和還不知道的部分分開。',{skill:8,health:-4,bond:5},{flag:'checked_sources'}),C('請觀眾補來源，先繼續節目','不讓無法核實的截圖牽著節目走。',{joy:4,bond:4}),C('改聊大家怎麼查消息','用這個機會一起練習辨認舊圖與斷章取義。',{skill:6,bond:7,health:-3})]},

{id:'tw_meme',tag:'台灣聊天室',topics:['迷因與觀眾互動','遊戲實況'],title:'「有料」「確實」「笑死」洗滿整頁',body:'老觀眾接梗接得很開心，新觀眾卻只看見一排看不懂的文字。你準備的故事還沒講完。',choices:[C('開一段本台梗的入門時間','讓新來的人也能跟上，而不是考驗誰比較懂。',{bond:8,skill:3},{fans:65}),C('把梗改成限時互動環節','一起笑完，再回到原本節目。',{skill:6,bond:5,joy:5},{flag:'meme_show'}),C('請大家暫停洗版，先讓故事說完','守住節奏，但有人會覺得少了點自由。',{joy:5,bond:-2,skill:4})]},

{id:'tw_typhoon',tag:'生活與開台',topics:['深夜雜談'],title:'颱風夜，網路一直斷',body:'今晚風雨很大，預定的聯動不斷斷線。聊天室有人敲碗長台，也有人提醒你先確認家裡狀況。',choices:[C('停播，聯絡家人與合作夥伴','先把安全和生活安排好。',{health:13,joy:4,network:3}),C('確認安全後改短場語音，隨時收台','清楚告知網路不穩，不讓觀眾空等。',{health:3,bond:7}),C('延後聯動，整理現有回放','照顧約定，也不用硬撐直播。',{skill:5,network:5,health:4})]},

{id:'tw_noise',tag:'租屋開台',topics:['ASMR 陪伴','歌唱音樂'],title:'最安靜的一刻，垃圾車來了',body:'你剛準備好收音，窗外響起熟悉的旋律，隔壁也開始移動家具。聊天室先笑成一團。',choices:[C('順勢變成台灣生活雜談','把意外留成這個房間的日常。',{bond:7,joy:7},{fans:35}),C('調整開台時間，和鄰居溝通','不能要求所有人配合直播，先找彼此舒服的時間。',{health:-3,skill:8,bond:3}),C('改善麥克風位置與基本隔音','花點預算，降低下次受干擾的機率。',{money:-1200,skill:9,joy:3})]},

{id:'tw_kuai',tag:'設備玄學',topics:['遊戲實況','迷因與觀眾互動'],title:'電腦旁那包綠色乖乖',body:'遊戲又閃退了。聊天室整齊地問：「你的乖乖是不是過期？」你低頭一看，還真的忘記換。',choices:[C('拍一張換乖乖的照片，再認真查錯','梗可以玩，設備問題還是要修。',{skill:7,bond:6,joy:4}),C('做成每月設備健檢企劃','讓觀眾一起記錄那些離奇的故障。',{skill:6,health:-4},{fans:90,flag:'meme_show'}),C('先借備用設備，今天照常','保住節目，也欠朋友一杯飲料。',{money:-100,network:4,bond:3})]},

{id:'tw_slang',tag:'語言與觀眾',topics:['深夜雜談','迷因與觀眾互動'],title:'一句台語，大家各自解讀',body:'你順口說了一句台語俚語，有觀眾不知道意思，也有人拿不同地區的用法互相吐槽。',choices:[C('解釋語境，請大家分享不同說法','語言可以帶來好奇，不必變成誰比較道地的考試。',{bond:9,skill:4},{fans:40}),C('做一場台語與諧音梗雜談','不拿口音貶低別人，笑點放在誤會本身。',{joy:7,health:-4},{fans:90,flag:'meme_show'}),C('簡單翻譯，回到原本主題','照顧聽不懂的人，也保留節目節奏。',{bond:5,skill:3})]},

{id:'tw_donation',tag:'贊助留言',topics:['時事與政治梗','迷因與觀眾互動'],title:'抖內留言夾了一句政治口號',body:'你正在念觀眾訊息，一筆贊助卻要求你大聲重複政治口號。有人想看反應，也有人開始不舒服。',choices:[C('感謝支持，但不代念政治口號','把付費能做與不能做的事說清楚。',{bond:8,joy:4},{flag:'politics_boundary'}),C('說明付費不代表能要求主播表態','把界線寫進贊助提醒，避免下一次誤會。',{skill:7,bond:5,health:-3},{flag:'politics_boundary'}),C('轉成虛構生活口號：「今晚記得喝水」','接住氣氛，但仍說明不替任何陣營宣傳。',{joy:6,bond:4},{chance:.6,win:{fans:90},lose:{fans:-25},flag:'meme_show'})]}

);

events.push(...[{"id": "holiday_lunar", "tag": "春節企劃", "title": "紅包裡裝的是觀眾的願望", "body": "有人回老家，有人在值班。你收到一串「今年也請多指教」，想替不同地方的人留一盞燈。", "choices": [{"label": "開一場不比金額的祝福台", "note": "大家把新年願望放進虛擬紅包。", "delta": {"bond": 10, "joy": 8}}, {"label": "製作新年抽籤小動畫", "note": "花一點預算，讓祝福變成紀念。", "delta": {"money": -900, "skill": 7}, "fans": 100}, {"label": "預錄拜年，陪家人吃飯", "note": "讓觀眾和自己都能安心過年。", "delta": {"health": 12, "joy": 7}}], "quarter": 0, "kind": "holiday"}, {"id": "holiday_valentine", "tag": "情人節企劃", "title": "今天也歡迎一個人來", "body": "聊天室提議辦告白台，有人想甜一點，也有人只想自在地度過今天。", "choices": [{"label": "收匿名生活情書", "note": "寫給朋友、寵物，或努力生活的自己。", "delta": {"bond": 10, "joy": 6}}, {"label": "演一段虛構戀愛喜劇", "note": "說好是角色演出，讓大家一起接梗。", "delta": {"skill": 7, "health": -5}, "fans": 110}, {"label": "辦單人遊戲同樂夜", "note": "不需要有伴，也能玩得開心。", "delta": {"joy": 9, "bond": 5}}], "quarter": 0, "kind": "holiday"}, {"id": "holiday_dragon", "tag": "端午企劃", "title": "南部粽北部粽，聊天室開戰", "body": "明明只是問晚餐吃什麼，聊天室已經幫各種粽子設計了戰隊徽章。", "choices": [{"label": "辦一場粽子辯論表演賽", "note": "用荒謬理由拉票，不攻擊其他人的口味。", "delta": {"joy": 8, "skill": 5}, "fans": 80}, {"label": "畫出聊天室的粽子吉祥物", "note": "把大家的點子收成一張圖。", "delta": {"skill": 9, "health": -4, "bond": 5}}, {"label": "只聊家裡的端午回憶", "note": "口味不同，想家的心情很像。", "delta": {"bond": 11, "joy": 6}}], "quarter": 1, "kind": "holiday"}, {"id": "holiday_graduate", "tag": "畢業季", "title": "「畢業以後，還能常來嗎？」", "body": "一位熟客即將離開學校，擔心工作後沒時間再跟台。聊天室也有人正站在人生的岔路。", "choices": [{"label": "寄一封給未來自己的信", "note": "把今晚的願望收好，未來再一起打開。", "delta": {"bond": 9, "joy": 7}, "flag": "future_letter"}, {"label": "辦觀眾作品分享會", "note": "讓畢業作品有一個小舞台。", "delta": {"network": 8, "health": -4}, "fans": 85}, {"label": "錄一段隨時能聽的祝福", "note": "不用準時上線，也能收到晚安。", "delta": {"skill": 5, "bond": 9}}], "quarter": 1, "kind": "holiday"}, {"id": "holiday_ghost", "tag": "中元企劃", "title": "恐怖故事還沒開始，你先被嚇到", "body": "你在試音效時被自己嚇了一跳。有人想聽鬼故事，也有人拜託今晚留一盞燈。", "choices": [{"label": "做溫柔的怪談夜", "note": "事先提醒內容，不用突然的巨響嚇人。", "delta": {"skill": 7, "bond": 6, "health": -3}}, {"label": "演出膽小鬼探險喜劇", "note": "讓害怕變成大家一起笑的橋段。", "delta": {"joy": 6, "health": -5}, "chance": 0.6, "win": {"fans": 160}, "lose": {"fans": 25}}, {"label": "改聊地方傳說與回憶", "note": "每個故事背後，可能都有熟悉的街道。", "delta": {"bond": 9, "joy": 5}}], "quarter": 2, "kind": "holiday"}, {"id": "holiday_moon", "tag": "中秋企劃", "title": "今晚的月亮，大家一起看", "body": "聊天室傳來烤肉、加班便當和便利商店宵夜的照片。同一輪月亮下，各自有不同生活。", "choices": [{"label": "一起開一場線上賞月台", "note": "不用出門，也能陪伴彼此。", "delta": {"bond": 12, "joy": 6}}, {"label": "做月亮主題歌唱企劃", "note": "先確認曲目可用，再準備演出。", "delta": {"money": -700, "skill": 8, "health": -4}, "fans": 100}, {"label": "預錄晚安，把晚上留給生活", "note": "有人陪觀眾，也有人陪你。", "delta": {"health": 12, "joy": 7}}], "quarter": 2, "kind": "holiday"}, {"id": "holiday_halloween", "tag": "萬聖節企劃", "title": "觀眾說你的可怕造型有點可愛", "body": "精心準備的恐怖造型，得到的評語卻是「想摸頭」。你只好決定要不要將錯就錯。", "choices": [{"label": "辦怪可愛造型選秀", "note": "觀眾用文字投稿，你即興演出。", "delta": {"joy": 9, "bond": 6}, "fans": 65}, {"label": "做完整變裝特別節目", "note": "把服裝或角色素材做成新作品。", "delta": {"money": -1500, "skill": 10, "health": -6}, "fans": 170}, {"label": "沿用舊造型玩反差", "note": "不用每個節日都買新東西。", "delta": {"skill": 5, "joy": 7}}], "quarter": 3, "kind": "holiday"}, {"id": "holiday_christmas", "tag": "聖誕企劃", "title": "交換禮物，交換一件今年的小事", "body": "你想辦交換禮物，但不想讓沒預算的觀眾覺得只能旁觀。", "choices": [{"label": "交換一句感謝", "note": "不花錢，也能準備一份禮物。", "delta": {"bond": 12, "joy": 8}}, {"label": "製作免費紀念桌布", "note": "讓大家都能帶走一小片節日。", "delta": {"skill": 8, "health": -5}, "fans": 90}, {"label": "安排一場短短的晚安台", "note": "早點收台，也把時間送給自己。", "delta": {"health": 8, "bond": 6, "joy": 5}}], "quarter": 3, "kind": "holiday"}, {"id": "holiday_countdown", "tag": "跨年企劃", "title": "倒數十秒，延遲了十五秒", "body": "你的直播延遲讓大家先在別台跨了年，聊天室開始倒數「第二次新年」。", "choices": [{"label": "乾脆發明頻道專屬跨年", "note": "把失誤變成只有這裡才有的笑點。", "delta": {"bond": 8, "joy": 10}, "fans": 75}, {"label": "回顧這一年最喜歡的瞬間", "note": "遲到的倒數，也能準時說謝謝。", "delta": {"bond": 12, "joy": 7}}, {"label": "記下延遲設定，提早收台", "note": "明年再試，今晚先好好休息。", "delta": {"skill": 6, "health": 9}}], "quarter": 3, "kind": "holiday"}, {"id": "special_raid", "tag": "特殊事件 · 串門", "title": "突然有一群人說「打擾了」", "body": "另一位主播收台前帶觀眾來串門。人數突然增加，你一時不知道該先說什麼。", "choices": [{"label": "簡短介紹自己，再接回節目", "note": "讓新觀眾知道平常的你。", "delta": {"bond": 6, "skill": 5}, "fans": 180}, {"label": "臨時挑戰聊天室點題", "note": "現場反應可能成為亮點。", "delta": {"health": -8}, "chance": 0.55, "win": {"fans": 320, "joy": 8}, "lose": {"fans": 35, "joy": -4}}, {"label": "請熟客協助歡迎", "note": "不必一個人接住所有訊息。", "delta": {"network": 8, "bond": 8}, "fans": 90}], "kind": "special"}, {"id": "special_milestone", "tag": "特殊事件 · 里程碑", "title": "第一千個追蹤，不只是一個數字", "body": "追蹤數跨過了一千。你想起初次開台時，連招呼都練習了很多次。", "choices": [{"label": "辦一千個日常感謝企劃", "note": "從小故事開始，量力完成。", "delta": {"bond": 12, "joy": 10}}, {"label": "投資一支頻道介紹影片", "note": "讓後來的人更容易認識你。", "delta": {"money": -1800, "skill": 10}, "fans": 200}, {"label": "簡單紀念，繼續平常的節目", "note": "不用更大的排場，也值得開心。", "delta": {"health": 7, "joy": 10, "bond": 5}}], "kind": "special", "minFans": 1000}, {"id": "special_mascot", "tag": "特殊事件 · 共同創作", "title": "亂畫的小生物，被大家叫成吉祥物", "body": "你隨手畫的奇怪生物開始出現在聊天室。大家問，牠是不是可以有正式名字？", "choices": [{"label": "邀觀眾取名，準備正式亮相", "note": "收集點子後，再製作自己的版本。", "delta": {"skill": 6, "health": -4}, "flag": "mascot_project"}, {"label": "先保留成聊天室小梗", "note": "不急著把每個笑點都做成商品。", "delta": {"joy": 8, "bond": 8}}, {"label": "委託繪師整理設計", "note": "預留預算並約定使用範圍。", "delta": {"money": -2000, "network": 7}, "flag": "mascot_project"}], "kind": "special"}, {"id": "special_mascot_debut", "tag": "特殊事件 · 企劃後續", "title": "牠終於有了名字和家", "body": "之前一起構想的吉祥物完成了。聊天室刷起第一次看到牠時的回憶。", "choices": [{"label": "辦正式亮相和表情包發表", "note": "共同的點子成為頻道的小標記。", "delta": {"bond": 12, "skill": 6}, "fans": 150}, {"label": "讓牠主持一次小節目", "note": "嘗試新的角色演出。", "delta": {"skill": 9, "health": -5}, "chance": 0.65, "win": {"fans": 230, "joy": 6}, "lose": {"fans": 35}}, {"label": "寫一段牠的晚安故事", "note": "把小生物放進大家的生活裡。", "delta": {"joy": 10, "bond": 10}}], "kind": "special", "requires": "mascot_project"}, {"id": "special_letter", "tag": "特殊事件 · 時光信件", "title": "你收到了過去的自己", "body": "那場畢業季節目留下的信件再次打開。有些願望達成了，有些已經不再重要。", "choices": [{"label": "讀出願意分享的那一段", "note": "也尊重選擇保留秘密的人。", "delta": {"bond": 12, "joy": 10}}, {"label": "把改變做成短片", "note": "替曾經的努力留下紀錄。", "delta": {"skill": 9, "health": -5}, "fans": 120}, {"label": "私下讀信，寫下新的願望", "note": "不是每一段生活都需要直播。", "delta": {"health": 10, "joy": 11}}], "kind": "special", "requires": "future_letter", "delay": 4}, {"id": "special_outage", "tag": "特殊事件 · 意外中斷", "title": "最精彩的地方，畫面停住了", "body": "平台突然連線不穩。你已經重試幾次，聊天室還是有人只看見轉圈圈。", "choices": [{"label": "公告延期，保留已錄下的內容", "note": "讓觀眾知道安排，再把自己放下線。", "delta": {"health": 8, "bond": 5}}, {"label": "整理成精華，改天補完", "note": "把白做的準備變成另一種作品。", "delta": {"skill": 9, "health": -4}, "fans": 55}, {"label": "和聯動夥伴改約時間", "note": "讓大家有機會完整參與。", "delta": {"network": 8, "joy": 4}}], "kind": "special"}, {"id": "special_invite", "tag": "特殊事件 · 小舞台", "title": "活動主辦邀你主持一個環節", "body": "第一次收到公開活動的主持邀請。你期待，也知道排練會擠壓原本的更新時間。", "choices": [{"label": "接下邀請，安排排練", "note": "把準備時間算進生活。", "delta": {"money": 1400, "network": 10, "health": -9}, "chance": 0.65, "win": {"fans": 190, "skill": 7}, "lose": {"fans": 35, "skill": 4}}, {"label": "提議和朋友雙主持", "note": "分工，也一起承擔舞台。", "delta": {"money": 700, "network": 12, "health": -5}, "fans": 90}, {"label": "這次婉拒，留下聯絡方式", "note": "等合適的時間再走上去。", "delta": {"health": 8, "joy": 5, "network": 3}}], "kind": "special"}]);

events.push(...[{"id": "daily_upload", "kind": "daily", "tag": "主播日常", "title": "直播結束了，工作還沒結束", "body": "回放、字幕、封面和短影片都在等你，明天還要準備下一場。", "repeatable": true, "choices": [{"label": "只剪一個最好的片段", "note": "先把一件事完成。", "delta": {"skill": 7, "health": -3}}, {"label": "付費找剪輯夥伴", "note": "試做一集再決定長期合作。", "delta": {"money": -1200, "network": 6, "health": 5}}, {"label": "今天先下班", "note": "待辦清單可以等明天。", "delta": {"health": 12, "joy": 5}}]}, {"id": "daily_algorithm", "kind": "daily", "tag": "主播日常", "title": "通知好像沒有送出去", "body": "熟客說開台後半小時才收到通知。你懷疑近期的低觀看和推播有關。", "repeatable": true, "choices": [{"label": "建立固定開台表", "note": "讓想來的人知道時間。", "delta": {"skill": 6, "bond": 6}}, {"label": "試一種新的宣傳方式", "note": "用小實驗觀察變化。", "delta": {"skill": 8, "health": -4}}, {"label": "先別一直盯著數字", "note": "把今晚的節目做好。", "delta": {"joy": 8, "bond": 5}}]}, {"id": "daily_payment", "kind": "daily", "tag": "主播日常", "title": "合作款項還沒入帳", "body": "案子已交付，窗口卻說付款流程還在跑。下個月的生活費需要重新安排。", "repeatable": true, "choices": [{"label": "整理交付紀錄並詢問日期", "note": "留下清楚的往來紀錄。", "delta": {"skill": 7, "health": -3}}, {"label": "先接一份短期工作", "note": "替生活預留緩衝。", "delta": {"money": 2400, "health": -8, "joy": -3}}, {"label": "縮減下一場企劃預算", "note": "先維持基本更新。", "delta": {"health": 5, "joy": 3}}]}, {"id": "daily_spoiler", "kind": "daily", "tag": "主播日常", "title": "你還沒看到結局，聊天室先說完了", "body": "有人出於好意一直指揮操作，也有人直接貼出故事結局。", "repeatable": true, "choices": [{"label": "說明不劇透規則", "note": "請版主一起維持遊玩體驗。", "delta": {"bond": 8, "joy": 5}}, {"label": "另開攻略討論時段", "note": "把想幫忙的人放在適合的環節。", "delta": {"skill": 6, "bond": 6}}, {"label": "關閉提示，自己摸索", "note": "先保留發現的樂趣。", "delta": {"joy": 9, "health": -3}}]}, {"id": "daily_voice", "kind": "daily", "tag": "主播日常", "title": "今天的聲音撐不住整場", "body": "連續幾場直播後，說話變得吃力。原訂的長節目還在行事曆上。", "repeatable": true, "choices": [{"label": "取消長台，安排休息", "note": "把更新通知寫清楚。", "delta": {"health": 16, "joy": 4}}, {"label": "改做無旁白創作記錄", "note": "用別的方式分享進度。", "delta": {"skill": 6, "health": 5}}, {"label": "縮短節目並提早收工", "note": "不把短台偷偷變成長台。", "delta": {"health": 9, "bond": 4}}]}, {"id": "daily_impersonation", "kind": "daily", "tag": "主播日常", "title": "有人用你的名字私訊觀眾", "body": "冒名帳號聲稱能販售限定福利，觀眾來問這是不是你本人。", "repeatable": true, "choices": [{"label": "公告官方聯絡方式並回報冒名", "note": "讓觀眾知道如何辨認。", "delta": {"bond": 9, "skill": 5, "health": -4}}, {"label": "請版主協助整理警示", "note": "不要轉貼觀眾的私人資料。", "delta": {"network": 6, "bond": 7}}, {"label": "暫停企劃，優先回覆受影響的人", "note": "處理問題也需要時間。", "delta": {"bond": 11, "health": -7}}]}, {"id": "daily_copyright", "kind": "daily", "tag": "主播日常", "title": "回放出現素材使用提醒", "body": "你使用的背景素材收到權利提醒，原本預計上架的精華需要重剪。", "repeatable": true, "choices": [{"label": "移除素材，確認替代素材授權", "note": "重新整理自己的素材庫。", "delta": {"skill": 9, "health": -5}}, {"label": "購買合適的素材方案", "note": "先確認用途符合需求。", "delta": {"money": -900, "skill": 6}}, {"label": "改用自己製作的簡單背景", "note": "畫面簡單，也能把節目說好。", "delta": {"skill": 7, "joy": 4}}]}, {"id": "daily_moderator", "kind": "daily", "tag": "主播日常", "title": "版主說最近想休息", "body": "長期幫忙的人也有生活。你發現很多管理工作一直只靠同一個人。", "repeatable": true, "choices": [{"label": "感謝對方，安排輪值", "note": "把工作分散到願意幫忙的人。", "delta": {"network": 9, "bond": 6}}, {"label": "減少需要大量管理的企劃", "note": "讓頻道規模符合現有心力。", "delta": {"health": 8, "bond": 5}}, {"label": "整理管理指南", "note": "讓之後接手的人有清楚方向。", "delta": {"skill": 8, "health": -4, "network": 5}}]}, {"id": "daily_schedule_clash", "kind": "daily", "tag": "主播日常", "title": "聯動前一天，對方臨時有事", "body": "你準備好的節目需要兩個人，但對方突然無法出席。", "repeatable": true, "choices": [{"label": "改成單人備案", "note": "保留合作企劃，另約時間。", "delta": {"skill": 8, "health": -4}}, {"label": "公開改期，不責怪夥伴", "note": "讓彼此都有調整空間。", "delta": {"network": 7, "health": 6}}, {"label": "邀聊天室測試新環節", "note": "把空檔變成小實驗。", "delta": {"bond": 7, "joy": 5}}]}, {"id": "daily_regular_conflict", "kind": "daily", "tag": "主播日常", "title": "兩位熟客在聊天室吵起來", "body": "他們都陪伴頻道很久，但這次的爭執讓其他人不敢說話。", "repeatable": true, "choices": [{"label": "按同一套規則處理", "note": "熟客也需要尊重別人。", "delta": {"bond": 8, "health": -4}}, {"label": "暫停話題，分開了解狀況", "note": "不要把爭執變成公開表演。", "delta": {"skill": 6, "network": 4, "health": -5}}, {"label": "請版主協助，先維持節目", "note": "事後再安排必要的溝通。", "delta": {"bond": 6, "network": 6}}]}, {"id": "daily_tracking", "kind": "daily", "tag": "VTuber 日常", "title": "你在笑，模型卻一直皺眉", "body": "追蹤程式更新後，表情和眨眼開始亂跳。觀眾以為你對他們生氣。", "repeatable": true, "choices": [{"label": "重新校正並說明狀況", "note": "把失誤當成小小的幕後故事。", "delta": {"skill": 8, "bond": 4}}, {"label": "切換備用靜態立繪", "note": "先把今天的節目完成。", "delta": {"health": 5, "bond": 5}}, {"label": "請技術夥伴協助檢查", "note": "為專業支援預留預算。", "delta": {"money": -1000, "network": 5, "skill": 4}}], "route": "VTuber"}, {"id": "daily_model_delay", "kind": "daily", "tag": "VTuber 日常", "title": "新衣裝趕不上預定日期", "body": "合作繪師通知製作進度需要延後，預告已經發出去了。", "repeatable": true, "choices": [{"label": "協調新日期並通知觀眾", "note": "說明進度，不把壓力丟給製作者。", "delta": {"bond": 7, "network": 5}}, {"label": "先做概念介紹台", "note": "分享能公開的設計過程。", "delta": {"skill": 6, "bond": 6}}, {"label": "取消倒數，留足修改時間", "note": "讓作品完成後再安排亮相。", "delta": {"health": 8, "joy": 4}}], "route": "VTuber"}, {"id": "daily_model_rights", "kind": "daily", "tag": "VTuber 日常", "title": "周邊製作前，發現授權範圍不清楚", "body": "想把角色印在小物上，卻發現原先約定只寫了直播使用。", "repeatable": true, "choices": [{"label": "先找創作者確認授權", "note": "釐清範圍再安排商品。", "delta": {"network": 6, "skill": 7}}, {"label": "改做已有使用權的設計", "note": "縮小第一批製作範圍。", "delta": {"skill": 8, "health": -3}}, {"label": "暫停商品企劃", "note": "先把時間放回節目。", "delta": {"health": 9, "joy": 4}}], "route": "VTuber"}, {"id": "daily_identity", "kind": "daily", "tag": "VTuber 日常", "title": "觀眾開始猜你的現實身分", "body": "有人把聲音和生活細節拼在一起。你不想讓頻道變成猜身分比賽。", "repeatable": true, "choices": [{"label": "清楚說明隱私界線", "note": "請版主移除涉及私人資料的留言。", "delta": {"bond": 8, "health": -3}}, {"label": "整理今後可分享的範圍", "note": "保留日常感，也保留私人生活。", "delta": {"skill": 7, "joy": 5}}, {"label": "暫停個人問答，改做企劃", "note": "先離開讓自己不舒服的話題。", "delta": {"health": 8, "joy": 6}}], "route": "VTuber"}, {"id": "daily_layers", "kind": "daily", "tag": "VTuber 日常", "title": "新表情按下去，配件飛走了", "body": "模型快捷鍵衝突，緊張時多按一下，畫面就像在拆角色。", "repeatable": true, "choices": [{"label": "排一場測試台", "note": "先測完再用在正式演出。", "delta": {"skill": 10, "health": -4}}, {"label": "只保留穩定的表情組", "note": "簡單一點也能自在表演。", "delta": {"health": 6, "joy": 5}}, {"label": "做一張快捷鍵提示卡", "note": "降低臨場操作的壓力。", "delta": {"skill": 6, "health": 4}}], "route": "VTuber"}, {"id": "daily_lore", "kind": "daily", "tag": "VTuber 日常", "title": "設定寫得很完整，聊天卻綁手綁腳", "body": "你想自然聊日常，又擔心和角色原本的世界觀對不上。", "repeatable": true, "choices": [{"label": "把世界觀當成創作背景", "note": "保留特色，也給日常一些彈性。", "delta": {"joy": 10, "skill": 4}}, {"label": "把設定留給專題節目", "note": "不同環節有不同的表演方式。", "delta": {"skill": 8, "bond": 5}}, {"label": "和觀眾一起補一段設定", "note": "用小故事解釋新的變化。", "delta": {"bond": 8, "health": -4}}], "route": "VTuber"}, {"id": "daily_avatar_load", "kind": "daily", "tag": "VTuber 日常", "title": "大型聯動時，模型讓電腦喘不過氣", "body": "遊戲、通話和模型一起運行，畫面開始掉格。", "repeatable": true, "choices": [{"label": "降低畫面與模型負載", "note": "先保證聲音和節目穩定。", "delta": {"skill": 8, "health": -3}}, {"label": "切成輕量形象參加", "note": "不讓設備問題擋住合作。", "delta": {"network": 6, "joy": 5}}, {"label": "更新必要設備", "note": "依預算升級真正的瓶頸。", "delta": {"money": -2500, "skill": 7, "health": 5}}], "route": "VTuber"}, {"id": "daily_lighting", "kind": "daily", "tag": "真人主播日常", "title": "白天拍得好好的，晚上卻滿臉陰影", "body": "房間光線變了，鏡頭自動曝光也一直跳。", "repeatable": true, "choices": [{"label": "重新安排燈光與曝光", "note": "把可重複使用的設定記下來。", "delta": {"skill": 9, "health": -3}}, {"label": "使用柔和的固定燈", "note": "添購基本設備。", "delta": {"money": -1000, "skill": 6}}, {"label": "今晚改成語音節目", "note": "把調整留到有精神的時候。", "delta": {"health": 8, "bond": 4}}], "route": "真人主播"}, {"id": "daily_reflection", "kind": "daily", "tag": "真人主播日常", "title": "鏡頭裡多了一個不該出現的角落", "body": "你發現窗戶反光拍到桌上的寄件資料，還好尚未正式開台。", "repeatable": true, "choices": [{"label": "重新檢查背景和反光", "note": "把私人資料移出拍攝區域。", "delta": {"skill": 8, "health": -3}}, {"label": "使用簡單背景布", "note": "讓拍攝範圍更好管理。", "delta": {"money": -600, "health": 5}}, {"label": "建立開台前檢查表", "note": "把檢查變成日常習慣。", "delta": {"skill": 7, "joy": 4}}], "route": "真人主播"}, {"id": "daily_street", "kind": "daily", "tag": "真人主播日常", "title": "外拍時，路人走進畫面", "body": "你正在介紹街景，路人停下來表示不想被拍進去。", "repeatable": true, "choices": [{"label": "立即轉開鏡頭並致歉", "note": "尊重對方的意願。", "delta": {"bond": 6, "skill": 5}}, {"label": "改拍景物細節", "note": "換個角度也能說故事。", "delta": {"skill": 8, "health": -3}}, {"label": "結束這段拍攝，另找場地", "note": "先確保節目能自在進行。", "delta": {"health": 5, "joy": 4}}], "route": "真人主播"}, {"id": "daily_camera_heat", "kind": "daily", "tag": "真人主播日常", "title": "外拍才一半，相機過熱關機", "body": "天氣和設備狀態都不適合繼續原訂行程。", "repeatable": true, "choices": [{"label": "先讓人和設備休息", "note": "重新安排剩下的內容。", "delta": {"health": 14, "joy": 3}}, {"label": "切成短段拍攝", "note": "減少負載並縮短節目。", "delta": {"skill": 7, "health": 4}}, {"label": "用手機記錄簡短收尾", "note": "說明狀況，不硬撐原本時長。", "delta": {"bond": 6, "skill": 5}}], "route": "真人主播"}, {"id": "daily_appearance", "kind": "daily", "tag": "真人主播日常", "title": "留言區只討論你今天的外表", "body": "你準備很久的節目被忽略，留言都在評論妝容、髮型和氣色。", "repeatable": true, "choices": [{"label": "把話題帶回作品", "note": "清楚介紹這次準備的內容。", "delta": {"skill": 6, "bond": 6}}, {"label": "設定外貌評論的界線", "note": "不接受讓自己不舒服的玩笑。", "delta": {"joy": 8, "bond": 5}}, {"label": "暫時少看評論", "note": "先和信任的朋友整理心情。", "delta": {"health": 8, "joy": 8}}], "route": "真人主播"}, {"id": "daily_recognised", "kind": "daily", "tag": "真人主播日常", "title": "下班買晚餐時，被觀眾認出來", "body": "對方很興奮想合照，但你現在只想安靜吃飯。", "repeatable": true, "choices": [{"label": "禮貌婉拒，說聲謝謝", "note": "私下時間也可以保有界線。", "delta": {"joy": 9, "health": 5}}, {"label": "簡短打招呼後離開", "note": "親切不代表需要一直陪聊。", "delta": {"bond": 6, "joy": 5}}, {"label": "之後說明偶遇原則", "note": "不要公開當下地點。", "delta": {"skill": 6, "bond": 7}}], "route": "真人主播"}, {"id": "daily_housemate", "kind": "daily", "tag": "真人主播日常", "title": "室友忘記你正在開台", "body": "房門突然打開，室友還穿著睡衣。你得趕快切換畫面。", "repeatable": true, "choices": [{"label": "切換待機並確認對方意願", "note": "回放相關片段也一起處理。", "delta": {"skill": 7, "bond": 4, "health": -3}}, {"label": "約定拍攝時間與門口提示", "note": "讓共同生活更容易配合。", "delta": {"health": 7, "joy": 6}}, {"label": "調整鏡頭位置", "note": "避免房門出現在畫面裡。", "delta": {"skill": 8, "health": 3}}], "route": "真人主播"}, {"id": "daily_female_skill", "kind": "daily", "tag": "角色故事 · 女主播", "title": "有人說妳的成績一定是別人幫的", "body": "妳分享練習成果，卻有人把成就歸因於性別或想像中的幫手。", "repeatable": true, "choices": [{"label": "展示自己的練習過程", "note": "讓願意看的人理解作品。", "delta": {"skill": 7, "bond": 6}}, {"label": "不為惡意留言額外加班", "note": "處理越界留言後繼續節目。", "delta": {"joy": 10, "health": 4}}, {"label": "邀同好討論創作技巧", "note": "把討論帶回實際內容。", "delta": {"network": 8, "skill": 5}}], "gender": "female"}, {"id": "daily_female_brand", "kind": "daily", "tag": "角色故事 · 女主播", "title": "品牌希望妳演出不喜歡的人設", "body": "合作腳本把妳寫成只會撒嬌的角色，與頻道風格不同。", "repeatable": true, "choices": [{"label": "提出符合自己風格的版本", "note": "讓合作呈現真正擅長的內容。", "delta": {"skill": 8, "network": 4}}, {"label": "婉拒這次邀約", "note": "留下選擇表演方式的自由。", "delta": {"joy": 10, "health": 5}}, {"label": "協商改成作品示範", "note": "用專長重新安排企劃。", "delta": {"skill": 6, "money": 700, "health": -3}}], "gender": "female"}, {"id": "daily_female_relationship", "kind": "daily", "tag": "角色故事 · 女主播", "title": "一場聯動被剪成戀愛猜測", "body": "妳和夥伴只是正常合作，觀眾卻開始追問私人關係。", "repeatable": true, "choices": [{"label": "說明合作與私生活的界線", "note": "不讓猜測決定今後的企劃。", "delta": {"bond": 7, "joy": 6}}, {"label": "和夥伴對齊回應方式", "note": "避免讓對方獨自面對猜測。", "delta": {"network": 10, "health": -3}}, {"label": "請版主管理越界追問", "note": "把節目留給原本的主題。", "delta": {"bond": 8, "health": 4}}], "gender": "female"}, {"id": "daily_female_voice", "kind": "daily", "tag": "角色故事 · 女主播", "title": "留言要求妳一直用更甜的聲音", "body": "妳想試新節目，但有人希望妳永遠維持同一種語氣。", "repeatable": true, "choices": [{"label": "用舒服的聲音繼續", "note": "長期創作需要適合自己的方式。", "delta": {"health": 9, "joy": 8}}, {"label": "把角色演出放在限定環節", "note": "表演與日常可以有不同聲音。", "delta": {"skill": 8, "bond": 5}}, {"label": "開一場新風格試播", "note": "讓觀眾認識更多面的妳。", "delta": {"skill": 7, "joy": 6}}], "gender": "female"}, {"id": "daily_male_emotion", "kind": "daily", "tag": "角色故事 · 男主播", "title": "你認真說累了，有人回「男人撐一下」", "body": "你只是分享近期疲憊，卻被要求別把情緒帶進節目。", "repeatable": true, "choices": [{"label": "坦白休息也是工作的一部分", "note": "不用把疲憊包裝成玩笑。", "delta": {"joy": 10, "bond": 6}}, {"label": "先下台，找朋友聊聊", "note": "把心情留給能接住它的人。", "delta": {"health": 12, "network": 4}}, {"label": "做一期創作者生活雜談", "note": "分享自己的經驗，不替所有人下結論。", "delta": {"skill": 6, "bond": 8}}], "gender": "male"}, {"id": "daily_male_brand", "kind": "daily", "tag": "角色故事 · 男主播", "title": "合作方只想讓你扮演硬派角色", "body": "對方覺得男主播就該大聲競爭，但你的節目一直是安靜陪伴。", "repeatable": true, "choices": [{"label": "提出符合頻道氣氛的腳本", "note": "溫柔也能成為作品特色。", "delta": {"skill": 8, "network": 4}}, {"label": "拒絕不適合的人設", "note": "保留自己喜歡的表演方式。", "delta": {"joy": 10, "health": 5}}, {"label": "用短片示範另一種風格", "note": "讓對方看見具體效果。", "delta": {"skill": 9, "health": -4}}], "gender": "male"}, {"id": "daily_male_cute", "kind": "daily", "tag": "角色故事 · 男主播", "title": "你想做可愛企劃，卻被問是不是不夠男人", "body": "你準備了手作和可愛配件，有些觀眾把性別當成企劃限制。", "repeatable": true, "choices": [{"label": "照自己的喜好完成企劃", "note": "喜歡的事不需要通過性別考試。", "delta": {"joy": 10, "skill": 5}}, {"label": "邀大家分享自己的反差興趣", "note": "把刻板印象變成聊天契機。", "delta": {"bond": 9, "joy": 6}}, {"label": "把話題帶回手作本身", "note": "專注作品，不替每則留言辯論。", "delta": {"skill": 9, "health": -3}}], "gender": "male"}, {"id": "daily_male_shipping", "kind": "daily", "tag": "角色故事 · 男主播", "title": "聯動默契被變成私生活猜測", "body": "你和另一位主播合作得很順，有些人開始要求你們照想像中的關係互動。", "repeatable": true, "choices": [{"label": "明確說明節目中的界線", "note": "默契不代表需要公開私生活。", "delta": {"bond": 7, "joy": 6}}, {"label": "和夥伴一起訂互動原則", "note": "讓後續合作對彼此都舒服。", "delta": {"network": 10, "health": -3}}, {"label": "請版主停止逼問", "note": "繼續原先準備好的內容。", "delta": {"bond": 8, "health": 4}}], "gender": "male"}]);

const contents=[

{id:'chat',name:'深夜雜談',desc:'陪伴日常，更容易留下熟客。',delta:{bond:5,joy:2}},

{id:'game',name:'遊戲實況',desc:'遊戲挑戰，增加曝光與實力，也消耗體力。',delta:{skill:4,health:-3,fans:35}},

{id:'music',name:'歌唱音樂',desc:'練歌與表演，提升實力與熱情。',delta:{skill:5,joy:3,health:-5}},

{id:'art',name:'創作繪畫',desc:'完成作品，累積創作實力和熟客關係。',delta:{skill:6,bond:2,health:-3}},

{id:'asmr',name:'ASMR 陪伴',desc:'安靜陪伴，熟客關係成長較快。',delta:{bond:7,health:-4}},

{id:'memes',name:'迷因與觀眾互動',desc:'和聊天室玩梗，增加曝光與熱情。',delta:{joy:4,fans:45,health:-4}},

{id:'current',name:'時事與政治梗',desc:'時事討論，曝光較高但更耗精神，相關事件機率增加。',delta:{skill:4,fans:55,health:-7}}

];

const backgrounds=[['租屋處的一盞燈','白天上班，晚上才輪到自己的夢。',12000,45,68],['畢業後的空白頁','還沒決定第一份工作，卻先替頻道取好了名字。',18000,35,78],['安靜的斜槓生活','工作穩定，但也想試著向鏡頭說一次晚安。',30000,40,62],['重新開始的人','你決定給自己一段時間，認真試一次。',22000,60,70],['家裡的小小角落','門外是家人的生活，門內是你的新世界。',8000,30,85]];

const traits=[['慢熱的傾聽者','開台時熱情 +1。','bond'],['停不下的點子','練習時心情 +1。','skill'],['熱情的行動派','新內容更容易被看見。','reach']];

backgrounds.push(['錄音室助理','你熟悉麥克風和錄音室的日常。',16000,52,72]);

traits.push(['好眠體質','休息時多累積 2 點體力。','sleep'],['樂於交朋友','練習時多累積 1 點熱情。','social'],['沉得住氣','工作時多累積 1 點心情。','calm']);

const openingChallenges=[

 ['隔音太差','窗外的車聲被收到直播裡。','加掛厚窗簾','先改到比較安靜的時段'],

 ['舊電腦不穩','試播到一半，畫面突然卡住。','送去檢查並整理散熱','先做低負載的節目'],

 ['剛搬家','開台設備還散在幾個紙箱裡。','添購收納架','分幾天把桌面整理好'],

 ['作息還沒調過來','一到原本排好的直播時間，你就開始想睡。','安排一段休息再調時段','先縮短每場直播'],

 ['收音設備太敏感','鍵盤聲比你的說話聲還大。','添購簡單的防震配件','先重新調整收音位置'],

 ['第一次面對空聊天室','節目準備好了，聊天室卻一直很安靜。','準備一套能獨自進行的內容','先從短場雜談開始']

];

const openingGifts=[['cash','開台預備金','現金 +5,000'],['lamp','可調光桌燈','開局即啟用桌燈'],['intro','前輩引薦','第 5 天收到聯動邀請']];

const openingOptions={

 background:backgrounds.map(([name,description],i)=>({id:String(i),name,description})),

 talent:traits.map(([name,description],i)=>({id:String(i),name,description})),

 challenge:openingChallenges.map(([name,description],i)=>({id:String(i),name,description})),

 gift:openingGifts.map(([id,name,description])=>({id,name,description}))

};

function openingPick(s,key,value){

 const options=openingOptions[key];

 return options.find(option=>option.id===value)||options[Math.floor(rand(s)*options.length)];

}





const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

const round=n=>Math.round(n*100)/100;

function rand(s){s.rng=(s.rng+0x6D2B79F5)>>>0;let t=s.rng;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}

const assets=[{id:'steady',name:'晴日綜合基金',risk:'低波動',vol:.008,start:100},{id:'media',name:'星幕媒體',risk:'中波動',vol:.03,start:180},{id:'dream',name:'夢火科技',risk:'高波動',vol:.075,start:70}];

assets.push(...[

{id:'chip',name:'霧光晶片',sector:'電腦硬體',risk:'高波動',vol:.032,start:220},

{id:'games',name:'像素遊戲',sector:'遊戲發行',risk:'高波動',vol:.038,start:95},

{id:'audio',name:'澄音聲學',sector:'音響收音',risk:'中波動',vol:.019,start:130},

{id:'net',name:'連橋電信',sector:'網路通訊',risk:'低波動',vol:.012,start:160},

{id:'delivery',name:'夜行物流',sector:'電商物流',risk:'中波動',vol:.023,start:85},

{id:'motion',name:'映身互動',sector:'虛擬影像與動捕',risk:'高波動',vol:.04,start:110}]);

function expandMarket(s){let m=s.market;if(!m||!m.positions||!m.prices||!m.previous)return;for(let a of assets.slice(3)){if(m.positions[a.id]===undefined&&m.prices[a.id]===undefined){m.positions[a.id]={qty:0,cost:0};m.prices[a.id]=m.previous[a.id]=a.start;if(m.bars)m.bars[a.id]=[{day:s.day,close:a.start,legacy:true}];if(m.flow)m.flow[a.id]=0;if(m.quotes)m.quotes[a.id]={volume:150000,halted:false,spread:.002};}}}

function simplifyShop(s){let f=upgradeLife(s).fund;if(f.balance>0){apply(s,{money:f.balance},'創作專款轉回現金');f.balance=0;}f.auto=false;f.goal=null;}

const dailyIndustry=[

{text:'大型新作上市，遊戲與電腦升級需求升溫。',moves:{games:.025,chip:.015},topic:'game',boost:.08},

{text:'聲音節目流行，收音設備與陪伴內容受到關注。',moves:{audio:.022,media:.008},topic:'asmr',boost:.08},

{text:'區域網路維修，部分創作者直播中斷；電信股承壓。',moves:{net:-.025,media:-.008},cost:60},

{text:'強降雨影響配送，物流成本上升；創作者收到延遲通知。',moves:{delivery:-.028},cost:40},

{text:'虛擬演出檔期增加，動捕與影像服務訂單成長。',moves:{motion:.03,chip:.01},topic:'music',boost:.08},

{text:'網購促銷檔期到來，電商出貨需求增加。',moves:{delivery:.022,chip:.009}},

{text:'遊戲更新評價不佳，玩家回流速度低於預期。',moves:{games:-.03},topic:'game',boost:-.06},

{text:'消費者縮減非必要採購，硬體與音響訂單降溫。',moves:{chip:-.02,audio:-.018,motion:-.015}}

];



const partTimeHourly=196, partTimeHours=4;

const salariedMonthlyPay=30000;

const actions=[

{id:'live',title:'認真開台',icon:'◉',desc:'選好節目，與觀眾一起過今天。',preview:'累積觀眾，但消耗體力',money:0},

{id:'learn',title:'練一個新本領',icon:'✦',desc:'剪輯、發聲或企劃練習。',preview:'實力上升 · 花費 120',money:-120},

{id:'connect',title:'聯動與交流',icon:'↗',desc:'和其他創作者建立關係。',preview:'人脈上升 · 花費 80',money:-80},

{id:'work',title:'兼職維持生活',icon:'▤',desc:'接案或工作，保留生活資金。',preview:`時薪 ${partTimeHourly} · ${partTimeHours} 小時班 · 體力下降`,money:partTimeHourly*partTimeHours},

{id:'rest',title:'好好休息',icon:'☾',desc:'恢復體力和熱情，仍有生活支出。',preview:'體力上升 · 更新放慢',money:0},

{id:'mentor',title:'分享前輩經驗',icon:'✧',desc:'50 歲後可帶領新創作者。',preview:'收入 250 · 累積人脈',money:250,minAge:50},

{id:'retire',title:'退休慢生活',icon:'♧',desc:'65 歲後減少工作，整理回憶與照顧自己。',preview:'恢復體力 · 沒有固定薪資',money:0,minAge:65}

];

function ageNow(s){return s.age+Math.floor(s.day/360)}

function dateLabel(day){return `第 ${Math.floor(day/360)+1} 年 ${Math.floor(day%360/30)+1} 月 ${day%30+1} 日`}

function calendar(season){return ['春節／情人節','端午／畢業季','中元／中秋','萬聖節／聖誕／跨年'][season%4]}

function initMarket(s){let r={rng:(s.seed^0x51af9132)>>>0};s.market={day:s.day,rng:r.rng,prices:Object.fromEntries(assets.map(a=>[a.id,a.start])),previous:Object.fromEntries(assets.map(a=>[a.id,a.start])),positions:Object.fromEntries(assets.map(a=>[a.id,{qty:0,cost:0}])),realized:0,log:[],history:[],news:'市場開市。價格只在遊戲日期前進時更新。'};}

function ageAtDebut(birthday,debut){
 if(!validDate(birthday)||!validDate(debut)||debut<birthday)return null;
 return Number(debut.slice(0,4))-Number(birthday.slice(0,4))-Number(debut.slice(5)<birthday.slice(5));
}
function normalizedName(name){return String(name??'').replace(/\s/gu,'').toLowerCase();}
function isEmuName(name){return ['夢寐愛姆','愛姆','emu','yumebiemu'].includes(normalizedName(name));}
function openingEasterEgg(s,name){
 const alias=normalizedName(name??s.name);
 if(['你不行','youcannot'].includes(alias))return 'wedding';
 const dates=s.personalCalendar;
 if(s.gender==='female'&&dates?.birthday.slice(5)==='06-21'&&dates.debut.slice(5)==='11-20'&&['夢寐愛姆','愛姆','emu','yumebiemu'].includes(alias))return 'anniversary';
 return null;
}
function make(o={},seed=Date.now()){

 let s={version:2,rng:seed>>>0,seed:seed>>>0,name:String(o.name||'未命名的旅人').trim().slice(0,16)||'未命名的旅人',route:'VTuber',gender:o.gender==='female'?'female':'male',genre:'尚未決定',day:0,season:0,stage:'focus',fans:0,money:0,health:85,joy:75,skill:0,bond:20,network:10,flags:[],flagDays:{},history:[],tally:{},used:[],graph:[0],eventId:null,summary:null,lastResult:'',peak:0,age:18};

 const background=openingPick(s,'background',o.background);let b=backgrounds[Number(background.id)];[s.background,s.bio,s.money,s.skill,s.joy]=b;s.money=Math.round(s.money*.65);s.age=ageAtDebut(o.birthday,o.debut)??(18+Math.floor(rand(s)*12));const talent=openingPick(s,'talent',o.talent);s.trait=traits[Number(talent.id)];s.deathDay=(Math.max(80-s.age,1)+Math.floor(rand(s)*24))*360+Math.floor(rand(s)*360);s.peers=['青禾','米洛','晚星'].map((name,i)=>({name,fans:0,pace:[.9,1.3,.65][i],note:'也在準備第一次開台。'}));initMarket(s);upgradeMarket(s);upgradeLife(s);if(o.birthday&&o.debut)setDates(s,o.birthday,o.debut);lifePlan(s);s.money=Math.max(s.money,Math.ceil(livingInfo(s).monthly*6*1.02/100)*100);

 const challenge=o.challenge===undefined||o.challenge==='none'?null:openingPick(s,'challenge',o.challenge),gift=openingPick(s,'gift',o.gift);

 s.opening={background,talent,challenge,gift};

 s.money+=Math.round(b[2]*.65);

 if(background.id==='5')s.life.completed.push('mic');

 if(gift.id==='cash')s.money+=5000;

 if(gift.id==='lamp')s.life.completed.push('desk_lamp');

 if(gift.id==='intro')queueLife(s,'opening_intro',4);

 if(challenge)queueLife(s,'opening_challenge_'+challenge.id,2);

 const egg=openingEasterEgg(s,o.name);
 if(egg)s.secretEnding=egg;
 return s;

}

function nextCashOrder(s){

 const expense=s.expenses?.at(-1)?.order;

 const income=s.incomeEntries?.at(-1)?.order;

 return Math.max(Number.isSafeInteger(expense)?expense:0,Number.isSafeInteger(income)?income:0)+1;

}

function recordExpense(s,amount,reason){

 if(!(amount>0))return;

 if(!s.expenses)s.expenses=[];

 s.expenses.push({day:s.day,amount:round(amount),reason,order:nextCashOrder(s)});

 if(s.expenses.length>40)s.expenses.shift();

}

function recordIncome(s,amount,reason){

 if(!s.incomeEntries)s.incomeEntries=[];

 s.incomeEntries.push({day:s.day,amount:round(amount),reason,order:nextCashOrder(s)});

 if(s.incomeEntries.length>40)s.incomeEntries.shift();

}

const dailyLimits={fans:5};
function subscriptionAward(value){return value>0?Math.round(Math.round(value*1.3)*1.3):value;}

const dailyScopes=new WeakMap();

const routinePreviews=new WeakSet();

function boundedDailyValue(s,key,value){

 const scope=dailyScopes.get(s);

 const limit=dailyLimits[key];

 if(!scope||!limit)return value;

 const baseline=scope.before[key]-(scope.previous[key]||0);

 return clamp(value,baseline-limit,baseline+subscriptionAward(limit));

}

const policyEffects={

 balanced:{weekly:{health:2,wellbeingMood:2,physical:2,joy:2}},

 career:{ads:1.25,subscribers:1.30,weekly:{health:-2,wellbeingMood:-2}},

 health:{weekly:{health:5,physical:5}},

 mood:{weekly:{wellbeingMood:5,joy:5}},

 venture:{ads:1.70,subscribers:1.80,weekly:{health:-5,physical:-4,wellbeingMood:-5,joy:-5}}

};

function lifePolicyEffect(s){return policyEffects[lifePlan(s).pace]||{};}

function settleRoutineStats(s,exertion=0,weekEnded=false){

 const {before}=dailyScopes.get(s);

 const after=trackedStats(s),living=livingState(s);

 const pending=s.weeklyRoutine??={};

 for(const key of Object.keys(after))pending[key]=(pending[key]||0)+after[key]-before[key];

 s.health=Math.max(0,before.health-exertion);

 s.joy=before.joy;

 living.mood=before.wellbeingMood;

 living.physical=before.physical;

 if(!weekEnded)return;

 const capped=Object.fromEntries(Object.entries(pending).map(([key,value])=>[key,clamp(whole(value),-5,5)]));

 const fixed=lifePolicyEffect(s).weekly||{};

 const start=trackedStats(s);

 for(const key of Object.keys(fixed))delete capped[key];

 apply(s,capped,'每週狀態結算');

 apply(s,fixed,'生活重心 · 每週固定效果');

 s.lastWeeklyChanges={week:s.day/7,changes:Object.fromEntries(Object.entries(trackedStats(s)).map(([key,value])=>[key,value-start[key]]))};

 delete s.weeklyRoutine;

}

function apply(s,d,reason='臨時支出'){for(let[k,v]of Object.entries(d)){if(k==='fans'){

 const previous=s.fans;

 s.fans=Math.max(0,boundedDailyValue(s,k,Math.round(s.fans+subscriptionAward(v))));
 trackLowSubscriptions(s);

 const change=s.fans-previous;

 if(change){

  const entries=s.subscriptionEntries??=[];

  const source=reason==='臨時支出'?'頻道變動':reason;

  const last=entries.at(-1);

  if(last?.day===s.day&&last.reason===source&&Math.sign(last.amount)===Math.sign(change))last.amount+=change;

  else entries.push({day:s.day,amount:change,reason:source});

  if(entries.length>80)entries.shift();

 }

}else if(k==='money'){v=whole(v);s.money=whole(s.money+v);if(v<0)recordExpense(s,-v,reason);else if(v>0)recordIncome(s,v,reason==='臨時支出'?'臨時入帳':reason);}else if(k==='wellbeingMood'||k==='physical'){

 const l=livingState(s),key=k==='wellbeingMood'?'mood':k;

 l[key]=clamp(boundedDailyValue(s,k,whole(l[key]+whole(v))),0,100);

}else if(k==='health'||k==='joy')s[k]=clamp(boundedDailyValue(s,k,whole(s[k]+whole(v))),0,100);

else if(['skill','bond','network'].includes(k))s[k]=round(clamp(s[k]+v,0,100))}}

function costs(s){return Math.ceil(livingInfo(s).monthly/30);}

function eligibleEvent(s,e,repeat=false){

 if(e.storyOnly||e.kind==='holiday'&&s.personalCalendar)return false;

 if(e.lifePhase&&e.lifePhase!==lifePhase(s).id)return false;

 if(e.dreamGate&&!dreamGate(s,e.dreamGate))return false;

 if(!lifeGate(s,e))return false;

 if(e.route&&e.route!==s.route||e.gender&&e.gender!==s.gender)return false;

 if(!repeat&&s.used.includes(e.id))return false;

 if(e.quarter!==undefined&&e.quarter!==s.season%4)return false;

 if(e.minFans&&s.fans<e.minFans)return false;

 if(e.requires){if(!s.flags.includes(e.requires))return false;let origin=s.flagDays?.[e.requires];if(origin===undefined){let h=s.history.find(h=>events.find(x=>x.title===h.title)?.choices.some(c=>c.flag===e.requires));origin=h?.day;}if(e.delay&&(origin===undefined||s.day-origin<e.delay*90))return false;}

 return true;

}

function pickEvent(s){

 

 const milestones={first:0,anniversary:360,agency:540,rainback:1080};

 for(let [id,day]of Object.entries(milestones))if(s.day>=day&&!s.used.includes(id)&&!(id==='anniversary'&&s.personalCalendar))return id;

 let names=selectedTopics(s);let pool=events.filter(e=>!e.rarity&&!Object.hasOwn(milestones,e.id)&&eligibleEvent(s,e)&&(!e.topics||e.topics.some(t=>names.includes(t))));

 let follow=pool.find(e=>e.requires);if(follow)return follow.id;

 if(selectedTopics(s).includes('時事與政治梗')&&s.flags.includes('politics_open')&&!s.used.includes('tw_clip'))return 'tw_clip';

 if(s.day%90<7){let h=pool.filter(e=>e.kind==='holiday');if(h.length)pool=h;}

 if(!pool.length)pool=events.filter(e=>!e.rarity&&e.repeatable&&eligibleEvent(s,e,true)&&e.id!==s.history.at(-1)?.eventId);

 pool=pool.filter(e=>!e.topics||e.topics.some(t=>names.includes(t)));let related=events.filter(e=>!e.rarity&&e.topics?.some(t=>names.includes(t))&&eligibleEvent(s,e,e.repeatable));if(related.length&&rand(s)<.75){let primary=contents.find(c=>c.id===lifePlan(s).topic)?.name;let weighted=related.flatMap(e=>Array(e.topics.includes(primary)?3:1).fill(e));return weighted[Math.floor(rand(s)*weighted.length)].id;}

 if(!pool.length)pool=related;

 if(!pool.length)return 'quiet';

 return pool[Math.floor(rand(s)*pool.length)].id;

}

const baseEvent=s=>{let e=events.find(e=>e.id===s.eventId);if(e?.id==='cash_lifeline')return cashLifelineEvent(s,e);if(e?.id.startsWith('monthly_'))return monthlyChoices(s,e);if(e?.rarity){let r=s.management?.riskLog.find(r=>r.day===s.day&&r.title===e.title);if(r?.loss)return {...e,body:e.body+'\n已發生直接損失 '+r.loss+' ，接下來的決定影響恢復方式。'};}if(e?.id.startsWith('annual_')&&s.calendarPending)return {...e,tag:s.calendarPending.name+' · '+realDay(s)};if(e?.arcEnd){let a=storyState(s).arcs[e.arcEnd];return {...e,body:e.body+"\n"+(a?storyArcs.find(x=>x.id===e.arcEnd).replies[a.choice]:"你們再次談起上次的話題。")};}return e;};

function weeklyPayout(s,tier,eventId){

 // Stable for this appearance, including when loading an older pending event.

 let hash=((s.seed??0)^(s.weeklyDraw?.day??s.day))>>>0;

 for(const char of eventId)hash=Math.imul(hash^char.charCodeAt(0),0x45d9f3b)>>>0;

 hash=Math.imul(hash^(hash>>>16),0x45d9f3b)>>>0;

 const moneyScale=.7+(hash&65535)/65535*.6;

 const fanScale=.75+(hash>>>16)/65535*.5;

 return {money:Math.round(tier.reward*moneyScale),fans:Math.round(tier.fans*fanScale)};

}

const festivalStories={

 '跨年・元旦':['倒數後的第一句話','聊天室開始分享新年願望。你想怎麼開啟新的一年？',

  C('和聊天室一起倒數','大家一起迎接了新年。',{health:-8,joy:8,bond:6}),

  C('元旦早上開一場新年談話','你和觀眾寫下了今年想做的事。',{joy:5,skill:3})],

 '情人節':['匿名的情人節信箱','觀眾寄來了想向重要的人說的話。你準備怎麼回應？',

  C('挑幾封信做匿名朗讀','幾段告白讓聊天室聊得比平常久。',{health:-4,bond:8}),

  C('辦一場單身也能參加的約會台','大家聊起自己最喜歡的一個人行程。',{joy:7})],

 '春節':['一場開在年節裡的直播','觀眾陸續回到家，有人忙著圍爐，也有人獨自在外地過年。',

  C('開台陪外地觀眾守歲','你陪大家聊到深夜。',{health:-7,bond:10}),

  C('留一段拜年錄音，回家吃飯','觀眾收到拜年錄音，你也和家人好好吃了一頓飯。',{joy:8},{wellbeing:{mood:4,physical:0}})],

 '清明・兒童節':['連假裡的兩件事','家人約你返鄉，觀眾則在聊天室聊起小時候的假日。',

  C('跟家人回鄉祭祖','你花了一天和家人相處，聽到幾段從沒聽過的往事。',{health:-3},{wellbeing:{mood:5,physical:0}}),

  C('做一場童年回憶台','大家拿出小時候的玩具和遊戲，聊了一整晚。',{joy:6,bond:5})],

 '母親節':['今天想謝謝誰','有觀眾想分享被照顧的回憶，也有人想安靜地過這一天。',

  C('做一集感謝照顧者的節目','聊天室分享了幾種不同的家庭故事。',{health:-3,bond:7}),

  C('把今天留給想見的人','你關掉直播通知，留出一個下午見面。',{joy:4},{wellbeing:{mood:6,physical:0}})],

 '端午節':['粽葉香和端午聊天室','南部粽與北部粽的話題又吵了起來，觀眾也在分享看龍舟的照片。',

  C('辦南北粽投票','票數一路拉鋸，大家順便分享了家裡的吃法。',{joy:6,bond:4}),

  C('出門看龍舟，晚上分享見聞','你在河邊走了一圈，回來有了新的直播話題。',{health:-3},{wellbeing:{mood:5,physical:0}})],

 '七夕':['想跨過銀河的留言','聊天室有人留下沒寄出的訊息，想把話說給遠方的人聽。',

  C('做一晚遠距故事投稿','有些觀眾把擱了很久的話寫了下來。',{bond:8,health:-4}),

  C('留一段星空晚安音檔','你的音檔成了幾位觀眾睡前的陪伴。',{joy:5,bond:3})],

 '中秋節':['分一塊月餅給聊天室','有人在烤肉，有人在值夜班，大家從各自的地方貼來月亮照片。',

  C('開一場各地賞月連線','聊天室從不同地方傳來同一輪月亮。',{health:-4,bond:8}),

  C('關台去散步賞月','你在晚風裡走了一段路，回家時心情好多了。',{health:3},{wellbeing:{mood:6,physical:0}})],

 '萬聖節':['模型今晚換個樣子','聊天室猜測你會用什麼裝扮，也有人敲碗聽鬼故事。',

  C('換上臨時萬聖節造型','觀眾忙著截圖，你花了點力氣處理造型設定。',{health:-6,joy:7}),

  C('辦一場可以開燈聽的鬼故事台','觀眾投稿的故事有驚悚，也有幾段好笑的。',{bond:6,joy:3})],

 '聖誕節':['交換一份沒有標價的禮物','觀眾提議交換手寫祝福，讓忙碌了一年的人收到一句問候。',

  C('做聊天室祝福交換','大家輪流念出收到的祝福。',{health:-3,bond:8}),

  C('錄一段聖誕晚安，提早休息','你留下錄音，也睡了一個好覺。',{health:7},{wellbeing:{mood:4,physical:0}})]

};

function withMinimumChoices(e){

 if(e.choices.length>=4)return e;

 const options=[

  C('保留紀錄，照原行程進行','你把今天的情況記了下來，照原行程繼續。'),

  C('留點時間整理，再回到日常','你花了一點時間整理思緒。',{}, {wellbeing:{mood:1,physical:0}}),

  C('把這件事寫進下次的準備清單','你把想到的做法留給下次。',{joy:4})

 ];

 if(e.id==='cash_lifeline'){

  return {...e,choices:[...e.choices,...[

   '先暫停開台，回去找穩定工作','把頻道交給存檔，先照顧生活','向觀眾告別，結束這一段創作'

  ].slice(0,4-e.choices.length).map(label=>C(label,'先安頓生活，結束本局。',{}, {lifeline:'end'}))]};

 }

 return {...e,choices:[...e.choices,...options.slice(0,4-e.choices.length).map(c=>({...c,originalIndex:-1,independent:true}))]};

}

function event(s){

 let e=baseEvent(s);

 if(!e)return e;

 if(e.id==='secret_anniversary_invite'||e.id.startsWith('author_story_'))return e;
 if(e.followupOf)return followupEvent(s,e);

 if(e.id==='annual_festival'){

  const story=festivalStories[s.calendarPending?.name];

  if(story){

   const [title,body,...choices]=story;

   e={...e,title,body,choices};

  }

 }

 if(e.id==='annual_emu_birthday')e={...e,letter:emuBirthdayLetter(s)};

 const draw=s.weeklyDraw;

 const weekly=draw?.id===e.id&&draw.day===s.day;

 const fixed=e.id.startsWith('annual_')||e.id===anniversaryEventId;

 if(e.adverse)return {...e,concealOutcomes:true};

 if(!weekly&&!fixed)return e.id==='monthly_equipment'?e:withMinimumChoices(e);

 const tier=weekly?weeklyTiers.find(t=>t.id===draw.tier):e.id===anniversaryEventId?weeklyTiers[0]:weeklyTiers.at(-1);

 if(!tier)return e;

 const rank=e.id===anniversaryEventId?6:weeklyTiers.length-weeklyTiers.indexOf(tier);

 const key=s.calendarPending?.name||e.id;

 const hidden=e.id===anniversaryEventId;

 const payout=weeklyPayout(s,hidden?{reward:22500,fans:4500}:tier,key);

 const factor=.8+(payout.money%41)/100;

 const alternateActions=['沿用上次的流程','請熟悉的夥伴一起安排','先試一個短版本','把安排留到開台時再定','依聊天室的提議調整','先把想法整理成一段簡單的內容'];

 const setback=C(alternateActions[payout.money%alternateActions.length],'原本的安排遇上變數。你花了更多時間善後，結果比預期差。',{},{

  weeklyPayout:{money:-Math.round(payout.money*.22*factor),fans:-Math.round(payout.fans*.18*factor),health:-rank,joy:-rank},

  wellbeing:{mood:-Math.round((rank+2)*factor),physical:-Math.round(rank*factor*.6)},setback:true

 });

 const choices=e.choices.map((c,i)=>{

  const factor=.8+((payout.money+i*17)%41)/100;

  if(c.opportunity||c.highRisk||c.life?.finish)return {...c,originalIndex:i};

  const rewardFactor=c.weeklyReward??1;

  const delta={};

  for(const [stat,value] of Object.entries(c.delta)){

   const key={skill:'wellbeingMood',bond:'joy',network:'wellbeingMood'}[stat]||stat;

   const amount=stat==='money'||stat==='fans'?(hidden?0:value):value*factor*(1+(rank-1)*.28);

   delta[key]=(delta[key]||0)+amount;

  }

  const wellbeing=c.wellbeing?{mood:Math.round(c.wellbeing.mood*factor),physical:Math.round(c.wellbeing.physical*factor)}

   :rewardFactor?{mood:Math.round(rank*factor),physical:0}:undefined;

  const money=Math.round(payout.money*rewardFactor*factor);

  const fans=Math.round(payout.fans*rewardFactor*factor);

  return {...c,originalIndex:i,delta,wellbeing,fans:hidden?0:c.fans,weeklyPayout:rewardFactor?{money,fans}:undefined,note:hidden?'五盞夢燈亮起，聊天室留下了這晚的祝福。':c.note};

 });

 choices.splice(payout.fans%(choices.length+1),0,setback);

 return withMinimumChoices({...e,concealOutcomes:true,choices});

}



function selectContent(s,id,plan='plan0'){if(s.stage!=='content')return false;let c=contents.find(c=>c.id===id);if(!c)return false;if(s.flags.includes('agency')&&c.id==='current')c=contents.find(v=>v.id==='chat');let p=programmeOptions(s,c.id).find(p=>p.id===plan);if(!p||p.locked)return false;s.sessionPlan=plan;s.genre=c.name;s.stage='focus';return focus(s,'live',true)}

function cancelContent(s){if(s.stage!=='content')return false;s.stage='focus';return true}

function record(s,item){let st=storyState(s);if(st.firstLive===null&&s.lastFocus?.startsWith('認真開台'))st.firstLive=s.day;s.history.push({day:s.day,season:s.season,content:s.lastFocus,fans:s.fans,...item});if(s.history.length>1000)s.history.shift();s.graph.push(s.fans);if(s.graph.length>180)s.graph.shift();s.peak=Math.max(s.peak,s.fans);}

function trackedStats(s){

 const living=livingState(s);

 return {wellbeingMood:living.mood,health:s.health,physical:living.physical,joy:s.joy};

}

function recordStatChanges(s,before,reason,day=s.day){

 const after=trackedStats(s);

 for(const [key,value] of Object.entries(after)){

  const amount=round(value-before[key]);

  if(!amount)continue;

  const rows=(s.statEntries??={})[key]??=[];

  rows.push({day,amount,reason});

  if(rows.length>50)rows.shift();

 }

}

function visibleSnapshot(s){

 return {money:s.money,fans:s.fans,...trackedStats(s)};

}

function visibleChanges(s,before){

 return Object.fromEntries(Object.entries(visibleSnapshot(s)).map(([key,value])=>[key,round(value-before[key])]));

}

function recordDailyChanges(s,day,{money,...changes}){

 const entry={day,changes};

 s.lastDailyChanges=entry;

 const history=s.dailyChangesHistory??=[];

 if(history.at(-1)?.day===day)history[history.length-1]=entry;

 else history.push(entry);

 if(history.length>30)history.shift();

}

function focus(s,id,ready=false){

 const before=visibleSnapshot(s);

 dailyScopes.set(s,{before,previous:{}});

 let ok;

 try{ok=resolveFocus(s,id,ready);}finally{dailyScopes.delete(s);}

 if(ok&&s.stage!=='content'){

  recordStatChanges(s,before,s.lastFocus);

  recordDailyChanges(s,s.day,visibleChanges(s,before));

  if(s.stage==='result'&&!routinePreviews.has(s))weeklyEvent(s);

 }

 return ok;

}

function resolveFocus(s,id,ready=false){

 if(s.stage!=='focus')return false;let a=actions.find(a=>a.id===id);if(!a||id==='work'&&upgradeCareer(s).mode==='full'||a.minAge&&ageNow(s)<a.minAge||a.money<0&&s.money+a.money<0)return false;

 if(id==='live'&&!ready){s.stage='content';return true}

 s.dailyAction=id;s.channelNote='';s.lastFocus=id==='live'?'認真開台 · '+s.genre:id==='work'&&upgradeCareer(s).mode==='salary'?'正職上班':a.title;s.tally[id]=(s.tally[id]||0)+1;

 const changes={live:{joy:-.6,skill:.12,bond:.6},learn:{health:-2,joy:-.6,skill:.6},connect:{health:-2,network:.5,bond:.3},work:{joy:-1.2},rest:{health:8,joy:5,bond:-.3},mentor:{health:-1.5,joy:.6,network:.4},retire:{health:6,joy:4,bond:-.2}};

 if(s.trait[2]==='sleep'&&id==='rest')changes[id].health+=2;

 if(s.trait[2]==='social'&&id==='learn')changes[id].joy+=1;

 if(s.trait[2]==='calm'&&id==='work')changes[id].wellbeingMood=1;

 const zodiac=zodiacProfile(s);

 if(zodiac?.action===id)for(const [stat,value] of Object.entries(zodiac.delta))changes[id][stat]=(changes[id][stat]||0)+value;

 if(id==='rest'&&zodiac?.action==='rest'){const l=livingState(s);l.mood=round(clamp(l.mood+1,0,100));}

 apply(s,changes[id],s.lastFocus);let career=upgradeCareer(s);if(id==='live'&&career.mode==='semi')apply(s,{health:2});if(career.partner>=40)apply(s,{joy:1});if(career.care>=40&&id==='rest')apply(s,{joy:1});if(id==='rest'&&career.home==='quiet')apply(s,{health:2});if(s.trait[2]==='skill'&&id==='learn')apply(s,{wellbeingMood:1});if(s.trait[2]==='bond'&&id==='live')apply(s,{joy:1});apply(s,{joy:-.25,bond:-.15});if(ageNow(s)>60&&!['rest','retire'].includes(id))apply(s,{health:-(ageNow(s)-60)*.05});

 const c=id==='live'?contents.find(c=>c.name===s.genre):null;const zodiacFit=c&&zodiac?.topics.includes(c.id);

 if(c){const counts=broadcastCounts(s);counts[c.id]++;trackSecretStream(s,c.id);lifeBroadcast(s,c);programmeBroadcast(s,c);}else{let j=journeyState(s);j.voice=Math.max(0,j.voice-(['rest','retire'].includes(id)?24:8));j.privacy=Math.max(0,j.privacy-5);j.streak=0;}if(c)apply(s,Object.fromEntries(Object.entries(c.delta).map(([k,v])=>[k,k==='fans'?v/30:v/12])));

 let churn=Math.round(s.fans*(id==='live'?.00025:.00075)*(.7+rand(s)*.6));let gain=id==='live'?Math.round((2+s.skill*.08+s.network*.03)*(.4+rand(s))*(s.flags.includes('agency')?1.25:1)*(s.trait[2]==='reach'?1.15:1)):id==='connect'?3:0;

 if(id==='live')gain=Math.round(gain*upgradeLife(s).lastFit*(1+s.life.completed.reduce((n,id)=>{let p=projects.find(p=>p.id===id);return n+equipmentMultiplier*((p?.reach||0)+(p?.topics?.includes(c?.id)?p.topicReach||0:0))},0)));

 if(['rest','retire'].includes(id)&&upgradeLife(s).completed.includes('archive'))apply(s,{joy:2});

 let income=Math.round(baseLiveAdIncome(s)*(.82+rand(s)*.36));

 if(id==='live'&&s.market.daily?.day===s.day&&s.market.daily.topic===c.id){income=Math.round(income*(1+s.market.daily.boost));gain=Math.round(gain*(1+s.market.daily.boost));}if(id==='live'){let mode=upgradeCareer(s).mode;gain=Math.round(gain*(isFullTimeStreaming(mode)?1.25:mode==='semi'?.7:1));income=Math.round(income*(isFullTimeStreaming(mode)?1.15:mode==='semi'?.7:1));}

 if(id==='live'){let st=channelStyle(s);income=Math.round(income*Math.max(.25,1+dreamEffect(s,'income')));gain=Math.round(gain*Math.max(.2,1+dreamEffect(s,'gain')+st.level*.04));}

 if(id==='live'){let m=managementState(s);const policy=lifePolicyEffect(s);income=Math.round(income*(policy.ads||1));gain=Math.round(gain*(policy.subscribers||1));if(s.plan?.pace==='venture')apply(s,{health:-4,joy:-1});if(m.focus==='community')apply(s,{joy:1});if(m.focus==='craft')apply(s,{wellbeingMood:2,health:-1});if(m.focus==='business'){income=Math.round(income*1.12);apply(s,{joy:-1,health:-1});}if(m.contract)apply(s,{health:-2});}

 if(id==='live'){const swing=.82+rand(s)*.36;gain=Math.round(gain*.65*swing*(zodiacFit?1.18:1));income=Math.round(income*swing*(zodiacFit?1.12:1));}

 let equipmentBonus=id==='live'?Math.round(income*equipmentEffect(s,c?.id).income):0;income+=equipmentBonus;upgradeLife(s).equipmentStats.income+=equipmentBonus;

 let cost=upgradeLife(s).completed.reduce((n,id)=>n+(projects.find(p=>p.id===id)?.upkeep||0),0),interest=s.money<0?Math.ceil(-s.money*.0004):0;

 const actionPay=id==='work'&&((s.emergencyWorkUntil||0)>s.day||career.mode==='salary')?0:a.money;

 if(id!=='live')income=0;

 apply(s,{money:income},'平台分成');

 const fansBeforeIncome=s.fans;
 if(gain)apply(s,{fans:gain},id==='live'?'開台新增訂閱':'社群互動');

 if(churn)apply(s,{fans:-churn},'日常取消訂閱');

 const donation=id==='live'?rollDonation(s):0;

 if(id==='live')s.lastChannelIncome={platform:income,donation};

 if(rand(s)<.12)apply(s,{money:-(25+Math.floor(rand(s)*76))},'當日零星支出');

 if(actionPay>0)apply(s,{money:actionPay},id==='work'?`兼職薪資 · ${actionPay/partTimeHourly} 小時`:a.title+'薪資');

 if(a.money<0)apply(s,{money:a.money},a.title);

 if(cost)apply(s,{money:-cost},'設備維護');

 if(interest)apply(s,{money:-interest},'欠款利息');

 let accident=0;

 upgradeLife(s).equipmentStats.maintenance+=cost;if(id==='live'&&income>=cost+costs(s))progressState(s).covered=true;s.finance={equipmentBonus,income,donation,cost,interest,accident,action:actionPay,growth:s.fans-fansBeforeIncome};s.lastChanges={};

 settleRoutineStats(s,id==='live'||id==='work'?1:0);

 dailyScopes.delete(s);

 if(checkExhaustion(s))return true;

 if(lifeDue(s)){s.eventId=lifeDue(s);s.stage='event';}

 else if(s.day===0&&!s.used.includes('first')){s.eventId='first';s.stage='event';}

 else if(!openAnniversaryEvent(s)){s.eventId=null;s.lastResult='完成今天的安排。'+(accident?`臨時設備與生活支出 ${accident}。`:'');record(s,{title:s.lastFocus,choice:'日常安排',text:s.lastResult});s.stage='result';}

 return true;

}

function choose(s,i,topic){

 const before=visibleSnapshot(s);

 const selected=s.stage==='event'?event(s):null;

 const ok=resolveChoice(s,i,topic);

 if(ok&&selected){

  recordStatChanges(s,before,selected.title);

  scheduleFollowup(s,selected,selected.choices[i],visibleChanges(s,before));
  if(selected.id.startsWith('author_story_'))resolveAuthorStory(s,selected.id,selected.choices[i]);
  if(selected.id===anniversaryEventId||selected.id==='secret_wedding'){
   s.secretEnding=selected.id===anniversaryEventId?'anniversary':'wedding';
  }

  s.lastChoiceResult={day:s.day,label:selected.choices[i].label,text:s.stage==='end'?s.summary?.body:s.lastResult,changes:visibleChanges(s,before)};

 }

 return ok;

}

function resolveChoice(s,i,topic){

 if(s.stage!=='event')return false;let e=event(s),c=e?.choices[i];if(!c||c.delta.money<0&&s.money+c.delta.money<0)return false;

 if(c.requiredCash>s.money)return false;

 i=c.originalIndex??i;

 if(e.id==='secret_anniversary_invite'){
  if(topic!==undefined)return false;
  s.used.push(e.id);
  s.eventId=c.enterAnniversary?anniversaryEventId:null;
  s.stage=c.enterAnniversary?'event':'focus';
  s.lastResult=c.note;
  return true;
 }
 if(e.id==='cash_lifeline')return chooseCashLifeline(s,c.lifeline);

 if(topic!==undefined)return false;

 let before={fans:s.fans,money:s.money,...trackedStats(s),skill:s.skill,bond:s.bond,network:s.network};

 const scale=d=>Object.fromEntries(Object.entries(d).map(([k,v])=>[k,['money','fans'].includes(k)?v:v*.25]));

 if(c.highRisk){let stake=Math.min(30000,Math.max(1500,Math.floor(Math.max(0,s.money)*.25)));apply(s,{money:-stake},e.title+' · 冒險投入');let win=rand(s)<.3;apply(s,win?{money:stake*3,fans:Math.max(80,Math.round(s.fans*.12)),joy:8,health:-10}:{fans:-Math.max(30,Math.round(s.fans*.18)),health:-22,joy:-15,bond:-12});s.lastChanges=Object.fromEntries(Object.keys(before).map(k=>[k,round((trackedStats(s)[k]??s[k])-before[k])]).filter(([,v])=>v));s.lastResult=win?'冒險成功，投入 '+stake+'，收到 '+stake*3+' 。':'冒險失敗，投入 '+stake+' 未能收回，疲勞與信任損失也需要時間恢復。';record(s,{eventId:e.id,title:e.title,choice:c.label,text:s.lastResult});s.stage='result';checkExhaustion(s);return true;}

 if(c.opportunity&&!applyOpportunity(s,c.opportunity))return false;

 if(s.stage==='end')return true;

 apply(s,scale(c.delta),e.title+' · '+c.label);if(c.weeklyPayout)apply(s,c.weeklyPayout,e.title+' · 活動回報');if(c.fans)apply(s,{fans:c.fans},e.title+' · 訂閱變動');if(c.flag&&!s.flags.includes(c.flag)){s.flags.push(c.flag);s.flagDays[c.flag]=s.day;}

 let outcome='';if(c.chance){const zodiac=zodiacProfile(s);const boosted=zodiac&&e.topics?.some(topic=>zodiac.topics.some(id=>contents.find(content=>content.id===id)?.name===topic||id===topic));let ok=rand(s)<clamp(c.chance-.12+(s.skill-50)/600+(boosted ? .1 : 0),.1,.85);apply(s,scale(ok?c.win:c.lose),e.title+' · 事件結果');outcome=ok?'這次嘗試得到回應。':'這次沒有如預期發展。'}

 if(!c.setback&&e.id==='life_sponsor_payment'&&i===0)apply(s,{money:upgradeLife(s).reputation>=40?4000:2000},'合作款項');

 if(c.contract)managementState(s).contract={due:s.day+30,started:s.tally.live||0};if(c.subscriberGain)addMembers(s,c.subscriberGain);if(c.wellbeing){apply(s,{wellbeingMood:c.wellbeing.mood,physical:c.wellbeing.physical});}if(!c.setback&&!c.independent){lifeChoice(s,e,c);dreamChoice(s,e,c);storyChoice(s,e,i);journeyChoice(s,e,i);}

 if(e.id.startsWith('annual_')&&s.calendarPending){let cal=calendarState(s);cal.seen.push(s.calendarPending.key);cal.seen=cal.seen.slice(-30);delete s.calendarPending;}s.lastChanges=Object.fromEntries(Object.keys(before).map(k=>[k,round((trackedStats(s)[k]??s[k])-before[k])]).filter(([,v])=>v));if(!s.used.includes(e.id))s.used.push(e.id);s.lastResult=c.note+' '+outcome;record(s,{eventId:e.id,title:e.title,choice:c.label,text:s.lastResult});s.stage='result';checkExhaustion(s);return true;

}

function marketValue(s){return round(assets.reduce((v,a)=>v+s.market.positions[a.id].qty*s.market.prices[a.id],0))}



function upgradeMarket(s){

 expandMarket(s);const m=s.market;if(m.schema===2)return;m.schema=2;m.regime='盤整';m.regimeLeft=20;m.dividends=0;m.newsFeed=[];m.flow={};m.bars={};

 for(const a of assets){m.flow[a.id]=0;m.bars[a.id]=m.history.map(h=>({day:h.day,close:h.prices[a.id],legacy:true}));if(!m.bars[a.id].length)m.bars[a.id]=[{day:s.day,close:m.prices[a.id],legacy:true}];}

 m.quotes=Object.fromEntries(assets.map(a=>[a.id,{volume:a.id==='steady'?500000:a.id==='media'?150000:60000,halted:false,spread:a.id==='steady'?.0008:a.id==='media'?.0018:.004}]));

}

function quote(s,id,side,qty){

 const m=s.market,a=assets.find(a=>a.id===id);

 if(s.stage==='end')return {ok:false,message:'人生已結束，僅供回顧。'};

 if(!a||!['buy','sell'].includes(side)||!Number.isSafeInteger(qty)||qty<=0||qty>1000000)return {ok:false,message:'請輸入有效的整數交易單位（1–1,000,000）。'};

 const q=m.quotes[id];if(q.halted)return {ok:false,message:'此資產今日暫停交易，請等待下一個遊戲日。'};

 let available=Math.max(0,Math.floor(q.volume*.02)-(m.flow[id]||0));if(qty>available)return {ok:false,message:`今日剩餘可成交 ${available} 單位，請減少數量。`};

 let impact=(qty+(m.flow[id]||0))/Math.max(1,q.volume)*.06,price=round(Math.max(.01,m.prices[id]*(1+(side==='buy'?1:-1)*(q.spread/2+impact)))),gross=round(price*qty),fee=round(Math.max(1,gross*.0015));

 return {ok:true,price,gross,fee,cash:round(side==='buy'?gross+fee:gross-fee),available};

}

function trade(s,id,side,qty){

 const q=quote(s,id,side,qty);if(!q.ok)return q;let m=s.market,p=m.positions[id];

 if(side==='buy'){if(s.money<q.cash)return {ok:false,message:'現金不足（已計入買賣價差、滑價與手續費）。'};s.money=round(s.money-q.cash);recordExpense(s,q.cash,'買入 '+assets.find(a=>a.id===id).name+'（含交易費）');p.qty+=qty;p.cost=round(p.cost+q.cash);}

 else{if(p.qty<qty)return {ok:false,message:'持有數量不足。'};let basis=p.cost*qty/p.qty;apply(s,{money:q.cash},'賣出 '+assets.find(a=>a.id===id).name);p.qty-=qty;p.cost=p.qty?round(p.cost-basis):0;m.realized=round(m.realized+q.cash-basis);fundInvestment(s,Math.max(0,q.cash-basis)*.5);}

 m.flow[id]=(m.flow[id]||0)+qty;m.log.unshift({day:s.day,id,side,qty,price:q.price,fee:q.fee});m.log=m.log.slice(0,30);

 return {ok:true,message:`${side==='buy'?'買入':'賣出'} ${qty} 單位，成交價 ${q.price.toFixed(2)}，費用 ${q.fee.toFixed(2)}。`};

}

const marketEvents=[

 ['季報優於預期',.045],['財測下修',-.055],['新產品熱銷',.035],['產品延後上市',-.035],['取得大型合作',.04],['主要合作方退出',-.04],['營運成本上升',-.025],['成本改善',.025],['資安事件調查',-.06],['市場傳言澄清',.03],['資金撤出該產業',-.045],['產業獲資金青睞',.04]

];

function normal(m){return Math.sqrt(-2*Math.log(Math.max(.000001,rand(m))))*Math.cos(2*Math.PI*rand(m))}

function tickMarket(s){

 const m=s.market;upgradeMarket(s);m.previous={...m.prices};m.day=s.day;m.flow={};let headlines=[];

 if(--m.regimeLeft<=0){m.regime=['盤整','擴張','衰退','動盪'][Math.floor(rand(m)*4)];m.regimeLeft=15+Math.floor(rand(m)*45);headlines.push('市場進入'+m.regime+'階段。');}

 let factor=m.regime==='動盪'?1.8:m.regime==='衰退'?1.3:1,drift=m.regime==='擴張'?.0009:m.regime==='衰退'?-.0012:0;

 let common=normal(m)*.006*factor+drift,macro=rand(m)<.025?(rand(m)<.5?-.035:.03):0;

 if(macro)headlines.push(macro<0?'利率預期升溫，市場風險偏好下降。':'景氣消息轉佳，市場資金回流。');

 let daily=s.day%3===0?dailyIndustry[Math.floor(rand(m)*dailyIndustry.length)]:null;m.daily=daily?{...daily,day:s.day}:null;if(daily){headlines.push('生活與產業：'+daily.text);if(daily.cost)apply(s,{money:-daily.cost},daily.text);}

 for(const a of assets){

  let prev=m.previous[a.id],base=a.id==='steady'?.004:a.id==='media'?.013:a.vol*.65,news=daily?.moves[a.id]||0,halt=rand(m)<.002;

  if(rand(m)<.065){let ev=marketEvents[Math.floor(rand(m)*marketEvents.length)];news+=ev[1]*(a.id==='steady'?.25:1);headlines.push(a.name+(a.id==='steady'?'成分企業':'')+'：'+ev[0]+'。');}

  if(halt)headlines.push(a.name+'：重大訊息待公布，今日暫停交易。');

  let dividend=!halt&&s.day%90===0&&a.id!=='dream'?round(prev*(a.id==='steady'?.004:.002)):0;

  let reference=Math.max(1,prev-dividend),open=round(clamp(reference*(1+common*.35+news*.6+normal(m)*base*.3),1,100000));

  let close=round(clamp(open*(1+common*.65+macro+news*.4+normal(m)*base*factor),1,100000));

  let high=round(clamp(Math.max(open,close)*(1+Math.abs(normal(m))*base*.6),1,100000)),low=round(clamp(Math.min(open,close)*(1-Math.abs(normal(m))*base*.6),1,100000));

  let volume=Math.round((a.id==='steady'?500000:a.id==='media'?150000:60000)*(.5+rand(m))*(1+Math.abs(close/prev-1)*18));

  if(halt){open=close=high=low=prev;volume=0;}

  if(dividend){let cash=round(dividend*m.positions[a.id].qty);apply(s,{money:cash},a.name+'配息');m.dividends=round(m.dividends+cash);fundInvestment(s,cash);headlines.push(a.name+'：每單位配息 '+dividend.toFixed(2)+'，價格已扣除配息參考值。'+(cash?'持倉收到 '+cash.toFixed(2)+'。':''));}

  m.prices[a.id]=close;m.bars[a.id].push({day:s.day,open,high,low,close,volume,dividend,halt});m.bars[a.id]=m.bars[a.id].slice(-90);

  m.quotes[a.id]={volume,halted:halt,spread:(a.id==='steady'?.0008:a.id==='media'?.0018:.004)*factor*(news?1.5:1)};

 }

 m.news=headlines.join(' ')||'市場正常交易，價格受到市場與個別資產波動影響。';

 for(const text of headlines)m.newsFeed.unshift({day:s.day,text});m.newsFeed=m.newsFeed.slice(0,40);

 m.history.push({day:s.day,prices:{...m.prices}});m.history=m.history.slice(-90);

}

function trackLowSubscriptions(s){
 if(s.fans>=1000)delete s.lowSubscriptionsSince;
 else if(!Number.isSafeInteger(s.lowSubscriptionsSince))s.lowSubscriptionsSince=s.day;
}
function checkEndingPriority(s){
 if(s.secretEnding)return true;
 if(s.lastSecretEndingDay===s.day||!['focus','result'].includes(s.stage))return false;
 return openAuthorStory(s,true)||openCareerSecretEnding(s)||openAnniversaryEvent(s);
}
function checkNaturalEnding(s){
 if(s.day<s.deathDay||s.lastSecretEndingDay===s.day)return false;
 if(checkEndingPriority(s))return true;
 s.summary=endingFor(s);
 livingState(s).ending=s.summary;
 s.stage='end';
 return true;
}
function checkExhaustion(s){

 if(s.stage==='end'||s.secretEnding||s.stage==='event'&&['author_story_confession',anniversaryEventId,'secret_wedding','secret_anniversary_invite'].includes(s.eventId))return true;

 trackLowSubscriptions(s);
 const living=livingState(s);

 const reasons=[

  [s.money<=0,'把麥克風收進抽屜','錢包幾乎空了，房租也不能再拖。你決定先回去過普通人的日子，偶爾還是會想起聊天室裡的晚安。'],

  [s.fans<1000&&s.day-s.lowSubscriptionsSince>=360,'聊天室的最後一盞燈','頻道連續一年都沒能站上一千訂閱。你把回放備份好，在最後一次開台向仍然來看你的人說了晚安。'],

  [living.mood<=0,'一段留給自己的日子','你已經很久沒有因為開台而開心了。這次不必再擠出笑容，你把更新行事曆留白，先過好自己的日子。'],

  [s.health<=0,'這次先不加播','再撐一場已經變成每一天。你把播出時間從行事曆劃掉，終於能好好睡上一覺。'],

  [living.physical<=0,'窗外的早晨','以前總在熬夜後看見天亮。如今你把日子留給休養，也重新學著在早晨出門。'],

  [s.joy<=0,'沒有下一次預告','你盯著待機畫面很久，發現自己已經不再期待開台。最後一次說完晚安，你沒有再排下一場。']

 ];

 const reason=reasons.slice(1).find(([ended])=>ended)||reasons[0][0]&&reasons[0];

 if(reason&&checkEndingPriority(s))return true;
 if(reason===reasons[0]&&(s.cashLifelinesUsed||0)<2){

  s.eventId='cash_lifeline';s.stage='event';return true;

 }

 if(!reason)return false;
 if(s.lastSecretEndingDay===s.day)return false;

 s.summary={title:reason[1],body:reason[2]+' 走過 '+s.day+' 天，最高 '+s.peak+' 人訂閱。'};

 living.ending=s.summary;

 s.stage='end';

 return true;

}

function advance(s){

 const before=visibleSnapshot(s), day=s.day, reason=s.dailyAction==='rest'?'休息後的生活變化':'每日生活結算';

 const previous=s.lastDailyChanges?.day===day?s.lastDailyChanges.changes:{};

 dailyScopes.set(s,{before,previous});

 let ok;

 try{ok=resolveAdvance(s);}finally{dailyScopes.delete(s);}

 if(ok){

  const weekly=s.day!==day&&s.day%7===0?s.lastWeeklyChanges?.changes:null;

  recordStatChanges(s,before,weekly?'每週狀態結算':reason,day);

  const changes=visibleChanges(s,before);

  if(weekly)for(const key of Object.keys(weekly))changes[key]-=weekly[key];

  for(const key of Object.keys(changes))changes[key]=round(changes[key]+(previous[key]||0));

  recordDailyChanges(s,day,changes);

  delete s.lastChoiceResult;

 }

 return ok;

}

function resolveAdvance(s){

 if(s.stage!=='result')return false;if(checkExhaustion(s))return true;s.day++;s.season=Math.floor(s.day/90);salaryTick(s);authorSupportTick(s);tickMarket(s);lifeTick(s);careerTick(s);membershipTick(s);managementTick(s);livingTick(s);creditTick(s);

 let notices=[];if(creditState(s).notice)notices.push(creditState(s).notice);

 s.health=Math.min(s.health,Math.max(55,whole(100-Math.max(0,ageNow(s)-55)*.7)));

 settleRoutineStats(s,0,s.day%7===0);

 if(checkExhaustion(s)){s.notice=notices.join(' ');return true;}

 for(let p of s.peers){p.fans+=Math.floor(rand(s)*p.pace*4);p.note=s.day>7200?'各自走在人生不同的階段。':'按自己的節奏更新。';}

 s.notice=notices.join(' ');
 s.stage='focus';
 if(s.day>=s.deathDay)checkNaturalEnding(s);
 checkMilestones(s);
 return true;

}

function simulate(s,days){

 if(s.stage!=='focus'||![7,30,360].includes(days))return false;let start=s.day,startMoney=s.money,startFans=s.fans,stories=[];

 for(let n=0;n<days&&s.stage!=='end';n++){

  let a=s.health<50||s.joy<35?'rest':s.money<8000&&upgradeCareer(s).mode!=='full'?'work':'live';focus(s,a);if(s.stage==='content')selectContent(s,contents.find(c=>c.name===s.genre)?.id||'chat');

  if(s.stage==='event'){stories.push('等待你決定：'+event(s).title);break;}

  advance(s);if(s.notice){stories.push(s.notice);break;}

 }

 s.autoReport={paused:s.stage==='event'||!!s.notice,days:s.day-start,money:round(s.money-startMoney),fans:s.fans-startFans,stories};return true;

}

function migrate(s,gender){

 s.route='VTuber';

 if(s.version===2){upgradeMarket(s);upgradeLife(s);return s;}s.gender=gender==='female'?'female':s.gender||'male';s.day=s.season*90;s.flagDays={};for(let flag of s.flags){let h=s.history.find(h=>events.find(e=>e.title===h.title)?.choices.some(c=>c.flag===flag));if(h)s.flagDays[flag]=h.season*90;}s.version=2;delete s.totalSeasons;

 s.deathDay=Math.max(s.day+360,(85+Math.floor(rand(s)*19)-s.age)*360);initMarket(s);upgradeMarket(s);s.history=s.history.map(h=>({...h,day:h.season*90}));upgradeLife(s);if(s.stage==='end'){s.stage='focus';s.summary=null;s.health=Math.max(35,s.health);s.joy=Math.max(30,s.joy);}return s;

}

function valid(s){

 if(s&&s.market)expandMarket(s);

 if(!s||![1,2].includes(s.version)||!['focus','content','event','result','broadcast','end'].includes(s.stage)||!Number.isInteger(s.season)||s.season<0||!['rng','money','fans','health','joy','skill','bond','network','age'].every(k=>Number.isFinite(s[k]))||!['history','flags','peers','graph','used','trait'].every(k=>Array.isArray(s[k]))||!s.tally||typeof s.name!=='string')return false;

 if(s.stage==='event'&&!event(s))return false;if(s.version===1)return true;

 return Number.isSafeInteger(s.day)&&s.day>=0&&Number.isSafeInteger(s.deathDay)&&s.deathDay>0&&s.market?.day===s.day&&Number.isFinite(s.market.rng)&&Number.isFinite(s.market.realized)&&Array.isArray(s.market.log)&&Array.isArray(s.market.history)&&assets.every(a=>Number.isFinite(s.market.prices[a.id])&&s.market.prices[a.id]>0&&Number.isFinite(s.market.previous[a.id])&&Number.isSafeInteger(s.market.positions[a.id]?.qty)&&s.market.positions[a.id].qty>=0&&Number.isFinite(s.market.positions[a.id].cost));

}



// Persistent career systems. All amounts are fictional game currency.

const projects=[

 {id:'mic',name:'可靠的收音設備',cost:5000,days:3,desc:'開台實力成長增加，收音不再只是臨時湊合。',skill:.08},

 {id:'studio',name:'自己的工作室',cost:45000,days:30,desc:'每次開台少消耗 1 點體力；每日維護 15。',health:1,upkeep:15},

 {id:'editor',name:'長期剪輯合作',cost:18000,days:14,desc:'開台新增追蹤增加 25%；每日合作費 30。',reach:.25,upkeep:30},

 {id:'outfit',name:'新的角色服裝',route:'VTuber',cost:30000,days:45,desc:'完成時增加 250 追蹤；改善開台時的觀眾互動。',bond:.15},

 {id:'set',name:'攝影與棚景改造',route:'真人主播',cost:30000,days:21,desc:'完成時增加 250 追蹤；改善開台時的觀眾互動。',bond:.15},

 {id:'concert',name:'自己的周年舞台',cost:80000,days:60,desc:'需要 1,000 追蹤。完成後留下作品、增加 800 追蹤與 10 熱情。',minFans:1000},

 {id:'archive',name:'生涯作品典藏',cost:12000,days:20,desc:'50 歲起可製作。留住創作回憶；休息與退休時額外恢復熱情。',minAge:50}

];

projects.push(...[{"id": "pc", "name": "高效能直播電腦", "cost": 35000, "days": 5, "desc": "遊戲／繪圖開台收益 +20%、新增追蹤 +15%，每場少耗 1 體力；每日維護 8。", "upkeep": 8, "topics": ["game", "art"], "income": 0.2, "topicReach": 0.15, "topicHealth": 1}, {"id": "dualpc", "name": "雙電腦直播工作站", "cost": 65000, "days": 7, "requires": "pc", "desc": "需高效能電腦。所有開台收益額外 +15%，每場少耗 1 體力；每日維護 15。", "upkeep": 15, "income": 0.15, "health": 1}, {"id": "acoustic", "name": "錄音空間隔音處理", "cost": 24000, "days": 14, "desc": "ASMR／歌唱收益 +15%，每場少耗 1 體力；每日維護 5。", "upkeep": 5, "topics": ["asmr", "music"], "income": 0.15, "topicHealth": 1}, {"id": "ku100", "name": "KU100 雙耳收音套組", "cost": 329000, "days": 14, "requires": "acoustic", "desc": "需隔音空間。ASMR 開台收益 +65%、新增追蹤 +35%，改善觀眾互動；每日保養 20。", "upkeep": 20, "topics": ["asmr"], "income": 0.65, "topicReach": 0.35, "topicBond": 0.3}, {"id": "model3d", "name": "專屬角色 3D 化", "cost": 120000, "days": 60, "requires": "pc", "route": "VTuber", "desc": "需高效能電腦。歌唱／互動收益 +35%、新增追蹤 +25%；解鎖動捕，完成後觸發 3D 初披露。每日維護 12。", "upkeep": 12, "topics": ["music", "memes"], "income": 0.35, "topicReach": 0.25}, {"id": "mocap", "name": "全身動捕設備", "cost": 80000, "days": 21, "requires": "model3d", "route": "VTuber", "desc": "需完成 3D 化。歌唱／互動收益額外 +30%、新增追蹤 +20%；每場額外耗 1 體力，每日維護 12。", "upkeep": 12, "topics": ["music", "memes"], "income": 0.3, "topicReach": 0.2, "topicHealth": -1}, {"id": "camera", "name": "高畫質相機與燈光", "cost": 48000, "days": 7, "route": "真人主播", "desc": "雜談／歌唱／互動收益 +25%、新增追蹤 +15%；每日維護 10。", "upkeep": 10, "topics": ["chat", "music", "memes"], "income": 0.25, "topicReach": 0.15}]);

function upgradeLife(s){

 upgradeCareer(s);if(s.life){if(!s.life.fund)s.life.fund={balance:0,goal:null,auto:false,fromInvestments:0,spent:0};if(!s.life.equipmentStats)s.life.equipmentStats={income:0,maintenance:0};return s.life;}

 s.life={schema:1,contacts:[{id:'rain',name:'小雨',role:'熟客',trust:s.flags.includes('rain')?35:15},{id:'qing',name:'青禾',role:'同期主播',trust:20},{id:'milo',name:'米洛',role:'同期主播',trust:15},{id:'star',name:'晚星',role:'剪輯創作者',trust:15}].map(p=>({...p,lastDay:s.day,lastAction:-1,memory:'還有很多故事可以一起寫。'})),audience:Object.fromEntries(contents.map(c=>[c.id,10])),lastContent:null,lastFit:1,transition:0,completed:[],project:null,queue:[],reputation:30};

 return upgradeLife(s);

}

function audienceInfo(s,id){let l=upgradeLife(s),entries=Object.entries(l.audience),total=entries.reduce((a,[,v])=>a+v,0),dominant=entries.reduce((a,b)=>b[1]>a[1]?b:a);return {share:Math.round(l.audience[id]/total*100),dominant:contents.find(c=>c.id===dominant[0]).name,fit:clamp(.55+l.audience[id]/total*3,.65,1.45)};}

function projectStatus(s,p){let l=upgradeLife(s);return l.completed.includes(p.id)?'已完成':s.stage==='end'?'人生已結束':l.project?'已有企劃進行中':p.route&&p.route!==s.route?'不適用此身分':p.requires&&!l.completed.includes(p.requires)?'需先完成：'+projects.find(v=>v.id===p.requires).name:p.minAge&&ageNow(s)<p.minAge?`${p.minAge} 歲後開放`:p.minFans&&s.fans<p.minFans?`需要 ${p.minFans} 追蹤`:Math.max(0,s.money)+l.fund.balance<p.cost?'現金與創作專款不足':'';}

function startProject(s,id,cashOnly=false){let p=projects.find(p=>p.id===id);if(!p)return false;upgradeLife(s);if(projectStatus(s,p)||(cashOnly&&s.money<p.cost))return false;let f=s.life.fund,fromFund=cashOnly?0:Math.min(f.balance,p.cost);f.balance=round(f.balance-fromFund);f.spent=round(f.spent+fromFund);apply(s,{money:-(p.cost-fromFund)},'訂購 '+p.name);if(f.goal===id)f.goal=null;s.life.project={id,started:s.day,due:s.day+p.days};record(s,{title:'啟動企劃：'+p.name,choice:`投入 ${p.cost} `,text:`預計 ${dateLabel(s.day+p.days)} 完成。${fromFund?`其中 ${fromFund} 由創作專款支付。`: ''}`});return true;}

function queueLife(s,id,delay){let l=upgradeLife(s);if(!s.used.includes(id)&&!l.queue.some(q=>q.id===id))l.queue.push({id,due:s.day+delay});}

function lifeDue(s){let l=upgradeLife(s);return l.queue.find(q=>q.due<=s.day&&!s.used.includes(q.id))?.id||null;}

function lifeGate(s,e){let l=upgradeLife(s);if(e.minAge&&ageNow(s)<e.minAge||e.maxAge&&ageNow(s)>e.maxAge)return false;if(e.queued)return l.queue.some(q=>q.id===e.id&&q.due<=s.day);if(e.contact&&l.contacts.find(p=>p.id===e.contact).trust<(e.minTrust||40))return false;return true;}

function social(s,id,kind){

 if(s.stage!=='focus')return false;let l=upgradeLife(s),p=l.contacts.find(p=>p.id===id);if(!p||p.lastAction===s.day)return false;

 let options={talk:{cost:0,trust:7,joy:3},help:{cost:200,trust:12,joy:2},collab:{cost:500,trust:5,joy:2}};let o=options[kind];if(!o||s.money<o.cost+80||kind==='collab'&&(p.role==='熟客'||p.trust<40))return false;

 apply(s,{money:-o.cost,joy:o.joy});p.trust=clamp(p.trust+o.trust,0,100);p.lastDay=s.day;p.lastAction=s.day;remember(s,p.name,kind==='help'?'你曾在我需要幫忙時伸出援手。':kind==='collab'?'我們一起完成過小型聯動。':'你曾抽空聽我說近況。');p.memory=kind==='talk'?'你抽空聽完了對方最近的生活。':kind==='help'?'你在對方需要幫忙時伸出了手。':'一起完成了小型聯動，默契又多了一點。';

 if(kind==='collab'){apply(s,{fans:Math.round(15+p.trust),network:2});queueLife(s,'life_collab_offer',5);}

 // A social interaction consumes today's arrangement, preventing free repeated gifts.

 focus(s,'connect');s.lastResult=(s.lastResult||'')+' '+p.name+'：'+p.memory;record(s,{title:'與'+p.name+'的相處',choice:kind==='talk'?'聊聊近況':kind==='help'?'協助創作':'小型聯動',text:p.memory});return true;

}

function lifeBroadcast(s,c){if(s.fans>=1000&&rand(s)<.12){let joined=addMembers(s,Math.max(1,Math.floor(s.fans*.0005)));if(joined)s.career.feedback.unshift('本場新增 '+joined+' 位會員。');}audienceVisit(s,c.id);let l=upgradeLife(s),info=audienceInfo(s,c.id),switched=l.lastContent&&l.lastContent!==c.id;l.lastFit=info.fit;let loss=switched&&info.share<15?Math.round(s.fans*(l.transition>0?.002:.012)):0;

 if(loss)apply(s,{fans:-loss,joy:-1});for(let id in l.audience)l.audience[id]=round(l.audience[id]*.985+(id===c.id?3:.02));l.lastContent=c.id;if(l.transition>0)l.transition--;

 s.channelNote=`${c.name}觀眾契合度 ${Math.round(info.fit*100)}%`+(loss?`；轉型流失 ${loss} 位追蹤`:'');

 for(let id of l.completed){let p=projects.find(p=>p.id===id);if(p){apply(s,equipmentStats(p,c.id),p.name);}}

}

function lifeChoice(s,e,c){let l=upgradeLife(s),x=c.life||{};

 if(x.contact){let p=l.contacts.find(p=>p.id===x.contact);p.trust=clamp(p.trust+(x.trust||0),0,100);p.lastDay=s.day;p.memory=c.note;}

 if(x.reputation)l.reputation=clamp(l.reputation+x.reputation,0,100);

 if(x.transition)l.transition=x.transition;

 if(x.next)queueLife(s,x.next,x.delay||7);

 l.queue=l.queue.filter(q=>q.id!==e.id);

 if(x.finish){let p=projects.find(p=>p.id===x.finish);if(l.project?.id===x.finish&&!l.completed.includes(x.finish)){addWork(s,{title:p.name,kind:'創作成果',review:c.note});l.completed.push(x.finish);l.project=null;if(p.followup)queueLife(s,p.followup,7);apply(s,{fans:p.id==='concert'?800:['set','outfit'].includes(p.id)?250:50,joy:p.id==='concert'?10:3});}}

 if(['first','anniversary'].includes(e.id))addWork(s,{title:e.title,kind:'里程碑',review:c.note});

 if(e.id==='first'){let p=l.contacts[0];p.trust=clamp(p.trust+(c.flag==='rain'?15:5),0,100);p.memory=c.note;p.lastDay=s.day;}

}

function lifeTick(s){let l=upgradeLife(s);if(l.project&&s.day>=l.project.due)queueLife(s,'life_finish_'+l.project.id,0);

 if(s.day%30===0)for(let p of l.contacts){if(s.day-p.lastDay>60){p.trust=Math.max(0,p.trust-2);p.memory='最近少了聯絡，彼此有些疏遠。';}}

}

function important(s,e){return !!(e.major||e.queued||e.choices.some(c=>c.flag||Math.abs(c.delta.money||0)>=1000));}



events.push(...[{"id": "life_sponsor_offer", "title": "合作不只是一筆入帳", "body": "品牌想簽三個階段的合作：先談條件，再交件，最後請款。你的商譽會影響尾款。", "tag": "人生與頻道", "major": true, "choices": [{"label": "先試用，談清楚交付內容", "note": "支付 300 試用與準備費；7 天後交件。", "delta": {"money": -300}, "life": {"next": "life_sponsor_deliver", "reputation": 5}}, {"label": "接急件，直接排進節目", "note": "先收 800 訂金；3 天後必須面對交件。", "delta": {"money": 800, "health": -5}, "life": {"next": "life_sponsor_rush", "delay": 3, "reputation": -3}}, {"label": "婉拒不適合的合作", "note": "保留頻道選題的自由。", "delta": {"joy": 4}, "life": {"reputation": 2}}], "minFans": 150}, {"id": "life_sponsor_deliver", "title": "品牌要求你刪掉產品缺點", "body": "初稿到了審核階段。你的觀眾信任你，但品牌希望每句話都好聽。", "tag": "人生與頻道", "major": true, "choices": [{"label": "據實交件，保留評論", "note": "7 天後進入收款程序。", "delta": {"skill": 3, "bond": 5}, "life": {"next": "life_sponsor_payment", "reputation": 10}}, {"label": "自費重拍，協商雙方能接受的版本", "note": "付 500 重拍費，14 天後收款。", "delta": {"money": -500, "health": -3}, "life": {"next": "life_sponsor_payment", "delay": 14, "reputation": 5}}, {"label": "停止合作，不把內容播出", "note": "損失準備時間，換回自主決定權。", "delta": {"joy": 3}, "life": {"reputation": -2}}], "queued": true}, {"id": "life_sponsor_rush", "title": "急件撞上了原本的排程", "body": "你收了訂金，卻發現資料還沒查完。今晚要趕上交件嗎？", "tag": "人生與頻道", "major": true, "choices": [{"label": "熬夜核對資料", "note": "體力下降，但保住交付品質。", "delta": {"health": -28}, "life": {"next": "life_sponsor_payment", "reputation": 5}}, {"label": "坦白延期並退還部分訂金", "note": "退 400，延後 14 天請款。", "delta": {"money": -400}, "life": {"next": "life_sponsor_payment", "delay": 14, "reputation": -5}}, {"label": "交出未查證的內容", "note": "觀眾不滿；尾款會看商譽。", "delta": {"bond": -16}, "life": {"next": "life_sponsor_payment", "reputation": -20}}], "queued": true}, {"id": "life_sponsor_payment", "title": "合作到了結款日", "body": "可以正常請款，也可以選擇折價換立即入帳。累積的商譽會影響正常請款金額。", "tag": "人生與頻道", "major": true, "choices": [{"label": "依合約請款", "note": "商譽 40 以上收到 4,000；不足則收到 2,000。", "delta": {}, "life": {"reputation": 3}}, {"label": "接受折價，立即結清", "note": "收到 1,500，結束這次合作。", "delta": {"money": 1500}, "life": {}}, {"label": "要求釐清費用，走調解", "note": "先支付 300 費用；14 天後處理結果。", "delta": {"money": -300}, "life": {"next": "life_sponsor_settle", "delay": 14}}], "queued": true}, {"id": "life_sponsor_settle", "title": "調解結果送到了信箱", "body": "完成紀錄讓爭議有了依據。這次結算後，你也更懂得保留交件證明。", "tag": "人生與頻道", "major": true, "choices": [{"label": "收下協議款", "note": "收到 2,500，合作正式結束。", "delta": {"money": 2500, "skill": 4}, "life": {"reputation": 3}}, {"label": "以 1,800 提早和解", "note": "少一些收入，多留一點力氣。", "delta": {"money": 1800, "health": 5}, "life": {}}, {"label": "不再追討，把經驗寫下來", "note": "沒有款項，但整理了自己的合作守則。", "delta": {"skill": 8, "joy": 4}, "life": {}}], "queued": true}, {"id": "life_collab_offer", "title": "青禾想和你做一個固定節目", "body": "小型聯動之後，青禾提出每週一起完成一集作品。熟悉的朋友，現在也要談分工。", "tag": "人生與頻道", "major": true, "choices": [{"label": "寫清楚分工再開始", "note": "先投入 600，10 天後試播。", "delta": {"money": -600}, "life": {"contact": "qing", "trust": 8, "next": "life_collab_review", "delay": 10}}, {"label": "先做零預算的短版", "note": "7 天後回顧試播成果。", "delta": {"health": -4}, "life": {"contact": "qing", "trust": 4, "next": "life_collab_review"}}, {"label": "現在無法固定合作，坦白說明", "note": "不勉強承諾，仍保留聯絡。", "delta": {}, "life": {"contact": "qing", "trust": 2}}], "queued": true}, {"id": "life_collab_review", "title": "同一個節目，兩種期待", "body": "青禾想追熱門，你想多留一些慢慢聊天的段落。一起創作需要重新協調。", "tag": "人生與頻道", "major": true, "choices": [{"label": "各留一段，輪流主企劃", "note": "關係更穩，也吸引新觀眾。", "delta": {"fans": 180}, "life": {"contact": "qing", "trust": 15}}, {"label": "照我的方向走", "note": "頻道得到曝光，但合作關係受損。", "delta": {"fans": 250}, "life": {"contact": "qing", "trust": -20}}, {"label": "好好結束合作", "note": "給彼此自己的空間。", "delta": {"joy": 5}, "life": {"contact": "qing", "trust": -3}}], "queued": true}, {"id": "life_rain_letter", "title": "小雨說：最近有點跟不上你的節目", "body": "熟客喜歡原本的陪伴，但你也想試新的方向。你不必永遠一樣，也不用假裝改變毫無代價。", "tag": "人生與頻道", "major": true, "choices": [{"label": "保留固定老節目，再慢慢轉型", "note": "接下來 10 次開台轉型流失降為六分之一。", "delta": {}, "life": {"contact": "rain", "trust": 10, "transition": 10}}, {"label": "直接轉型，誠實說明想做的事", "note": "失去一些熟客的支持，換回自由。", "delta": {"joy": 8}, "life": {"contact": "rain", "trust": -12}}, {"label": "先一起回顧過去的作品", "note": "7 天後收到觀眾回信。", "delta": {}, "life": {"contact": "rain", "trust": 5, "next": "life_rain_reply"}}], "contact": "rain", "minTrust": 35}, {"id": "life_rain_reply", "title": "有人因為你的回顧，重新回來了", "body": "小雨整理了一份入門清單，想讓新朋友知道這個頻道走過的路。", "tag": "人生與頻道", "major": true, "choices": [{"label": "徵得同意後介紹清單", "note": "把回憶分享給新朋友。", "delta": {"fans": 120, "bond": 8}, "life": {"contact": "rain", "trust": 10}}, {"label": "私下道謝，不在台上點名", "note": "陪伴也可以保留隱私。", "delta": {"joy": 8}, "life": {"contact": "rain", "trust": 12}}, {"label": "自己另做一份公開版", "note": "投入 200，減少對觀眾無償勞動的依賴。", "delta": {"money": -200, "skill": 4}, "life": {"contact": "rain", "trust": 6}}], "queued": true}, {"id": "life_pivot", "title": "你想讓頻道換一種樣子", "body": "觀眾漸漸形成偏好。轉型可以慢慢試，也可以一下子改變，但人氣不會保證跟著走。", "tag": "人生與頻道", "major": true, "choices": [{"label": "預告混合編排，逐步試播", "note": "接下來 10 次開台降低轉型流失。", "delta": {"skill": 3}, "life": {"transition": 10}}, {"label": "把想做的內容直接播出", "note": "保留自由；轉型仍依觀眾偏好計算。", "delta": {"joy": 6}, "life": {}}, {"label": "先整理觀眾回饋", "note": "多花時間理解熟客。", "delta": {"bond": 8, "health": -4}, "life": {}}], "minFans": 300}, {"id": "life_age_young", "title": "租約到期，創作角落該搬去哪裡？", "body": "朋友找到便宜的合租房，但作息和開台聲音需要協調。", "tag": "人生與頻道", "major": true, "choices": [{"label": "先談生活公約", "note": "多留時間練習溝通。", "delta": {"health": 12, "joy": 6}, "life": {"next": "life_age_young_after", "delay": 30}}, {"label": "搬去獨立小套房", "note": "支付 2,000 搬家費，換自己的空間。", "delta": {"money": -2000, "health": 16}, "life": {"next": "life_age_young_after", "delay": 30}}, {"label": "先維持現況，之後再安排", "note": "壓力暫時留在生活裡。", "delta": {"health": -8, "joy": -4}, "life": {}}], "minAge": 18, "maxAge": 29}, {"id": "life_age_young_after", "title": "一個月後，生活有了新的節奏", "body": "先前的決定留下了影響。現在你可以替下一段日子留一點空間。", "tag": "人生與頻道", "major": true, "choices": [{"label": "把新的節奏保留下來", "note": "生活比以前安穩了一些。", "delta": {"health": 12, "joy": 8}, "life": {}}, {"label": "把這段經驗變成節目", "note": "讓經驗陪伴有相似煩惱的人。", "delta": {"fans": 80, "bond": 8}, "life": {}}, {"label": "找青禾聊聊近況", "note": "多年來的聯絡，今天又多了一段。", "delta": {}, "life": {"contact": "qing", "trust": 10}}], "queued": true}, {"id": "life_age_adult", "title": "家人的照顧需要排進行事曆", "body": "創作之外，家人也有需要你的時候。你得重新分配每天的時間。", "tag": "人生與頻道", "major": true, "choices": [{"label": "減少企劃，固定陪伴", "note": "留住生活裡的重要關係。", "delta": {"health": 12, "joy": 6}, "life": {"next": "life_age_adult_after", "delay": 30}}, {"label": "請人協助照顧", "note": "支付 2,000，把工作與照顧安排開。", "delta": {"money": -2000, "health": 16}, "life": {"next": "life_age_adult_after", "delay": 30}}, {"label": "先維持現況，之後再安排", "note": "壓力暫時留在生活裡。", "delta": {"health": -8, "joy": -4}, "life": {}}], "minAge": 30, "maxAge": 44}, {"id": "life_age_adult_after", "title": "一個月後，生活有了新的節奏", "body": "先前的決定留下了影響。現在你可以替下一段日子留一點空間。", "tag": "人生與頻道", "major": true, "choices": [{"label": "把新的節奏保留下來", "note": "生活比以前安穩了一些。", "delta": {"health": 12, "joy": 8}, "life": {}}, {"label": "把這段經驗變成節目", "note": "讓經驗陪伴有相似煩惱的人。", "delta": {"fans": 80, "bond": 8}, "life": {}}, {"label": "找青禾聊聊近況", "note": "多年來的聯絡，今天又多了一段。", "delta": {}, "life": {"contact": "qing", "trust": 10}}], "queued": true}, {"id": "life_age_middle", "title": "長期坐著工作，身體開始提醒你", "body": "健檢讓你發現需要調整生活。這次不是休息一天就能忘記的事。", "tag": "人生與頻道", "major": true, "choices": [{"label": "重新安排運動與休息", "note": "優先恢復體力。", "delta": {"health": 12, "joy": 6}, "life": {"next": "life_age_middle_after", "delay": 30}}, {"label": "自費檢查與復健", "note": "支付 2,000，認真處理累積的疲累。", "delta": {"money": -2000, "health": 16}, "life": {"next": "life_age_middle_after", "delay": 30}}, {"label": "先維持現況，之後再安排", "note": "壓力暫時留在生活裡。", "delta": {"health": -8, "joy": -4}, "life": {}}], "minAge": 45, "maxAge": 59}, {"id": "life_age_middle_after", "title": "一個月後，生活有了新的節奏", "body": "先前的決定留下了影響。現在你可以替下一段日子留一點空間。", "tag": "人生與頻道", "major": true, "choices": [{"label": "把新的節奏保留下來", "note": "生活比以前安穩了一些。", "delta": {"health": 12, "joy": 8}, "life": {}}, {"label": "把這段經驗變成節目", "note": "讓經驗陪伴有相似煩惱的人。", "delta": {"fans": 80, "bond": 8}, "life": {}}, {"label": "找青禾聊聊近況", "note": "多年來的聯絡，今天又多了一段。", "delta": {}, "life": {"contact": "qing", "trust": 10}}], "queued": true}, {"id": "life_age_senior", "title": "新的平台介面，你有點不習慣", "body": "年輕創作者願意教你，而你的經驗也是他們想聽的故事。", "tag": "人生與頻道", "major": true, "choices": [{"label": "請朋友一起慢慢學", "note": "讓學習變成新的相遇。", "delta": {"health": 12, "joy": 6}, "life": {"next": "life_age_senior_after", "delay": 30}}, {"label": "付費請人整理操作流程", "note": "支付 2,000，留下方便查閱的指南。", "delta": {"money": -2000, "health": 16}, "life": {"next": "life_age_senior_after", "delay": 30}}, {"label": "先維持現況，之後再安排", "note": "壓力暫時留在生活裡。", "delta": {"health": -8, "joy": -4}, "life": {}}], "minAge": 60, "maxAge": 74}, {"id": "life_age_senior_after", "title": "一個月後，生活有了新的節奏", "body": "先前的決定留下了影響。現在你可以替下一段日子留一點空間。", "tag": "人生與頻道", "major": true, "choices": [{"label": "把新的節奏保留下來", "note": "生活比以前安穩了一些。", "delta": {"health": 12, "joy": 8}, "life": {}}, {"label": "把這段經驗變成節目", "note": "讓經驗陪伴有相似煩惱的人。", "delta": {"fans": 80, "bond": 8}, "life": {}}, {"label": "找青禾聊聊近況", "note": "多年來的聯絡，今天又多了一段。", "delta": {}, "life": {"contact": "qing", "trust": 10}}], "queued": true}, {"id": "life_age_elder", "title": "有人想保存你的老影片", "body": "一位年輕觀眾說，他從你的作品認識了另一個年代的生活。", "tag": "人生與頻道", "major": true, "choices": [{"label": "一起整理口述回憶", "note": "你仍有值得被聽見的故事。", "delta": {"health": 12, "joy": 6}, "life": {"next": "life_age_elder_after", "delay": 30}}, {"label": "整理與備份作品", "note": "支付 2,000，留下一份更完整的記錄。", "delta": {"money": -2000, "health": 16}, "life": {"next": "life_age_elder_after", "delay": 30}}, {"label": "先維持現況，之後再安排", "note": "壓力暫時留在生活裡。", "delta": {"health": -8, "joy": -4}, "life": {}}], "minAge": 75, "maxAge": 110}, {"id": "life_age_elder_after", "title": "一個月後，生活有了新的節奏", "body": "先前的決定留下了影響。現在你可以替下一段日子留一點空間。", "tag": "人生與頻道", "major": true, "choices": [{"label": "把新的節奏保留下來", "note": "生活比以前安穩了一些。", "delta": {"health": 12, "joy": 8}, "life": {}}, {"label": "把這段經驗變成節目", "note": "讓經驗陪伴有相似煩惱的人。", "delta": {"fans": 80, "bond": 8}, "life": {}}, {"label": "找青禾聊聊近況", "note": "多年來的聯絡，今天又多了一段。", "delta": {}, "life": {"contact": "qing", "trust": 10}}], "queued": true}, {"id": "life_finish_mic", "title": "收音設備準備好了", "body": "從預算到等待，這次你把想做的事變成了真的。完成後的效果可在「人生與企劃」查看。", "tag": "人生與頻道", "major": true, "choices": [{"label": "和觀眾分享成果", "note": "讓支持你的人一起見證。", "delta": {"bond": 4}, "life": {"finish": "mic"}}, {"label": "寫下幕後製作紀錄", "note": "留住學到的經驗。", "delta": {"skill": 4}, "life": {"finish": "mic"}}, {"label": "邀朋友一起慶祝", "note": "值得和朋友分享的日子。", "delta": {}, "life": {"finish": "mic", "contact": "star", "trust": 8}}], "queued": true}, {"id": "life_finish_studio", "title": "工作室準備好了", "body": "從預算到等待，這次你把想做的事變成了真的。完成後的效果可在「人生與企劃」查看。", "tag": "人生與頻道", "major": true, "choices": [{"label": "和觀眾分享成果", "note": "讓支持你的人一起見證。", "delta": {"bond": 4}, "life": {"finish": "studio"}}, {"label": "寫下幕後製作紀錄", "note": "留住學到的經驗。", "delta": {"skill": 4}, "life": {"finish": "studio"}}, {"label": "邀朋友一起慶祝", "note": "值得和朋友分享的日子。", "delta": {}, "life": {"finish": "studio", "contact": "star", "trust": 8}}], "queued": true}, {"id": "life_finish_editor", "title": "剪輯合作準備好了", "body": "從預算到等待，這次你把想做的事變成了真的。完成後的效果可在「人生與企劃」查看。", "tag": "人生與頻道", "major": true, "choices": [{"label": "和觀眾分享成果", "note": "讓支持你的人一起見證。", "delta": {"bond": 4}, "life": {"finish": "editor"}}, {"label": "寫下幕後製作紀錄", "note": "留住學到的經驗。", "delta": {"skill": 4}, "life": {"finish": "editor"}}, {"label": "邀朋友一起慶祝", "note": "值得和朋友分享的日子。", "delta": {}, "life": {"finish": "editor", "contact": "star", "trust": 8}}], "queued": true}, {"id": "life_finish_outfit", "title": "角色服裝準備好了", "body": "從預算到等待，這次你把想做的事變成了真的。完成後的效果可在「人生與企劃」查看。", "tag": "人生與頻道", "major": true, "choices": [{"label": "和觀眾分享成果", "note": "讓支持你的人一起見證。", "delta": {"bond": 4}, "life": {"finish": "outfit"}}, {"label": "寫下幕後製作紀錄", "note": "留住學到的經驗。", "delta": {"skill": 4}, "life": {"finish": "outfit"}}, {"label": "邀朋友一起慶祝", "note": "值得和朋友分享的日子。", "delta": {}, "life": {"finish": "outfit", "contact": "star", "trust": 8}}], "queued": true}, {"id": "life_finish_set", "title": "攝影棚景準備好了", "body": "從預算到等待，這次你把想做的事變成了真的。完成後的效果可在「人生與企劃」查看。", "tag": "人生與頻道", "major": true, "choices": [{"label": "和觀眾分享成果", "note": "讓支持你的人一起見證。", "delta": {"bond": 4}, "life": {"finish": "set"}}, {"label": "寫下幕後製作紀錄", "note": "留住學到的經驗。", "delta": {"skill": 4}, "life": {"finish": "set"}}, {"label": "邀朋友一起慶祝", "note": "值得和朋友分享的日子。", "delta": {}, "life": {"finish": "set", "contact": "star", "trust": 8}}], "queued": true}, {"id": "life_finish_concert", "title": "周年舞台準備好了", "body": "從預算到等待，這次你把想做的事變成了真的。完成後的效果可在「人生與企劃」查看。", "tag": "人生與頻道", "major": true, "choices": [{"label": "和觀眾分享成果", "note": "讓支持你的人一起見證。", "delta": {"bond": 4}, "life": {"finish": "concert"}}, {"label": "寫下幕後製作紀錄", "note": "留住學到的經驗。", "delta": {"skill": 4}, "life": {"finish": "concert"}}, {"label": "邀朋友一起慶祝", "note": "值得和朋友分享的日子。", "delta": {}, "life": {"finish": "concert", "contact": "star", "trust": 8}}], "queued": true}, {"id": "life_finish_archive", "title": "生涯典藏準備好了", "body": "從預算到等待，這次你把想做的事變成了真的。完成後的效果可在「人生與企劃」查看。", "tag": "人生與頻道", "major": true, "choices": [{"label": "和觀眾分享成果", "note": "讓支持你的人一起見證。", "delta": {"bond": 4}, "life": {"finish": "archive"}}, {"label": "寫下幕後製作紀錄", "note": "留住學到的經驗。", "delta": {"skill": 4}, "life": {"finish": "archive"}}, {"label": "邀朋友一起慶祝", "note": "值得和朋友分享的日子。", "delta": {}, "life": {"finish": "archive", "contact": "star", "trust": 8}}], "queued": true}]);





const equipmentMultiplier=2.5;

function whole(value){return Math.sign(value)*Math.round(Math.abs(value))||0;}

function equipmentStats(p,topic){

 const matched=p.topics?.includes(topic);

 return {

  health:whole((p.health>0?p.health*equipmentMultiplier:p.health||0)+(matched?(p.topicHealth||0)*equipmentMultiplier:0)),

  wellbeingMood:p.skill>0?Math.max(1,whole(p.skill*equipmentMultiplier*4)):0,

  joy:(p.bond||0)+(matched?p.topicBond||0:0)>0?Math.max(1,whole(((p.bond||0)+(matched?p.topicBond||0:0))*equipmentMultiplier*4)):0

 };

}

function equipmentEffect(s,topic){let l=upgradeLife(s);return {income:l.completed.reduce((v,id)=>{let p=projects.find(p=>p.id===id);return v+(!p?.topics||p.topics.includes(topic)?(p?.income||0)*equipmentMultiplier:0)},0)};}

function setGoal(s,id){let l=upgradeLife(s),p=projects.find(p=>p.id===id);if(s.stage!=='end'&&!id){l.fund.goal=null;return true;}if(s.stage==='end'||!p||p.route&&p.route!==s.route||l.completed.includes(id)||l.project?.id===id)return false;l.fund.goal=id;return true;}

function setFundAuto(s,on){if(s.stage==='end'||typeof on!=='boolean')return false;upgradeLife(s).fund.auto=on;return true;}

function transferFund(s,amount){if(s.stage==='end'||!Number.isFinite(amount)||(!Number.isSafeInteger(Math.round(amount*100))||round(amount)!==amount)||amount===0)return false;let f=upgradeLife(s).fund;if(amount>0&&s.money<amount||amount<0&&f.balance<-amount)return false;s.money=round(s.money-amount);f.balance=round(f.balance+amount);return true;}

function fundInvestment(s,amount){let f=upgradeLife(s).fund;if(!f.auto||amount<=0)return;let v=round(Math.min(Math.max(0,s.money),amount));f.balance=round(f.balance+v);s.money=round(s.money-v);f.fromInvestments=round(f.fromInvestments+v);}

function goalInfo(s){let l=upgradeLife(s),f=l.fund,p=projects.find(p=>p.id===f.goal),cash=Math.max(0,s.money)+f.balance;return {project:p,balance:f.balance,cash,gap:p?Math.max(0,round(p.cost-cash)):0,portfolio:marketValue(s),upkeep:l.completed.reduce((v,id)=>v+(projects.find(p=>p.id===id)?.upkeep||0),0)};}



events.push({"id": "life_finish_pc", "title": "高效能直播電腦準備好了", "body": "完成測試與設定後，這項升級就能用在接下來的節目。它有持續費用，也需要適合的內容才能發揮。", "tag": "設備與創作", "major": true, "queued": true, "choices": [{"label": "準備首場升級節目", "note": "把設備變成觀眾能感受到的內容。", "delta": {"skill": 4}, "life": {"finish": "pc"}}, {"label": "先測試，再正式啟用", "note": "留一些時間熟悉新的工作流程。", "delta": {"health": 8}, "life": {"finish": "pc"}}, {"label": "邀朋友協助調整", "note": "一起磨合比一個人摸索更安心。", "delta": {}, "life": {"finish": "pc", "contact": "star", "trust": 8}}]});



events.push({"id": "life_finish_dualpc", "title": "雙電腦直播工作站準備好了", "body": "完成測試與設定後，這項升級就能用在接下來的節目。它有持續費用，也需要適合的內容才能發揮。", "tag": "設備與創作", "major": true, "queued": true, "choices": [{"label": "準備首場升級節目", "note": "把設備變成觀眾能感受到的內容。", "delta": {"skill": 4}, "life": {"finish": "dualpc"}}, {"label": "先測試，再正式啟用", "note": "留一些時間熟悉新的工作流程。", "delta": {"health": 8}, "life": {"finish": "dualpc"}}, {"label": "邀朋友協助調整", "note": "一起磨合比一個人摸索更安心。", "delta": {}, "life": {"finish": "dualpc", "contact": "star", "trust": 8}}]});



events.push({"id": "life_finish_acoustic", "title": "錄音空間隔音處理準備好了", "body": "完成測試與設定後，這項升級就能用在接下來的節目。它有持續費用，也需要適合的內容才能發揮。", "tag": "設備與創作", "major": true, "queued": true, "choices": [{"label": "準備首場升級節目", "note": "把設備變成觀眾能感受到的內容。", "delta": {"skill": 4}, "life": {"finish": "acoustic"}}, {"label": "先測試，再正式啟用", "note": "留一些時間熟悉新的工作流程。", "delta": {"health": 8}, "life": {"finish": "acoustic"}}, {"label": "邀朋友協助調整", "note": "一起磨合比一個人摸索更安心。", "delta": {}, "life": {"finish": "acoustic", "contact": "star", "trust": 8}}]});



events.push({"id": "life_finish_ku100", "title": "KU100 雙耳收音套組準備好了", "body": "完成測試與設定後，這項升級就能用在接下來的節目。它有持續費用，也需要適合的內容才能發揮。", "tag": "設備與創作", "major": true, "queued": true, "choices": [{"label": "準備首場升級節目", "note": "把設備變成觀眾能感受到的內容。", "delta": {"skill": 4}, "life": {"finish": "ku100"}}, {"label": "先測試，再正式啟用", "note": "留一些時間熟悉新的工作流程。", "delta": {"health": 8}, "life": {"finish": "ku100"}}, {"label": "邀朋友協助調整", "note": "一起磨合比一個人摸索更安心。", "delta": {}, "life": {"finish": "ku100", "contact": "star", "trust": 8}}]});



events.push({"id": "life_finish_model3d", "title": "專屬角色 3D 化準備好了", "body": "完成測試與設定後，這項升級就能用在接下來的節目。它有持續費用，也需要適合的內容才能發揮。", "tag": "設備與創作", "major": true, "queued": true, "choices": [{"label": "準備首場升級節目", "note": "把設備變成觀眾能感受到的內容。", "delta": {"skill": 4}, "life": {"finish": "model3d"}}, {"label": "先測試，再正式啟用", "note": "留一些時間熟悉新的工作流程。", "delta": {"health": 8}, "life": {"finish": "model3d"}}, {"label": "邀朋友協助調整", "note": "一起磨合比一個人摸索更安心。", "delta": {}, "life": {"finish": "model3d", "contact": "star", "trust": 8}}]});



events.push({"id": "life_finish_mocap", "title": "全身動捕設備準備好了", "body": "完成測試與設定後，這項升級就能用在接下來的節目。它有持續費用，也需要適合的內容才能發揮。", "tag": "設備與創作", "major": true, "queued": true, "choices": [{"label": "準備首場升級節目", "note": "把設備變成觀眾能感受到的內容。", "delta": {"skill": 4}, "life": {"finish": "mocap"}}, {"label": "先測試，再正式啟用", "note": "留一些時間熟悉新的工作流程。", "delta": {"health": 8}, "life": {"finish": "mocap"}}, {"label": "邀朋友協助調整", "note": "一起磨合比一個人摸索更安心。", "delta": {}, "life": {"finish": "mocap", "contact": "star", "trust": 8}}]});



events.push({"id": "life_finish_camera", "title": "高畫質相機與燈光準備好了", "body": "完成測試與設定後，這項升級就能用在接下來的節目。它有持續費用，也需要適合的內容才能發揮。", "tag": "設備與創作", "major": true, "queued": true, "choices": [{"label": "準備首場升級節目", "note": "把設備變成觀眾能感受到的內容。", "delta": {"skill": 4}, "life": {"finish": "camera"}}, {"label": "先測試，再正式啟用", "note": "留一些時間熟悉新的工作流程。", "delta": {"health": 8}, "life": {"finish": "camera"}}, {"label": "邀朋友協助調整", "note": "一起磨合比一個人摸索更安心。", "delta": {}, "life": {"finish": "camera", "contact": "star", "trust": 8}}]});

projects.find(p=>p.id==='ku100').followup='gear_story_ku100';

events.push({"id": "gear_story_ku100", "title": "第一次用 KU100 做整場企劃", "body": "觀眾注意到新的聲音層次，但收音也讓小小的環境聲更明顯。", "tag": "設備後續", "queued": true, "major": true, "choices": [{"label": "用新設備做專屬聲音企劃", "note": "把心力花在內容設計。", "delta": {"fans": 250, "health": -8, "bond": 8}}, {"label": "先熟悉收音位置", "note": "慢慢建立自己的操作習慣。", "delta": {"skill": 12, "bond": 5}}, {"label": "公布幕後設定與製作過程", "note": "讓觀眾看見這筆投入的過程。", "delta": {"fans": 100, "joy": 8}}]});

projects.find(p=>p.id==='model3d').followup='gear_story_model3d';

events.push({"id": "gear_story_model3d", "title": "3D 初披露的排練日", "body": "角色終於能走進空間。你要怎麼安排大家第一次看到的演出？", "tag": "設備後續", "queued": true, "major": true, "choices": [{"label": "製作正式初披露節目", "note": "支付 2,000 排練與製作費，吸引 500 追蹤。", "delta": {"money": -2000, "fans": 500, "health": -8}}, {"label": "用免費的小型測試台見面", "note": "先把新的姿態分享給熟客。", "delta": {"fans": 120, "bond": 10}}, {"label": "公開製作日誌", "note": "聊聊等待與磨合的故事。", "delta": {"fans": 80, "joy": 10}}]});

projects.find(p=>p.id==='pc').followup='gear_story_pc';

events.push({"id": "gear_story_pc", "title": "新電腦，新的企劃清單", "body": "以前跑不順的遊戲與創作流程，現在終於能認真試一試。", "tag": "設備後續", "queued": true, "major": true, "choices": [{"label": "安排挑戰遊戲特輯", "note": "投入練習，給新觀眾一個入口。", "delta": {"fans": 100, "health": -5}}, {"label": "重新整理剪輯流程", "note": "省下反覆等待的時間。", "delta": {"skill": 10}}, {"label": "陪觀眾測試新設備", "note": "一起見證創作環境的改變。", "delta": {"bond": 8, "joy": 5}}]});





const shows=[

{id:'talk',name:'觀眾來信特輯',topic:'chat',cost:300,need:2,gear:[],desc:'把熟客的故事編成一場節目。'},

{id:'audio',name:'沉浸式聲音劇場',topic:'asmr',cost:3000,need:3,gear:['ku100'],desc:'寫劇本、設計聲音，完成一部聲音作品。'},

{id:'dance',name:'3D 舞蹈公演',topic:'music',cost:6000,need:4,gear:['model3d','mocap'],desc:'排練走位與舞蹈，正式登上虛擬舞台。'},

{id:'game',name:'大型遊戲挑戰企劃',topic:'game',cost:1500,need:3,gear:['pc'],desc:'測試路線、練習關卡，挑戰自己的紀錄。'},

{id:'film',name:'實景音樂短片',topic:'music',cost:4000,need:3,gear:['camera'],desc:'規劃鏡位與排練，留下鏡頭前的作品。'}];

const workModes=[{id:'salary',name:'正職工作＋兼職直播',desc:'週一至週五上班，週末依生活方針安排直播。每 30 天結算正職薪資。'},{id:'part',name:'全職直播＋兼職工作',desc:'一般開台廣告分成 +15%、新增訂閱 +25%；依生活方針安排兼職。'},{id:'full',name:'全職主播',desc:'開台新增追蹤 +25%、收入 +15%；不安排兼職。'},{id:'semi',name:'半退休',desc:'50 歲開放。開台少耗 2 體力、收益與新增追蹤減少 30%；生活開銷照常。'}];

function upgradeCareer(s){journeyState(s);storyState(s);progressState(s);dreamState(s);if(s.career)return s.career;s.career={mode:'part',changed:-30,home:'original',partner:0,care:0,lastFamily:-1,production:null,works:[],totalWorks:0,feedback:[],viewers:[{name:'小雨',likes:'chat',loyalty:45,status:'常來',lastVisit:s.day,memory:'喜歡陪伴型的節目。'},{name:'阿湛',likes:'game',loyalty:30,status:'常來',lastVisit:s.day,memory:'期待看你挑戰新遊戲。'},{name:'眠眠',likes:'asmr',loyalty:35,status:'常來',lastVisit:s.day,memory:'常在睡前來聽聲音。'}],promise:null};return s.career;}

function crewInfo(s,id){let p=upgradeLife(s).contacts.find(p=>p.id===id);if(!p||p.role==='熟客')return null;let d={qing:{topic:'chat',style:'重視溝通',offset:0},milo:{topic:'game',style:'喜歡挑戰',offset:1},star:{topic:'asmr',style:'在意細節',offset:2}}[id];return {...p,...d,available:s.day>=(dreamState(s).breakUntil[id]||0)&&(s.day+d.offset)%7<4};}

function showStatus(s,id){let c=upgradeCareer(s),p=shows.find(p=>p.id===id);return !p?'未知企劃':!['focus','event','result'].includes(s.stage)?'目前無法開始':c.production?'已有節目製作中':p.gear.some(g=>!s.life.completed.includes(g))?'需要 '+p.gear.filter(g=>!s.life.completed.includes(g)).map(g=>projects.find(p=>p.id===g).name).join('、'):s.money<p.cost?'可用現金不足':'';}

function startShow(s,id,crew=''){if(showStatus(s,id))return false;let p=shows.find(p=>p.id===id),member=crew&&crewInfo(s,crew);if(crew&&(!member||member.trust<40||!member.available))return false;apply(s,{money:-p.cost},'節目製作 '+p.name);s.career.production={id,crew,prep:0,rehearsal:0,started:s.day,spent:p.cost};record(s,{title:'開始製作：'+p.name,choice:crew?'邀請'+member.name:'獨立製作',text:'準備完成後，還需要選擇排練與正式播出。'});return true;}

function workShow(s,action){let c=upgradeCareer(s),w=c.production,p=w&&shows.find(p=>p.id===w.id);if(s.stage!=='focus'||!p||!['prepare','rehearse','publish','cancel'].includes(action))return false;

 if(action==='cancel'){if(w.crew){let m=s.life.contacts.find(v=>v.id===w.crew);m.trust=Math.max(0,m.trust-5);m.memory='企劃取消了，期待下次能早點協調。';}c.production=null;record(s,{title:'取消：'+p.name,choice:'停止製作',text:'已支付的製作成本不退還。'});return true;}

 let plan=showPlan(s),need=plan.need;

 if(action==='publish'&&w.prep<need||action==='prepare'&&w.prep>=need||action==='rehearse'&&(w.prep<need||w.rehearsal>=2)||action!=='publish'&&s.money<120)return false;

 if(action!=='publish'){if(!focus(s,'learn'))return false;w[action==='prepare'?'prep':'rehearsal']++;w.spent+=120;record(s,{title:p.name,choice:action==='prepare'?'準備內容':'排練節目',text:`準備 ${w.prep}/${need}，排練 ${w.rehearsal}/2。今天的生活與學習費已結算。`});return true;}

 return beginLive(s);

}

function finishLive(s){let c=upgradeCareer(s),live=c.live,w=c.production,p=shows.find(v=>v.id===w.id),plan=showPlan(s);
 trackSecretStream(s,p.topic);

 let m=w.crew&&s.life.contacts.find(v=>v.id===w.crew),crew=w.crew&&crewInfo(s,w.crew),chemistry=m?(m.trust>=60?10:3)+(crew.topic===p.topic?8:0):0;



 let failed=!!plan.risk&&rand(s)<Math.max(.03,plan.risk-w.rehearsal*.06);let energyPenalty=w.id==='dance'&&s.health<45?15:0;apply(s,{health:plan.health});dreamState(s).counts.producer+=3;

 let score=Math.round(clamp(live.quality+plan.score-energyPenalty-(failed?25:0)+35+s.skill*.3+w.rehearsal*12+chemistry+rand(s)*15,0,100)),revenue=Math.round(platformRevenue(300+s.fans*.6)*streamIncomeFactor(s)*(.35+score/100)*Math.max(.4,1+live.revenue/100)*(s.flags.includes('agency')?.75:1)),fans=Math.round(score*plan.fans*Math.max(.4,live.retention/70)*(p.id==='talk'?1:3));apply(s,{money:revenue,fans,joy:score>=70?4:-2},'平台分成');const donation=rollDonation(s);s.lastChannelIncome={platform:revenue,donation};

 let review=score>=85?'觀眾願意反覆回看':score>=65?'找到自己的亮點':'還需要再磨合';addWork(s,{title:p.name,kind:'節目',score,revenue,cost:w.spent,crew:m?.name||'獨立',live:{atmosphere:live.atmosphere,retention:live.retention,choices:live.log},review:review+' · '+plan.name+(failed?'（現場失誤，仍完成演出）':'')});

 if(m){remember(s,m.name,'我們一起完成了'+p.name+'。');m.trust=clamp(m.trust+(score>=65?8:-10),0,100);m.lastDay=s.day;m.memory=score>=65?'一起完成了'+p.name+'，期待下次合作。':'這次節奏不太合，下次需要更多排練。';}

 s.stage=live.pendingStage;s.eventId=live.pendingEvent;c.live=null;record(s,{title:'播出：'+p.name,choice:review,text:`評價 ${score}/100，節目結算收入 ${revenue}，斗內 ${donation}，累計製作費 ${w.spent}。`});c.production=null;if(s.stage==='result')s.lastResult=`${review}，評價 ${score}/100。節目收入 ${revenue}，斗內 ${donation}，累計製作費 ${w.spent}。`;checkMilestones(s);return true;

}

function addWork(s,w){let st=storyState(s);if(w.kind==='節目'&&(!st.best||w.score>st.best.score))st.best={title:w.title,score:w.score,day:s.day};let c=upgradeCareer(s);c.totalWorks++;c.works.unshift({day:s.day,...w});c.works=c.works.slice(0,100);}

function careerAction(s,kind,value){let c=upgradeCareer(s);if(s.stage!=='focus')return false;

 if(kind==='mode'){if(!workModes.some(m=>m.id===value)||value===c.mode||s.day-c.changed<30||value==='semi'&&ageNow(s)<50)return false;if(value==='semi')c.mode=value;else setWorkMode(s,value);c.changed=s.day;record(s,{title:'人生安排',choice:workModes.find(m=>m.id===value).name,text:'30 天後可再次調整。'});return true;}

 if(kind==='agency'){if(s.day-c.changed<30)return false;let joined=s.flags.includes('agency');if(value==='join'&&(joined||s.fans<300))return false;if(value==='leave'&&(!joined||s.money<3000))return false;if(!['join','leave'].includes(value))return false;s.flags=s.flags.filter(f=>!['agency','indie'].includes(f));s.flags.push(value==='join'?'agency':'indie');if(value==='leave')apply(s,{money:-3000},'離開團隊整理費');c.changed=s.day;record(s,{title:'事業選擇',choice:value==='join'?'加入團隊':'結束團隊合作',text:value==='join'?'曝光增加 25%，頻道與節目收入分成 25%；時事內容需改為雜談。':'支付 3,000 解約整理費，恢復內容自主。'});return true;}

 if(kind==='home'){if(c.home==='quiet'||s.money<8000)return false;apply(s,{money:-8000},'搬入安靜住處');c.home='quiet';record(s,{title:'搬家',choice:'搬入安靜的住處',text:'每日生活費增加 25，休息額外恢復 2 體力。'});return true;}

 if(kind==='family'){if(!['partner','care'].includes(value)||value==='partner'&&ageNow(s)<25||c.lastFamily===s.day)return false;c.lastFamily=s.day;c[value]=Math.min(100,c[value]+12);focus(s,'rest');record(s,{title:value==='partner'?'螢幕之外的伴侶':'陪家人度過今天',choice:'安排陪伴',text:value==='partner'?'關係慢慢建立，並不取代你的創作人生。':'留出照顧與相處的時間。'});apply(s,{joy:3});return true;}

 return false;

}

function makePromise(s,topic){let c=upgradeCareer(s);if(s.stage!=='focus'||c.promise||!contents.some(v=>v.id===topic))return false;c.promise={topic,due:s.day+14};return true;}

function audienceVisit(s,topic){if(s.day>=3600&&s.career.viewers.some(v=>v.likes===topic&&v.loyalty>=40))progressState(s).decade=true;dreamBroadcast(s,topic);let c=upgradeCareer(s);for(let v of c.viewers){let liked=v.likes===topic;v.loyalty=clamp(v.loyalty+(liked?5:-1),0,100);if(liked){v.memory=v.status==='淡出'?'看到熟悉的內容，我又回來了。':'今天的節目正是我喜歡的！';v.status='常來';v.lastVisit=s.day;}else if(v.loyalty<15){v.status='淡出';v.memory='最近的方向不太適合我，先偶爾看回放。';}}

 if(c.promise?.topic===topic){apply(s,{bond:3});c.feedback.unshift('你完成了答應觀眾的節目。');remember(s,'小雨','你如期完成了答應大家的節目。');storyState(s).kept++;c.promise=null;}c.feedback=c.feedback.slice(0,12);

}

function careerTick(s){let c=upgradeCareer(s);if(c.promise&&s.day>c.promise.due){apply(s,{bond:-3});c.feedback.unshift('預告的節目沒有如期出現，觀眾有些失望。');remember(s,'小雨','上次預告沒能如期出現；希望下次有變動時先告訴我們。');storyState(s).missed++;c.promise=null;}if(s.day%30===0){c.partner=Math.max(0,c.partner-2);c.care=Math.max(0,c.care-2);}c.feedback=c.feedback.slice(0,12);}

function parseSave(raw){

 if(typeof raw!=='string'||raw.length>8000000)throw Error('檔案過大或不是文字存檔。');let o=JSON.parse(raw),s=o.format==='nextstream-save'?o.state:o;

 if(!valid(s))throw Error('不是可讀取的主播人生存檔。');migrate(s,s.gender);

 if(s.broadcastCounts!==undefined&&(!s.broadcastCounts||!contents.every(c=>Number.isSafeInteger(s.broadcastCounts[c.id])&&s.broadcastCounts[c.id]>=0)))throw Error('開台次數資料不完整。');

 if(s.incomeEntries!==undefined&&(!Array.isArray(s.incomeEntries)||s.incomeEntries.length>40||!s.incomeEntries.every(r=>r&&Number.isSafeInteger(r.day)&&r.day>=0&&Number.isFinite(r.amount)&&r.amount>=0&&typeof r.reason==='string')))throw Error('入帳紀錄資料不完整。');

 const finite=n=>typeof n==='number'&&Number.isFinite(n),l=s.life,c=s.career;

 if(s.activityQueue&&(!Array.isArray(s.activityQueue)||s.activityQueue.length>4||!s.activityQueue.every(a=>['social','workShow','careerAction'].includes(a.kind)&&typeof a.value==='string'&&typeof a.extra==='string')))throw Error('稍後活動資料不完整。');

 const cr=s.credit;if(cr&&(!Array.isArray(cr.loans)||cr.loans.length>2||!Number.isSafeInteger(cr.nextId)||cr.home&&(!homes.some(h=>h.id===cr.home.id)||!Number.isFinite(cr.home.price))||!cr.loans.every(l=>['personal','mortgage'].includes(l.kind)&&['id','due','months','missed'].every(k=>Number.isSafeInteger(l[k]))&&['balance','original','apr','payment','paid'].every(k=>Number.isFinite(l[k])&&l[k]>=0)&&l.apr<=1&&typeof l.purpose==='string')))throw Error('房屋與貸款資料不完整。');

 const lv=s.living;if(lv&&(!['mood','physical','paid'].every(k=>Number.isFinite(lv[k])&&lv[k]>=0)||lv.mood>100||lv.physical>100||!Number.isSafeInteger(lv.nextBill)||!lv.levels||!livingCategories.every(c=>[0,1,2].includes(lv.levels[c.id]))||!lv.services||!Object.values(lv.services).every(v=>Number.isSafeInteger(v))))throw Error('生活與健康資料不完整。');if(lv?.autoCare&&!Object.entries(lv.autoCare).every(([id,a])=>lifeServices.some(p=>p.id===id)&&typeof a.on==='boolean'&&[7,14,30].includes(a.every)&&Number.isSafeInteger(a.due)))throw Error('自動照顧設定不完整。');

 const mg=s.management;if(mg&&(!['community','craft','business'].includes(mg.focus)||!Array.isArray(mg.riskLog)||mg.riskLog.length>24||!mg.riskLog.every(r=>Number.isSafeInteger(r.day)&&typeof r.title==='string'&&Number.isFinite(r.loss))||mg.contract&&(!Number.isSafeInteger(mg.contract.due)||!Number.isFinite(mg.contract.started))))throw Error('經營資料不完整。');

 if(s.membership?.schema===2&&(!Number.isSafeInteger(s.membership.count)||s.membership.count<0||typeof s.membership.unlocked!=='boolean'||!Number.isSafeInteger(s.membership.due)))throw Error('獨立會員資料不完整。');

 const member=s.membership;if(member&&(!member.members||Array.isArray(member.members)||!Number.isFinite(member.total)||member.total<0||!Object.values(member.members).every(r=>Number.isSafeInteger(r.since)&&Number.isSafeInteger(r.due)&&Number.isFinite(r.paid)&&r.paid>=0)))throw Error('會員資料不完整。');

 const cal=s.personalCalendar;if(cal&&(!validDate(cal.birthday)||!validDate(cal.debut)||!Number.isSafeInteger(cal.anchor)||!Array.isArray(cal.seen)||cal.seen.length>30||!cal.seen.every(k=>typeof k==='string')))throw Error('紀念日設定不完整。');if(s.plan&&!setLifePlan(s,s.plan))throw Error('生活方針不完整。');

 const j=s.journey;if(!j||!Number.isSafeInteger(j.since)||!['voice','privacy','streak'].every(k=>finite(j[k])&&j[k]>=0)||j.voice>100||j.privacy>100||typeof j.lastTopic!=='string'||!j.counts||!Object.values(j.counts).every(v=>Number.isSafeInteger(v)&&v>=0)||!Array.isArray(j.memories)||j.memories.length>32||!j.memories.every(m=>Number.isSafeInteger(m.day)&&typeof m.name==='string'&&typeof m.text==='string')||!Array.isArray(j.chat)||j.chat.length>8||!j.chat.every(m=>typeof m.name==='string'&&typeof m.text==='string')||j.last&&(!Number.isSafeInteger(j.last.day)||typeof j.last.title!=='string'||typeof j.last.text!=='string'||!finite(j.last.gain)))throw Error('開台安排與相處記憶資料不完整。');

 const st=s.story;if(!st||typeof st.arcs!=='object'||st.arcs===null||Array.isArray(st.arcs)||!Object.entries(st.arcs).every(([id,a])=>storyArcs.some(x=>x.id===id)&&a&&Number.isInteger(a.choice)&&a.choice>=0&&a.choice<3&&Number.isSafeInteger(a.due)&&typeof a.done==='boolean')||!Array.isArray(st.memories)||st.memories.length>24||!st.memories.every(m=>typeof m.name==='string'&&typeof m.text==='string'&&Number.isSafeInteger(m.day))||!Number.isSafeInteger(st.kept)||!Number.isSafeInteger(st.missed)||typeof st.details!=='boolean'||st.firstLive!==null&&!Number.isSafeInteger(st.firstLive)||st.best&&(!finite(st.best.score)||typeof st.best.title!=='string'))throw Error('人生記憶資料不完整。');

 if(s.stage==='broadcast'&&(!c.production||!c.live||!Number.isInteger(c.live.step)||c.live.step<0||c.live.step>2||!['event','result'].includes(c.live.pendingStage)||c.live.pendingStage==='event'&&!events.some(e=>e.id===c.live.pendingEvent)||!['quality','atmosphere','retention','revenue'].every(k=>finite(c.live[k]))||!Array.isArray(c.live.log)))throw Error('直播現場資料不完整。');

 if(!s.dream||!s.dream.counts||!['comfort','tech','producer'].every(k=>finite(s.dream.counts[k])&&s.dream.counts[k]>=0)||!Array.isArray(s.dream.effects)||!s.dream.effects.every(e=>finite(e.until)&&finite(e.income)&&finite(e.gain))||!Array.isArray(s.dream.turns)||!s.dream.breakUntil||!finite(s.dream.lastLive))throw Error('風格與持續事件資料不完整。');

 if(!l||!Array.isArray(l.contacts)||l.contacts.length!==4||!l.contacts.every(p=>['rain','qing','milo','star'].includes(p.id)&&finite(p.trust))||!Array.isArray(l.completed)||!l.completed.every(id=>projects.some(p=>p.id===id))||!l.audience||!contents.every(v=>finite(l.audience[v.id]))||!l.fund||!finite(l.fund.balance)||l.fund.balance<0||!Array.isArray(l.queue)||!l.queue.every(q=>events.some(e=>e.id===q.id)&&Number.isSafeInteger(q.due))||l.project&&(!projects.some(p=>p.id===l.project.id)||!Number.isSafeInteger(l.project.due)))throw Error('存檔的企劃或資產資料不完整。');

 if(!['original','quiet'].includes(c.home)||!['partner','care','lastFamily','changed','totalWorks'].every(k=>finite(c[k]))||c.promise&&(!contents.some(v=>v.id===c.promise.topic)||!Number.isSafeInteger(c.promise.due)))throw Error('生活安排資料不完整。');

 if(!['balance','fromInvestments','spent'].every(k=>finite(l.fund[k]))||typeof l.fund.auto!=='boolean'||!l.equipmentStats||!['income','maintenance'].every(k=>finite(l.equipmentStats[k]))||!finite(l.reputation)||!s.graph.every(finite)||!s.peers.every(p=>finite(p.fans)&&finite(p.pace))||s.stage==='result'&&(!s.history.length||!s.lastChanges)||s.stage==='end'&&!s.summary)throw Error('存檔的數值資料不完整。');

 if(!c||!workModes.some(m=>m.id===c.mode)||!Array.isArray(c.works)||c.works.length>100||!Array.isArray(c.viewers)||c.viewers.length!==3||!c.viewers.every(v=>finite(v.loyalty))||!Array.isArray(c.feedback)||c.production&&(!shows.some(p=>p.id===c.production.id)||!finite(c.production.prep)||!finite(c.production.rehearsal)||c.production.crew&&!['qing','milo','star'].includes(c.production.crew)))throw Error('存檔的節目或生活資料不完整。');if(new Set(l.contacts.map(v=>v.id)).size!==4||!c.works.every(w=>Number.isSafeInteger(w.day)&&typeof w.title==='string'&&(w.score===undefined||['score','revenue','cost'].every(k=>finite(w[k]))))||!s.market.bars||!s.market.quotes||!assets.every(a=>Array.isArray(s.market.bars[a.id])&&s.market.bars[a.id].length>0&&s.market.bars[a.id].every(b=>finite(b.close)&&Number.isSafeInteger(b.day)&&(b.legacy||['open','high','low','volume'].every(k=>finite(b[k]))))&&finite(s.market.quotes[a.id]?.volume)))throw Error('作品或行情資料不完整。');return s;

}





const directions={

 talk:[{id:'letters',name:'匿名來信・慢慢聽',desc:'少量故事深入回應；評價 +6，吸引陪伴型觀眾。',score:6,health:0,fans:.9},{id:'debate',name:'聊天室即興問答',desc:'臨場互動；追蹤 +25%，評價波動較大。',score:0,health:-2,fans:1.25,risk:.2}],

 audio:[{id:'sleep',name:'月光晚安劇本',desc:'慢節奏、柔和環境聲；評價 +8，較省體力。',score:8,health:1,fans:1},{id:'journey',name:'夢境冒險音效劇',desc:'多場景聲音設計；製作多 1 天、追蹤 +35%，需要排練。',score:10,health:-3,fans:1.35,extra:1,risk:.15}],

 dance:[{id:'gentle',name:'抒情組曲・定點走位',desc:'保留體力，表演較穩；評價 +5。',score:5,health:0,fans:1},{id:'medley',name:'高強度串燒・全場走位',desc:'體力不足 45 時扣評價；額外耗 8 體力，追蹤 +45%。',score:12,health:-8,fans:1.45,risk:.2}],

 game:[{id:'guide',name:'觀眾陪跑・攻略解說',desc:'穩定完成，展示技術與解說；評價 +5。',score:5,health:-1,fans:1},{id:'hard',name:'高難度・一命挑戰',desc:'成功更吸睛，失敗也留下作品；追蹤 +50%，有 30% 失誤機率。',score:12,health:-5,fans:1.5,risk:.3}],

 film:[{id:'room',name:'室內單鏡・細膩演唱',desc:'專注演唱，製作較穩；評價 +6。',score:6,health:-1,fans:1},{id:'location',name:'外景敘事・多鏡剪輯',desc:'拍攝多 1 天、額外耗 5 體力，追蹤 +35%。',score:10,health:-5,fans:1.35,extra:1,risk:.2}]

};

function dreamState(s){if(!s.dream)s.dream={counts:{comfort:0,tech:0,producer:0},effects:[],turns:[],breakUntil:{},lastLive:s.day};return s.dream;}

function channelStyle(s){let d=dreamState(s),labels={comfort:'陪伴型',tech:'技術派',producer:'企劃型'},top=Object.entries(d.counts).sort((a,b)=>b[1]-a[1])[0];return {id:top[0],name:top[1]<5?'正在找自己的風格':labels[top[0]],level:Math.min(3,Math.floor(top[1]/10)),counts:d.counts};}

function chooseDirection(s,id){let w=upgradeCareer(s).production;if(!['focus','event','result'].includes(s.stage)||!w||w.prep>0||!directions[w.id].some(t=>t.id===id))return false;w.direction=id;return true;}

function showPlan(s){let w=upgradeCareer(s).production;if(!w)return null;let p=shows.find(v=>v.id===w.id),t=directions[w.id].find(t=>t.id===w.direction)||directions[w.id][0];return {...t,need:p.need+(t.extra||0)};}

function dreamBroadcast(s,topic){let d=dreamState(s),k=['chat','asmr'].includes(topic)?'comfort':['game','art'].includes(topic)?'tech':'producer';d.counts[k]++;d.lastLive=s.day;}

function dreamEffect(s,key){return dreamState(s).effects.filter(e=>e.until>s.day).reduce((n,e)=>n+(e[key]||0),0);}

function dreamChoice(s,e,c){let d=dreamState(s),x=c.dream;if(!x)return;if(x.effect){d.effects=d.effects.filter(e=>e.id!==x.effect.id);d.effects.push({...x.effect,until:s.day+x.days});}if(x.break)d.breakUntil[x.break]=s.day+x.days;d.turns.unshift({day:s.day,title:e.title,choice:c.label});d.turns=d.turns.slice(0,40);}

function dreamRecap(s){let c=upgradeCareer(s),w=c.works.filter(w=>w.kind==='節目').sort((a,b)=>b.score-a.score),friends=s.life.contacts.slice().sort((a,b)=>b.trust-a.trust);return {style:channelStyle(s).name,best:w.slice(0,3),friend:friends[0],turns:dreamState(s).turns.slice(0,8),profit:c.works.reduce((n,w)=>n+(w.revenue||0)-(w.cost||0),0)};}

function dreamToday(s){let c=upgradeCareer(s),w=c.production,upkeep=goalInfo(s).upkeep,d=dreamState(s),out=[];if(w)out.push({title:'製作中：'+shows.find(p=>p.id===w.id).name,text:`準備 ${w.prep}/${showPlan(s).need} · 排練 ${w.rehearsal}/2`,target:'studio'});if(c.promise)out.push({title:'觀眾還記得你的預告',text:`${contents.find(p=>p.id===c.promise.topic).name} · 剩 ${Math.max(0,c.promise.due-s.day)} 天`,target:'studio'});if(s.stage==='event')out.push({title:'有一個決定正在等你',text:event(s).title,target:'story'});if(s.life.project)out.push({title:'設備企劃進行中',text:projects.find(p=>p.id===s.life.project.id).name+' · 還有 '+Math.max(0,s.life.project.due-s.day)+' 天',target:'career'});out.push({title:'生活預備金',text:`現金約可負擔 ${Math.max(0,Math.floor(s.money/(costs(s)+upkeep)))} 天固定費用（未計收入／突發支出）`,target:'market'});for(let e of d.effects.filter(e=>e.until>s.day))out.push({title:e.name,text:`還有 ${e.until-s.day} 天 · 開台收益 ${e.income>=0?'+':''}${Math.round((e.income||0)*100)}% · 新增追蹤 ${e.gain>=0?'+':''}${Math.round((e.gain||0)*100)}%`,target:'story'});return out;}





function dreamGate(s,g){return g==='fans'?s.fans>=300:g==='later'?s.day>=60:g==='hiatus'?s.day-dreamState(s).lastLive>=30:g==='friend'?(s.life.contacts[1].trust>=40||channelStyle(s).id==='comfort'&&channelStyle(s).level>=1):g==='senior'?s.day>=1080:g==='partner'?s.career.partner>=24:g==='adult'?ageNow(s)>=30:true;}

events.push(...[{"id": "dream_viral", "tag": "夢境生活・轉折", "title": "爆紅之後，聊天室變得陌生", "body": "新觀眾大量湧入，熟客卻開始跟不上。接下來兩週，你想怎麼接住這波關注？", "major": true, "dreamGate": "fans", "choices": [{"label": "安排新觀眾入門企劃", "note": "14 天新增追蹤 +30%，收入 +10%。", "delta": {"health": -8}, "dream": {"effect": {"id": "viral", "name": "新觀眾引導", "income": 0.1, "gain": 0.3}, "days": 14}}, {"label": "繼續原本的慢節奏", "note": "7 天收入與成長小幅增加，保留熟客感。", "delta": {"bond": 8}, "dream": {"effect": {"id": "viral", "name": "熟悉的直播間", "income": 0.05, "gain": 0.1}, "days": 7}}, {"label": "加開場次追熱度", "note": "7 天成長 +60%、收入 +25%，體力消耗很大。", "delta": {"health": -30}, "dream": {"effect": {"id": "viral", "name": "短期熱潮", "income": 0.25, "gain": 0.6}, "days": 7}}]}, {"id": "dream_platform", "tag": "夢境生活・轉折", "title": "平台更新了推薦方式", "body": "你的節目突然少了曝光。改版不只改變數字，也打亂了原本的工作節奏。", "major": true, "dreamGate": "later", "choices": [{"label": "剪輯短版重新找到觀眾", "note": "支付 600，7 天內新增追蹤 -10%。", "delta": {"money": -600}, "dream": {"effect": {"id": "platform", "name": "調整中的推薦", "income": 0, "gain": -0.1}, "days": 7}}, {"label": "先穩定更新，觀察變化", "note": "14 天收入 -10%、新增追蹤 -25%。", "delta": {}, "dream": {"effect": {"id": "platform", "name": "平台改版", "income": -0.1, "gain": -0.25}, "days": 14}}, {"label": "邀朋友交叉宣傳", "note": "14 天新增追蹤 +10%，花一些心力聯絡。", "delta": {"health": -12}, "dream": {"effect": {"id": "platform", "name": "朋友的推薦", "income": 0, "gain": 0.1}, "days": 14}}]}, {"id": "dream_sponsor", "tag": "夢境生活・轉折", "title": "業配剪輯引發了誤會", "body": "片段離開完整內容後，被解讀成你從未說過的承諾。你需要處理接下來一段時間的信任。", "major": true, "dreamGate": "fans", "choices": [{"label": "公開資料並更正說明", "note": "7 天收入 -15%，逐步修復信任。", "delta": {"health": -8}, "dream": {"effect": {"id": "trust", "name": "澄清與修復", "income": -0.15, "gain": 0}, "days": 7}}, {"label": "暫停合作，重新檢查流程", "note": "支出 500，14 天收入 -10%。", "delta": {"money": -500, "bond": 8}, "dream": {"effect": {"id": "trust", "name": "整理合作流程", "income": -0.1, "gain": 0}, "days": 14}}, {"label": "不回應，照常開台", "note": "21 天收入 -30%、新增追蹤 -20%。", "delta": {"bond": -12}, "dream": {"effect": {"id": "trust", "name": "尚未釐清的爭議", "income": -0.3, "gain": -0.2}, "days": 21}}]}, {"id": "dream_break", "tag": "夢境生活・轉折", "title": "隔了一陣子，重新打開直播間", "body": "你很久沒有開台，熟悉的待機畫面還在。復播要先向誰說第一句話？", "major": true, "dreamGate": "hiatus", "choices": [{"label": "先和熟客慢慢聊", "note": "7 天成長 -10%，重新建立節奏。", "delta": {"bond": 10}, "dream": {"effect": {"id": "return", "name": "溫柔復播", "income": 0, "gain": -0.1}, "days": 7}}, {"label": "準備一場復出企劃", "note": "付 800，14 天成長 +20%。", "delta": {"money": -800}, "dream": {"effect": {"id": "return", "name": "復出企劃", "income": 0.1, "gain": 0.2}, "days": 14}}, {"label": "先開短台找回感覺", "note": "7 天收入 -15%，保留體力。", "delta": {"health": 10}, "dream": {"effect": {"id": "return", "name": "短台復健", "income": -0.15, "gain": 0}, "days": 7}}]}, {"id": "dream_qing", "tag": "夢境生活・轉折", "title": "青禾主動邀你做一季節目", "body": "青禾想改做陪伴型企劃，希望有熟悉的朋友一起嘗試。", "major": true, "dreamGate": "friend", "choices": [{"label": "答應一起籌備", "note": "14 天成長 +15%，增加默契。", "delta": {"network": 8}, "dream": {"effect": {"id": "invite", "name": "朋友的固定邀約", "income": 0, "gain": 0.15}, "days": 14}}, {"label": "幫忙介紹合適的人", "note": "維持關係，也保留自己的時間。", "delta": {"network": 5, "joy": 4}, "dream": {}}, {"label": "坦白說現在排不開", "note": "別讓承諾變成負擔。", "delta": {"health": 8}, "dream": {}}]}, {"id": "dream_milo", "tag": "夢境生活・轉折", "title": "米洛說，他想休息一個月", "body": "他最近總在比較數字。這次訊息不是聯動邀請，而是想有人聽他說完。", "major": true, "dreamGate": "later", "choices": [{"label": "陪他聊聊，支持休息", "note": "米洛 30 天沒有新合作檔期。", "delta": {"joy": 4}, "dream": {"break": "milo", "days": 30}}, {"label": "一起規劃低負擔的復出", "note": "米洛休息 14 天，你投入一些心力。", "delta": {"health": -8}, "dream": {"break": "milo", "days": 14}}, {"label": "告訴他，需要時都能找你", "note": "米洛休息 30 天。", "delta": {"bond": 4}, "dream": {"break": "milo", "days": 30}}]}, {"id": "dream_star", "tag": "夢境生活・轉折", "title": "晚星決定結束固定直播", "body": "晚星想把心力放在幕後創作。畢業不代表斷了聯絡，但你們需要適應新的相處方式。", "major": true, "dreamGate": "senior", "choices": [{"label": "做一場回憶特輯", "note": "90 天內不安排新合作，留下告別回憶。", "delta": {"joy": 6, "fans": 100}, "dream": {"break": "star", "days": 90}}, {"label": "私下寫一封信", "note": "讓告別保留一點安靜。", "delta": {"joy": 8}, "dream": {"break": "star", "days": 90}}, {"label": "約好之後再一起創作", "note": "先休息 45 天，再尋找新的合作方式。", "delta": {"network": 6}, "dream": {"break": "star", "days": 45}}]}, {"id": "dream_partner", "tag": "夢境生活・轉折", "title": "約好的晚餐，撞上重要直播", "body": "伴侶沒有要求你放棄創作，但希望彼此的時間不總是被排在最後。", "major": true, "dreamGate": "partner", "choices": [{"label": "調整直播，保留晚餐", "note": "7 天收入 -10%，生活得到喘息。", "delta": {"joy": 12}, "dream": {"effect": {"id": "home", "name": "留給生活的時間", "income": -0.1, "gain": 0}, "days": 7}}, {"label": "坦白討論，另約完整一天", "note": "花心力重新安排。", "delta": {"health": -4, "joy": 5}, "dream": {}}, {"label": "這次仍把工作放前面", "note": "疲憊與愧疚還需要之後處理。", "delta": {"joy": -10}, "dream": {"effect": {"id": "home", "name": "家庭與工作的拉扯", "income": -0.05, "gain": 0}, "days": 7}}]}, {"id": "dream_family", "tag": "夢境生活・轉折", "title": "家人需要你陪同回診", "body": "不是每一天都能照原本的排程走。你要怎麼把生活裡的重要事情排進去？", "major": true, "dreamGate": "adult", "choices": [{"label": "減少場次，親自陪同", "note": "14 天收入 -15%，換取陪伴的時間。", "delta": {"joy": 8}, "dream": {"effect": {"id": "care", "name": "照顧家人的日子", "income": -0.15, "gain": 0}, "days": 14}}, {"label": "請人協助，自己保留探望時間", "note": "支付 1,000，維持原本節奏。", "delta": {"money": -1000}, "dream": {}}, {"label": "和家人一起重排時間", "note": "7 天收入 -5%，減少手邊壓力。", "delta": {"health": -4}, "dream": {"effect": {"id": "care", "name": "重新安排生活", "income": -0.05, "gain": 0}, "days": 7}}]}]);



const milestones=[

{id:'first',name:'第一次按下開台',desc:'完成一次日常開台或正式企劃播出。',goal:1},

{id:'week',name:'七個晚安',desc:'走過七天的主播生活。',goal:7},

{id:'living',name:'靠創作付生活費',desc:'一次開台的頻道收入足以支付當日固定生活與維護費。',goal:1},

{id:'fans',name:'千人相遇',desc:'累積 1,000 位追蹤。',goal:1000},

{id:'show',name:'值得重播的作品',desc:'完成一場評價至少 80 的正式企劃。',goal:80},

{id:'ku',name:'把夢境送到耳邊',desc:'完成 KU100 設備企劃。',goal:1},

{id:'stage',name:'站上自己的舞台',desc:'完成一場 3D 舞蹈公演。',goal:1},

{id:'decade',name:'十年後的晚安',desc:'十年後再次開台，仍有熟悉度 40 以上的觀眾喜歡當天的內容。',goal:1}];

function progressState(s){if(!s.progress)s.progress={earned:{},tutorialDismissed:s.day>=7,covered:false,decade:false};return s.progress;}

function milestoneValue(s,id){let p=progressState(s),c=s.career;return id==='first'?(s.tally.live||0):id==='week'?s.day:id==='living'?+p.covered:id==='fans'?s.peak:id==='show'?Math.max(0,...(c?.works||[]).map(w=>w.score||0)):id==='ku'?+(s.life?.completed.includes('ku100')||false):id==='stage'?+!!c?.works.some(w=>w.kind==='節目'&&w.title===shows.find(v=>v.id==='dance').name):+p.decade;}

function checkMilestones(s){let p=progressState(s);for(let m of milestones)if(p.earned[m.id]===undefined&&milestoneValue(s,m.id)>=m.goal)p.earned[m.id]=s.day;}

function achievementRows(s){checkMilestones(s);return milestones.map(m=>({...m,value:Math.min(m.goal,milestoneValue(s,m.id)),earned:s.progress.earned[m.id]}));}

const lessons=[

 ['你的第一場直播','先選「認真開台」，再選喜歡的內容。完成故事後按「走向明天」，才會結算日期。','story'],

 ['照顧螢幕後的自己','體力與熱情不足時安排休息。生活費每天都會支付，早期兼職能讓創作更從容。','story'],

 ['讓名字變成朋友','到「人生與企劃」找熟客或創作者聊聊；一次相處會占用一天。','career'],

 ['把想法變成節目','來信特輯不需要特殊設備。先準備、排練，再進入開場、節目中、收尾三段現場。','studio'],

 ['替創作留一筆預算','在投資頁設定設備存錢目標。持倉仍有波動，創作專款與可用生活現金分開。','market'],

 ['承諾與自己的風格','開台選擇會累積風格。向觀眾預告節目後，要留意兩週期限。','studio'],

 ['留下這段人生','把完整 JSON 存檔匯出，方便換版本接續；也能查看已完成與下一個生涯目標。','saves']

];

function tutorial(s){let p=progressState(s);if(s.day>=7||p.tutorialDismissed)return null;return {day:s.day+1,title:lessons[s.day][0],text:lessons[s.day][1],target:lessons[s.day][2]};}

function dismissTutorial(s){progressState(s).tutorialDismissed=true;return true;}

function beginLive(s){let c=upgradeCareer(s),w=c.production,p=shows.find(v=>v.id===w.id);if(!focus(s,'live'))return false;
 if(s.stage!=='content')return true;
 if(!selectContent(s,p.topic))return false;
 if(s.stage==='end'||s.secretEnding||s.stage==='event'&&checkExhaustion(s))return true;
 let familiar=c.viewers.filter(v=>v.likes===p.topic&&v.loyalty>=40).length,style=channelStyle(s),equipment=p.gear.filter(g=>s.life.completed.includes(g)).length;

 c.live={step:0,opening:rand(s)<.3?'raid':'quiet',pendingStage:s.stage,pendingEvent:s.eventId,quality:familiar*2+equipment,atmosphere:45+familiar*5+style.level*2,retention:65+familiar*3,revenue:0,log:[]};s.stage='broadcast';return true;}

function baseLiveScene(s){if(s.stage!=='broadcast'||!s.career.live)return null;let live=s.career.live,w=s.career.production,p=shows.find(v=>v.id===w.id),option=(label,note,quality,atmosphere,retention,revenue,health=0)=>({label,note,quality,atmosphere,retention,revenue,health});

 if(live.step===0)return {phase:'開場',title:live.opening==='raid'?'突然有一群新觀眾進來':'開場的人數比預期安靜',body:live.opening==='raid'?'一位創作者轉播了你的節目。新朋友不知道今天要做什麼，熟客正在幫忙招呼。':'熟悉的名字慢慢出現。你可以暖場，也可以直接進入準備好的內容。',options:[option('介紹今天的節目','節奏穩定，留存 +8、氣氛 +6。',3,6,8,0),option('和熟客聊一小段','留存 +12、氣氛 +10，節目收入 -5%。',1,10,12,-5,-1),option('立刻用亮點開場','氣氛 +15、收入 +10%，留存 -5、額外耗 3 體力。',2,15,-5,10,-3)]};

 if(live.step===1){let labels={talk:['聊天室出現不同意見','你準備的話題引起討論，有人想多說一些，有人希望節目繼續。'],audio:['觀眾臨時點播新的聲音','設備能做到，但即興音效不在原本的聲音劇本裡。'],dance:['動捕追蹤突然飄了一下','觀眾注意到了小失誤，你要怎麼把表演接回來？'],game:['挑戰關卡卡住了','聊天室開始提供不同攻略。照原本路線走，還是現場換一種方法？'],film:['畫面與原本的節奏不同','現場效果不如排練，合作者等著你決定接下來的鏡位。']}[p.id];return {phase:'節目中',title:labels[0],body:labels[1],options:[option(p.id==='audio'?'維持劇本，讓聲音有完整起伏':p.id==='game'?'照練習路線穩穩完成':'照排練流程穩定接回','評價 +6、留存 +5，氣氛 -3。',6,-3,5,0),option(w.crew?'請合作者接應':'請熟客一起協助',w.crew?'合作默契發揮：評價 +9、留存 +7。':'熟客一起參與：評價 +2、留存 +7，收入 -5%。',w.crew?9:2,6,7,-5,-2),option(p.id==='audio'?'即興設計新音效':p.id==='game'?'挑戰沒試過的新路線':'臨場改編，讓意外成為亮點','收入 +20%、氣氛 +15；耗 8 體力。體力不足 35 時評價 -12，否則 +4。',s.health<35?-12:4,15,-5,20,-8)]};}

 return {phase:'收尾',title:'今晚，要在哪一句晚安停下來？',body:'觀眾還想多留一會兒，你也看見了自己的疲累。今天的結尾會成為大家記住的感受。',options:[option('準時下播，好好說晚安','評價 +4、留存 +8，不再消耗體力。',4,0,8,0),option('加碼一小段','收入 +15%、氣氛 +8，耗 7 體力，留存 +3。',1,8,3,15,-7),option('提前休息，留下感謝','收入 -10%、氣氛 -5，恢復 4 體力，留存 +5。',0,-5,5,-10,4)]};}

function chooseLive(s,i){let scene=liveScene(s);if(!scene||!Number.isInteger(i)||!scene.options[i])return false;let o=scene.options[i],l=s.career.live;for(let k of ['quality','revenue'])l[k]+=o[k];for(let k of ['atmosphere','retention'])l[k]=clamp(l[k]+o[k],0,100);apply(s,{health:o.health});if(checkExhaustion(s))return true;l.log.push(scene.phase+'：'+o.label+'。'+o.reason+'（評價 '+(o.quality>=0?'+':'')+o.quality+'、收入權重 '+(o.revenue>=0?'+':'')+o.revenue+'%、體力 '+(o.health>=0?'+':'')+o.health+'）');l.step++;if(l.step===3){l.quality+=Math.round((l.atmosphere-50)/10);return finishLive(s);}return true;}





// Small persistent memories survive the bounded daily diary.

function storyState(s){if(!s.story){let first=s.history?.find(h=>h.content?.startsWith('認真開台'));let best=s.career?.works?.filter(w=>w.kind==='節目').slice().sort((a,b)=>b.score-a.score)[0];s.story={arcs:{},memories:[],firstLive:first?.day??null,best:best?{title:best.title,score:best.score,day:best.day}:null,kept:0,missed:0,details:false};}return s.story;}

const storyArcs=[

{id:'rain',name:'小雨',viewer:0,day:14,title:'小雨明天有一場面試',body:'「明天要面試，現在還睡不著。」小雨打完這句話，又補了一個笑臉。你想怎麼回應？',labels:['聽他說最擔心的部分','邀大家分享自己的經驗','溫柔祝福，保留他的隱私'],replies:['「那天你聽我說完，我才發現自己其實準備很多了。我錄取了！」','「聊天室的經驗幫了我很多。這次沒有錄取，但我知道下一次怎麼準備。」','「謝謝你沒有追問。新工作已經開始，現在只能看回放，但晚安還是有收到。」']},

{id:'zhan',name:'阿湛',viewer:1,day:30,title:'阿湛寄來第一次剪輯',body:'阿湛剪了一段你的遊戲失誤合集，想知道自己能不能繼續學下去。',labels:['認真給一點具體回饋','徵得同意後在台上介紹','鼓勵他照自己的節奏練習'],replies:['「我把你說的節奏重剪了，這次終於敢投作品集。」','「有別的創作者找我剪片了！我也記得先問能不能使用素材。」','「最近工作忙，剪得很慢。不過我還留著第一個專案，沒有放棄。」']},

{id:'sleep',name:'眠眠',viewer:2,day:45,title:'眠眠要開始輪班生活',body:'眠眠說以後可能無法準時聽晚安台，擔心慢慢和聊天室疏遠。',labels:['告訴他回放也算相遇','和大家約一次白天的小聚','祝福他先照顧自己的生活'],replies:['「下班聽回放，聽到熟悉的片尾，就知道今天可以休息了。」','「那次白天能遇到大家很開心，不過之後不用特地配合我的時間。」','「好一陣子沒來了。現在生活穩定一點，我回來說聲晚安。」']},

{id:'qing',name:'青禾',contact:'qing',day:90,title:'青禾想改變節目方向',body:'她擔心改做慢節奏節目會讓原本的觀眾失望，想先聽聽你的想法。',labels:['一起試做一集','幫她整理觀眾來信','支持她先休息再決定'],replies:['「試播有人離開，也有人留下。謝謝你陪我承受第一次改變。」','「看完那些信，我發現大家喜歡的不只有節目形式。」','「休息後我還是想創作，只是決定不再每天直播。」']},

{id:'milo',name:'米洛',contact:'milo',day:180,title:'米洛不想再只看排行榜',body:'米洛想挑戰一個沒什麼流量的遊戲，又擔心大家覺得他退步了。',labels:['陪他做一場冷門企劃','和他聊聊不看數字的日子','幫他安排一次短暫休假'],replies:['「那場人不多，但有人說等這個遊戲的實況等很久了。」','「我還是會看數字，只是不再每十分鐘刷新一次。」','「休假回來粉絲少了一點，但我又想按下開台了。」']},

{id:'star',name:'晚星',contact:'star',day:360,title:'晚星想把幕後筆記留下',body:'晚星整理了很多失敗的製作筆記，猶豫這些不完美的東西是否值得分享。',labels:['一起整理成入門手冊','邀她聊一次失敗經驗','幫她保存，等她準備好'],replies:['「有新人拿手冊完成第一支影片了，原來失敗也能幫上忙。」','「那次聊完，收到最多的話是『原來不是只有我會卡住』。」','「現在終於想公開其中幾頁。謝謝你沒有替我決定時間。」']}

];

for(const a of storyArcs){events.push({id:'memory_'+a.id,storyOnly:true,major:true,tag:'那些記得你的人',title:a.title,body:a.body,arcStart:a.id,choices:a.labels.map((label,i)=>C(label,['多花些心力陪伴，也留下共同的記憶。','讓彼此與社群產生新的連結。','保留界線，讓對方用自己的步調生活。'][i],[{health:-4,bond:8},{network:4,bond:4},{joy:6,bond:4}][i]))});events.push({id:'memory_'+a.id+'_return',storyOnly:true,major:true,tag:'一封後來的回信',title:a.name+'帶來了後續',body:'熟悉的名字出現在訊息欄。',arcEnd:a.id,choices:[C('說聲恭喜，也謝謝他回來告訴你','這份回憶被收進你們的故事。',{joy:8}),C('聊聊彼此最近的生活','生活繼續往前，相遇也不只這一次。',{bond:8}),C('把這句話留在今晚的晚安裡','不公開私事，只把這份溫暖分享出去。',{joy:4,bond:4})]});}

function lifePhase(s){return ageNow(s)>=60?{id:'elder',name:'晚年的晚安',text:'傳承、健康與重逢，讓創作有自己的步調。'}:s.day>=1800||s.peak>=10000?{id:'mature',name:'自己的創作道路',text:'觀眾期待與團隊責任，開始需要取捨。'}:s.day>=180||s.peak>=1000?{id:'growth',name:'逐漸被看見',text:'更新、業配與生活時間，都在爭取你。'}:{id:'new',name:'第一盞直播燈',text:'先找到願意留下的人，也照顧自己的生活。'};}

const phaseStories=[

['new','空聊天室裡的一個問題','你問大家今天過得如何，卻一直沒有訊息。也許有人只是安靜聽著。',['繼續分享一件日常小事','把安靜留給背景音樂','提早收尾，明天再試']],

['new','第一位觀眾問你何時再開','你還在兼職，尚未有能力承諾每天開台。',['訂每週能做到的時間','先試一週密集更新','坦白說會提前公告']],

['growth','邀約撞上自己的企劃','一份業配希望你臨時加場，但原本答應熟客的節目已經準備一半。',['保留原企劃，婉拒邀約','接下邀約並說明改期','協商下週再合作']],

['growth','每個平台都希望你更新','短片、直播與社群各有機會，你開始沒有完整休息的一天。',['集中做好一種內容','試行一週密集剪輯','減量並調整公告']],

['mature','團隊等你做一個決定','頻道已經走過一段路。有人想擴張，也有人希望維持穩定。',['保留小團隊的步調','投入一筆製作預算','先和夥伴逐一聊聊']],

['mature','觀眾說你和以前不一樣','有人懷念早期的簡單，有人喜歡現在的專業。你也知道自己變了。',['做一場舊企劃回顧','繼續嘗試新的形式','聊聊這些年的變化']],

['elder','新人想聽你的第一場直播','對方以為你從一開始就知道該怎麼做，你想起那些只有幾個人的夜晚。',['分享失敗的經驗','一起做一集跨世代節目','把筆記交給他慢慢看']],

['elder','老觀眾帶著不同的人生回來','當年熬夜看台的人，如今可能已經成家。你們約好不必每次到場，也可以彼此記得。',['辦一場白天的重逢','整理一份往年精華','留一段簡單的晚安']]

];

phaseStories.forEach((x,i)=>events.push({id:'chapter_'+i,lifePhase:x[0],major:true,tag:'生涯章節',title:x[1],body:x[2],choices:x[3].map((label,j)=>C(label,['把時間留給熟悉的人，成長可能慢一些。','投入更多精力與 300 製作費，嘗試新的可能。','少一點負擔，把步調留給未來。'][j],[{bond:8,health:-4},{money:-300,skill:8,fans:40,health:-12},{joy:8,health:4}][j]))}));

function storyDue(s){let st=storyState(s);if(s.day===0)return null;for(const a of storyArcs){let r=st.arcs[a.id];if(r&&!r.done&&s.day>=r.due&&!s.used.includes('memory_'+a.id+'_return'))return 'memory_'+a.id+'_return';}for(const a of storyArcs){if(st.arcs[a.id]||s.used.includes('memory_'+a.id)||s.day<a.day)continue;let ready=a.contact?s.life.contacts.find(c=>c.id===a.contact)?.trust>=40:s.career?.viewers[a.viewer]?.loyalty>=45;if(ready)return 'memory_'+a.id;}return null;}

function storyChoice(s,e,i){let st=storyState(s),id=e.arcStart||e.arcEnd;if(!id)return;let a=storyArcs.find(a=>a.id===id);if(e.arcStart)st.arcs[id]={choice:i,due:s.day+14,done:false};else{if(st.arcs[id])st.arcs[id].done=true;let text=st.arcs[id]?a.replies[st.arcs[id].choice]:e.body;st.memories.unshift({day:s.day,name:a.name,text});st.memories=st.memories.slice(0,24);}if(a.contact){let c=s.life.contacts.find(c=>c.id===a.contact);c.trust=clamp(c.trust+4,0,100);c.memory=e.title;}else{let v=s.career.viewers[a.viewer];v.loyalty=clamp(v.loyalty+4,0,100);} }

function souvenir(s){let st=storyState(s),r=dreamRecap(s),pending=storyArcs.filter(a=>st.arcs[a.id]&&!st.arcs[a.id].done).map(a=>a.name+'的後續還沒收到');if(s.career.promise)pending.push('答應觀眾的下一場節目');let best=st.best||r.best[0];return {name:s.name,phase:lifePhase(s).name,days:s.day,peak:s.peak,first:st.firstLive,best:best?best.title+' · '+best.score+' 分':'代表作仍在下一次開台裡',friend:r.friend.name,friendTrust:r.friend.trust,memories:st.memories.slice(0,3),pending,kept:st.kept,missed:st.missed,ending:s.stage==='end'?s.summary?.title||'最後一次晚安':'故事仍在繼續'};}

function liveScene(s){let scene=baseLiveScene(s);if(!scene)return null;let l=s.career.live;const hints=[['讓新朋友跟上節奏，暖場的驚喜較少。','熟客會感到被記得，但新觀眾可能還在找節目重點。','用亮點抓住目光，也會更快消耗自己的精力。'],['穩定完成準備好的內容，氣氛可能稍微冷卻。','把現場交給彼此接應，需要默契，也要留出互動時間。','意外可能成為亮點；疲累時勉強即興，更容易失去節奏。'],['完整收尾，讓大家知道下次還能在哪裡相遇。','多陪大家一會兒，也把休息時間交給今晚。','照顧自己，讓期待留到下一次；今晚收益可能較少。']];scene.options.forEach((o,i)=>{o.hint=hints[l.step][i];o.reason=o.hint;if(l.step===0&&l.opening==='raid'&&i===1){o.retention-=12;o.reason='熟客聊得開心，部分新觀眾卻還沒跟上話題。';}if(l.step===0&&l.opening==='quiet'&&i===1){o.quality+=3;o.reason='熟悉的聊天讓安靜的開場慢慢暖起來。';}if(l.step===2&&i===1&&s.health<30){o.quality-=10;o.retention-=8;o.reason='疲累讓加播失去節奏，部分觀眾先離開了。';}o.detail=`評價 ${o.quality>=0?'+':''}${o.quality} · 氣氛 ${o.atmosphere>=0?'+':''}${o.atmosphere} · 留存 ${o.retention>=0?'+':''}${o.retention} · 收入權重 ${o.revenue>=0?'+':''}${o.revenue}% · 體力 ${o.health>=0?'+':''}${o.health}`;});return scene;}



// v0.17: everyday programme choices and remembered decisions.

function journeyState(s){if(!s.journey)s.journey={since:s.day,voice:0,privacy:0,lastTopic:'',streak:0,counts:{},memories:[],chat:[],last:null};return s.journey;}

const programmeSpecs={

chat:[['日常話題','保留私人細節，讓新觀眾也跟得上。',0,0,2,0],['匿名來信','花心力整理故事，增加熟客連結。',-2,0,5,0],['分享私生活','更親近，也增加隱私壓力。',-1,8,4,12]],

game:[['攻略解說','練習表達與技術，較不依賴熱度。',-1,4,1,0],['追當週熱門','爭取曝光；重複同題材會累積疲乏。',-4,13,0,0],['熟客同樂','曝光較少，換取陪伴與互動。',-2,0,5,0]],

music:[['短場練唱','保留嗓子，累積基本功。',0,1,1,0],['高音挑戰','曝光較高，但大幅增加嗓子負荷。',-5,14,1,0],['點歌聊天','增加熟客連結，仍需留意嗓子。',-2,3,4,0]],

art:[['分段創作','完成一小步，不急著交出完整作品。',-1,2,2,0],['限時挑戰','搶眼但更累，題材重複會失去新鮮感。',-5,13,0,0],['講解創作過程','花時間教學，累積實力與熟客。',-2,3,4,0]],

asmr:[['短場環境音','減少說話，噪音仍會影響體驗。',0,0,3,0],['耳語劇本','更投入的陪伴，也增加嗓子負荷。',-3,5,5,0],['先測試再收音','多花準備心力，降低環境噪音影響。',-2,1,4,0]],

memes:[['限定時段玩梗','保留互動，也守住節目節奏。',-1,4,2,0],['即興接梗','曝光較高；連續同題材容易疲乏。',-4,12,1,0],['新觀眾入門','解釋本台梗，讓陌生人也能加入。',-2,3,4,0]],

current:[['查證後整理','花心力確認來源，降低討論壓力。',-3,3,3,0],['即時評論','曝光較高，也增加個人界線壓力。',-5,14,0,10],['限定題目討論','限制範圍，重視對話與熟客關係。',-2,2,4,0]]};

const gearProgrammes=[

{id:'binaural',topic:'asmr',gear:['ku100'],name:'雙耳空間音景',desc:'用左右聲道設計移動聲音；少說話，降低嗓子負荷。',health:-2,fans:8,bond:5,voice:2},

{id:'virtual',topic:'music',gear:['model3d'],name:'3D 定點小舞台',desc:'以簡單走位搭配短組曲；要預留排練體力。',health:-5,fans:14,bond:2,voice:10},

{id:'capture',topic:'memes',gear:['model3d','mocap'],name:'全身動捕互動',desc:'讓觀眾指定動作；增加曝光，也更消耗體力。',health:-7,fans:18,bond:4,voice:2},

{id:'complex',topic:'game',gear:['pc'],name:'高負載遊戲製作',desc:'同步錄影與多場景直播；設備提供新內容，仍需技術。',health:-4,fans:12,bond:2,voice:3}

];

function programmeOptions(s,topic){if(!programmeSpecs[topic])return [];let j=journeyState(s);let base=programmeSpecs[topic].map((a,i)=>({id:'plan'+i,name:a[0],desc:a[1],health:a[2],fans:a[3],bond:a[4],privacy:a[5],voice:topic==='music'?[5,24,12][i]:topic==='asmr'?[2,16,5][i]:4,gear:[]}));return [...base,...gearProgrammes.filter(p=>p.topic===topic)].map(p=>({...p,locked:p.gear.filter(id=>!s.life.completed.includes(id)).map(id=>projects.find(p=>p.id===id).name).join('、'),warning:j.voice>=55&&p.voice>8?'嗓子已疲累，這種做法會降低效果。':j.streak>=3&&j.lastTopic===topic?'連續相同題材，曝光效果降低。':''}));}

function remember(s,name,text){let j=journeyState(s);j.memories.unshift({day:s.day,name,text});j.memories=j.memories.slice(0,32);}

function programmeBroadcast(s,c){let j=journeyState(s),p=programmeOptions(s,c.id).find(p=>p.id===s.sessionPlan&&!p.locked)||programmeOptions(s,c.id)[0];delete s.sessionPlan;let tired=j.voice>=55&&p.voice>8,repeated=j.lastTopic===c.id&&j.streak>=3,noise=c.id==='asmr'&&!s.life.completed.includes('acoustic')&&s.career.home!=='quiet'&&(s.day+s.seed)%3===0;let gain=p.fans;

if(tired||repeated)gain=Math.floor(gain*.4);if(noise&&p.id!=='plan2')gain=Math.floor(gain*.5);

apply(s,{health:p.health,skill:p.id==='plan0'? .3:.15,bond:p.bond*.3-(noise&&p.id!=='plan2'?1:0),joy:tired?-2:0,fans:gain});j.voice=clamp(j.voice+p.voice,0,100);j.privacy=clamp(j.privacy+(p.privacy||-4),0,100);if(j.privacy>=60&&p.privacy){apply(s,{joy:-3,bond:-1});}j.streak=j.lastTopic===c.id?j.streak+1:1;j.lastTopic=c.id;j.counts[c.id]=(j.counts[c.id]||0)+1;

let reasons=[tired?'嗓子負荷偏高，表現打了折扣。':'',repeated?'題材連續出現，觀眾的新鮮感下降。':'',noise?(p.id==='plan2'?'事前試音避開了今天的噪音。':'環境噪音影響了安靜片段；試音、隔音或安靜住處能改善。'):'',j.privacy>=60?'隱私壓力偏高，改用匿名或限定話題能保留界線。':''].filter(Boolean);j.last={day:s.day,title:c.name+' · '+p.name,text:reasons.join(' ')||'照今天的安排完成節目。',gain};

let names={chat:'小雨',game:'阿湛',asmr:'眠眠',music:'小雨',art:'阿湛',memes:'小雨',current:'小雨'},name=names[c.id],m=j.memories.find(m=>m.name===name);j.chat=[{name,text:m?'還記得'+m.text+' 今天也來聽你說晚安。':repeated?'最近都是這個題材，下次想看看別的內容。':tired?'聲音有點累，今天早點休息也可以。':'今天的「'+p.name+'」我有跟上。'}];let friend=j.memories.find(m=>['青禾','米洛','晚星'].includes(m.name)&&s.day-m.day<=30);if(friend)j.chat.push({name:friend.name,text:'上次'+friend.text+' 這次也來看看你的節目。'});

}

const firstMonth=[

[3,'familiar','第二次出現的名字','小雨又來了。他記得上次開台時你說過的小事。',['問他最近過得如何','做一段新觀眾介紹','先把今天的企劃完成']],

[7,'budget','第一筆設備預算','想改善收音，但生活費也需要保留。青禾說，可以先一起檢查設定。',['和青禾排查設定','保留預算，先練習表達','花 600 做線材整理']],

[12,'setback','準備了，卻沒有人回應','今天的內容比之前完整，聊天室卻很安靜。阿湛說他其實在看，只是不知道怎麼接話。',['設計容易回答的小問題','分析回放，改一個環節','收台休息，明天再試']],

[18,'boundary','聊天室想知道更多','小雨問起你的私生活。親近感很好，但不是每件事都想公開。',['說清楚不公開的範圍','只分享整理過的日常','邀大家匿名分享近況']],

[24,'friend','青禾的試播邀請','青禾邀你幫忙測試新企劃。你可以花心力幫忙，也可以坦白說自己需要休息。',['一起試播並給建議','提供簡短的文字回饋','坦白說明這次沒空']],

[29,'month','第一個月，留下了什麼','熟悉的名字、試過的內容，以及還不確定的未來。你想用什麼方式走進下個月？',['整理最喜歡的一場','謝謝陪你開始的人','調整能長期維持的作息']]

];

for(let [day,key,title,body,labels] of firstMonth)events.push({id:'month_'+key,storyOnly:true,major:true,tag:'第一個月 · 第 '+(day+1)+' 天',title,body,monthKey:key,choices:labels.map((t,i)=>C(t,['為下一場留下一個具體改變。','用適合自己的方式繼續。','保留自己的選擇與步調。'][i],key==='budget'&&i===2?{money:-600,skill:4}:i===0?{health:-3,bond:5}:i===1?{skill:4,joy:3}:{health:6,joy:3}))});

function monthDue(s){let j=journeyState(s);if(s.day>=45)return null;return firstMonth.find(([d,k])=>d>=j.since&&s.day>=d&&!s.used.includes('month_'+k))?.[1];}

function journeyChoice(s,e,i){if(!e.monthKey&&e.id!=='first'&&!e.arcStart&&!e.arcEnd)return;let arc=storyArcs.find(a=>a.id===(e.arcStart||e.arcEnd));let name=arc?arc.name:e.monthKey==='friend'||e.monthKey==='budget'?'青禾':e.monthKey==='setback'?'阿湛':'小雨';remember(s,name,'你在「'+e.title+'」選擇了「'+e.choices[i].label+'」。');if(e.monthKey==='boundary')journeyState(s).privacy=Math.max(0,journeyState(s).privacy-20);if(e.monthKey==='friend'){let p=s.life.contacts.find(p=>p.id==='qing');p.trust=clamp(p.trust+(i===0?8:i===1?4:1),0,100);p.memory=e.choices[i].label;}}

function journeyInfo(s){let j=journeyState(s),next=firstMonth.find(([d,k])=>d>=j.since&&!s.used.includes('month_'+k));return {...j,next:s.day<30&&next?{day:next[0]+1,title:next[2]}:null,unlocks:gearProgrammes.map(p=>({...p,available:p.gear.every(id=>s.life.completed.includes(id))}))};}



function lifePlan(s){if(!s.plan)s.plan={topic:'chat',secondary:'',pace:'balanced',style:'steady'};else setLifePlan(s,s.plan);return s.plan;}

function calendarState(s){if(!s.personalCalendar)s.personalCalendar={birthday:'2000-06-21',debut:'2026-11-08',anchor:s.day,seen:[]};return s.personalCalendar;}

function validDate(v){return typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v+'T00:00:00Z'))&&new Date(v+'T00:00:00Z').toISOString().slice(0,10)===v;}

function setLifePlan(s,p){let legacy={study:'career',social:'balanced',savings:'balanced',series:'career',variety:'balanced',comeback:'health',slow:'health'},pace=legacy[p.pace]||p.pace,topic=p.pace==='variety'?'mixed':p.topic,secondary=p.secondary||'';if(!(topic==='mixed'||contents.some(c=>c.id===topic))||!['balanced','career','health','mood','venture'].includes(pace)||!['steady','growth','community'].includes(p.style)||secondary&&!contents.some(c=>c.id===secondary))return false;if(secondary===topic)secondary='';s.plan={topic,secondary,pace,style:p.style};return true;}



// Fictional personality effects use the game's fixed month/day zodiac boundaries.

const zodiacTraits=[

 ['01-20','水瓶座','喜歡試新點子','直播時少消耗 1 體力和 1 熱情。','live',{health:1,joy:1}],

 ['02-19','雙魚座','容易投入表演','直播時少消耗 1 熱情。','live',{joy:1}],

 ['03-21','牡羊座','上台有衝勁','直播時少消耗 1 體力。','live',{health:1}],

 ['04-20','金牛座','擅長養精蓄銳','休息時多恢復 2 體力。','rest',{health:2}],

 ['05-21','雙子座','擅長接聊天室的話','直播時少消耗 1 熱情。','live',{joy:1}],

 ['06-22','巨蟹座','懂得享受獨處','休息時多恢復 1 熱情。','rest',{joy:1}],

 ['07-23','獅子座','享受和觀眾互動','直播時少消耗 1 熱情和 1 體力。','live',{joy:1,health:1}],

 ['08-23','處女座','習慣拆解問題','學習時少消耗 1 體力和 1 熱情。','learn',{health:1,joy:1}],

 ['09-23','天秤座','重視工作與生活的平衡','休息時多恢復 1 體力和 1 熱情。','rest',{health:1,joy:1}],

 ['10-24','天蠍座','做事專注','學習時少消耗 1 體力。','learn',{health:1}],

 ['11-23','射手座','喜歡從工作中找樂趣','兼職時少消耗 1 熱情。','work',{joy:1}],

 ['12-22','摩羯座','安排工作有條理','兼職時少消耗 1 體力。','work',{health:1}]

];

const zodiacTopics=[

 ['art','memes'],['music','asmr'],['game','memes'],['asmr','art'],

 ['chat','memes'],['chat','asmr'],['music','chat'],['art','game'],

 ['music','chat'],['current','game'],['memes','current'],['current','art']

];

function zodiacProfile(s){

 const day=s.personalCalendar?.birthday?.slice(5);

 if(!day)return null;

 const trait=zodiacTraits.reduce((match,trait)=>day>=trait[0]?trait:match,zodiacTraits[zodiacTraits.length-1]);

 const [,name,personality,description,action,delta]=trait;

 const topics=zodiacTopics[zodiacTraits.indexOf(trait)];

 return {name,personality,description,action,delta,topics};

}

function setDates(s,birthday,debut){if(!validDate(birthday)||!validDate(debut))return false;if(s.calendarPending)return false;let seen=s.personalCalendar?.seen||[];s.personalCalendar={birthday,debut,anchor:s.day,seen};return true;}

function realDay(s){let c=calendarState(s);return new Date(Date.parse(c.debut+'T00:00:00Z')+(s.day-c.anchor)*86400000).toISOString().slice(0,10);}

const fixedFestivals={'01-01':'跨年・元旦','02-14':'情人節','04-04':'清明・兒童節','10-31':'萬聖節','12-25':'聖誕節'};

const lunarCalendar=new Intl.DateTimeFormat('en-u-ca-chinese',{month:'numeric',day:'numeric',timeZone:'UTC'});

const springDates=new Map();

function springDate(year){

 if(!springDates.has(year)){

  const start=Date.UTC(year,0,21);

  for(let day=0;day<32;day++){

   const timestamp=start+day*86400000;

   const parts=lunarCalendar.formatToParts(timestamp);

   if(parts.find(p=>p.type==='month')?.value==='1'&&parts.find(p=>p.type==='day')?.value==='1'){

    springDates.set(year,timestamp);

    break;

   }

  }

 }

 return springDates.get(year);

}

function festivalFor(date){

 const offset=(Date.parse(date+'T00:00:00Z')-springDate(Number(date.slice(0,4))))/86400000;

 return {spring:offset>=-3&&offset<=5,newYear:offset===0};

}

function extraFestival(date){

 const timestamp=Date.parse(date+'T00:00:00Z');

 const day=new Date(timestamp);

 if(day.getUTCMonth()===4&&day.getUTCDay()===0&&day.getUTCDate()>=8&&day.getUTCDate()<=14)return '母親節';

 const parts=lunarCalendar.formatToParts(timestamp);

 const month=parts.find(p=>p.type==='month')?.value;

 const lunarDay=parts.find(p=>p.type==='day')?.value;

 return {'5-5':'端午節','7-7':'七夕','8-15':'中秋節'}[month+'-'+lunarDay];

}

const watchPageShare=.55, superChatShare=.70;

function platformRevenue(views){

 const monetizedShare=.70, adRevenuePerThousand=320;

 return views*monetizedShare*adRevenuePerThousand/1000*watchPageShare;

}

const partTimeStreamIncome=.75;

function isFullTimeStreaming(mode){return mode==='full'||mode==='part';}

function streamIncomeFactor(s){return isFullTimeStreaming(upgradeCareer(s).mode)?1:partTimeStreamIncome;}

function baseLiveAdIncome(s){

 return platformRevenue(30+s.fans*.18+s.bond*2)*(s.flags.includes('agency')?.75:1)*streamIncomeFactor(s);

}

function estimateChannelIncome(s){

 const platform=Math.round(baseLiveAdIncome(s)*(lifePolicyEffect(s).ads||1));

 const info=donationInfo(s);

 const donation=Math.round(info.base*superChatShare*info.chance);

 return {platform,donation,total:platform+donation};

}

function estimateMonthlyChannelIncome(s){

 const perStream=estimateChannelIncome(s);

 let streams=0, paidShifts=0;

 for(let offset=0;offset<30;offset++){

  const day=s.day+offset;

  const action=policyAction(s,false,day);

  if(action==='live')streams++;

  if(action==='work'&&s.career.mode!=='salary'&&day>=(s.emergencyWorkUntil||0))paidShifts++;

 }

 const partTime=paidShifts*partTimeHourly*partTimeHours;

 const platform=perStream.platform*streams;

 const donation=perStream.donation*streams;

 const membership=membershipInfo(s).monthly;

 const salary=s.career.salary;

 const salaryIncome=salary?salary.earned+(s.career.mode==='salary'?Math.min(30,Math.max(0,salary.due-s.day))*salariedMonthlyPay/30:0):0;

 const authorSupport=Number.isSafeInteger(s.authorSupportDue)&&s.authorSupportDue<=s.day+30?authorSupportAmount:0;
 return {streams,paidShifts,platform,donation,membership,partTime,salary:salaryIncome,authorSupport,total:platform+donation+membership+partTime+salaryIncome+authorSupport};

}

function donationInfo(s){



 const followers=Math.max(0,s.fans);



 const date=s.personalCalendar?realDay(s):null;



 const spring=date&&festivalFor(date).spring;



 const fixed=date&&(fixedFestivals[date.slice(5)]||date.endsWith('-06-21')||extraFestival(date)||date.slice(5)===s.personalCalendar.birthday.slice(5)||s.personalCalendar.birthday.endsWith('02-29')&&date.endsWith('02-28')&&!validDate(date.slice(0,4)+'-02-29')||s.day>s.personalCalendar.anchor&&date.slice(5)===s.personalCalendar.debut.slice(5));



 const bonus=spring ? .22 : fixed ? .14 : 0;



 return {chance:Math.min(.75,.06+Math.log10(1+followers)*.075+bonus),base:Math.round((100+Math.sqrt(followers)*9)*streamIncomeFactor(s)),festival:spring?'春節':fixed?'固定活動':''};



}



function rollDonation(s){

 s.lastSuperChat=null;

 const info=donationInfo(s);

 if(rand(s)>=info.chance)return 0;

 const gross=Math.max(30,Math.round(info.base*(.6+rand(s)*.8)/30)*30);

 const amount=Math.round(gross*superChatShare);

 apply(s,{money:amount},info.festival?'斗內 · '+info.festival:'斗內');

 s.lastSuperChat={gross,net:amount};

 return amount;

}

function calendarDue(s){let c=calendarState(s),date=realDay(s),md=date.slice(5),year=date.slice(0,4),birth=c.birthday.slice(5),leap=new Date(Number(year),1,29).getMonth()===1;if(birth==='02-29'&&!leap)birth='02-28';let all=[];if(md===birth)all.push({id:'annual_birthday',key:year+'-birthday',name:'生日'});if(s.day>c.anchor&&md===c.debut.slice(5))all.push({id:'annual_debut',key:year+'-debut',name:'初配信週年'});if(festivalFor(date).newYear)all.push({id:'annual_festival',key:date+'-spring',name:'春節'});const festival=fixedFestivals[md]||extraFestival(date);if(festival)all.push({id:'annual_festival',key:date+'-holiday',name:festival});if(md==='06-21')all.push({id:'annual_emu_birthday',key:year+'-emu-birthday',name:'愛姆生日彩蛋'});return all.find(x=>!c.seen.includes(x.key));}

for(let [id,title,body]of [['birthday','今天，大家記得你的生日','聊天室準備了一份祝福。這一天可以熱鬧，也可以留給自己。'],['debut','又到了第一次按下開台的日子','從當初的緊張到今天的熟悉，有些名字一直陪著你。'],['festival','今天的節日，要怎麼過？','有人期待特別節目，也有人想把時間留給家人。']])events.push({id:'annual_'+id,storyOnly:true,major:true,tag:'每年相遇',title,body,choices:[C('安排一場特別節目','多投入心力，留下共同回憶。',{health:-6,bond:8,joy:5}),C('簡單開台，謝謝一路陪伴','用平常的方式記住今天。',{bond:5,joy:5}),C('休息，留時間給生活','發一則祝福，讓自己好好過節。',{health:10,joy:7})]});

const emuBirthdayWishes=[

 '願你新的一年有更多想做就做的事。',

 '希望你每天都能找到一件值得開心的小事。',

 '願你在忙碌之間，也有時間做自己喜歡的事。',

 '希望今年的每一個新企劃，都讓你想起開始創作時的期待。',

 '願你累的時候睡得好，高興的時候有人陪你笑。',

 '希望今天的蛋糕是你最喜歡的口味。',

 '願新的一年有好聽的歌、好玩的故事和舒服的晚安。',

 '希望今天有好多讓你笑出聲的驚喜。',

 '願你的生日願望，都能按你喜歡的步調實現。',

 '希望你在舞台上玩得開心，下了台也能好好休息。',

 '願你接下來的一年平安順心，常常遇見溫柔的人。',

 '希望以後想起今天，你還記得吹蠟燭時的好心情。'

];

const emuBirthdayClosings=[

 '也祝你每次開台都能玩得盡興。',

 '今天就讓大家把平常收到的晚安還給你。',

 '願今晚有個好夢，明早醒來精神滿滿。',

 '記得把今天留一點時間給自己。',

 '也願你常有好好吃飯、慢慢散步的空檔。',

 '希望聊天室的祝福能陪你度過今天。',

 '期待今年還能聽到更多你的新故事。',

 '祝你每天都能用喜歡的方式收工。',

 '希望這張卡片也能讓你笑一下。',

 '也祝你每個想放空的晚上都能安心休息。',

 '願今年留下好多值得回味的回憶。',

 '祝你接下來的每一段旅程都走得自在。'

];

function emuBirthdayLetter(s){

 const year=realDay(s).slice(0,4);

 const cards=s.emuBirthdayCards??={};

 if(!Object.hasOwn(cards,year)){

  const used=new Set(Object.values(cards));

  const count=emuBirthdayWishes.length*emuBirthdayClosings.length;

  const available=Array.from({length:count},(_,i)=>i).filter(i=>!used.has(i));

  cards[year]=available.length?available[Math.floor(rand(s)*available.length)]:-1;

 }

 const index=cards[year], size=emuBirthdayClosings.length;

 const wish=index>=0?emuBirthdayWishes[Math.floor(index/size)]+emuBirthdayClosings[index%size]

  :'願 '+year+' 年的每一天都平安順心，也有空做自己喜歡的事。';

 return {message:'愛姆，生日快樂！'+wish,signature:'你不行 敬上'};

}

events.push({id:'annual_emu_birthday',storyOnly:true,major:true,tag:'愛姆生日彩蛋',

 title:'六月二十一日，給愛姆的晚安',

 body:'今晚，聊天室把平常收到的晚安變成一句生日快樂。你想用什麼方式向永遠二十歲的夢寐愛姆送上祝福？',

 links:[

  {label:'主頻道',url:'https://www.youtube.com/@Yumebi_Emu'},

  {label:'ASMR 頻道',url:'https://www.youtube.com/@eemumu0621'},

  {label:'推特（X）',url:'https://x.com/Yumebi_Emu'}

 ],

 choices:[

  C('開一場生日祝福台','把祝福和觀眾的故事一起留下來。',{joy:12},{wellbeing:{mood:6,physical:0}}),

  C('寫下一張晚安卡片','把今天的祝福留給下一個做夢的人。',{joy:8},{wellbeing:{mood:4,physical:0}})

 ]

});

function openCalendarEvent(s){let due=calendarDue(s);if(!due)return false;s.calendarPending=due;s.eventId=due.id;s.stage='event';if(due.id==='annual_emu_birthday')emuBirthdayLetter(s);return true;}

function eventPauseReason(s){
 if(s.eventId==='cash_lifeline')return '資金週轉等待選擇';
 if(s.eventId?.startsWith('author_story_'))return '特別故事等待決定';
 if(s.eventId===anniversaryEventId)return '週年收集事件等待決定';
 if(s.calendarPending)return '紀念日等待決定';
 return '事件等待決定';
}

function autoLifeStep(s){if(s.secretEnding)return {paused:true,reason:'隱藏結局等待確認'};lifePlan(s);calendarState(s);if(checkExhaustion(s))return {paused:true,reason:s.stage==='event'?eventPauseReason(s):s.summary?.title||'隱藏結局等待確認'};if(s.stage==='end'||s.stage==='broadcast')return {paused:true,reason:s.stage==='end'?'人生已結束':'正式直播等待選擇'};if(s.stage==='event')return {paused:true,reason:eventPauseReason(s)};
if(checkNaturalEnding(s))return {paused:true,reason:s.summary?.title||'結局等待確認'};

if(s.stage==='result'){if(openCalendarEvent(s))return {paused:true,reason:'紀念日等待決定'};if(openAuthorStory(s))return {paused:true,reason:'特別故事等待決定'};if(openCareerSecretEnding(s))return {paused:true,reason:'隱藏結局等待確認'};if(openAnniversaryEvent(s)||openGuaranteedLegendary(s))return {paused:true,reason:'週年收集事件等待決定'};if(openFollowup(s))return {paused:true,reason:'後續事件等待決定'};if(openProductOffer(s))return {paused:true,reason:'商品推薦等待決定'};advance(s);if(s.secretEnding)return {paused:true,reason:'隱藏結局等待確認'};if(s.stage==='event')return {paused:true,reason:eventPauseReason(s)};if(s.notice||s.stage==='end')return {paused:true,reason:s.notice||'人生已結束'};}


if(s.stage==='content')cancelContent(s);if(openCalendarEvent(s))return {paused:true,reason:'紀念日等待決定'};if(openAuthorStory(s))return {paused:true,reason:'特別故事等待決定'};if(openCareerSecretEnding(s))return {paused:true,reason:'隱藏結局等待確認'};

if(openAnniversaryEvent(s)||openGuaranteedLegendary(s))return {paused:true,reason:'週年收集事件等待決定'};

if(openFollowup(s))return {paused:true,reason:'後續事件等待決定'};

if(openProductOffer(s))return {paused:true,reason:'商品推薦等待決定'};

let queue=pendingActivities(s);if(queue.length){let a=queue.shift(),ok=a.kind==='social'?social(s,a.value,a.extra):a.kind==='workShow'?workShow(s,a.value):careerAction(s,a.value,a.extra);if(!ok)record(s,{title:'稍後活動未能執行',choice:'重新確認條件',text:'活動條件或預算已改變，請重新安排。'});if(s.stage==='event'||s.stage==='broadcast')return {paused:true,reason:'活動帶來新事件'};if(s.stage!=='focus')return {paused:false,reason:'活動已進行'};}let p=s.plan,action=policyAction(s,needsRoutineRest(s));focus(s,action);if(s.stage==='content'){let topic=pickProgrammeTopic(s);let opts=programmeOptions(s,topic).filter(o=>!o.locked),index=p.style==='growth'?1:p.style==='community'?2:0;selectContent(s,topic,opts[index]?.id||'plan0');}

if(s.stage==='end')return {paused:true,reason:s.summary.title};

if(s.stage==='event')return {paused:true,reason:eventPauseReason(s)};return {paused:false,reason:'時間前進中'};

}



function membershipState(s){return independentMembers(s);}

const memberNetPay=20;

function membershipTick(s){let m=independentMembers(s);m.lastPayment=0;if(m.unlocked&&s.day>=m.due){let payCount=m.count,paid=payCount*memberNetPay;apply(s,{money:paid},'會員月費');m.total+=paid;m.lastPayment=paid;m.due=s.day+30;let churn=Math.ceil(Math.max(0,m.count-Math.ceil(s.fans*.01))*.04);m.count=Math.max(Math.ceil(s.fans*.01),m.count-churn);if(churn)record(s,{title:'會員續訂變化',choice:churn+' 位會員暫停續訂',text:'會員收入與人數會隨時間變化，仍保留追蹤 1% 底線。'});if(paid)record(s,{title:'會員月費入帳',choice:payCount+' 位會員支持 '+paid+' ',text:'獨立會員收入，每位會員每 30 天實收 '+memberNetPay+'。'});}return m.lastPayment;}

function membershipInfo(s){let m=independentMembers(s);return {count:m.count,unlocked:m.unlocked,monthly:m.count*memberNetPay,netPay:memberNetPay,total:m.total,due:m.due,rows:[]};}

function fastStopOptions(){

 return [...[...weeklyTiers].reverse().map(({id,name})=>({id,name})),

  {id:'fixed',name:'固定日期事件'},{id:'product',name:'商品推薦'},

  {id:'hidden',name:'隱藏週年事件'},{id:'other',name:'其他事件與正式直播'}];

}

function fastStopKind(s){

 if(s.stage==='broadcast')return 'other';

 if(s.eventId==='author_story_confession'||s.eventId===anniversaryEventId||s.eventId==='secret_wedding'||s.eventId==='secret_anniversary_invite')return 'hidden';

 const followup=events.find(e=>e.id===s.eventId)?.followupOf;

 if(followup)return followup.tier;

 if(s.eventId.startsWith('annual_'))return 'fixed';

 if(s.eventId==='monthly_equipment')return 'product';

 const draw=s.weeklyDraw;

 return draw?.id===s.eventId&&draw.day===s.day?draw.tier:'other';

}

function fastLifeBatch(s,days,stops){

 const start=s.day;

 const selected=new Set(stops);
 const shouldStop=()=>['event','broadcast'].includes(s.stage)&&(s.eventId==='secret_anniversary_invite'||selected.has(fastStopKind(s)));

 for(let n=0;n<days*8&&s.day<start+days;n++){

  if(s.stage==='event'||s.stage==='broadcast'){


   if(shouldStop())return {paused:true,reason:'已勾選的事件等待決定',days:s.day-start};

   const options=s.stage==='event'?event(s).choices:liveScene(s)?.options||[];

   const indices=options.flatMap((c,i)=>s.stage==='broadcast'||(!(c.requiredCash>s.money)&&!((c.delta?.money||0)<0&&s.money+c.delta.money<0))?[i]:[]);

   let resolved=false;

   while(indices.length&&!resolved){

    const [i]=indices.splice(Math.floor(rand(s)*indices.length),1);

    resolved=s.stage==='event'?choose(s,i):chooseLive(s,i);

   }

   if(!resolved)return {paused:true,reason:'事件需要手動處理',days:s.day-start};
   if(s.secretEnding)return {paused:true,reason:'隱藏結局等待確認',days:s.day-start};

   continue;

  }

  const result=autoLifeStep(s);

  if(result.paused&&!['event','broadcast'].includes(s.stage))return {...result,days:s.day-start};

 }

 if(shouldStop())return {paused:true,reason:'已勾選的事件等待決定',days:s.day-start};
 return {paused:false,reason:'快速模式進行中',days:s.day-start};

}

function autoLifeBatch(s,days){if(!Number.isInteger(days)||days<7||days>30)return {paused:true,reason:'請選擇有效天數',days:0};let start=s.day,target=start+days,result;for(let n=0;n<days+2&&s.day<target;n++){result=autoLifeStep(s);if(result.paused)return {...result,days:s.day-start};}return {paused:false,reason:'時間前進中',days:s.day-start};}

for(let [topic,title,body]of [

['chat','熟客話題，新朋友聽不懂','聊天室接著前幾場的故事，新觀眾卻不知道話題從哪裡開始。'],

['game','新版本改變了練習路線','熟悉的攻略不再適用，觀眾等著看你怎麼面對這次更新。'],

['music','今天的歌單與嗓子狀況','觀眾期待高音曲，你卻發現今天唱起來比平常吃力。'],

['art','作品進度卡在細節','畫面已經能看出想法，你還在猶豫是否要繼續修改。'],

['asmr','耳語中混進了環境聲','收音時傳來窗外的聲響，有人覺得親切，也有人希望更安靜。'],

['memes','玩梗環節超出了預定時間','聊天室越玩越起勁，但也有人想看原本準備的內容。'],

['current','觀眾貼來未確認的截圖','大家希望你立刻回應，但目前還缺少完整來源與脈絡。']])events.push({id:'topic_routine_'+topic,topics:[contents.find(c=>c.id===topic).name],repeatable:true,major:true,tag:'內容日常',title,body,choices:[C('調整流程，照顧今天的狀況','多花些心力，讓節目適合現在的自己。',{skill:4,health:-2}),C('和觀眾說明，一起調整期待','保持溝通，也留出節目的界線。',{bond:5,joy:2}),C('縮短這場，把準備留給下次','保留體力，接受今天不必完成所有事。',{health:7,joy:2})]});



function memberFee(loyalty){return Math.round(100+clamp(loyalty,0,100)*2);}

const riskLabels={chat:'公開私密企劃，賭一次話題爆發',game:'投入大筆獎勵，挑戰極限紀錄',music:'重押現場製作，挑戰高強度演出',art:'接受高額急件，限時完成大作品',asmr:'重金租棚，即興製作大型聲音劇',memes:'跨圈大型企劃，衝一波新觀眾',current:'直播即時辯論，挑戰爭議話題'};

for(let topic of contents){let e=events.find(e=>e.id==='topic_routine_'+topic.id);e.choices.push(C('高風險：'+riskLabels[topic.id],'成功率 30%。先投入現金的 25%（最低 1,500、最高 30,000）；成功收回投入的 3 倍並增加觀眾，失敗不退投入並損失體力、觀眾與熟客信任。',{money:-1500},{highRisk:true}));}

function pendingActivities(s){if(!s.activityQueue)s.activityQueue=[];return s.activityQueue;}

function queueActivity(s,kind,value,extra){let q=pendingActivities(s);if(q.length>=4)return false;q.push({kind,value,extra:extra||''});record(s,{title:'安排稍後的活動',choice:kind==='social'?'與朋友相處':kind==='workShow'?'節目製作':'生活安排',text:'目前故事保留，活動排在選擇之後。'});return true;}

function queuedSocial(s,id,kind){if(['event','result'].includes(s.stage))return ['rain','qing','milo','star'].includes(id)&&['talk','help','collab'].includes(kind)?queueActivity(s,'social',id,kind):false;return social(s,id,kind);}

function queuedWorkShow(s,action){if(['event','result'].includes(s.stage))return ['prepare','rehearse','publish','cancel'].includes(action)&&s.career.production?queueActivity(s,'workShow',action):false;return workShow(s,action);}

function queuedCareerAction(s,kind,value){if(!['event','result'].includes(s.stage))return careerAction(s,kind,value);if(kind==='family')return queueActivity(s,'careerAction',kind,value);let stage=s.stage,id=s.eventId;s.stage='focus';let ok=careerAction(s,kind,value);s.stage=stage;s.eventId=id;return ok;}

function queuedPromise(s,topic){if(!['event','result'].includes(s.stage))return makePromise(s,topic);let stage=s.stage;s.stage='focus';let ok=makePromise(s,topic);s.stage=stage;return ok;}



const extraGoods=[

{id:'backup',name:'離線備份硬碟',cost:3200,days:1,desc:'降低檔案遺失事故機率 60%，開台實力緩慢累積。',skill:.03},

{id:'ups',name:'不斷電系統',cost:6500,days:2,desc:'降低設備故障與斷電事故機率 60%。',health:.2},

{id:'deskchair',name:'可調式工作椅',cost:8000,days:3,desc:'每場開台少耗 1 體力。',health:1},

{id:'monitorarm',name:'螢幕支架與桌面整理',cost:2400,days:1,desc:'收拾工作空間，改善每場開台的觀眾互動。',bond:.1},

{id:'vocal',name:'發聲訓練課程',cost:12000,days:10,desc:'歌唱收益 +10%、每場少耗 1 體力。',topics:['music'],income:.1,topicHealth:1},

{id:'moderator',name:'專業聊天室管理服務',cost:15000,days:7,upkeep:12,desc:'降低社群風波事故機率 50%；每日服務費 12。',bond:.12},

{id:'license',name:'節目素材授權包',cost:4500,days:2,desc:'所有開台收益 +5%，降低授權爭議事故機率 60%。',income:.05},

{id:'tracking',name:'臉部追蹤升級',route:'VTuber',cost:18000,days:5,desc:'互動節目收益 +12%，新增追蹤 +8%。',topics:['memes'],income:.12,topicReach:.08}

];projects.push(...extraGoods);for(let p of extraGoods)events.push({id:'life_finish_'+p.id,queued:true,major:true,title:p.name+'已交付',tag:'商店交付',body:'設備或服務已準備完成，你想如何開始使用？',choices:[C('完成測試並啟用','設備效果從現在生效。',{skill:2},{life:{finish:p.id}}),C('請朋友一起確認','確認細節後再投入日常。',{bond:2},{life:{finish:p.id}}),C('慢慢熟悉操作','保留體力，逐步使用。',{health:4},{life:{finish:p.id}})]});

for(let e of events)if(e.id.startsWith('topic_routine_'))e.choices=e.choices.filter(c=>!c.highRisk);

const unusualStories=[

['hardware','設備燒毀的那一晚','突如其來的電源異常使工作中斷，維修費與停播安排同時壓上來。','low','ups',.03],

['files','準備數週的檔案打不開','作品檔案發生損毀，是否有可用的備份會改變這次損失。','low','backup',.04],

['copyright','節目收到素材授權申訴','一段用了很久的音樂被提出授權疑慮，你需要確認文件並調整節目。','low','license',.03],

['community','社群衝突延燒到其他平台','片段在陌生社群擴散，觀眾開始詢問你是否會回應。','low','moderator',.02],

['invite','大型創作者主動邀約','一位你欣賞很久的創作者寄來正式聯動邀請，但準備工作比想像中多。','rare','',0],

['spotlight','平台把你的作品放上首頁','一段作品意外被平台選中，新觀眾湧入，也帶來新的期待。','rare','',0],

['scam','合作對象突然失聯','原本談好的合作在交件前失去聯絡，已投入的時間與款項很難追回。','rare','',.1],

['health','醫師建議暫停高強度工作','持續透支終於影響生活，原本的節目表需要整個重排。','rare','',.02],

['legacy','很久以前的觀眾帶來一封信','對方說，你曾經一句平常的話改變了他面對生活的方式。','rare','',0],

['contract','長約邀請伴隨違約責任','一份高報酬長約要求獨家與密集交付，條件會影響接下來的生活。','rare','',0]

];

for(let [id,title,body,rarity,protection,loss]of unusualStories)events.push({id:'unusual_'+id,title,body,rarity,protection,incidentLoss:loss,storyOnly:true,major:true,tag:rarity==='rare'?'稀有轉折':'低機率事故',choices:id==='contract'?[

C('簽下密集長約','先收 12,000；未來 30 天額外消耗體力，若未能完成 10 場直播需付 18,000 違約整理費。',{money:12000},{contract:true}),C('付費請人審閱，協商後婉拒','支出 1,200，保留自主性。',{money:-1200,skill:8}),C('拒絕條件不合的合作','保留自由，也放下這筆收入。',{joy:4})]:[

C('投入資源處理或準備','支出 1,000，增加實力與信任。',{money:-1000,skill:8,bond:6}),C('請熟悉的朋友一起商量','花時間溝通，保留生活空間。',{health:-8,network:8,joy:4}),C(loss?'縮減工作，先處理生活':'照自己的步調回應','保留體力，不追求立即的成果。',{health:10,joy:5})]});

function managementState(s){if(!s.management)s.management={focus:'community',riskLog:[],contract:null};return s.management;}

function setManagement(s,id){if(!['community','craft','business'].includes(id)||s.stage==='end')return false;managementState(s).focus=id;return true;}

function unusualDue(s,e){if(e.protection&&s.life.completed.includes(e.protection)&&rand(s)>=(e.protection==='moderator'?.5:.4))return false;let loss=e.incidentLoss?Math.round(Math.max(0,s.money)*e.incidentLoss)+500:0;if(loss)apply(s,{money:-loss,health:e.id==='unusual_health'?-28:-5,joy:-10},e.title);else if(e.id==='unusual_spotlight')apply(s,{fans:Math.max(100,Math.round(s.fans*.15))});else if(e.id==='unusual_legacy')apply(s,{joy:12,bond:8});let m=managementState(s);m.riskLog.unshift({day:s.day,title:e.title,loss});m.riskLog=m.riskLog.slice(0,24);s.stage='event';s.eventId=e.id;s.lastSpecialEventDay=s.day;record(s,{eventId:e.id,title:e.title,choice:'生活發生轉折',text:loss?'已發生損失 '+loss+'，接下來如何處理由你決定。':'一個罕見的機會出現了。'});return true;}

function managementTick(s){let m=managementState(s),c=m.contract;if(c&&s.day>=c.due){let done=(s.tally.live||0)-c.started;apply(s,done>=10?{money:8000,joy:5}:{money:-18000,joy:-12});record(s,{title:'長約結算',choice:done>=10?'完成約定':'未達交付量',text:'完成 '+done+' 場直播；'+(done>=10?'收到尾款 8,000。':'支付違約整理費 18,000。')});m.contract=null;}}



function independentMembers(s){let old=s.membership;if(!old||old.schema!==2)s.membership={schema:2,members:{},count:0,unlocked:!!(s.fans>=1000||s.peak>=1000),due:s.day+30,total:old?.total||0,lastPayment:0};let m=s.membership;if(!m.unlocked&&(s.fans>=1000||s.peak>=1000)){m.unlocked=true;m.due=s.day+30;}if(m.unlocked)m.count=Math.max(m.count,Math.ceil(s.fans*.01));return m;}

function addMembers(s,n){let m=independentMembers(s);if(!m.unlocked||n<=0)return 0;let gain=Math.min(Math.max(0,Math.floor(s.fans*.15)-m.count),Math.floor(n));m.count+=gain;return gain;}

const membershipStories=[

['opening','觀眾詢問會員方案','頻道開始有人期待固定支持。你想怎麼介紹新開放的會員？',12],

['series','固定節目吸引長期支持','持續更新讓一些觀眾願意加入會員，支持下一個系列。',8],

['giftwave','一波會員支持','有人分享你的節目，帶來一群願意長期支持創作的新觀眾。',20]

];for(let [id,title,body,n]of membershipStories)events.push({id:'subscriber_'+id,title,body,tag:'頻道會員',minFans:1000,repeatable:id!=='opening',major:true,choices:[C('準備一段會員內容介紹','增加 '+n+' 位獨立會員，另花一些心力。',{health:-4},{subscriberGain:n}),C('說明量力支持，保持原本節奏','增加 '+Math.ceil(n/2)+' 位獨立會員。',{joy:3},{subscriberGain:Math.ceil(n/2)}),C('先把公開節目做好','這次不增加會員，保留體力。',{health:6,skill:3})]});



const lifePolicies=[

{id:'balanced',name:'兼顧生活',desc:'每週固定體力、心情、健康與熱情各 +2。'},

{id:'career',name:'專心創作',desc:'把固定兼職班換成開台，廣告分成 +25%、新增訂閱 +30%，每週固定體力 −2、心情 −2。'},

{id:'health',name:'健康優先',desc:'每週固定體力 +5、健康 +5。體力低於 70 時優先休息。'},

{id:'mood',name:'照顧心情',desc:'每週固定心情 +5、熱情 +5。心情低於 55 時優先休息。'},

{id:'venture',name:'高投入衝刺',desc:'一般開台廣告分成 +70%、新增訂閱 +80%。每週固定體力 −5、心情 −5、健康 −4、熱情 −5。'}];

function selectedTopics(s){let p=lifePlan(s);return p.topic==='mixed'?contents.map(c=>c.name):contents.filter(c=>c.id===p.topic).map(c=>c.name);}

function pickProgrammeTopic(s){let p=lifePlan(s);return p.topic==='mixed'?contents[Math.floor(rand(s)*contents.length)].id:p.topic;}



function setWorkMode(s,mode){

 if(s.stage==='end'||!['part','full','salary'].includes(mode))return false;

 const career=upgradeCareer(s);

 if(mode==='salary'&&!career.salary)career.salary={due:s.day+30,earned:0};

 if(career.mode!==mode&&mode==='salary')delete s.emergencyWorkUntil;

 career.mode=mode;

 return true;

}

function setPartTime(s,enabled){

 if(typeof enabled!=='boolean'||s.stage==='end')return false;

 return enabled&&upgradeCareer(s).mode==='semi'?true:setWorkMode(s,enabled?'part':'full');

}

function salaryTick(s){

 const career=upgradeCareer(s), salary=career.salary;

 if(!salary)return;

 if(career.mode==='salary')salary.earned+=salariedMonthlyPay/30;

 if(s.day>=salary.due){

  apply(s,{money:salary.earned},'正職薪資');

  salary.earned=0;

  salary.due=s.day+30;

  if(career.mode!=='salary')delete career.salary;

 }

}

function estimateWeeklyStats(s){

 const preview=JSON.parse(JSON.stringify(s));

 routinePreviews.add(preview);

 const before=trackedStats(preview);

 const plan=lifePlan(preview);

 // Forecast one full week using the current policy and the normal routine rules.

 for(let day=0;day<7;day++){

  preview.stage='focus';

  const rest=preview.health<(plan.pace==='health'?70:45)||preview.joy<40||journeyState(preview).voice>65;

  const action=policyAction(preview,rest);

  focus(preview,action);

  if(preview.stage==='content'){

   const topic=pickProgrammeTopic(preview);

   selectContent(preview,topic);

  }

  if(preview.stage==='end')break;

  preview.stage='result';

  advance(preview);

  if(preview.stage==='end')break;

 }

 const after=trackedStats(preview);

 return Object.fromEntries(Object.keys(before).map(key=>[key,whole(after[key]-before[key])]));

}

function needsRoutineRest(s){
 const {pace}=lifePlan(s);
 const threshold=pace==='slow'?75:pace==='comeback'?60:pace==='health'?70:45;
 return s.health<threshold||s.joy<40||journeyState(s).voice>65;
}

function estimateWeeklySchedule(s){

 const counts={live:0,work:0,rest:0,learn:0};

 const rest=needsRoutineRest(s);
 for(let offset=0;offset<7;offset++)counts[policyAction(s,rest,s.day+offset)]++;

 return counts;

}

function policyAction(s,rest,day=s.day){

 const p=lifePlan(s),d=day%7,mode=upgradeCareer(s).mode,partTime=mode!=='full';

 if(mode==='salary'){
  if(rest||s.health<45||p.pace==='mood'&&livingState(s).mood<55)return 'rest';
  return d<5?'work':d===6?'rest':'live';
 }

 if(rest||p.pace==='mood'&&(d===3||d===6||livingState(s).mood<55))return 'rest';

 if(partTime&&((s.emergencyWorkUntil||0)>day&&d!==6||s.money<costs(s)*14))return 'work';

 if(d===6||p.pace==='health'&&day%3===0)return 'rest';

 if(d===(p.pace==='career'?5:2))return 'learn';

 return partTime&&d===4&&p.pace!=='career'?'work':'live';

}



const topicPacks={

chat:[['聊天被沉默打斷','你提起一個話題後，聊天室安靜下來。也許大家需要更容易接話的開頭。'],['晚安時間與觀眾作息','不同時區的觀眾希望你改時間，但你自己的生活也需要穩定。'],['匿名信裡的難題','一封來信希望你替他做人生決定。你想陪伴，也知道自己無法代替對方選擇。'],['聊不完的童年回憶','熟客說起相似的成長經驗，新朋友也開始加入。今晚有機會變成系列起點。']],

game:[['隊友約定臨時改期','聯機隊友當天有事，你準備的內容需要重新安排。'],['攻略與劇透的界線','有人熱心提供解答，也有人希望保留第一次探索的驚喜。'],['觀眾期待連勝','連勝讓人氣上升，但你已經開始疲憊，下一局不一定能保持表現。'],['老遊戲突然回溫','一部冷門舊作重新受到討論，你熟悉它，卻不確定熱度能持續多久。']],

music:[['伴奏音量沒有對上','排練時沒注意到的音量差，在正式開唱後變得明顯。'],['一首歌反覆被點播','觀眾很喜歡你的代表曲，你也想讓其他作品被聽見。'],['排練與公開練唱','你想挑戰新曲，但練習過程不一定像完整表演那樣好看。'],['合唱邀請的調性','朋友提議合唱，曲目很吸引人，調性卻不適合現在的你。']],

art:[['委託修改次數增加','對方多次調整需求，原本排好的創作時間逐漸被吃掉。'],['繪圖過程被誤解','一張未完成的截圖被拿來評論，完整構想還沒有呈現。'],['觀眾想看不同畫風','熟悉的風格很穩定，但轉換題材可能帶來新的靈感。'],['創作直播的空白時間','需要思考時你會安靜，觀眾想知道你正在做什麼決定。']],

asmr:[['音量太小還是太近','不同耳機的觀眾回饋不一，你需要找出適合大多數人的範圍。'],['觀眾臨時指定音效','有人點播你還不熟悉的聲音，希望今晚立刻嘗試。'],['劇本需要留白','你寫了很多台詞，但排練時發現安靜也可以是內容的一部分。'],['睡前觀眾的播放需求','有人只聽回放，希望你保留較完整的收尾與段落標記。']],

memes:[['本台梗開始傳到外面','熟客聽得懂的笑話被陌生觀眾截出來，少了原本的語境。'],['投票結果讓企劃走偏','觀眾選出的方向很有趣，卻和你準備的內容差很多。'],['互動活動獎勵怎麼分','參與者比預期多，你需要公平又能負擔的安排。'],['新來的觀眾想一起玩','熟客已經開始下一輪，第一次參加的人還在找規則。']],

current:[['舊聞被當成今天的消息','一則被大量轉傳的截圖，日期其實不是今天。'],['不同立場都想被聽見','聊天室有人希望完整表達，也有人擔心討論變成互相攻擊。'],['熱門話題還缺關鍵資料','話題正在升溫，現在評論能抓住注意，卻可能過早下結論。'],['玩笑被當成正式立場','原本的一句吐槽引起認真爭論，你需要重新說清楚語境。']]

};

for(let [topic,pack]of Object.entries(topicPacks))for(let [i,[title,body]]of pack.entries())events.push({id:'expanded_'+topic+'_'+i,topics:[contents.find(c=>c.id===topic).name],title,body,tag:'直播日常',major:true,choices:[C('先調整內容與流程','投入心力解決問題，累積實力。',{health:-4,skill:6}),C('和觀眾說清楚，一起找平衡','保留互動與界線。',{bond:6,joy:2}),C('縮小今天的安排，下次再完成','照顧體力，接受今天的限制。',{health:8,joy:3})]});

for(let [i,[title,body]]of [

['房租續約通知','房東提出續約條件，你得在工作空間與生活預算間做取捨。'],['朋友的平日晚餐','很久沒見面的朋友約你吃飯，時間剛好撞上原本的直播安排。'],['家中設備需要整理','線材和雜物堆滿桌邊，找到東西比以前花更多時間。'],['白天工作的新任務','工作內容臨時增加，今晚的創作安排需要重新排序。'],['想放假的念頭','連續忙了一陣子，你想替自己留一段沒有更新壓力的時間。'],['收到觀眾手寫信','一封實體信讓螢幕裡的陪伴有了重量，你想好好回應。'],['過度比較的晚上','看到別人的成績後，你又打開自己的後台數字。'],['第一次整理年度作品','把作品放在一起，你發現進步並不總是表現在追蹤數上。']].entries())events.push({id:'expanded_life_'+i,title,body,tag:'螢幕之外',choices:[C('花時間整理與溝通','多一點心力，釐清接下來的安排。',{health:-4,skill:4,network:3}),C('編一筆生活預算處理','支出 600，換取一些餘裕。',{money:-600,joy:6,health:6}),C('先休息，明天再決定方向','讓思緒慢下來。',{health:9,joy:3})]});

for(let [i,[title,body,n]]of [

['會員回放整理得到回應','你整理的段落標記讓觀眾更容易回顧，願意支持的人增加了。',10],['小型會員交流企劃','一場不追求規模的交流，讓參與者更理解你的創作過程。',15],['公開作品帶來支持者','新觀眾從作品認識你，有人想用會員支持之後的更新。',18],['會員方案說明需要更清楚','觀眾不確定會員包含什麼，希望你說清楚能長期維持的內容。',8]].entries())events.push({id:'expanded_member_'+i,title,body,tag:'獨立會員',minFans:1000,major:true,choices:[C('安排一段內容介紹','新增 '+n+' 位會員，額外投入準備。',{health:-5},{subscriberGain:n}),C('簡單說明，不增加過多承諾','新增 '+Math.ceil(n/2)+' 位會員。',{skill:3},{subscriberGain:Math.ceil(n/2)}),C('先維持現有內容','保留現在的更新品質。',{health:6,joy:3})]});

for(let [i,[title,body,rarity]]of [

['海外觀眾替你翻譯片段','一群觀眾整理了字幕，讓不同語言的人第一次理解你的節目。','rare'],['作品被展覽主辦方看見','主辦方邀請你提供展示內容，但你需要確認製作時程。','rare'],['合作檔期臨時出現空缺','一場適合你的活動突然空出名額，準備時間卻很短。','low'],['錄影素材出現罕見錯誤','檔案還能開啟，卻有部分畫面與聲音不同步，需要花時間重整。','low']].entries())events.push({id:'expanded_unusual_'+i,title,body,rarity,storyOnly:true,major:true,tag:rarity==='rare'?'稀有相遇':'低機率插曲',choices:[C('投入準備，把機會接好','支出 1,000，增加實力與人脈。',{money:-1000,skill:10,network:10}),C('找夥伴一起研究','用溝通確認適合自己的方式。',{health:-6,network:7,joy:3}),C('保留自己的步調','接受機會未必需要立刻答應。',{health:7,joy:5})]});



const livingCategories=[

{id:'food',name:'食',prices:[3000,4500,7000],labels:['簡單自炊','均衡飲食','充裕餐食']},

{id:'clothing',name:'衣',prices:[150,350,900],labels:['必要替換','日常整理','添購搭配']},

{id:'housing',name:'住',prices:[2500,4500,8000],labels:['精簡空間','一般住處','舒適住處']},

{id:'transport',name:'行',prices:[300,700,1800],labels:['步行與大眾運輸','基本通勤','彈性交通']},

{id:'education',name:'育',prices:[100,400,1500],labels:['免費資源為主','固定學習預算','進修預算']},

{id:'leisure',name:'樂',prices:[150,500,1800],labels:['低花費休閒','日常娛樂','充裕休閒']}

];

function livingState(s){if(!s.living)s.living={mood:70,physical:75,levels:Object.fromEntries(livingCategories.map(c=>[c.id,1])),nextBill:s.day+30,paid:0,lastBill:null,services:{},ending:null};return s.living;}

function estimateIncidentalExpenses(s){

 const recent=(s.expenses||[]).filter(row=>row.reason==='當日零星支出'&&row.day> s.day-30);

 if(!recent.length&&s.day<30)return Math.round(30*.12*62.5);

 return recent.reduce((sum,row)=>sum+row.amount,0);

}

function livingInfo(s){let l=livingState(s),factor=Math.min(2.5,Math.pow(1.02,s.day/360)),rows=livingCategories.map(c=>({...c,level:l.levels[c.id],cost:c.id==='housing'&&creditState(s).home?0:Math.round(c.prices[l.levels[c.id]]*factor)})),extra=!creditState(s).home&&s.career?.home==='quiet'?750:0;return {...l,rows,monthly:rows.reduce((n,c)=>n+c.cost,extra),extra};}

function setLivingLevel(s,id,level){if(s.stage==='end'||!livingCategories.some(c=>c.id===id)||!Number.isInteger(level)||level<0||level>2)return false;livingState(s).levels[id]=level;return true;}

const lifeServices=[{id:'meal',name:'好好吃一頓',cost:350,mood:6,physical:3},{id:'outing',name:'散步與小旅行',cost:800,mood:12,physical:2},{id:'checkup',name:'健康檢查與照護安排',cost:1800,mood:2,physical:12},{id:'exercise',name:'運動與伸展課',cost:600,mood:4,physical:8},{id:'counselling',name:'安排諮詢與支持時間',cost:1200,mood:12,physical:0},{id:'break',name:'休假與休閒活動',cost:1500,mood:16,physical:5}];

function buyLifeService(s,id){let p=lifeServices.find(p=>p.id===id),l=livingState(s);if(!p||s.stage==='end'||s.money<p.cost||l.services[id]!==undefined&&s.day-l.services[id]<7)return false;apply(s,{money:-p.cost},p.name);l.mood=clamp(l.mood+p.mood,0,100);l.physical=clamp(l.physical+p.physical,0,100);l.services[id]=s.day;record(s,{title:p.name,choice:'生活照顧支出 '+p.cost,text:'心情 +'+p.mood+'、健康 +'+p.physical+'（最高 100）。'});return true;}

function livingTick(s){let l=livingState(s),lv=l.levels,rest=['rest','retire'].includes(s.dailyAction);l.mood=whole(clamp(l.mood+whole((rest?(s.plan?.pace==='mood'?3:.8):-.4)+(lv.leisure-1)*.1+(lv.housing-1)*.04+(lv.clothing-1)*.03),0,100));l.physical=whole(clamp(l.physical+whole((rest?1:-1)+(lv.food-1)*.1+(lv.transport-1)*.02-Math.max(0,ageNow(s)-60)*.001-(s.plan?.pace==='venture'&&!rest?.5:0)),0,100));apply(s,{skill:s.dailyAction==='learn'?0:-.08,bond:s.dailyAction==='live'?-.04:-.16});if(s.day%7===0&&lv.education>0)apply(s,{skill:lv.education*.12});if(l.mood<25)apply(s,{joy:-.5});if(l.physical<25)apply(s,{health:-.5});if(s.day>=l.nextBill){let info=livingInfo(s);apply(s,{money:-info.monthly},'基本支出');l.paid+=info.monthly;l.lastBill={day:s.day,total:info.monthly,rows:info.rows.map(c=>({name:c.name,cost:c.cost})),extra:info.extra};l.nextBill=s.day+30;if(s.money<0){l.mood=Math.max(0,l.mood-5);}record(s,{title:'基本支出',choice:'支出 '+info.monthly,text:'本月基本支出已扣除。'});}}

function endingFor(s,retired=false){let l=livingState(s),wealth=netWorth(s),works=s.career?.totalWorks||0,friends=s.life.contacts.filter(c=>c.trust>=60).length;const completed=s.life.completed;
const broadcasts=broadcastCounts(s);
const archiveCount=Object.values(broadcasts).filter(count=>count>=30).length;
const followups=s.used.filter(id=>id.startsWith('followup_')).length;
let options=[

[wealth<0,'仍然走過的路','生活帳單與創作壓力留下了負擔，但你的努力與相遇也真實存在。'],

[l.physical<30,'學會慢下來','這段路讓你明白，照顧身體也是創作人生的一部分。'],

[l.mood<30,'尋回自己的聲音','曾經為期待付出太多，最後你把注意力慢慢帶回自己的生活。'],

[s.peak>=1000000,'百萬人的晚安','最後一場直播，來自各地的觀眾接力向你說晚安。你從第一個留言開始，把這些年的故事慢慢說完。'],

[completed.includes('model3d')&&completed.includes('mocap')&&completed.includes('concert'),'謝幕前的最後一舞','你用一路升級的舞台完成最後一支舞。謝幕時，螢幕另一端還有觀眾揮著螢光棒。'],

[s.peak>=100000,'被很多人記住的頻道','你的作品走進了許多人的日常，留下不只屬於數字的影響。'],

[completed.includes('ku100')&&(broadcasts.asmr||0)>=150,'把長夜留在錄音裡','聽眾把你的雨聲和耳語留在睡前清單裡。你離開麥克風後，這些聲音仍陪著晚睡的人。'],

[archiveCount>=5,'把頻道做成一座遊樂場','不同節目的觀眾來到最後一場直播。有人記得你第一次唱歌，有人還在等那個沒打完的關卡。'],

[followups>=12,'每封回信都留了下來','你整理出十二段曾經有過後續的故事。有人帶來新的合作，也有人回來把當年沒說完的話說清楚。'],

[works>=20,'留下一座作品室','一次次準備與完成，累積成關台後仍能被看見的作品。'],

[friends>=2,'有人一起走的路','長期相處留下了信任，創作之外也有願意互相支持的人。'],

[wealth>=500000,'有餘裕的下一章','你為生活累積了餘裕，能用自己的步調安排往後的時間。'],

[l.mood>=65&&l.physical>=65,'把生活也過好了','你在創作、身體和日常之間，留下了適合自己的平衡。'],

[true,'平凡而完整的晚安','不一定有盛大的成果，日常的相遇依然構成了完整的一生。']];let pick=options.find(x=>x[0]);return {title:(retired?'退休 · ':'')+pick[1],body:pick[2]+' 走過 '+s.day+' 天，最高 '+s.peak+' 人追蹤；心情 '+l.mood+'、健康 '+Math.round(l.physical)+'。',retired};}

function retireLife(s){if(ageNow(s)<65||s.stage==='end'||s.stage==='broadcast'||s.lastSecretEndingDay===s.day)return false;if(checkEndingPriority(s))return true;s.summary=endingFor(s,true);s.stage='end';livingState(s).ending=s.summary;return true;}

for(let [i,[title,body,mood,physical]]of [

['一頓熱飯的時間','忙了一整天後，你發現自己還沒好好吃飯。',6,5],['週末的公園','朋友邀你離開螢幕，出去走一小段路。',7,5],['睡眠被工作切碎','連續幾晚在半夜醒來，白天比以前更難集中。',5,8],['想換一件喜歡的衣服','很久沒替自己的生活挑選過東西了。',8,1],['通勤路上的疲憊','來回的路程占用了不少精力，你想重新安排。',5,5],['一場想看的演出','喜歡的演出有新的場次，但票價也需要預算。',10,0],['年度健康提醒','行事曆提醒你，可以安排一次照護自己的時間。',2,10],['想把煩惱說出口','最近的心事反覆出現，你想找一個願意聽你說話的人。',10,2],['生活帳單比想像中重','整理開支時，你看見好幾筆一直忽略的小額支出。',5,2],['一個沒有工作的下午','今天有一段空白時間，可以留給自己。',8,5]

].entries())events.push({id:'wellbeing_'+i,title,body,tag:'心情與健康',choices:[C('安排預算照顧自己','支出 600，改善心情與健康。',{money:-600},{wellbeing:{mood,physical}}),C('用低花費的方式調整','花時間休息與整理，不額外花錢。',{health:4},{wellbeing:{mood:Math.ceil(mood/2),physical:Math.ceil(physical/2)}}),C('先完成工作，晚點再處理','保留金錢，但忽略照顧會有代價。',{skill:3},{wellbeing:{mood:-4,physical:-3}})]});



const homes=[{id:'small',name:'小型中古自住房',price:4500000},{id:'flat',name:'一般中古公寓',price:8500000},{id:'studiohome',name:'住宅與工作空間',price:12500000}];

function creditState(s){if(!s.credit)s.credit={home:null,loans:[],nextId:1,notice:''};return s.credit;}

function loanPayment(amount,apr,months){let r=apr/12;return Math.ceil(amount*r/(1-Math.pow(1+r,-months)));}

function loanInfo(s){let c=creditState(s);return {...c,balance:c.loans.reduce((n,l)=>n+l.balance,0),monthly:c.loans.reduce((n,l)=>n+Math.min(l.payment,l.balance*(1+l.apr/12)),0),limit:Math.min(50000,10000+Math.floor(s.fans*.25))};}

function borrow(s,amount,months,purpose='其他用途'){let c=creditState(s),info=loanInfo(s);if(s.stage==='end'||!Number.isSafeInteger(amount)||amount<1000||amount>info.limit||![12,24,36].includes(months)||c.loans.some(l=>l.kind==='personal'||l.missed>=3)||typeof purpose!=='string')return false;c.loans.push({id:c.nextId++,kind:'personal',purpose:purpose.slice(0,40),balance:amount,original:amount,apr:.09,payment:loanPayment(amount,.09,months),due:s.day+30,months,missed:0,paid:0});apply(s,{money:amount},'貸款入帳 · '+purpose.slice(0,40));record(s,{title:'申請一般貸款',choice:purpose.slice(0,40)+' · '+amount,text:'年利率 9%，每 30 天自動還款；資金不足會形成逾期。'});return true;}

function buyHome(s,id,downPercent=20){let c=creditState(s),h=homes.find(h=>h.id===id);if(s.stage==='end'||c.home||!h||![20,40,100].includes(downPercent)||c.loans.some(l=>l.missed>=3))return false;let down=h.price*downPercent/100;if(s.money<down)return false;apply(s,{money:-down},'購屋付款 · '+h.name);c.home={id,price:h.price,bought:s.day};if(downPercent<100){let amount=h.price-down;c.loans.push({id:c.nextId++,kind:'mortgage',purpose:h.name+'房貸',balance:amount,original:amount,apr:.03,payment:loanPayment(amount,.03,240),due:s.day+30,months:240,missed:0,paid:0});}record(s,{title:'買下自己的住處',choice:h.name,text:'支付 '+down+'，以後不再收租屋費；有房貸時仍須每月還款。'});return true;}

function repayLoan(s,id,amount){let l=creditState(s).loans.find(l=>l.id===id);if(!l||s.stage==='end'||!Number.isSafeInteger(amount)||amount<1)return false;let paid=Math.min(amount,l.balance);if(paid>s.money)return false;apply(s,{money:-paid},'提前還本金 · '+l.purpose);l.balance=round(l.balance-paid);l.paid+=paid;if(l.balance<=.01)creditState(s).loans=creditState(s).loans.filter(v=>v.id!==id);record(s,{title:'提前還款',choice:'償還本金 '+paid,text:'本金減少，下期利息會按剩餘本金計算。'});return true;}

function creditTick(s){let c=creditState(s);c.notice='';for(let l of c.loans){if(s.day<l.due)continue;let interest=round(l.balance*l.apr/12),due=round(Math.min(l.payment,l.balance+interest)),paid=round(Math.min(Math.max(0,s.money),due));apply(s,{money:-paid},'每月還款 · '+l.purpose);l.balance=round(l.balance+interest-paid);l.paid+=paid;l.months=Math.max(0,l.months-1);if(paid<due){l.missed++;let fee=Math.min(100,Math.ceil(l.balance*.005));l.balance=round(l.balance+fee);c.notice='貸款逾期：本期應付 '+due+'，實付 '+paid+'，未還款與利息仍在本金中。';}else l.missed=0;l.due=s.day+30;record(s,{title:'每月貸款還款',choice:l.purpose+' · 支付 '+paid,text:'本期利息 '+interest+'，剩餘本金 '+l.balance+(paid<due?'；不足額還款，已逾期。':'。')});}c.loans=c.loans.filter(l=>l.balance>.01);}

function netWorth(s){return s.money+marketValue(s)+(creditState(s).home?.price||0)-loanInfo(s).balance;}

function careAutomation(s){let l=livingState(s);if(!l.autoCare)l.autoCare={};return l.autoCare;}

function setAutoCare(s,id,on,every=7){if(s.stage==='end'||!lifeServices.some(p=>p.id===id)||typeof on!=='boolean'||![7,14,30].includes(every))return false;let a=careAutomation(s),old=a[id];a[id]={on,every,due:old?.due??s.day+every};if(old&&old.every!==every||on&&!old?.on)a[id].due=s.day+every;return true;}

function autoCareTick(s){let a=careAutomation(s);for(let p of lifeServices){let setting=a[p.id];if(!setting?.on||s.day<setting.due)continue;setting.due=s.day+setting.every;let reserve=livingInfo(s).monthly+loanInfo(s).monthly;if(s.money-p.cost<reserve){record(s,{title:'自動照顧略過',choice:p.name,text:'保留下一期生活費與還款預算，等待下次安排。'});continue;}if(buyLifeService(s,p.id))record(s,{title:'定期生活照顧',choice:p.name,text:'依自動安排執行，下次第 '+(setting.due+1)+' 天。'});}}



const opportunitySpecs=[

 ['care','需要一段照顧自己的時間','選擇安排照顧，或留時間休息。'],

 ['equipment','一項設備值得添購嗎？','商家提出一項升級，現在要把資金用在這裡嗎？'],

 ['investment','這個月的投資機會','可以用少量交易，市場變動仍有風險。'],

 ['housing','有一間房可以考慮','比較頭期款、房貸與租金，再決定是否搬進自己的住處。'],

 ['credit','一筆資金怎麼安排','可以借款週轉，也可以提前償還已有貸款。'],

 ['friends','同行約你聊聊近況','一起聊聊、交換意見，或留時間給自己的生活。'],

 ['work','有機會做一個特別節目','投入預算完成企劃，成效有好有壞。'],

 ['budget','這個月要怎麼過？','調整食衣住行育樂預算，從下一張帳單開始生效。'],

 ['retirement','要不要正式退休？','你可以結束創作生涯並查看結局，或繼續過日子。']

];

for(const [id,title,body] of opportunitySpecs){

 events.push({id:'monthly_'+id,title,body,tag:'每月選擇',major:true,repeatable:true,storyOnly:true,choices:[C('先維持目前安排','保留資金與目前設定。')]});

}

function shopProductIds(s){

 if(!s.shopProducts){

  const old=s.productPreferences;

  s.shopProducts=[...new Set([...(old?.hidden||[]),...Object.keys(old?.deferred||{})])];

 }

 const last=s.productOffer?.id;
 if(last&&!s.shopProducts.includes(last))s.shopProducts.push(last);
 return s.shopProducts;

}

function shopProducts(s){

 const life=upgradeLife(s);

 return shopProductIds(s).flatMap(id=>{

  const product=projects.find(p=>p.id===id);

  if(!product||product.route&&product.route!==s.route||life.completed.includes(id)||life.project?.id===id)return [];

  return [{product,status:projectStatus(s,product)||(s.money<product.cost?'現金不足':'')}];

 });

}

function buyShopProduct(s,id){

 return shopProducts(s).some(row=>row.product.id===id&&!row.status)&&startProject(s,id,true);

}

function availableProducts(s){

 const listed=shopProductIds(s);

 return projects.filter(p=>s.money>=p.cost&&!projectStatus(s,p)&&!listed.includes(p.id));

}

function broadcastCounts(s){

 if(s.broadcastCounts)return s.broadcastCounts;

 const counts=Object.fromEntries(contents.map(c=>[c.id,0]));

 const byContent=new Map(contents.map(c=>['認真開台 · '+c.name,c.id]));

 const seen=new Set();

 for(const row of s.history){

  const topic=byContent.get(row.content);

  if(topic&&!seen.has(row.day)){

   counts[topic]++;

   seen.add(row.day);

  }

 }

 s.broadcastCounts=counts;

 return counts;

}

function recommendedProduct(s){

 const eligible=availableProducts(s);

 const counts=broadcastCounts(s);

 const max=Math.max(...contents.map(c=>counts[c.id]));

 const leaders=new Set(contents.filter(c=>max>0&&counts[c.id]===max).map(c=>c.id));

 const matching=eligible.filter(p=>p.topics?.some(topic=>leaders.has(topic)));

 const general=eligible.filter(p=>!p.topics?.length);

 const pool=matching.length?matching:general;

 const fresh=pool.filter(p=>p.id!==s.productOffer?.id);

 const choices=fresh.length?fresh:pool;

 return choices[((s.seed??0)+s.day)%choices.length];

}

function monthlyChoices(s,e){

 const id=e.id.slice(8), variant=(s.seed+s.day)>>>0;

 const skip=C('維持目前安排','保留目前的資金和安排。');

 const offer=(label,note,action,cost=0)=>C(label,note,{}, {opportunity:action,requiredCash:cost});

 let choices=[];

 if(id==='care'){

  const care=lifeServices[variant%lifeServices.length];

  choices=[offer(care.name,'支付 '+care.cost+'，心情 +'+care.mood+'，健康 +'+care.physical+'。',{type:'care',id:care.id},care.cost),C('留在家休息','心情 +4，健康 +2。',{}, {wellbeing:{mood:4,physical:2}})];

 }else if(id==='equipment'){

  const item=s.productOffer?.day===s.day

   ?projects.find(p=>p.id===s.productOffer.id&&!projectStatus(s,p))

   :recommendedProduct(s);

  if(!item)return {...e,title:'這個月先照原計畫',body:'目前沒有適合的商品。',choices:[skip]};

  return {...e,title:'購買機會 · '+item.name,body:item.desc,choices:[

   offer('購買 '+item.name,'付款 '+item.cost+'，'+item.days+' 天後交付。',{type:'equipment',id:item.id},item.cost),

   offer('繼續原本的行程','商品已列入商城，之後可購買。',{type:'listProduct',id:item.id})

  ]};

 }else if(id==='investment'){

  const asset=assets[variant%assets.length];

  const holding=assets.find(a=>s.market.positions[a.id].qty>0);

  const buy=quote(s,asset.id,'buy',1);

  if(buy.ok)choices.push(offer('買入 '+asset.name+' 1 單位','預計支出 '+buy.cash+'。',{type:'trade',side:'buy',id:asset.id,qty:1},buy.cash));

  if(holding){

   const qty=Math.min(5,s.market.positions[holding.id].qty), sell=quote(s,holding.id,'sell',qty);

   if(sell.ok)choices.push(offer('賣出 '+holding.name+' '+qty+' 單位','預計入帳 '+sell.cash+'。',{type:'trade',side:'sell',id:holding.id,qty}));

  }

 }else if(id==='housing'){

  if(!creditState(s).home)choices=homes.filter(home=>s.money>=home.price*.2).map(home=>offer(

   '購買'+home.name,'總價 '+home.price.toLocaleString('zh-TW')+'，頭期款 '+(home.price*.2).toLocaleString('zh-TW')+'，房貸每期約 '+loanPayment(home.price*.8,.03,240)+'。買下後免租。',

   {type:'home',id:home.id},home.price*.2));



 }else if(id==='credit'){

  const loan=creditState(s).loans[0];

  if(loan)choices=[offer('提前還本金','最多還 1,000，減少後續利息。',{type:'repay',id:loan.id},Math.min(1000,loan.balance))];

  else choices=[offer('借 5,000 週轉','年利率 9%，分 12 期還款。',{type:'borrow'})];

 }else if(id==='friends'){

  const contact=s.life.contacts[variant%s.life.contacts.length];

  choices=[C('和'+contact.name+'聊近況','支出 80，信任 +7。',{money:-80},{life:{contact:contact.id,trust:7}}),C('留在家陪伴自己','心情 +5。',{}, {wellbeing:{mood:5,physical:0}})];

 }else if(id==='work'){

  if(s.career.production){

   const plan=showPlan(s), work=s.career.production;

   choices=[offer(work.prep<plan.need?'安排下一次準備':'安排正式播出','安排在下一個創作日。',{type:'show',action:work.prep<plan.need?'prepare':'publish'})];

  }else{const show=shows.find(p=>!showStatus(s,p.id));if(show)choices.push(offer('立項：'+show.name,'製作預算 '+show.cost+'，之後可在每月事件繼續準備。',{type:'startShow',id:show.id},show.cost));choices.push(C('製作一集特別節目','支出 1,200。可能得到較多曝光，也可能反應平淡。',{money:-1200,health:-6},{chance:.6,win:{fans:220,joy:6,money:1500},lose:{fans:15,joy:-6}}));}

 }else if(id==='retirement'){

  if(ageNow(s)>=65)choices=[offer('正式退休並查看結局','結束這段人生。',{type:'retire'})];

 }else if(id==='budget'){

  choices=[offer('改為節省預算','六項基本生活支出採低檔。',{type:'budget',level:0}),offer('改為一般預算','六項基本生活支出採中檔。',{type:'budget',level:1})];

 }

 return {...e,choices:[...choices,skip]};

}

function applyOpportunity(s,a){

 switch(a.type){

 case 'care':return buyLifeService(s,a.id);

 case 'equipment':return startProject(s,a.id,true);

 case 'listProduct':{

  const ids=shopProductIds(s);

  if(!ids.includes(a.id))ids.push(a.id);

  return true;

 }

 case 'trade':return trade(s,a.id,a.side,a.qty).ok;

 case 'home':return buyHome(s,a.id,20);

 case 'borrow':return borrow(s,5000,12,'生活週轉');

 case 'repay':return repayLoan(s,a.id,1000);

 case 'retire':return retireLife(s);

 case 'startShow':return startShow(s,a.id);

 case 'show':return queueActivity(s,'workShow',a.action);

 case 'budget':for(const c of livingCategories)setLivingLevel(s,c.id,a.level);return true;

 default:return false;

 }

}

const weeklyTiers=[

 {id:'legendary',name:'傳說',chance:.005,reward:15000,fans:3000},

 {id:'epic',name:'史詩',chance:.01,reward:3750,fans:750},

 {id:'rare',name:'稀有',chance:.03,reward:1200,fans:240},

 {id:'low',name:'少見',chance:.065,reward:450,fans:90},

 {id:'common',name:'普通',chance:.19,reward:150,fans:30}

];

const topicEventTitles={

 chat:['聊天室的深夜問答','觀眾寄來一箱手寫故事','深夜電台邀你代班','城市聲音展邀你主持','一整晚的全島接力聊天室'],

 game:['觀眾提議無傷挑戰','冷門遊戲的作者來訪','受邀參加實況主盃','新作發表會指定試玩','國際電競總決賽的開幕挑戰'],

 music:['觀眾點了一首沒唱過的歌','獨立樂團邀你合唱','收到原創單曲合作邀請','音樂祭邀你壓軸演出','為跨年轉播錄製主題曲'],

 art:['觀眾提出限色繪畫題','插畫同好揪你接力作畫','出版社邀你畫封面','美術館邀你現場作畫','跨國藝術節為你保留主展間'],

 asmr:['聊天室想聽雨聲特輯','有人借你一組雙耳麥克風','聲音設計師邀你合作','沉浸式劇場委託夜間聲景','世界聲音展邀你製作主展聲景'],

 memes:['聊天室發起迷因改圖賽','梗圖原作者來串台','短片節邀你做迷因專場','年度網路文化展邀你策展','跨國迷因節邀你主持首播'],

 current:['觀眾請你整理一則熱門新聞','記者邀你交流查核方法','公民團體邀你主持座談','公共媒體邀你製作專題','國際論壇邀你主持跨國對談']

};

const orderedTiers=[...weeklyTiers].reverse();

for(const [topic,titles] of Object.entries(topicEventTitles)){

 const name=contents.find(c=>c.id===topic).name;

 for(const [index,title] of titles.entries()){

  const tier=orderedTiers[index];

  events.push({id:'weekly_'+topic+'_'+tier.id,title,tag:name,topics:[name],rarity:tier.id==='common'?undefined:tier.id,topicSpecial:true,

   body:index<2?'這個提案很適合你平常的直播。你想怎麼安排這次內容？':'這次邀請會讓更多人認識你的頻道。對方希望你確認合作方式和準備時間。',

   choices:[C('親自準備並接下','投入體力與熱情，取得全額回報。',{health:-4-index*2,joy:-index},{weeklyReward:1}),

    C('縮小規模後接下','減輕準備壓力，取得六成回報。',{health:-2},{weeklyReward:.6}),

    C('婉拒這次邀請','把時間留給原本的節目。',{}, {weeklyReward:0})]

  });

 }

}

for(const e of events){

 if(e.rarity||e.queued||e.storyOnly||e.route==='真人主播')continue;

 const promoted=/^expanded_(chat|game|music|art|asmr|memes|current|life|member)_([0-9]+)$/.exec(e.id);

 if(promoted){

  const index=Number(promoted[2]);

  if(index>=1)e.rarity=['','low','rare','epic'][index%4]||'low';

 }

}

// Each row follows the order common, low, rare, epic, legendary.

const newTopicEvents={

 chat:[

  ['把一週的小事寫成明信片','大家想交換一件最近值得記住的小事。','開放觀眾投稿'],

  ['凌晨便利商店的故事','一位夜班店員想連線聊聊深夜遇到的人。','安排夜班故事連線'],

  ['老觀眾帶來一卷錄音帶','幾位觀眾留下了這些年的聲音日記，想和你做一集回顧。','剪輯並播出聲音日記'],

  ['替地方影展做映後訪談','導演願意把首映後的對談交給你主持。','準備完整映後專場'],

  ['一百個城市的深夜來電','公共電台邀你主持跨城市的故事接力。','主持跨城市接力']

 ],

 game:[

  ['觀眾替你設計練習關卡','幾個觀眾做了可分享的地圖，想看你一一試玩。','試玩整套觀眾地圖'],

  ['速通玩家想交換路線','對方發現你走的路線很特別，想把兩種打法同場比較。','一起跑完整流程'],

  ['工作室借出未公開的關卡','測試版允許你公開指定關卡，製作人也願意一起回答問題。','籌備實機試玩直播'],

  ['街機館要辦復古挑戰夜','館方願意出借機台與場地，請你設計一整晚的挑戰。','主持街機挑戰夜'],

  ['經典系列邀你參與十週年企劃','開發團隊要公開歷代原型，也想讓你帶觀眾重走系列歷史。','製作十週年實況特輯']

 ],

 music:[

  ['用三個和弦寫一段片頭','觀眾投票選了三個和弦，想看看最後會寫出什麼。','現場寫曲並錄下片頭'],

  ['隔壁練團室傳來和聲','樂手聽見你練歌，提議為下一場加一段不插電伴奏。','排練完整不插電合奏'],

  ['紀錄片缺一首片尾歌','導演寄來片尾畫面，希望你寫一段唱得出故事的旋律。','完成片尾曲與現場首唱'],

  ['交響樂團邀你合作改編','樂團想把你的歌改成弦樂版本，並公開排練過程。','參與編曲與現場演出'],

  ['巡演的最後一晚','製作團隊邀你為巡演終站策畫原創合唱組曲。','製作巡演終站組曲']

 ],

 art:[

  ['一張紙只能用一支筆','觀眾提議把平常的繪圖台改成單色速寫。','完成一組單色速寫'],

  ['書店窗邊留了一塊畫板','店員希望你畫下附近居民的日常，並在店內展出。','完成書店窗邊插畫'],

  ['桌遊團隊想借你的筆觸','設計師寄來尚未公開的角色卡，希望你替它們畫一組肖像。','繪製完整角色卡組'],

  ['車站長廊的牆面委託','地方策展人想把你的手稿放大成旅客每天經過的壁畫。','完成長廊壁畫設計'],

  ['為一座城市畫一年','城市藝術計畫邀你用四季連作記錄街區變化。','接下四季連作委託']

 ],

 asmr:[

  ['把整理桌面的聲音錄下來','觀眾想聽紙張、鉛筆盒和杯墊各自的聲音。','錄一整段桌面整理'],

  ['深夜書店借你一小時','打烊後能錄下翻頁、木地板和書架上的細碎聲音。','收錄深夜書店特輯'],

  ['觀星活動想做聲音導覽','主辦方希望閉上眼也能感受到山上的風和夜晚。','製作觀星聲音導覽'],

  ['夜間列車的聲景委託','展覽希望你用車門、軌道和雨聲重現一段夜行旅程。','製作雙耳列車聲景'],

  ['把正在消失的聲音留下來','聲音典藏團隊邀你採錄老街工坊和夜市收攤的聲音。','參與聲音典藏專案']

 ],

 memes:[

  ['同一句話被剪成七個版本','聊天室想票選哪個版本最能代表這一週。','舉辦剪輯票選直播'],

  ['社群替你做了配音包','創作者希望你首播並逐一介紹每段配音的由來。','策畫完整配音首播'],

  ['喜劇團來問梗的來歷','對方想把直播梗做成短劇，也願意讓原作者一起上台。','參與短劇編排與演出'],

  ['資料館要收錄一代流行語','策展團隊希望你採訪創作者，整理有來源的迷因年表。','策畫迷因口述史'],

  ['十個時區一起接梗','跨國直播活動要你主持多語迷因翻譯接力。','主持跨語接力直播']

 ],

 current:[

  ['同一條新聞出現兩種說法','觀眾把不同報導貼在一起，想知道原始資料在哪裡。','準備資料來源比較'],

  ['地方議題收到當事人回信','對方願意上直播說明，也希望你先整理常見疑問。','做一場查證與訪談'],

  ['社區邀你主持公開對談','幾組不同立場的居民都願意來談，希望你先訂好發言規則。','主持完整社區對談'],

  ['跨媒體查核專題邀約','幾家編輯室願意提供資料，邀你做一場能看懂來源的公開解說。','製作跨媒體查核專題'],

  ['重大公共議題的跨國連線','各地研究者想把不同地區的經驗放在同一場直播裡討論。','主持跨國公共議題直播']

 ]

};

function addWeeklyOpportunity(id,tier,title,body,choice,topic){

 const index=orderedTiers.indexOf(tier);

 const name=contents.find(c=>c.id===topic)?.name;

 events.push({id,title,body,tag:name||'創作者生涯',topics:name?[name]:undefined,

  rarity:tier.id==='common'?undefined:tier.id,topicSpecial:!!name,

  choices:[

   C(choice,'投入體力，領取本次全額回報。',{health:-4-index*2,joy:-index},{weeklyReward:1}),

   C('只接一部分','保留體力，領取本次六成回報。',{health:-2},{weeklyReward:.6}),

   C('婉謝邀請','保留原有行程。',{}, {weeklyReward:0})

  ]});

}

for(const [topic,entries] of Object.entries(newTopicEvents)){

 entries.forEach(([title,body,choice],index)=>addWeeklyOpportunity(

  'weekly_'+topic+'_extra_'+orderedTiers[index].id,orderedTiers[index],title,body,choice,topic

 ));

}

const generalOpportunities={

 low:[

  ['共享工作室的空檔','附近工作室有半天空檔，願意請你幫忙試用並回報設備問題。','接下工作室測試'],

  ['小型活動需要救場','社區活動少了一名主持人，主辦方可以配合你的空檔。','接下一段主持'],

  ['幫新創作者整理開台流程','一群剛入行的創作者想借你的經驗做一份入門手冊。','主持經驗分享']

 ],

 rare:[

  ['創作者聯盟的公開工作坊','幾個頻道聯合辦活動，邀你設計一節公開課。','接下工作坊講師'],

  ['影像團隊想記錄你的工作日','對方希望跟拍一天，呈現開台背後的準備與收工。','參與工作日紀錄'],

  ['地方創作者基金徵件入選','你的提案通過初選，可以選擇執行完整計畫或縮小範圍。','執行入選企劃']

 ],

 epic:[

  ['年度創作者大會邀你主持','活動方邀你串聯幾場訪談，並保留一段給你的頻道。','主持大會主舞台'],

  ['獨立製作基金願意支持一季節目','基金方希望你提出完整集數，並保留創作決定權。','製作一整季節目'],

  ['跨平台公益接力找你領隊','三個平台願意共同提供時段，請你安排創作者輪班。','籌畫公益接力']

 ],

 legendary:[

  ['國際創作者交流計畫的駐地邀請','主辦方提供場地與製作經費，邀你和各地創作者一起完成公開作品。','接下駐地創作計畫'],

  ['一座公共展館想保存你的創作生涯','策展人希望把多年素材整理成公開展覽，並支付典藏與製作費。','共同製作生涯展覽'],

  ['跨國直播節把閉幕交給你','主辦方希望你的團隊串連不同語言的創作者，完成一場同步直播。','統籌跨國閉幕直播']

 ]

};

for(const [id,entries] of Object.entries(generalOpportunities)){

 const tier=weeklyTiers.find(t=>t.id===id);

 entries.forEach(([title,body,choice],index)=>addWeeklyOpportunity('weekly_general_'+id+'_'+index,tier,title,body,choice));

}

const generalPromotions={

 low:['offline','move','special_mascot','special_letter','special_outage','daily_impersonation','daily_model_delay','daily_camera_heat'],

 rare:['sponsor','gift','collab','special_raid','special_invite','daily_model_rights','life_pivot','dream_platform'],

 epic:['dream_viral','dream_qing','life_age_elder','chapter_4','chapter_6','subscriber_giftwave']

};

for(const [rarity,ids] of Object.entries(generalPromotions)){

 for(const id of ids){

  const e=events.find(e=>e.id===id);

  if(e&&!e.topics?.length&&e.route!=='真人主播')e.rarity=rarity;

 }

}

for(const [index,[title,body,choice]] of [

 ['二十封來自夢裡的信','一群老觀眾寫下陪伴他們度過長夜的二十段回憶，想在同一晚讀給你聽。','舉辦夢境來信之夜'],

 ['替整座城市說晚安','城市夜間活動邀你在最後一班車出發前，為還醒著的人做一場直播。','主持城市晚安直播'],

 ['第五盞夢燈的委託','聲音與影像創作者想一起做一場五幕夢境展，邀你留下最後一幕。','製作第五幕夢境']

].entries())addWeeklyOpportunity('weekly_anniversary_legendary_'+index,weeklyTiers[0],title,body,choice);



function trackSecretStream(s,topic){
 if(isEmuName(s.name)&&!Number.isSafeInteger(s.authorStoryStart))s.authorStoryStart=storyState(s).firstLive??s.day;
 const streak=s.secretStreamStreak;
 if(streak?.topic!==topic||!Number.isSafeInteger(streak.last)||s.day-streak.last>30){
  s.secretStreamStreak={topic,since:s.day,last:s.day};
 }else streak.last=s.day;
}
function openCareerSecretEnding(s){
 if(s.lastSecretEndingDay===s.day)return false;
 if(s.stage!=='focus'&&s.stage!=='result')return false;
 const streak=s.secretStreamStreak;
 const active=Number.isSafeInteger(streak?.last)&&s.day-streak.last<=30;
 const candidates=[
  [s.day>=20*360,'twentieth'],
  [active&&streak.topic==='asmr'&&s.day-streak.since>=5*360,'asmr'],
  [active&&streak.topic==='chat'&&s.day-streak.since>=5*360,'chat']
 ];
 const match=candidates.find(([ready,id])=>ready&&!s.seenCareerSecretEndings?.includes(id));
 if(!match)return false;
 s.secretEnding=match[1];
 return true;
}
const authorSupportAmount=3000;
const authorStorySteps=[
 ['follow',180],['regular',24*30],['support',45*30]
];
function authorStoryStart(s){
 if(!isEmuName(s.name))return null;
 return s.authorStoryStart??storyState(s).firstLive;
}
function authorSupportTick(s){
 if(!Number.isSafeInteger(s.authorSupportDue)||s.day<s.authorSupportDue)return;
 apply(s,{money:authorSupportAmount},'你不行 · 每月斗內');
 s.authorSupportDue=s.day+30;
}
function isLastBirthdayBeforeAnniversary(s,start){
 const date=realDay(s), birthday=s.personalCalendar.birthday.slice(5);
 const year=Number(date.slice(0,4));
 const dateFor=y=>validDate(y+'-'+birthday)?y+'-'+birthday:y+'-02-28';
 const deadline=new Date(Date.parse(date+'T00:00:00Z')+(start+1800-s.day)*86400000).toISOString().slice(0,10);
 return date===dateFor(year)&&date<deadline&&dateFor(year+1)>=deadline;
}
function openAuthorStory(s,confessionOnly=false){
 const start=authorStoryStart(s);
 if(start===null||start===undefined)return false;
 const elapsed=s.day-start;
 const step=authorStorySteps.find(([id])=>!s.used.includes('author_story_'+id));
 let id;
 if(step){
  if(elapsed<step[1])return false;
  id=step[0];
 }else if(!s.used.includes('author_story_gift')&&elapsed<1800&&isLastBirthdayBeforeAnniversary(s,start))id='gift';
 else if(elapsed>=1800&&!s.used.includes('author_story_confession'))id='confession';
 else return false;
 if(confessionOnly&&id!=='confession'||id==='confession'&&s.lastSecretEndingDay===s.day)return false;
 s.eventId='author_story_'+id;
 s.stage='event';
 return true;
}
function resolveAuthorStory(s,id,choice){
 if(id==='author_story_support'&&!Number.isSafeInteger(s.authorSupportDue)){
  apply(s,{money:authorSupportAmount},'你不行 · 首次斗內');
  s.authorSupportDue=s.day+30;
 }
 if(id==='author_story_gift')s.authorBirthdayGift=choice.acceptGift;
 if(id==='author_story_confession')s.secretEnding=choice.weddingEnding;
}
function authorStoryEvent(id,title,body,choices){
 return {id:'author_story_'+id,title,body,choices,tag:'夢境連續故事',storyOnly:true,major:true};
}
events.push(
 authorStoryEvent('follow','作者你不行已經關注你','開台滿半年，你在通知欄看見「你不行」關注了頻道。',[
  C('向新觀眾打聲招呼','你在開台時說了一句歡迎。'),
  C('在收台前說聲謝謝','你把謝意放進今天的晚安。'),
  C('把通知留在日記裡','你記住了這個名字。'),
  C('照平常的步調開台','你繼續準備原本的節目。')
 ]),
 authorStoryEvent('regular','作者你不行開始頻繁關注你','到了第 25 個月，你發現你不行常在開台時出現，也記得你上次聊到哪裡。',[
  C('接著聊上次沒講完的故事','熟悉的話題有了下一段。'),
  C('問大家今天過得如何','聊天室慢慢聊起各自的日常。'),
  C('在收台時留一段晚安','你多留了一點時間道別。'),
  C('把他的留言記下來','你把幾句留言收進創作日記。')
 ]),
 authorStoryEvent('support','作者你不行開始斗內你','到了第 46 個月，你不行送來第一筆支持。從今天起，他每 30 個遊戲日會固定斗內 3,000。',[
  C('在直播裡道謝','你收到第一筆 3,000。'),
  C('寫一段感謝留言','你收到第一筆 3,000。'),
  C('把支持留作下次開台預算','你收到第一筆 3,000。'),
  C('收工後再好好道謝','你收到第一筆 3,000。')
 ]),
 authorStoryEvent('gift','五週年前的生日禮物','生日這天，你不行送來一盞手作夢燈。盒子裡還有張卡片，寫著「謝謝你陪我走到這裡」。',[
  C('接受生日禮物','你把夢燈放在直播桌旁。',{}, {acceptGift:true}),
  C('不接受生日禮物','你婉拒禮物，把卡片上的祝福記在心裡。',{}, {acceptGift:false})
 ]),
 authorStoryEvent('confession','五週年後｜想和你一起走下去','在這段夢境故事裡，週年直播結束後，你不行留下來向愛姆告白。他想知道，她願不願意把往後的日子也留一份給彼此。',[
  C('我願意，往後的每個晚安都想和你一起說。','兩人在夢裡約定結婚。',{}, {weddingEnding:'author_wedding_goodnight'}),
  C('我們結婚吧，我想和你把平凡的日子一起過下去。','兩人在夢裡約定結婚。',{}, {weddingEnding:'author_wedding_days'})
 ])
);
const secretEndings={
 author_wedding_goodnight:{title:'五週年後｜把晚安說給彼此',lines:[
  '「我願意，往後的每個晚安都想和你一起說。」',
  '愛姆和你不行在夢境裡結了婚。很久以後，他們依然會在睡前留一點時間，聽彼此說完今天的故事。'
 ]},
 author_wedding_days:{title:'五週年後｜一起過平凡的日子',lines:[
  '「我們結婚吧，我想和你把平凡的日子一起過下去。」',
  '愛姆和你不行在夢境裡成了家。多年後，最常想起的還是那些一起吃飯、散步和收工的普通日子。'
 ]},
 asmr:{title:'只播給還醒著的人',lines:[
  '五年來，你每次開台都只為那群還醒著的人留一點聲音。',
  '今晚，觀眾寄來各自城市的夜聲。窗外的雨、最後一班車，還有回家後輕輕放下鑰匙的聲音。',
  '你戴上耳機。這一次，換聊天室陪你睡著。'
 ]},
 chat:{title:'今晚也有人等你說晚安',lines:[
  '五年來，你一開台就問大家今天過得怎麼樣。',
  '有人從學生聊到出社會，有人搬了家，還有人偶爾回來，只為告訴你他最近過得很好。',
  '今天他們反過來問你累不累。你說有一點，聊天室便陪你慢慢聊到最後。'
 ]},
 twentieth:{title:'二十週年｜只留給彼此的婚禮',lines:[
  '二十週年直播結束後，夢裡的小房間還亮著一盞燈。',
  '在這段夢境故事裡，愛姆和你不行避開鏡頭，悄悄交換戒指。',
  '對外，今天是大家一起度過的二十週年。對彼此，今天還有一件只想私下慶祝的事。'
 ]},
 anniversary:{title:'20＋5｜五週年快樂',lines:[
  '愛姆，五週年快樂！',
  '如果這款遊戲最後只能留下一句話，我想留的是「謝謝你開台」。五年前，你按下了第一次開台。今天，我也想用自己會的方式，把這句話送給你。',
  '我喜歡你在直播裡聊那些生活小事。一個話題聊著聊著就岔開了，聊天室接了幾句，回過神來才發現，原本平常的一個晚上已經過得很開心。',
  '也謝謝你在 ASMR 裡替還睡不著的人留一點聲音。有時候，聽見一句晚安，就覺得今天可以到這裡了，剩下的事明天再想。',
  '我做了《下一次開台》，想把這份心情放進遊戲裡。玩家會遇到冷清的聊天室、忙不完的工作，也會遇到願意下次再來的人。寫到這些地方的時候，我總會想到，一場直播結束後，觀眾記得的也許只是你講的一句話，但那句話可以在心裡留很久。',
  '五週年值得好好慶祝。也希望下一年，你可以照自己喜歡的步調走。想唱歌就唱歌，想聊日常就聊日常，累了也可以放心早點收台。希望你開台的時候，自己也玩得開心。',
  '謝謝永遠二十歲的夢寐愛姆，陪大家走過這五年。也祝下次說晚安的你，收工後能睡個好覺，做一個只屬於自己的好夢。',
  '愛姆，五週年快樂。',
  '你不行 敬上'
 ]},
 wedding:{title:'你不行與愛姆｜白頭偕老',lines:[
  "那天，夢裡的小屋點起了兩盞燈。窗外下著細雨，愛姆和你不行把寫了一半又重寫的誓詞放在桌上，等彼此先開口。",
  "你不行原本練了好幾遍，到了交換戒指的時候，卻只說出一句：「以後收工回家，記得跟我說一聲。」愛姆笑了，把手伸過去。「好。你也要記得。」",
  "婚禮過後，他們把花插進平常喝水的玻璃瓶，坐在廚房分完最後一塊蛋糕。窗外的雨停了，兩人還在爭論哪一張合照最好看。",
  "後來的日子有早班、晚班，也有臨時加開的直播。愛姆收台時，如果廚房還亮著燈，就知道你不行替她留了晚飯。有時候換她先到家，桌上就會多一張寫著「記得吃飯」的紙條。",
  "他們偶爾也會為了小事鬧彆扭。有一回兩人忙了一整週，忘了把衣服從洗衣機拿出來。那天誰都不想先說話，最後還是一起把衣服重洗一遍，站在陽台一件一件晾好。",
  "又過了好些年，桌上的麥克風換過幾次，窗簾也換了顏色。兩枚戒指磨出了細小的痕跡，兩人的頭髮慢慢白了，睡前卻還是有好多日常想講。",
  "有一晚，愛姆問：「你還記得結婚那天說了什麼嗎？」你不行想了想，說：「我記得你答應我，回家會說一聲。」愛姆把手放到他手上，小聲說：「我回來了。」",
  "你不行握住她的手。「歡迎回家，愛姆。晚安。」",
  "愛姆往他身邊靠了一點。「晚安，你不行。明天再聊。」"
 ]}
};
function secretEndingFor(s){
 const ending=secretEndings[s.secretEnding];
 if(!ending||!s.secretEnding.startsWith('author_wedding_'))return ending;
 const memory=s.authorBirthdayGift===true?'婚禮那晚，當年收下的生日夢燈就亮在兩人身旁。'
  :s.authorBirthdayGift===false?'那年的夢燈沒有收下。婚禮那晚，他們一起點亮了一盞新燈。'
  :'婚禮那晚，他們把一張寫著週年快樂的卡片留在窗邊。';
 return {...ending,lines:[ending.lines[0],memory,...ending.lines.slice(1)]};
}
function resolveSecretEnding(s,continuePlaying){
 const ending=secretEndingFor(s);
 if(!ending)return false;
 if(['asmr','chat','twentieth'].includes(s.secretEnding)){
  const seen=s.seenCareerSecretEndings??=[];
  if(!seen.includes(s.secretEnding))seen.push(s.secretEnding);
 }
 s.lastSecretEndingDay=s.day;
 delete s.secretEnding;
 if(!continuePlaying){
  s.summary={title:ending.title,body:ending.lines.join(' ')};
  s.stage='end';
 }
 return true;
}
events.push(
 {id:'secret_anniversary_invite',title:'一封寫給愛姆的週年邀請',body:'五盞夢燈提早亮了起來。要現在打開週年故事嗎？',tag:'開局彩蛋',storyOnly:true,major:true,choices:[
  C('前往週年事件','你推開了週年直播間的門。',{}, {enterAnniversary:true}),
  C('從開局繼續遊玩','你把邀請留在桌上，先開始自己的生涯。')
 ]},
 {id:'secret_wedding',title:'兩盞夢燈，一個家',body:'在這個夢境裡，你不行和愛姆要一起辦一場婚禮。你想怎麼記住今天？',tag:'隱藏結婚事件',storyOnly:true,major:true,choices:[
  C('在窗邊交換誓言','兩人在最熟悉的窗邊交換誓言。'),
  C('把祝福讀給彼此聽','你們讀完每一張卡片，一起留下了今天的合照。'),
  C('邀請朋友見證婚禮','朋友們點起夢燈，為兩人祝福。'),
  C('在夢裡的小屋辦婚禮','小屋裡亮著燈，兩人牽手走向門外。')
 ]}
);
const anniversaryEventId='anniversary_20_plus_5';

events.push({id:anniversaryEventId,title:'20＋5｜第五盞夢燈',tag:'隱藏週年事件',storyOnly:true,major:true,

 body:'五段傳說，點亮了五盞夢燈。永遠二十歲的夢寐愛姆走過了五週年。今晚，聊天室把一路收集的故事排成一場晚安直播，等你說出最後一句話。',

 choices:[

  C('把五盞夢燈帶上週年舞台','獲得 22,500 和 4,500 訂閱，為大家辦一場特別直播。',{money:22500},{fans:4500}),

  C('把晚安留給每個正在做夢的人','獲得 22,500、4,500 訂閱與 20 心情。',{money:22500},{fans:4500,wellbeing:{mood:20,physical:0}})

 ]

});

function anniversaryProgress(s){

 const ids=events.filter(e=>e.rarity==='legendary').map(e=>e.id);

 const seen=new Set([...(s.legendarySeen||[]),...s.used,s.eventId].filter(id=>ids.includes(id)));

 return {count:seen.size,total:ids.length,required:5,yearsRequired:5,years:Math.floor(s.day/360),complete:s.used.includes(anniversaryEventId)};

}

function openAnniversaryEvent(s){
 if(s.lastSecretEndingDay===s.day)return false;

 const progress=anniversaryProgress(s);

 if(progress.complete||progress.count<progress.required||progress.years<progress.yearsRequired)return false;

 s.eventId=anniversaryEventId;

 s.stage='event';

 return true;

}

function rememberLegendary(s){

 s.legendarySeen=[...new Set([...(s.legendarySeen||[]),s.eventId])];

 s.lastLegendaryDay=s.day;

}

function countWeeklyEvent(s,tier){

 const counts=s.weeklyEventCounts??={};

 counts[tier]=(counts[tier]||0)+1;

}

function openGuaranteedLegendary(s){
 if(s.lastSecretEndingDay===s.day)return false;

 const progress=anniversaryProgress(s);

 if(progress.count>=progress.required)return false;

 const last=s.lastLegendaryDay??(progress.count&&Number.isSafeInteger(s.lastLegendaryWeek)?s.lastLegendaryWeek*7:0);

 if(s.day-last<360&&progress.years<progress.yearsRequired)return false;

 const seen=new Set([...(s.legendarySeen||[]),...s.used]);

 const remaining=events.filter(e=>e.rarity==='legendary'&&!seen.has(e.id));

 const names=selectedTopics(s);

 const themed=remaining.filter(e=>e.topics?.some(name=>names.includes(name)));

 const pool=themed.length?themed:remaining;

 if(!pool.length)return false;

 s.eventId=pool[Math.floor(rand(s)*pool.length)].id;

 s.stage='event';

 s.weeklyDraw={day:s.day,tier:'legendary',id:s.eventId};

 s.lastEventWeek=Math.floor(s.day/7);

 delete s.pendingWeeklyEvent;

 rememberLegendary(s);

 countWeeklyEvent(s,'guaranteed');

 return true;

}

const incidentScenarios=[

 ['自動字幕寫錯了名字','字幕把聯動來賓的名字寫成另一個人。','修正回放字幕並標記更正','先轉發片段，請觀眾猜是誰','以舊字幕剪成精華','重播片段並沿用原字幕'],

 ['封面用了錯誤的版本','預告圖放上了已被否決的設計。','換回已確認的封面','把舊圖當作驚喜版本','沿用原圖另發預告','先把同一張圖貼到所有平台'],

 ['直播背景出現私人資訊','試播畫面閃過不該公開的檔案名稱。','暫停並移除畫面後重開','先把這一段播完','縮小視窗後繼續沿用','先公開試播回放'],

 ['合作邀請寄錯頻道','你收到了一封內容像是寫給別人的聯動信。','向寄件人確認邀請對象','先宣布聯動日期','按信上資料製作宣傳圖','直接轉發完整邀請信'],

 ['觀眾的投稿漏了授權','你找到一段很合適的投稿，卻沒有公開使用的同意紀錄。','聯絡投稿者確認授權','先播再補問','把來源省略後使用','交給聊天室投票決定能否使用'],

 ['剪輯出現失真的片段','一段剪輯把你的前後兩句話接在一起，意思變了。','公開完整片段及時間點','轉發剪輯用玩笑帶過','要求觀眾到對方留言','先把剪輯做成置頂短片'],

 ['活動頁的日期對不上','活動網站和你手上的流程表寫著不同日期。','和主辦核對後統一公告','按最早看到的日期宣傳','先開放報名再問','在兩個日期各發一次不同預告'],

 ['備份打開只剩空白','準備上台前發現共享檔案無法使用。','改用本機備份並核對版本','覆寫所有備份','等到開場才重新下載','用尚未核對的舊版檔案'],

 ['同一時段收到兩份流程','工作人員和主辦各寄來一份互相衝突的流程。','請雙方確認一份共同流程','直接挑較短的流程','在直播中臨時決定','把兩份流程一起交給來賓'],

 ['款項明細少了一個項目','對帳時發現合作費的其中一筆沒有列入。','附上紀錄請對方更正','先回覆款項已結清','先接受口頭承諾','直接撤掉原本的對帳紀錄'],

 ['聊天室出現假抽獎','有人假冒工作人員通知觀眾領獎。','公告正式領獎流程並通報假帳號','轉貼假訊息讓觀眾自行辨認','先等對方再發一次','照假帳號的流程測試一次'],

 ['短片的音量忽大忽小','試看的人說人聲很輕，片頭音效卻突然變得很大。','重新混音再發佈','直接提高整段音量','加長片頭掩蓋問題','先把現有版本排進首播'],

 ['設備借用時間重疊','你借的收音設備當天也要交給另一個團隊。','和對方協調時段並準備備機','先假設對方會晚到','取消備機預約','把最吃設備的環節排在交接時'],

 ['預告被誤認為正式公告','一則試寫貼文被觀眾當成已確定的重大消息。','更正並說明哪些部分仍在確認','用含糊的回覆維持熱度','把未確認內容再發一次','先接受媒體以原文轉載'],

 ['後台突然多了陌生管理員','工作人員發現頻道權限出現不認識的名字。','撤銷異常權限並檢查登入紀錄','先把管理權轉給陌生帳號確認','等下一場直播後再查','用公開留言詢問對方身分'],

 ['外包交付缺少原始檔','對方交來成品，但少了後續修改需要的檔案。','依合約要求補交並確認備份','先標記交付完成','以預覽檔直接進下一階段','刪掉原交付清單以簡化流程'],

 ['字幕翻譯混淆兩個角色','試播觀眾發現兩個角色的台詞被交換。','校對關鍵段落後更新字幕','保留字幕當成二創效果','用同一份字幕發到所有語言區','只改片名，字幕留待日後處理'],

 ['報名表收集了多餘資料','活動表單要求觀眾填寫與活動無關的欄位。','關閉表單、清除多餘資料並重新開放','先把收到的資料匯出給所有夥伴','保留欄位等活動結束再處理','用現有資料做宣傳名單'],

 ['來賓臨時失去網路','來賓在開播前十分鐘回報連線不穩。','改為預先準備的單人段落並重新約時間','照原時長等待連線恢復','在開場時直接公布來賓聯絡方式','重播未確認可公開的彩排'],

 ['合作方混用了兩個合約版本','簽回的合約與雙方最後討論的條款不同。','暫停交付，逐項確認並重新簽署','按對方版本立即交付','只把不同頁面換掉','先公開宣布合作已完成'],

 ['直播延遲讓投票失準','觀眾還沒看到所有選項，票數就已經截止。','重新開票並留足延遲時間','採用第一輪票數','先宣布你猜的結果','直接把投票交給最早留言的人'],

 ['活動檔案和舊版本混在一起','現場資料夾有數份同名檔案，工作人員各自開了不同版本。','建立唯一版本清單並逐一核對','把全部檔案重新寄一遍','選最新修改時間的檔案直接播','請各組沿用手邊的版本'],

 ['贈品寄送名單對不上','同一位觀眾出現兩次，有人卻沒有被列入。','用原始報名紀錄核對後再寄送','先照目前清單全部寄出','請觀眾公開貼出收件資料','把缺漏的名單直接複製到下一批'],

 ['舞台轉播臨時換訊號','現場和線上的畫面來源突然不同步。','切換已測試的備援訊號並告知觀眾','同時播放兩個訊號','先提高轉播音量','沿用未測試的備用連線'],

 ['多方合作出現授權衝突','兩個合作團隊都以為自己擁有首播權。','請各方一起確認權利並改期','先在最大的平台播出','分別向雙方承諾獨家','把未確認版本上傳到公開雲端'],

 ['跨區直播誤排了時區','不同地區的預告把同一場活動寫成了不同時間。','發布統一時刻與各地換算','保留所有原本的預告','直接沿用最早出現的時刻','把改期消息留到開播後再說'],

 ['公開典藏誤收了私人檔案','策展用的上傳清單混入了幾份未公開素材。','暫停公開、撤下檔案並逐項重審','先完整開放再收回','把清單轉發給觀眾找錯','只修改檔名就照常公開']

];

const adverseCounts={common:27,low:10,rare:11,epic:8,legendary:5};

for(const [rank,tier] of [...weeklyTiers].reverse().entries()){

 for(let index=0;index<adverseCounts[tier.id];index++){

  const [title,body,safe,...risky]=incidentScenarios[(index+rank*7)%incidentScenarios.length];

  const contexts=['平常開台','主題聯動','平台企劃','大型活動','跨國特別節目'];

  const effects={money:Math.round(tier.reward*(.2+index%4*.05)),fans:Math.round(tier.fans*.3)};

  const choices=[C(safe,'你把問題妥善處理，原定內容得以繼續。',{},{

   weeklyPayout:{money:Math.round(effects.money*.35),fans:Math.round(effects.fans*.4),health:rank+1},

   wellbeing:{mood:rank+1,physical:0},resolvedIncident:true

  }),...risky.map((label,i)=>C(label,'後續出現混亂，你得花時間和預算善後。',{},{

   weeklyPayout:{money:-effects.money*(i+1),fans:-effects.fans*(i+1),health:-(rank+2+i),joy:-(rank+1+i)},

   wellbeing:{mood:-(rank+2+i),physical:-(rank+1)},setback:true

  }))];

  const shift=(index+rank)%choices.length;

  events.push({id:'adverse_'+tier.id+'_'+index,title:contexts[rank]+' · '+title,

   body,tag:tier.name+'事件',rarity:tier.id==='common'?undefined:tier.id,adverse:true,choices:[...choices.slice(shift),...choices.slice(0,shift)]});

 }

}

function weeklyEvent(s){

 const week=Math.floor(s.day/7);

 if(week>=1&&s.lastEventWeek!==week&&!s.pendingWeeklyEvent){

  s.lastEventWeek=week;

  const roll=rand(s);

  let threshold=0;

  const tier=weeklyTiers.find(t=>(threshold+=t.chance)>roll);

  s.pendingWeeklyEvent=tier?{tier:tier.id,day:week*7+Math.floor(rand(s)*7)}:null;

 }

 const pending=s.pendingWeeklyEvent;

 if(!pending||pending.day>s.day)return false;

 delete s.pendingWeeklyEvent;

 const names=selectedTopics(s);

 const eligible=events.filter(e=>(e.rarity===pending.tier||pending.tier==='common'&&e.adverse&&!e.rarity)&&(!s.used.includes(e.id)||e.rarity==='low'&&e.id.startsWith('unusual_')&&!managementState(s).riskLog.some(r=>r.title===e.title&&s.day-r.day<120))&&(e.id.includes('unusual_')||eligibleEvent(s,e))&&(!e.topics||e.topics.some(name=>names.includes(name))));

 const themed=events.filter(e=>e.topicSpecial&&(e.rarity||'common')===pending.tier&&!s.used.includes(e.id)&&e.topics.some(name=>names.includes(name)));

 const seen=new Set([...(s.legendarySeen||[]),...s.used]);

 const remainingLegends=pending.tier==='legendary'?events.filter(e=>e.rarity==='legendary'&&!seen.has(e.id)):null;

 const pool=pending.tier==='legendary'

  ?themed.some(e=>!seen.has(e.id))?themed.filter(e=>!seen.has(e.id)):remainingLegends

  :themed.length&&rand(s)<.65?themed:pending.tier==='common'&&rand(s)<.2?eligible:pending.tier==='common'?[]:eligible;

 const e=pool[Math.floor(rand(s)*pool.length)];

 if(e){

  if(e.id.startsWith('unusual_')||e.id.startsWith('expanded_unusual_')){

   if(!unusualDue(s,e))return false;

  }else{s.eventId=e.id;s.stage='event';}

 }else if(pending.tier==='common'){

  s.eventId=monthlyEvent(s);

  s.stage='event';

 }else return false;

 if(pending.tier==='legendary')rememberLegendary(s);

 s.weeklyDraw={day:s.day,tier:pending.tier,id:s.eventId};

 countWeeklyEvent(s,pending.tier);

 return true;

}

const productOfferInterval=30;

function openProductOffer(s){

 if(s.day-(s.lastProductOfferDay??0)<productOfferInterval)return false;

 const product=recommendedProduct(s);

 if(!product)return false;

 s.productOffer={day:s.day,id:product.id};
 shopProductIds(s);

 s.lastProductOfferDay=s.day;

 s.eventId='monthly_equipment';

 s.stage='event';

 return true;

}

function monthlyEvent(s){

 const due=storyDue(s);

 if(due)return due;

 if(s.career.production)return 'monthly_work';

 const options=opportunitySpecs.filter(([id])=>(id!=='housing'||(!creditState(s).home&&s.money>=homes[0].price*.2))&&(id!=='retirement'||ageNow(s)>=65)&&id!=='equipment');

 if(rand(s)<.55){

  const fresh=options.filter(([id])=>'monthly_'+id!==s.lastMonthlyChoice);

  const id=fresh[Math.floor(rand(s)*fresh.length)][0];

  s.lastMonthlyChoice='monthly_'+id;

  return s.lastMonthlyChoice;

 }

 return pickEvent(s);

}



events.push({id:'cash_lifeline',title:'房租快繳不出來了',body:'手邊已經沒有能用的現金。你還有機會靠一份工作或一筆貸款撐過去。',tag:'資金週轉',storyOnly:true,major:true,choices:[C('結束創作生涯','回到原本的生活。',{}, {lifeline:'end'})]});

function emergencyLoanAmount(s){return Math.min(loanInfo(s).limit,Math.ceil(Math.max(0,-s.money)+livingInfo(s).monthly));}

function cashLifelineEvent(s,e){

 const remaining=2-(s.cashLifelinesUsed||0), amount=Math.ceil(Math.max(0,-s.money)+livingInfo(s).monthly*2);

 const loanAmount=emergencyLoanAmount(s);

 const choices=['full','salary'].includes(upgradeCareer(s).mode)?[]:[

  C('接下臨時兼職','先領 '+amount+' 。接下來 30 天優先兼職，體力不足仍會休息。',{}, {lifeline:'work'}),

 ];

 if(!creditState(s).loans.some(l=>l.kind==='personal'||l.missed>=3)&&loanAmount>=1000&&loanAmount>-s.money)

  choices.push(C('申請緊急週轉','借 '+loanAmount+' ，年利率 9%，分 24 期償還。',{}, {lifeline:'loan'}));

 choices.push(...e.choices);

 return {...e,body:(['full','salary'].includes(upgradeCareer(s).mode)?'手邊已經沒有能用的現金。你可以申請緊急週轉，或調整兼職方針。':e.body)+' 還有 '+remaining+' 次轉機。',choices};

}

function chooseCashLifeline(s,option){

 if(s.money>0||(s.cashLifelinesUsed||0)>=2)return false;

 if(option==='end'){

  s.cashLifelinesUsed=2;

  checkExhaustion(s);

  return true;

 }

 const amount=option==='loan'?emergencyLoanAmount(s):Math.ceil(Math.max(0,-s.money)+livingInfo(s).monthly*2);

 if(option==='loan'){if(amount<=-s.money||!borrow(s,amount,24,'緊急週轉'))return false;}

 else if(option==='work'&&!['full','salary'].includes(upgradeCareer(s).mode)){

  apply(s,{money:amount},'臨時兼職預領薪資');

  s.emergencyWorkUntil=s.day+30;

  record(s,{title:'臨時兼職',choice:'預領薪資 '+amount,text:'接下來 30 天優先工作，預領期間的兼職薪資已包含在這筆款項中。'});

 }else return false;

 s.cashLifelinesUsed=(s.cashLifelinesUsed||0)+1;

 s.lastChanges={money:amount};

 s.lastResult=option==='loan'?'這筆貸款讓你先把生活安頓下來。':'先把日子穩住，再找時間回到麥克風前。';

 s.stage='result';

 return true;

}

const newProducts=[

 {id:'desk_lamp',name:'可調光桌燈',cost:850,days:2,desc:'改善桌面照明，每次開台少消耗 0.4 體力。',health:.4},

 {id:'mic_arm',name:'麥克風懸臂',cost:1250,days:2,desc:'收音位置更穩定，每場開台實力成長增加 0.08。',skill:.08},

 {id:'wired_earphones',name:'有線監聽耳機',cost:1600,days:3,desc:'歌唱與 ASMR 收益增加 6%。',topics:['music','asmr'],income:.06},

 {id:'desk_mat',name:'桌面吸音墊',cost:690,days:1,desc:'讓雜談與 ASMR 的觀眾互動更穩定。',topics:['chat','asmr'],topicBond:.12},

 {id:'chat_prompt',name:'桌上提詞螢幕',cost:4800,days:2,desc:'雜談收益增加 8%。',topics:['chat'],income:.08},

 {id:'chat_controls',name:'快捷控制器',cost:2200,days:2,desc:'雜談時更容易和觀眾互動。',topics:['chat'],topicBond:.24},

 {id:'game_capture',name:'擷取卡',cost:5900,days:2,desc:'遊戲直播曝光增加 12%。',topics:['game'],topicReach:.12},

 {id:'game_pad',name:'低延遲手把',cost:1800,days:2,desc:'遊戲直播時少消耗 0.7 體力。',topics:['game'],topicHealth:.7},

 {id:'music_interface',name:'雙軌錄音介面',cost:8300,days:2,desc:'歌唱直播收益增加 12%。',topics:['music'],income:.12},

 {id:'music_pop',name:'防噴罩',cost:900,days:2,desc:'歌唱直播曝光增加 6%。',topics:['music'],topicReach:.06},

 {id:'art_tablet',name:'繪圖板',cost:3200,days:2,desc:'繪圖直播曝光增加 12%。',topics:['art'],topicReach:.12},

 {id:'art_shortcuts',name:'繪圖快捷鍵盤',cost:1600,days:2,desc:'繪圖直播少消耗 0.7 體力。',topics:['art'],topicHealth:.7},

 {id:'asmr_binaural',name:'雙耳收音麥克風',cost:9800,days:2,desc:'ASMR 直播收益增加 16%。',topics:['asmr'],income:.16},

 {id:'asmr_isolation',name:'防震架組',cost:1700,days:2,desc:'ASMR 直播時更容易和觀眾建立連結。',topics:['asmr'],topicBond:.24},

 {id:'memes_edit',name:'剪輯控制台',cost:3800,days:2,desc:'迷因直播曝光增加 12%。',topics:['memes'],topicReach:.12},

 {id:'memes_effects',name:'音效按鍵組',cost:1500,days:2,desc:'迷因直播時更容易和觀眾建立連結。',topics:['memes'],topicBond:.24},

 {id:'current_screen',name:'資料查閱副螢幕',cost:4200,days:2,desc:'時事直播時少消耗 0.9 體力。',topics:['current'],topicHealth:.9},

 {id:'current_notes',name:'桌上文件架',cost:650,days:2,desc:'時事直播時更容易和觀眾建立連結。',topics:['current'],topicBond:.2}

];

projects.push(...newProducts);

for(const product of newProducts){

 events.push({id:'life_finish_'+product.id,title:product.name+'送到了',body:'拆開包裹，新的設備已經可以使用。',tag:'設備交付',queued:true,major:true,choices:[

  C('裝好設備','之後開台會套用設備效果。',{}, {life:{finish:product.id}}),

  C('先整理桌面再裝','設備啟用，體力小幅恢復。',{health:4},{life:{finish:product.id}}),

  C('試用後收好包裝','設備啟用，心情好了一點。',{}, {life:{finish:product.id},wellbeing:{mood:1,physical:0}})

 ]});

}

const followupCadence={legendary:35,epic:28,rare:21,low:14,common:7};

const followupRates={legendary:1,epic:.5,rare:.25,low:.125,common:.0625};

const followupSources=new Map();

for(const tier of weeklyTiers){

 const candidates=events.filter(e=>e.route!=='真人主播'&&(tier.id==='common'

  ?!e.rarity&&!e.queued&&!e.storyOnly&&e.kind!=='holiday'&&!['first','anniversary','agency','rainback'].includes(e.id)&&!e.id.startsWith('monthly_')

  :e.rarity===tier.id));

 // Spread the selected stories across the existing catalogue, including later additions.

 const count=Math.round(candidates.length*followupRates[tier.id]);

 for(let n=0;n<count;n++){

  const source=candidates[Math.floor((n+.5)*candidates.length/count)];

  const followupOf={id:source.id,tier:tier.id,title:source.title};

  const id='followup_'+source.id;

  followupSources.set(source.id,{id,tier:tier.id});

  events.push({id,followupOf,title:source.title+' · 後續',tag:tier.name+' · 後續',body:'',storyOnly:true,major:true,queued:true,choices:[]});

 }

}

function scheduleFollowup(s,source,choice,delta){

 const next=followupSources.get(source.id);

 if(!next||s.stage==='end')return;

 const queue=upgradeLife(s).queue;

 if(s.used.includes(next.id)||queue.some(q=>q.id===next.id))return;

 const declined=choice.weeklyReward===0||choice.independent;

 const failed=choice.setback||delta.fans<0||(choice.chance||choice.highRisk)&&s.lastResult.includes(choice.highRisk?'冒險失敗':'沒有如預期');

 const outcome=failed?'repair':declined?'return':'continue';

 const delay=followupCadence[next.tier]+(outcome==='repair'?0:outcome==='return'?7:3);

 queue.push({id:next.id,due:s.day+delay,previousChoice:choice.label,outcome});

}

function openFollowup(s){

 const pending=upgradeLife(s).queue.find(q=>q.id.startsWith('followup_')&&q.due<=s.day&&!s.used.includes(q.id));

 if(!pending)return false;

 s.eventId=pending.id;

 s.stage='event';

 return true;

}

function followupEvent(s,e){

 const pending=upgradeLife(s).queue.find(q=>q.id===e.id);

 const tier=weeklyTiers.find(t=>t.id===e.followupOf.tier);

 const money=Math.round(tier.reward*.35), fans=Math.round(tier.fans*.35);

 const effect=(name,income,gain)=>({effect:{id:e.id,name,income,gain},days:30});

 const earlier=pending?.previousChoice?'上次你選了「'+pending.previousChoice+'」。':'';

 const outcome=pending?.outcome;

 const source=events.find(item=>item.id===e.followupOf.id);

 const adverse=source?.adverse||source?.id.includes('unusual_');

 const context=adverse?'參與的人回來確認上次事件留下的問題。':source?.topics?.length?'觀眾還記得那次'+source.topics[0]+'的安排，想知道接下來還會不會有續集。':'當時參與的人再次聯絡，想確認接下來要怎麼安排。';

 let choices;

 if(outcome==='repair')choices=[

  C('先確認影響，再公布補救時間','你逐項處理問題，觀眾也開始回來。',{money:-Math.round(money*.2),fans:Math.round(fans*.3)},{dream:effect('補救後的回溫',.03,.08)}),

  C('找原本的夥伴一起收尾','你和夥伴把剩餘工作分掉，心情安定許多。',{}, {wellbeing:{mood:4,physical:0}}),

  C('把紀錄整理成公開更新','你把事情說清楚，但後續整理耗了些體力。',{health:-8,fans:Math.round(fans*.2)}),

  C('照原定行程更新','你繼續開台，但一些觀眾仍在等待回應。',{fans:-Math.round(fans*.3)},{dream:effect('尚待回應的觀眾',-.05,-.08)})

 ];

 else if(outcome==='return')choices=[

  C('先接一個小版本','原本擱下的邀請終於做成了一集。',{money:Math.round(money*.45),fans:Math.round(fans*.4)},{dream:effect('重新接上的合作',.06,.05)}),

  C('留到下一季一起談','雙方約好先保留題目，你也能維持現在的節奏。',{joy:12}),

  C('把機會介紹給另一位創作者','對方接下邀請，也有觀眾因此認識你的頻道。',{fans:Math.round(fans*.3)}),

  C('回信說明目前的安排','對方收到答覆，你把時間留給自己的生活。',{}, {wellbeing:{mood:3,physical:0}})

 ];

 else choices=[

  C('確認交付範圍，再做正式續篇','合作順利延續，觀眾也開始期待接下來的內容。',{money,fans,health:-8},{dream:effect('續篇帶來的曝光',.12,.10)}),

  C('先做一集試播','小規模續篇順利播出，讓你多留了一些體力。',{money:Math.round(money*.5),fans:Math.round(fans*.6)},{dream:effect('試播帶來的關注',.05,.05)}),

  C('整理上次的片段做公開回顧','老觀眾回來重看，新觀眾也有機會補上故事。',{fans:Math.round(fans*.45),joy:8}),

  C('回覆感謝，把這段故事收好','你把這次成果留在頻道，騰出時間休息。',{}, {wellbeing:{mood:4,physical:1}})

 ];

 const bridge=outcome==='repair'?'上次的問題還有影響，這次要先決定怎麼收尾。':outcome==='return'?'隔了一段時間，對方問你現在是否有空重新談談。':'上次的安排有了回應，對方想和你談下一步。';

 return {...e,body:earlier+context+bridge,concealOutcomes:true,choices};

}



for(const [i,[title,body,paid,free]] of openingChallenges.entries()){

 events.push({id:'opening_challenge_'+i,title,body,tag:'開局難題',queued:true,storyOnly:true,major:true,choices:[

  C(paid,'你投入一點預算和時間，先把開台環境安頓好。',{money:-600},{wellbeing:{mood:3,physical:0}}),

  C(free,'你調整了安排，找到可以先繼續開台的方法。',{joy:8}),

  C('請熟悉的朋友一起確認','朋友陪你試了一遍，你也安心了一些。',{}, {wellbeing:{mood:2,physical:0}}),

  C('先做一小段測試','你把問題記下來，留到下次再處理。',{health:-4,joy:4})

 ]});

}

events.push({id:'opening_intro',title:'前輩寄來第一封邀請',body:'介紹人幫你接上了另一位剛出道的創作者。對方想一起做個小節目。',tag:'開台禮物',queued:true,storyOnly:true,major:true,choices:[

 C('一起做一場短聯動','兩邊的觀眾都認識了新朋友。',{fans:30,health:-4}),

 C('先互相交換節目點子','你把幾個好點子寫進了企劃。',{joy:8}),

 C('約一場幕後試播','試播讓你對下次開台更有信心。',{}, {wellbeing:{mood:3,physical:0}}),

 C('回信致謝','你先把自己的開台安排穩定下來。')

]});

let api={secretEndingFor,secretEndings,resolveSecretEnding,ageAtDebut,openingOptions,lifePolicyEffect,shopProducts,buyShopProduct,estimateWeeklyStats,fastLifeBatch,fastStopOptions,estimateWeeklySchedule,estimateIncidentalExpenses,equipmentStats,partTimeStreamIncome,setWorkMode,estimateMonthlyChannelIncome,estimateChannelIncome,equipmentMultiplier,anniversaryProgress,weeklyTiers,donationInfo,setPartTime,zodiacProfile,checkExhaustion,homes,creditState,loanInfo,loanPayment,borrow,buyHome,repayLoan,netWorth,careAutomation,setAutoCare,livingState,livingInfo,setLivingLevel,lifeServices,buyLifeService,endingFor,retireLife,selectedTopics,pickProgrammeTopic,lifePolicies,addMembers,managementState,setManagement,pendingActivities,memberFee,autoLifeBatch,membershipInfo,lifePlan,calendarState,realDay,setDates,setLifePlan,autoLifeStep,eventPauseReason,calendarDue,simplifyShop,journeyInfo,programmeOptions,storyState,storyDue,lifePhase,souvenir,liveScene,chooseLive,achievementRows,tutorial,dismissTutorial,directions,chooseDirection,showPlan,channelStyle,dreamRecap,dreamToday,shows,workModes,upgradeCareer,crewInfo,showStatus,startShow,workShow:queuedWorkShow,careerAction:queuedCareerAction,makePromise:queuedPromise,parseSave,equipmentEffect,setGoal,setFundAuto,transferFund,goalInfo,projects,upgradeLife,audienceInfo,projectStatus,startProject,social:queuedSocial,important,make,migrate,ageNow,dateLabel,calendar,costs,eligibleEvent,contents,selectContent,cancelContent,focus,choose,advance,event,actions,events,valid,assets,marketValue,quote,trade,simulate,upgradeMarket};if(typeof module!=='undefined')module.exports=api;root.StreamLife=api;

})(typeof globalThis!=='undefined'?globalThis:this);

