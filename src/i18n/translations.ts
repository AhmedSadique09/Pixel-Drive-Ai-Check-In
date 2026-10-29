export type LanguageCode = 'ja' | 'en' | 'zh' | 'ko'

export interface CommonCopy {
  selfCheckIn: string
  goBack: string
  changeLanguage: string
}

export interface WelcomeCopy {
  greet: string
  /** Lines are separated by "\n" */
  title: string
  desc: string
  highlights: readonly [string, string, string]
  chooseLanguage: string
  continueLabel: string
  powered: string
}

export interface PlateCopy {
  submit: string
  title: string
  desc: string
  plateAria: string
  legend: string
  region: string
  classNo: string
  kana: string
  serial: string
}

export interface BookingFoundCopy {
  cta: string
  banner: string
  cardAria: string
  dates: string
  plan: string
  guests: string
  fee: string
  notMe: string
  /** Placeholder booking values until real data is wired in. */
  demo: { dates: string; nights: string; plan: string; guests: string; feeStatus: string }
}

export interface NoBookingCopy {
  askHost: string
  title: string
  desc: (plate: string) => string
  reasonsTitle: string
  reasons: readonly string[]
  editPlate: string
  searchByName: string
  walkInTitle: string
  walkInDesc: string
  walkInCta: string
}

export interface SiteRulesCopy {
  agreeText: string
  agreeCta: string
  siteLabel: string
  mapAria: (site: string) => string
  restrooms: string
  kitchen: string
  entrance: string
  directions: string
  title: string
  /** Same order as the icons in SiteRules */
  rules: ReadonlyArray<{ title: string; text: string }>
}

export interface CheckInCopy {
  progressLabel: string
  steps: readonly [string, string, string]
  plate: PlateCopy
  bookingFound: BookingFoundCopy
  noBooking: NoBookingCopy
  siteRules: SiteRulesCopy
}

export interface Translations {
  common: CommonCopy
  welcome: WelcomeCopy
  checkIn: CheckInCopy
}

export const DEFAULT_LANGUAGE: LanguageCode = 'en'

/** Language names are always written in their own language; `hint` is the cross-reference label. */
export const LANGUAGE_OPTIONS: ReadonlyArray<{ code: LanguageCode; name: string; hint: string }> = [
  { code: 'ja', name: '日本語', hint: 'Japanese' },
  { code: 'en', name: 'English', hint: '英語' },
  { code: 'zh', name: '中文', hint: 'Chinese (简体)' },
  { code: 'ko', name: '한국어', hint: 'Korean' },
]

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en: {
    common: {
      selfCheckIn: '24-hour self check-in',
      goBack: 'Go back',
      changeLanguage: 'Change language',
    },
    welcome: {
      greet: 'Welcome',
      title: 'Let’s get you\nchecked in',
      desc: 'No staff on site? Check in, pay and get answers — all from this page.',
      highlights: ['About 1 min', 'No app', 'AI guide 24/7'],
      chooseLanguage: 'Choose your language',
      continueLabel: 'Continue',
      powered: 'Powered by PixelDrive',
    },
    checkIn: {
      progressLabel: 'Check-in progress',
      steps: ['Booking', 'Rules', 'Payment'],
      plate: {
        submit: 'Find my booking',
        title: 'Find your booking',
        desc: 'Enter the name on your booking, or your number plate.',
        plateAria: 'Number plate',
        legend: 'Your number plate',
        region: 'Region',
        classNo: 'Class no.',
        kana: 'Kana',
        serial: 'Number',
      },
      bookingFound: {
        cta: 'Check in with this booking',
        banner: 'We found your booking',
        cardAria: 'Your booking',
        dates: 'Dates',
        plan: 'Plan',
        guests: 'Guests',
        fee: 'Fee',
        notMe: 'This isn’t my booking',
        demo: {
          dates: 'Fri 30 Oct – Sat 31 Oct',
          nights: '1 night',
          plan: 'Powered site',
          guests: '2 adults',
          feeStatus: 'Unpaid',
        },
      },
      noBooking: {
        askHost: 'Ask the host',
        title: 'We couldn’t find your booking',
        desc: (plate) => `No booking for today matches “${plate}”.`,
        reasonsTitle: 'Common reasons',
        reasons: [
          'The booking used a different car',
          'The booking is for another date',
          'Someone else in your group booked',
        ],
        editPlate: 'Edit the plate',
        searchByName: 'Search by name',
        walkInTitle: 'You can still stay tonight',
        walkInDesc: 'Sites are free tonight. Check in at tonight’s rate.',
        walkInCta: 'Check in as a walk-in',
      },
      siteRules: {
        agreeText: 'I’ve read the rules above',
        agreeCta: 'Agree and continue',
        siteLabel: 'Your site',
        mapAria: (site) => `Site map: ${site} is right of the entrance, opposite the restrooms`,
        restrooms: 'Restrooms',
        kitchen: 'Kitchen',
        entrance: 'Entrance',
        directions: 'Turn right at the entrance — opposite the restrooms.',
        title: 'Before you settle in',
        rules: [
          { title: 'Quiet hours 22:00–7:00', text: 'No engines or generators.' },
          {
            title: 'Sort rubbish into 3 types',
            text: 'Burnable, cans & bottles, PET — at the trash station.',
          },
          { title: 'Fires in fire pits only', text: 'No fires directly on the ground.' },
          {
            title: 'Check-out by 10:00',
            text: 'Late check-out is ¥500/hour — ask the AI guide.',
          },
        ],
      },
    },
  },
  ja: {
    common: {
      selfCheckIn: '24時間セルフチェックイン',
      goBack: '戻る',
      changeLanguage: '言語を変更',
    },
    welcome: {
      greet: 'ようこそ',
      title: 'チェックインを\nはじめましょう',
      desc: 'スタッフが不在でも大丈夫。チェックイン、お支払い、ご案内まで、このページだけで完結します。',
      highlights: ['約1分', 'アプリ不要', 'AIガイド 24時間'],
      chooseLanguage: '言語を選択',
      continueLabel: '次へ',
      powered: 'Powered by PixelDrive',
    },
    checkIn: {
      progressLabel: 'チェックインの進行状況',
      steps: ['予約', 'ルール', 'お支払い'],
      plate: {
        submit: '予約を探す',
        title: 'ご予約を探す',
        desc: 'ご予約のお名前、またはナンバープレートを入力してください。',
        plateAria: 'ナンバープレート',
        legend: 'ナンバープレート',
        region: '地名',
        classNo: '分類番号',
        kana: 'かな',
        serial: '番号',
      },
      bookingFound: {
        cta: 'この予約でチェックイン',
        banner: 'ご予約が見つかりました',
        cardAria: 'ご予約内容',
        dates: '日程',
        plan: 'プラン',
        guests: '人数',
        fee: '料金',
        notMe: '自分の予約ではありません',
        demo: {
          dates: '10月30日(金)〜10月31日(土)',
          nights: '1泊',
          plan: '電源付きサイト',
          guests: '大人2名',
          feeStatus: '未払い',
        },
      },
      noBooking: {
        askHost: 'ホストに問い合わせる',
        title: 'ご予約が見つかりませんでした',
        desc: (plate) => `本日のご予約に「${plate}」と一致するものはありません。`,
        reasonsTitle: 'よくある原因',
        reasons: ['別の車で予約した', '別の日付で予約した', '同行者が予約した'],
        editPlate: 'ナンバーを修正',
        searchByName: '名前で検索',
        walkInTitle: '今夜のご宿泊も可能です',
        walkInDesc: '今夜はサイトに空きがあります。本日の料金でチェックインできます。',
        walkInCta: '飛び込みでチェックイン',
      },
      siteRules: {
        agreeText: '上記のルールを確認しました',
        agreeCta: '同意して次へ',
        siteLabel: 'あなたのサイト',
        mapAria: (site) => `サイトマップ：${site}は入口の右側、トイレの向かいです`,
        restrooms: 'トイレ',
        kitchen: '炊事場',
        entrance: '入口',
        directions: '入口を右へ。トイレの向かいです。',
        title: 'ご利用前にご確認ください',
        rules: [
          { title: '静粛時間 22:00〜7:00', text: 'エンジンや発電機の使用はご遠慮ください。' },
          {
            title: 'ゴミは3種類に分別',
            text: '燃えるゴミ、缶・びん、ペットボトル。ゴミステーションへお願いします。',
          },
          { title: '焚き火は焚き火台で', text: '地面での直火は禁止です。' },
          {
            title: 'チェックアウトは10:00まで',
            text: 'レイトチェックアウトは1時間¥500。AIガイドにご相談ください。',
          },
        ],
      },
    },
  },
  zh: {
    common: {
      selfCheckIn: '24小时自助入住',
      goBack: '返回',
      changeLanguage: '切换语言',
    },
    welcome: {
      greet: '欢迎',
      title: '让我们开始\n办理入住',
      desc: '现场没有工作人员？入住、付款和咨询，都可以在此页面完成。',
      highlights: ['约1分钟', '无需下载App', 'AI向导 24/7'],
      chooseLanguage: '选择语言',
      continueLabel: '继续',
      powered: 'Powered by PixelDrive',
    },
    checkIn: {
      progressLabel: '入住进度',
      steps: ['预订', '规则', '付款'],
      plate: {
        submit: '查找我的预订',
        title: '查找您的预订',
        desc: '请输入预订姓名或车牌号码。',
        plateAria: '车牌',
        legend: '您的车牌',
        region: '地区',
        classNo: '分类号',
        kana: '假名',
        serial: '号码',
      },
      bookingFound: {
        cta: '使用此预订办理入住',
        banner: '已找到您的预订',
        cardAria: '您的预订',
        dates: '日期',
        plan: '方案',
        guests: '人数',
        fee: '费用',
        notMe: '这不是我的预订',
        demo: {
          dates: '10月30日（周五）– 10月31日（周六）',
          nights: '1晚',
          plan: '带电营位',
          guests: '2位成人',
          feeStatus: '未付款',
        },
      },
      noBooking: {
        askHost: '联系房东',
        title: '未找到您的预订',
        desc: (plate) => `今天没有与“${plate}”匹配的预订。`,
        reasonsTitle: '常见原因',
        reasons: ['预订时使用了另一辆车', '预订的是其他日期', '由同行的其他人预订'],
        editPlate: '修改车牌',
        searchByName: '按姓名搜索',
        walkInTitle: '今晚仍可入住',
        walkInDesc: '今晚有空余营位，可按今晚价格办理入住。',
        walkInCta: '以临时入住方式办理',
      },
      siteRules: {
        agreeText: '我已阅读以上规则',
        agreeCta: '同意并继续',
        siteLabel: '您的营位',
        mapAria: (site) => `营位地图：${site}在入口右侧，洗手间对面`,
        restrooms: '洗手间',
        kitchen: '厨房',
        entrance: '入口',
        directions: '入口处右转，洗手间对面。',
        title: '入住前请注意',
        rules: [
          { title: '安静时段 22:00–7:00', text: '请勿使用发动机或发电机。' },
          {
            title: '垃圾分为3类',
            text: '可燃垃圾、罐瓶、PET塑料瓶——请投放至垃圾站。',
          },
          { title: '仅可在火盆中生火', text: '禁止直接在地面生火。' },
          { title: '退房时间为10:00前', text: '延迟退房每小时¥500，请咨询AI向导。' },
        ],
      },
    },
  },
  ko: {
    common: {
      selfCheckIn: '24시간 셀프 체크인',
      goBack: '뒤로',
      changeLanguage: '언어 변경',
    },
    welcome: {
      greet: '환영합니다',
      title: '체크인을\n시작해 볼까요',
      desc: '직원이 없어도 괜찮아요. 체크인, 결제, 문의까지 이 페이지에서 모두 해결하세요.',
      highlights: ['약 1분', '앱 설치 불필요', 'AI 가이드 24시간'],
      chooseLanguage: '언어 선택',
      continueLabel: '계속',
      powered: 'Powered by PixelDrive',
    },
    checkIn: {
      progressLabel: '체크인 진행 상황',
      steps: ['예약', '규칙', '결제'],
      plate: {
        submit: '내 예약 찾기',
        title: '예약 찾기',
        desc: '예약자 이름 또는 번호판을 입력해 주세요.',
        plateAria: '번호판',
        legend: '번호판',
        region: '지역',
        classNo: '분류 번호',
        kana: '가나',
        serial: '번호',
      },
      bookingFound: {
        cta: '이 예약으로 체크인',
        banner: '예약을 찾았습니다',
        cardAria: '예약 정보',
        dates: '일정',
        plan: '플랜',
        guests: '인원',
        fee: '요금',
        notMe: '제 예약이 아닙니다',
        demo: {
          dates: '10월 30일(금) – 10월 31일(토)',
          nights: '1박',
          plan: '전기 사이트',
          guests: '성인 2명',
          feeStatus: '미결제',
        },
      },
      noBooking: {
        askHost: '호스트에게 문의',
        title: '예약을 찾을 수 없습니다',
        desc: (plate) => `오늘 “${plate}”와(과) 일치하는 예약이 없습니다.`,
        reasonsTitle: '자주 있는 원인',
        reasons: ['다른 차량으로 예약했어요', '다른 날짜로 예약했어요', '일행 중 다른 분이 예약했어요'],
        editPlate: '번호판 수정',
        searchByName: '이름으로 검색',
        walkInTitle: '오늘 밤 숙박도 가능합니다',
        walkInDesc: '오늘 밤 빈 사이트가 있습니다. 오늘 요금으로 체크인하세요.',
        walkInCta: '현장 체크인하기',
      },
      siteRules: {
        agreeText: '위 규칙을 확인했습니다',
        agreeCta: '동의하고 계속',
        siteLabel: '내 사이트',
        mapAria: (site) => `사이트 지도: ${site}은(는) 입구 오른쪽, 화장실 맞은편입니다`,
        restrooms: '화장실',
        kitchen: '주방',
        entrance: '입구',
        directions: '입구에서 오른쪽, 화장실 맞은편입니다.',
        title: '입실 전 확인해 주세요',
        rules: [
          { title: '정숙 시간 22:00–7:00', text: '엔진과 발전기는 사용하지 마세요.' },
          {
            title: '쓰레기는 3종류로 분리',
            text: '가연성, 캔·병, 페트병 — 쓰레기장에 버려 주세요.',
          },
          { title: '화기는 화로대에서만', text: '땅바닥에서 직접 불을 피우지 마세요.' },
          {
            title: '체크아웃은 10:00까지',
            text: '늦은 체크아웃은 1시간당 ¥500 — AI 가이드에 문의하세요.',
          },
        ],
      },
    },
  },
}

export function isLanguageCode(value: unknown): value is LanguageCode {
  return typeof value === 'string' && value in TRANSLATIONS
}
