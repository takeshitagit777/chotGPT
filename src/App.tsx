/**const combinations
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  Coffee,
  Code2,
  Compass,
  Copy,
  FlaskConical,
  HelpCircle,
  Info,
  Lightbulb,
  Menu,
  MessageSquare,
  PenLine,
  Plus,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
  note?: string;
  time: string;
};

const pick = <T,>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

const getCurrentTime = () => {
  return new Date().toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const openings = [
  "承知しました。",
  "いいですね。",
  "たぶんこれでいけます。",
  "方向性としては、こんな感じです。",
  "一旦、これでどうでしょう。",
  "ちょっとだけ頑張ってみました。",
  "完全ではないですが、使える形にします。",
  "ほどよく整えると、こうなります。",
  "雑に見えて、意外と使える案です。",
  "人間が仕上げやすい形にしておきます。",
  "もう一声ほしいですが、まずはこれです。",
  "ちゃんとして見える形にすると、こんな感じです。",
];

const endings = [
  "必要に応じて、語尾だけ少し調整してください。",
  "このままでも使えますが、少し具体例を足すと強いです。",
  "相手に合わせて、少しだけ丁寧さを足すとよさそうです。",
  "最後に日付や期限を入れると、急にちゃんとして見えます。",
  "細かいニュアンスは、人間の手で整えると完成です。",
  "ここに固有名詞を入れると、かなり実用的になります。",
  "もう少しだけ背景を足せば、だいぶ自然になります。",
  "あとは温度感だけ調整すればOKです。",
  "このままだと少し薄いですが、方向性は悪くないです。",
  "必要なら、ここから真面目版に寄せられます。",
];

const humorOpenings = [
  "了解です。chotGPT、今だけ少し賢そうな顔をしています。",
  "任せてください。完璧ではないですが、雰囲気は出します。",
  "承知しました。だいたい合ってる方向に全力で走ります。",
  "いいですね。今、脳内でそれっぽい会議が始まりました。",
  "わかりました。自信は控えめ、やる気はそこそこあります。",
  "了解です。少しだけ仕事ができるAIのふりをします。",
  "任せてください。人間が直しやすい程度に整えます。",
  "承知しました。あとで人間が助けに来る前提で進めます。",
  "いい感じにします。いい感じの定義は、今から考えます。",
  "わかりました。chotGPT、ここで一歩前に出ます。半歩くらい。",
  "了解です。今のところ、方向性だけはかなり前向きです。",
  "承知しました。深そうに見える浅瀬からお届けします。",
  "任せてください。ほどよく使えて、ほどよく不安な案です。",
  "いいですね。たぶん悪くないです。たぶんが重要です。",
  "わかりました。人類の叡智を薄めに使います。",
  "承知しました。すごそうな言い方で、普通のことを言います。",
  "了解です。今から“それっぽさ”を最大化します。",
  "任せてください。完成度80点、伸びしろ20点でいきます。",
  "いいですね。AIらしく冷静に、chotGPTらしく少し外します。",
  "わかりました。考えている風の間を少し取ります。",
  "承知しました。ほどよい賢さでお送りします。",
  "了解です。ちゃんとして見えるところまで持っていきます。",
  "任せてください。最後の詰めだけ置き去りにします。",
  "いいですね。ギリギリ実用ラインを狙います。",
  "わかりました。chotGPT、静かに腕まくりします。",
  "承知しました。惜しさ込みで、味にします。",
  "了解です。雑ではないです。粗めです。",
  "任せてください。未来のあなたが少し直せる余地を残します。",
  "いいですね。たたき台としては、だいぶ偉いです。",
  "わかりました。人間が褒めてくれる一歩手前まで行きます。",
];

const humorPunchlines = [
  "ここまで来たら、あとは人間の顔つきで押し切れます。",
  "かなりそれっぽいです。中身の確認は別途お願いします。",
  "完成ではないですが、会議に出しても怒られにくいです。",
  "今のところ、雰囲気は勝っています。",
  "もう一文足せば、急に仕事ができる人に見えます。",
  "不足している部分は、伸びしろと呼びましょう。",
  "chotGPT的には、これはかなり健闘しています。",
  "ちゃんと見えるかどうかで言えば、ちゃんと見えます。",
  "正確さより先に、安心感を出してみました。",
  "ここから先は、キーボードを持った人間の出番です。",
  "少し薄いですが、薄味が好きな人には刺さります。",
  "もう少し具体化すると、急に本物っぽくなります。",
  "このまま出すなら勇気、直して出すなら知性です。",
  "方向性は合っています。たぶん道もあります。",
  "完璧ではないですが、寝かせたら良くなりそうです。",
  "人間が3分直せば、かなり戦えます。",
  "あと少しで“ちゃんとしてる感”に届きます。",
  "今はまだ素材です。でも、いい素材です。",
  "この回答には、ほどよい未完成感があります。",
  "責任だけは、そっと人間側に置いておきます。",
  "chotGPTはここまでです。ラストワンマイルは徒歩でお願いします。",
  "AI感はあります。実務感は追加トッピングです。",
  "だいたい合っています。だいたいは便利な言葉です。",
  "最後に固有名詞を入れたら、急にプロっぽくなります。",
  "ここに期限を書くと、仕事が発生します。",
  "いい感じです。いい感じという言葉に甘えています。",
  "詰めが甘いですが、甘さ控えめです。",
  "かなり惜しいです。つまり、chotGPTらしいです。",
  "堂々と出せば、それっぽく見える可能性があります。",
  "一回見直せば、かなり人間社会に適応します。",
];

const humorNotes = [
  "※ 最終判断は、寝不足ではない人間がしてください。",
  "※ chotGPTは責任より雰囲気を重視しています。",
  "※ ここから先は、あなたの社会性に託します。",
  "※ 正確性は確認、勢いはこのままでOKです。",
  "※ あと一歩は、だいたい人間の仕事です。",
  "※ すごく見えますが、念のため見直してください。",
  "※ これは完成品ではなく、完成品の親戚です。",
  "※ ちゃんとした人に見せる前に、ちゃんと見直してください。",
  "※ chotGPTは褒められると伸びます。たぶん。",
  "※ 雰囲気採点なら高得点です。",
  "※ 実務投入前に、軽く現実を混ぜてください。",
  "※ あくまで“それっぽい”です。“それ”ではありません。",
  "※ ここで油断すると、あとで人間が焦ります。",
  "※ もう一声ほしい。それがchotGPTです。",
  "※ 仕上げるときは、急に真面目になってください。",
  "※ だいたい使えます。だいたい。",
  "※ すべてを信じるには、まだ早いです。",
  "※ 不安なところは、chotGPTも不安です。",
  "※ いい感じに見えるよう、最大限がんばりました。",
  "※ 足りないところがあるから、人間が輝けます。",
];

const createChotReply = (input: string) => {
  const text = input.toLowerCase();

  let bodyPool = defaultBodies;

  if (text.includes("謝罪") || text.includes("すみません") || text.includes("申し訳")) {
    bodyPool = apologyBodies;
  } else if (text.includes("会議") || text.includes("アジェンダ") || text.includes("打ち合わせ")) {
    bodyPool = meetingBodies;
  } else if (text.includes("メール") || text.includes("返信") || text.includes("文章")) {
    bodyPool = mailBodies;
  } else if (text.includes("アイデア") || text.includes("案") || text.includes("企画")) {
    bodyPool = ideaBodies;
  } else if (text.includes("コード") || text.includes("エラー") || text.includes("バグ")) {
    bodyPool = codeBodies;
  }

  return {
    text: `${pick(openings)}\n\n${pick(bodyPool)}\n\n${pick(endings)}`,
    note: pick(notes),
  };
};

const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) => (
  <div
    className={`group flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all ${
      active
        ? "bg-white text-gray-950 shadow-sm ring-1 ring-gray-100"
        : "text-gray-500 hover:bg-white/70 hover:text-gray-900"
    }`}
  >
    <Icon
      className={`h-4 w-4 ${
        active ? "text-green-500" : "text-gray-400 group-hover:text-green-500"
      }`}
    />
    <span>{label}</span>
  </div>
);

const RobotCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35 }}
    className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-5 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl"
  >
    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green-200/40 blur-3xl" />
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-gray-400">CHOT STATUS</p>
        <p className="text-sm font-semibold text-gray-900">そこそこ稼働中</p>
      </div>
      <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        online
      </span>
    </div>

    <div className="flex items-center gap-5">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="relative h-32 w-32"
      >
        <div className="absolute left-1/2 top-0 h-7 w-1 -translate-x-1/2 rounded-full bg-slate-400">
          <div className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.7)]" />
        </div>
        <div className="absolute left-1/2 top-6 flex h-24 w-28 -translate-x-1/2 items-center justify-center rounded-[2rem] border-4 border-gray-50 bg-white p-3 shadow-xl">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[1.35rem] bg-slate-900">
            <div className="flex gap-5">
              <div className="h-4 w-3 rounded-full bg-green-400" />
              <div className="h-4 w-3 rounded-full bg-green-400" />
            </div>
            <div className="h-1 w-7 rounded-full bg-slate-600" />
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 h-8 w-24 -translate-x-1/2 rounded-t-3xl border-x-4 border-t-4 border-gray-50 bg-white shadow-lg" />
      </motion.div>

      <div className="min-w-0">
        <p className="rounded-2xl bg-gray-950 px-4 py-3 text-sm font-medium leading-relaxed text-white shadow-xl">
          うーん…
          <br />
          あと一歩、届かない…
        </p>
        <p className="mt-3 text-xs leading-relaxed text-gray-500">
          完璧すぎない返答を、かなり真面目な顔で返します。
        </p>
      </div>
    </div>
  </motion.div>
);

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: any;
  title: string;
  description: string;
  color: string;
}) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="group rounded-[1.75rem] border border-white/80 bg-white/70 p-6 shadow-[0_18px_60px_-36px_rgba(15,23,42,0.4)] backdrop-blur-xl transition-all hover:bg-white"
  >
    <div
      className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}
    >
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="mb-2 text-sm font-bold text-gray-950">{title}</h3>
    <p className="text-xs leading-relaxed text-gray-500">{description}</p>
  </motion.div>
);

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "user",
      text: "いい感じの返信考えて",
      time: "10:21",
    },
    {
      id: 2,
      role: "assistant",
      text: "承知しました。\n\nいい感じにしておきます。",
      note: "※ 具体性は人間が足してください。",
      time: "10:21",
    },
  ]);

const combinations = "AI";

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      text: trimmed,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

try {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: trimmed,
    }),
  });

  const data = await response.json();

  const assistantMessage: ChatMessage = {
    id: Date.now() + 1,
    role: "assistant",
    text:
      data.reply ||
      data.error ||
      "すみません、chotGPTがちょっと詰まりました。",
    note:
      typeof data.remaining === "number"
        ? `※ 本日の残りちょっと相談: ${data.remaining}回`
        : "",
    time: getCurrentTime(),
  };

  setMessages((prev) => [...prev, assistantMessage]);
} catch (error) {
  const assistantMessage: ChatMessage = {
    id: Date.now() + 1,
    role: "assistant",
    text: "すみません、chotGPTがちょっと転びました。",
    note: "※ 少し時間を置いて試してください。",
    time: getCurrentTime(),
  };

  setMessages((prev) => [...prev, assistantMessage]);
} finally {
  setIsThinking(false);
}
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#f7faf8] text-gray-900">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[18%] top-[-10%] h-72 w-72 rounded-full bg-green-200/50 blur-3xl" />
        <div className="absolute right-[-8%] top-[12%] h-96 w-96 rounded-full bg-emerald-100/80 blur-3xl" />
        <div className="absolute bottom-[-12%] left-[35%] h-96 w-96 rounded-full bg-lime-100/80 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.06)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>

      <AnimatePresence>
        {isSidebarOpen && windowWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? 280 : 0,
          x: isSidebarOpen ? 0 : -280,
        }}
        className="fixed z-50 h-screen overflow-hidden border-r border-white/70 bg-white/55 shadow-[8px_0_40px_-30px_rgba(15,23,42,0.5)] backdrop-blur-2xl lg:relative"
      >
        <div className="flex h-full min-w-[280px] flex-col p-4">
          <div className="mb-6 flex items-center gap-3 rounded-3xl bg-white/70 p-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100 text-green-600">
              <MessageSquare className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold tracking-tight">
                chot<span className="text-green-500">GPT</span>
              </h1>
              <p className="text-[10px] font-semibold text-gray-400">
                あとちょっと足りないAI
              </p>
            </div>
          </div>

          <button className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-4 py-3 text-sm font-bold text-white shadow-xl shadow-gray-200 transition-all hover:-translate-y-0.5 hover:bg-gray-800">
            <Plus className="h-4 w-4" />
            ちょっと新しく聞く
          </button>

          <nav className="flex-1 space-y-1">
            <SidebarItem icon={MessageSquare} label="あとちょっと相談室" active />
            <SidebarItem icon={PenLine} label="気まずい返信処理室" />
            <SidebarItem icon={FlaskConical} label="やる気ゼロ研究所" />
            <SidebarItem icon={Lightbulb} label="丸投げアイデア置き場" />
            <SidebarItem icon={Coffee} label="雑談でもいいよね" />
          </nav>

          <div className="space-y-1 border-t border-gray-200/60 pt-4">
            <SidebarItem icon={Settings} label="ちょっとした設定" />
            <SidebarItem icon={HelpCircle} label="使い方のヒント" />
            <SidebarItem icon={Info} label="chotGPTについて" />
          </div>

          <div className="mt-4 rounded-3xl border border-white/80 bg-white/70 p-4 shadow-sm">
            <p className="mb-1 text-[10px] font-extrabold tracking-[0.18em] text-green-600">
              TODAY'S CHOT
            </p>
            <p className="text-xs leading-relaxed text-gray-600">
              「考えるフリ、大得意。」
            </p>
          </div>
        </div>
      </motion.aside>

      <main className="relative z-10 flex h-screen flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-[#f7faf8]/75 px-5 backdrop-blur-xl sm:px-8">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-2xl border border-white/80 bg-white/70 p-2 text-gray-600 shadow-sm transition hover:bg-white lg:hidden"
            aria-label="menu"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-semibold text-gray-500 shadow-sm backdrop-blur-xl sm:flex">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            API接続中・1日3回まで
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-full border border-green-200 bg-white/80 px-4 py-2 text-xs font-bold text-green-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              アップグレード
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gray-200 shadow-sm">
              <Bot className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-6xl flex-col px-5 pb-16 pt-10 sm:px-8 lg:pt-14">
          <div className="grid items-start gap-8 lg:grid-cols-[1fr,360px]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-xs font-bold text-green-700 shadow-sm backdrop-blur-xl">
                  <Sparkles className="h-4 w-4" />
                  ちょっと惜しい。でも、ちょっと助かる。
                </div>

                <h2 className="font-display text-5xl font-black tracking-[-0.06em] text-gray-950 sm:text-7xl">
                  chot<span className="text-green-500">GPT</span>
                </h2>

                <p className="mt-4 max-w-2xl text-xl font-semibold leading-relaxed text-gray-700 sm:text-2xl">
                  返信が、
                  <span className="mx-1 rounded-2xl bg-green-100 px-2 text-green-700">
                    あとちょっと
                  </span>
                  足りないAI。
                </p>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
                  完璧すぎないから、ちょうどいい。文章・返信・アイデアを、
                  ゆるく整える相棒です。
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-5 rounded-[2rem] border border-white/80 bg-white/75 p-3 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.45)] backdrop-blur-xl"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmit();
                    }}
                    placeholder="何を聞きますか？たぶん答えます。"
                    className="min-h-12 flex-1 bg-transparent px-4 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!input.trim() || isThinking}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-gray-200 transition-all hover:-translate-y-0.5 hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                  >
                    <Send className="h-4 w-4" />
                    ちょっと聞く
                  </button>
                </div>
              </motion.div>

              <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/70 bg-white/55 px-4 py-3 text-xs font-semibold text-gray-500 backdrop-blur-xl">
                  <span className="text-gray-950">{combinations.toLocaleString()}</span>
                  通り以上の返答
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/55 px-4 py-3 text-xs font-semibold text-gray-500 backdrop-blur-xl">
                  OpenAI API
                  <span className="text-gray-950"> 未使用</span>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/55 px-4 py-3 text-xs font-semibold text-gray-500 backdrop-blur-xl">
                  そこそこ考え中
                  <span className="text-gray-950"> 対応</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <RobotCard />
            </div>
          </div>

          <div className="mt-4 grid gap-8 lg:grid-cols-[1fr,360px]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-[2rem] border border-white/80 bg-white/60 p-4 shadow-[0_24px_80px_-46px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="flex items-center gap-2 text-xs font-extrabold tracking-[0.18em] text-gray-400">
                    <Sparkles className="h-4 w-4 text-green-500" />
                    CHOT CHAT
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-gray-950">
                    こんなやりとり、よくあります。
                  </h3>
                </div>
                <button
                  onClick={() =>
                    setMessages([
                      {
                        id: 1,
                        role: "user",
                        text: "いい感じの返信考えて",
                        time: "10:21",
                      },
                      {
                        id: 2,
                        role: "assistant",
                        text: "承知しました。\n\nいい感じにしておきます。",
                        note: "※ 具体性は人間が足してください。",
                        time: "10:21",
                      },
                    ])
                  }
                  className="hidden rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-500 transition hover:bg-gray-50 sm:block"
                >
                  reset
                </button>
              </div>

              <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col gap-1 ${
                      message.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`whitespace-pre-line px-5 py-3 text-sm leading-7 shadow-sm ${
                        message.role === "user"
                          ? "max-w-[88%] rounded-3xl rounded-tr-md bg-gray-950 text-white"
                          : "max-w-[92%] rounded-3xl rounded-tl-md border border-gray-100 bg-white text-gray-800"
                      }`}
                    >
                      {message.text}
                      {message.note && (
                        <div className="mt-3 border-t border-gray-100 pt-2 text-[11px] italic leading-relaxed text-gray-400">
                          {message.note}
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-[10px] text-gray-400 ${
                        message.role === "user" ? "mr-2" : "ml-2"
                      }`}
                    >
                      {message.role === "user" ? "あなた" : "chotGPT"} • {message.time}
                    </span>
                  </motion.div>
                ))}

                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-start gap-1"
                  >
                    <div className="rounded-3xl rounded-tl-md border border-gray-100 bg-white px-5 py-3 text-sm text-gray-500 shadow-sm">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        そこそこ考え中...
                      </span>
                    </div>
                    <span className="ml-2 text-[10px] text-gray-400">chotGPT</span>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </motion.div>

            <div className="space-y-5">
              <div className="lg:hidden">
                <RobotCard />
              </div>

              <div className="rounded-[2rem] border border-white/80 bg-white/60 p-5 shadow-[0_24px_80px_-46px_rgba(15,23,42,0.35)] backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-500" />
                  <p className="text-sm font-bold text-gray-950">できること</p>
                </div>
                <div className="space-y-3">
                  {[
                    "謝罪文をちょっと丁寧に",
                    "会議アジェンダをちょっと作成",
                    "返信文をちょっと整える",
                    "アイデアをちょっと出す",
                    "コードエラーをちょっと見る",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl bg-white/70 px-3 py-2 text-xs font-semibold text-gray-600"
                    >
                      <span className="h-2 w-2 rounded-full bg-green-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-gray-900 bg-gray-950 p-5 text-white shadow-[0_24px_80px_-42px_rgba(15,23,42,0.8)]">
                <div className="mb-3 flex items-center gap-2">
                  <Copy className="h-4 w-4 text-green-300" />
                  <p className="text-sm font-bold">今日のchotコピー</p>
                </div>
                <p className="text-sm leading-7 text-gray-300">
                  「完璧ではないけど、だいたい何とかなるAI。」
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            <FeatureCard
              icon={PenLine}
              title="文章をちょっと整える"
              description="言いたいことはあるけど、形にするのがめんどうなときに。"
              color="bg-blue-50 text-blue-500"
            />
            <FeatureCard
              icon={Lightbulb}
              title="アイデアをちょっと出す"
              description="ゼロからは無理だけど、ヒントがほしいときに。"
              color="bg-amber-50 text-amber-500"
            />
            <FeatureCard
              icon={Code2}
              title="コードをちょっと見る"
              description="たぶん原因を言います。直るかは環境次第です。"
              color="bg-rose-50 text-rose-500"
            />
          </div>

          <footer className="mt-14 pb-10 text-center">
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/80 bg-white/55 px-6 py-5 text-xs leading-7 text-gray-500 backdrop-blur-xl">
              <p className="font-semibold text-gray-600">
                ちょっとだけが、ちょうどいい。そんなAIです。
              </p>
              <p className="mt-2">
                chotGPTはジョーク系のオリジナルAIサービスです。OpenAI / ChatGPTとは関係ありません。
              </p>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
