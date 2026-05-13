/**
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

const notes = [
  "※ 具体性は人間が足してください。",
  "※ 最後の詰めは、あなたの仕事です。",
  "※ もう一声ほしい場合があります。",
  "※ ここから先は人類の出番です。",
  "※ だいたい合っている気がします。",
  "※ ちゃんと見直すと、ちゃんとします。",
  "※ いい感じ風にはなっています。",
  "※ あと一文足すと急に仕事っぽくなります。",
  "※ 完成度は人間のやさしさで補ってください。",
  "※ chotGPT調べです。つまり、やや不安です。",
  "※ 方向性だけは合っているはずです。",
  "※ 仕上げは未来のあなたに託します。",
  "※ たぶん使えます。たぶん。",
  "※ 少し整えると、かなりそれっぽくなります。",
  "※ 深掘りは人間担当です。",
];

const apologyBodies = [
  "このたびはご迷惑をおかけし、申し訳ございません。\n今後同様のことがないよう、十分注意いたします。",
  "ご指摘いただきありがとうございます。\n確認不足によりご迷惑をおかけし、申し訳ございませんでした。",
  "本件について、配慮が足りておらず申し訳ございません。\n内容を確認のうえ、速やかに対応いたします。",
  "ご不便をおかけし、申し訳ございません。\n原因を確認し、再発防止に努めます。",
  "認識に誤りがあり、申し訳ございません。\n改めて確認し、正しい内容に修正いたします。",
  "対応が遅くなり、申し訳ございません。\n現在確認を進めておりますので、完了次第ご連絡いたします。",
  "説明が不足しており、申し訳ございません。\n補足を含めて、改めて整理いたします。",
  "お手数をおかけしてしまい、申し訳ございません。\n次回以降、同様のことがないよう注意いたします。",
];

const mailBodies = [
  "お世話になっております。\nご連絡いただきありがとうございます。\n本件について、確認のうえ対応いたします。\nよろしくお願いいたします。",
  "お世話になっております。\n内容確認いたしました。\n問題なければ、この方向で進めさせていただきます。",
  "ご共有ありがとうございます。\nいただいた内容を確認し、必要に応じて対応いたします。",
  "ご連絡ありがとうございます。\n確認後、改めてご回答いたします。",
  "お世話になっております。\nご依頼の件、承知いたしました。\n対応完了次第、ご報告いたします。",
  "ご確認ありがとうございます。\nいただいたご指摘を踏まえ、修正いたします。",
  "お世話になっております。\n本件について、以下の通り回答いたします。",
  "ご連絡ありがとうございます。\n現時点では、以下の対応を想定しております。",
];

const meetingBodies = [
  "以下の流れでよいかと思います。\n\n1. はじめに\n2. 確認事項\n3. 今後について",
  "アジェンダ案は以下です。\n\n1. 前回内容の確認\n2. 本日の確認事項\n3. 課題・懸念点\n4. 次回アクション",
  "会議の流れとしては、以下が使いやすそうです。\n\n1. 目的の確認\n2. 現状共有\n3. 論点整理\n4. 決定事項の確認",
  "一旦、以下の構成で進めると整理しやすいです。\n\n1. 背景\n2. 現状\n3. 課題\n4. 対応方針\n5. 次の進め方",
  "議論が散らからないように、以下の流れがよさそうです。\n\n1. ゴール確認\n2. 主要論点\n3. 判断が必要な事項\n4. 宿題事項",
  "短めなら、これで十分です。\n\n1. 現状確認\n2. 課題確認\n3. 次アクション確認",
  "お客様向けなら、以下の方が丁寧です。\n\n1. 本日のゴール\n2. 前回からの変更点\n3. ご確認事項\n4. 今後の進め方",
];

const ideaBodies = [
  "方向性としては、以下の3つが使いやすそうです。\n\n1. シンプルに伝える案\n2. 少しユーモアを入れる案\n3. ちゃんとして見える案",
  "まずは案を広げるなら、以下です。\n\n1. 使いやすさ重視\n2. ネタ感重視\n3. 真面目さ重視",
  "それっぽい案としては、以下があります。\n\n1. ゆるく見せる\n2. 便利そうに見せる\n3. ちょっと笑えるようにする",
  "初手の案としては、これくらいで十分です。\n\n1. 直球案\n2. ひねり案\n3. 安全案",
  "考え方としては、以下の切り口がよさそうです。\n\n1. 誰に向けるか\n2. 何で笑わせるか\n3. どこまで実用に寄せるか",
  "ざっくり案出しすると、以下です。\n\n1. 見た目で惹く\n2. 文言で笑わせる\n3. 動きで印象を残す",
  "バズりを狙うなら、以下の軸がよさそうです。\n\n1. 共感\n2. 自虐\n3. あるある",
];

const codeBodies = [
  "たぶんですが、原因はこのあたりにありそうです。\n\n・指定している名前が違う\n・必要な設定が足りない\n・読み込む場所がずれている",
  "まず見るべきは以下です。\n\n1. エラーメッセージの1行目\n2. 対象ファイル名\n3. importやパスの指定",
  "怪しいポイントはこのあたりです。\n\n・ファイル名の不一致\n・型エラー\n・パッケージ不足\n・設定ファイルのズレ",
  "切り分けるなら、以下の順番がよさそうです。\n\n1. ローカルで動くか\n2. buildが通るか\n3. Vercelでだけ落ちるか",
  "この手のエラーは、だいたい以下のどれかです。\n\n1. typo\n2. import漏れ\n3. バージョン違い\n4. 設定不足",
  "焦らず見るなら、まずはログです。\n\nエラーの最初の1〜3行に、だいたい答えがいます。",
];

const defaultBodies = [
  "方向性としては問題なさそうです。\n少し整えれば、ちゃんと使える内容になると思います。",
  "一旦、この形で進めてもよさそうです。\n細かい部分はあとで調整できます。",
  "かなりいい感じです。\nただ、最後にもう一文あると安心感が出ます。",
  "その内容なら、まずはシンプルに伝えるのがよさそうです。",
  "少しだけ丁寧にすると、かなり印象がよくなります。",
  "このままだと少し薄いですが、方向性は悪くないです。",
  "まずはたたき台として十分です。\nあとで人間が整えれば完成です。",
  "いいと思います。\nただ、具体例を1つ足すともっと伝わりやすいです。",
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

  const combinations = useMemo(() => {
    return openings.length * endings.length * notes.length * defaultBodies.length;
  }, []);

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

  const handleSubmit = () => {
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

    setTimeout(() => {
      const reply = createChotReply(trimmed);

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: reply.text,
        note: reply.note,
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 850);
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
            APIなし・課金ゼロのテンプレ版
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
