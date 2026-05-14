/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import {
  Bot,
  Coffee,
  Code2,
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

type Plan = "free" | "pro";

const getCurrentTime = () => {
  return new Date().toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const initialMessages: ChatMessage[] = [
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
];

const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`group flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition-all ${
      active
        ? "bg-white text-gray-950 shadow-sm ring-1 ring-gray-100"
        : "text-gray-700 hover:bg-white/80 hover:text-gray-950 hover:shadow-sm"
    }`}
  >
    <Icon
      className={`h-4 w-4 ${
        active ? "text-green-500" : "text-gray-500 group-hover:text-green-500"
      }`}
    />
    <span>{label}</span>
  </button>
);

const RobotCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35 }}
    className="relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/70 p-4 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:rounded-[2rem] sm:p-5"
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

    <div className="flex items-center gap-4 sm:gap-5">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32"
      >
        <div className="absolute left-1/2 top-0 h-7 w-1 -translate-x-1/2 rounded-full bg-slate-400">
          <div className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.7)]" />
        </div>
        <div className="absolute left-1/2 top-6 flex h-20 w-24 -translate-x-1/2 items-center justify-center rounded-[1.75rem] border-4 border-gray-50 bg-white p-3 shadow-xl sm:h-24 sm:w-28 sm:rounded-[2rem]">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[1.35rem] bg-slate-900">
            <div className="flex gap-5">
              <div className="h-4 w-3 rounded-full bg-green-400" />
              <div className="h-4 w-3 rounded-full bg-green-400" />
            </div>
            <div className="h-1 w-7 rounded-full bg-slate-600" />
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 h-7 w-20 -translate-x-1/2 rounded-t-3xl border-x-4 border-t-4 border-gray-50 bg-white shadow-lg sm:h-8 sm:w-24" />
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
    className="group rounded-[1.5rem] border border-white/80 bg-white/70 p-5 shadow-[0_18px_60px_-36px_rgba(15,23,42,0.4)] backdrop-blur-xl transition-all hover:bg-white sm:rounded-[1.75rem] sm:p-6"
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
  const [activeMenu, setActiveMenu] = useState("あとちょっと相談室");
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [plan, setPlan] = useState<Plan>("free");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

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
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get("checkout");

    if (checkout === "success") {
      localStorage.setItem("chotgpt_plan", "pro");
      setPlan("pro");
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    const savedPlan = localStorage.getItem("chotgpt_plan");

    if (savedPlan === "pro") {
      setPlan("pro");
    }
  }, []);

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
          "x-chot-plan": plan,
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
            ? `※ ${data.plan === "pro" ? "Pro" : "無料"}プラン残り: ${
                data.remaining
              }回`
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

  const handleNewChat = () => {
    setActiveMenu("あとちょっと相談室");
    setInput("");
    setMessages([]);
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "決済ページの作成に失敗しました。");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      alert("決済ページに行こうとして転びました。少し時間を置いて試してください。");
    }
  };

  const mainMenuItems = [
    {
      icon: MessageSquare,
      label: "あとちょっと相談室",
      prompt: "",
    },
    {
      icon: PenLine,
      label: "気まずい返信処理室",
      prompt: "気まずい返信を、ちょっと失礼じゃない感じで考えて",
    },
    {
      icon: FlaskConical,
      label: "やる気ゼロ研究所",
      prompt: "やる気が出ないときの言い訳を、それっぽく考えて",
    },
    {
      icon: Lightbulb,
      label: "丸投げアイデア置き場",
      prompt: "丸投げでいいので、ちょっと使えそうなアイデア出して",
    },
    {
      icon: Coffee,
      label: "雑談でもいいよね",
      prompt: "どうでもいい雑談を、ちょっと面白く返して",
    },
  ];

  const subMenuItems = [
    {
      icon: Settings,
      label: "ちょっとした設定",
      prompt: "chotGPTの設定っぽいものを教えて",
    },
    {
      icon: HelpCircle,
      label: "使い方のヒント",
      prompt: "chotGPTの使い方を、ちょっとふざけて教えて",
    },
    {
      icon: Info,
      label: "chotGPTについて",
      prompt: "chotGPTについて説明して",
    },
  ];

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#f7faf8] text-gray-900">
      <AnimatePresence>
        {isUpgradeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-6 backdrop-blur-sm sm:items-center"
            onClick={() => setIsUpgradeOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ type: "spring", damping: 24, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="my-auto w-full max-w-2xl rounded-[1.5rem] border border-white/80 bg-white p-5 shadow-[0_30px_100px_-40px_rgba(15,23,42,0.6)] sm:rounded-[2rem] sm:p-6"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    chotGPT Pro
                  </p>
                  <h2 className="font-display text-2xl font-black tracking-[-0.04em] text-gray-950 sm:text-3xl">
                    もっとちょっとする？
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-gray-500">
                    無料版では物足りない人向けの、物足りなさ増量プランです。
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsUpgradeOpen(false)}
                  className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 transition hover:bg-gray-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-5">
                  <p className="text-sm font-black text-gray-950">無料プラン</p>
                  <p className="mt-2 text-3xl font-black text-gray-950">
                    ¥0
                    <span className="text-sm font-bold text-gray-400"> / 月</span>
                  </p>
                  <div className="mt-5 space-y-3 text-sm text-gray-600">
                    <p>・1日3回まで</p>
                    <p>・ちょっと惜しい回答</p>
                    <p>・たまに転ぶ</p>
                    <p>・最後の詰めは人間</p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[1.5rem] border border-green-200 bg-green-50 p-5 shadow-lg shadow-green-100">
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-green-300/40 blur-2xl" />
                  <p className="relative text-sm font-black text-green-800">
                    Proプラン
                  </p>
                  <p className="relative mt-2 text-3xl font-black text-gray-950">
                    ¥500
                    <span className="text-sm font-bold text-gray-500"> / 月</span>
                  </p>
                  <div className="relative mt-5 space-y-3 text-sm text-gray-700">
                    <p>・1日50回まで</p>
                    <p>・さらにふざける</p>
                    <p>・長めの返信も対応</p>
                    <p>・履歴保存予定</p>
                    <p>・もう少しだけ頼れる</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-dashed border-gray-200 bg-gray-50 px-5 py-4 text-sm leading-7 text-gray-500">
                Proプランでは、1日50回までちょっと相談できます。
                決済後、もう少しだけ頼れるchotGPTをご利用いただけます。
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsUpgradeOpen(false)}
                  className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
                >
                  まだ人間で頑張る
                </button>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="rounded-2xl bg-gray-950 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-gray-200 transition hover:-translate-y-0.5 hover:bg-gray-800"
                >
                  Proプランにアップグレード
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

          <button
            type="button"
            onClick={handleNewChat}
            className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-4 py-3 text-sm font-bold text-white shadow-xl shadow-gray-200 transition-all hover:-translate-y-0.5 hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            ちょっと新しく聞く
          </button>

          <nav className="flex-1 space-y-1">
            {mainMenuItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={activeMenu === item.label}
                onClick={() => {
                  setActiveMenu(item.label);
                  setInput(item.prompt);
                }}
              />
            ))}
          </nav>

          <div className="space-y-1 border-t border-gray-200/60 pt-4">
            {subMenuItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={activeMenu === item.label}
                onClick={() => {
                  setActiveMenu(item.label);
                  setInput(item.prompt);
                }}
              />
            ))}
          </div>

          <div className="mt-4 rounded-3xl border border-white/80 bg-white/70 p-4 shadow-sm">
            <p className="mb-1 text-[10px] font-extrabold tracking-[0.18em] text-green-600">
              TODAY&apos;S CHOT
            </p>
            <p className="text-xs leading-relaxed text-gray-600">
              「考えるフリ、大得意。」
            </p>
          </div>
        </div>
      </motion.aside>

      <main className="relative z-10 flex h-screen flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-[#f7faf8]/75 px-4 backdrop-blur-xl sm:px-8">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-2xl border border-white/80 bg-white/70 p-2 text-gray-600 shadow-sm transition hover:bg-white lg:hidden"
            aria-label="menu"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-semibold text-gray-500 shadow-sm backdrop-blur-xl sm:flex">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            {plan === "pro"
              ? "Pro稼働中・1日50回まで"
              : "ふざけ気味に稼働中・1日3回まで"}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {plan === "pro" && (
              <span className="rounded-full bg-green-100 px-3 py-2 text-xs font-bold text-green-700 sm:hidden">
                Pro
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsUpgradeOpen(true)}
              className="rounded-full border border-green-200 bg-white/80 px-3 py-2 text-xs font-bold text-green-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:px-4"
            >
              <span className="hidden sm:inline">アップグレード</span>
              <span className="sm:hidden">Pro</span>
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gray-200 shadow-sm">
              <Bot className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-8 lg:pt-14">
          <div className="grid items-start gap-6 lg:grid-cols-[1fr,360px] lg:gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 sm:mb-8"
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-xs font-bold text-green-700 shadow-sm backdrop-blur-xl sm:mb-5">
                  <Sparkles className="h-4 w-4" />
                  ちょっと惜しい。でも、ちょっと助かる。
                </div>

                <h2 className="font-display text-4xl font-black tracking-[-0.06em] text-gray-950 sm:text-7xl">
                  chot<span className="text-green-500">GPT</span>
                </h2>

                <p className="mt-4 max-w-2xl text-lg font-semibold leading-relaxed text-gray-700 sm:text-2xl">
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
                className="mb-5 rounded-[1.5rem] border border-white/80 bg-white/80 p-2 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:rounded-[2rem] sm:p-3"
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
                    type="button"
                    onClick={handleSubmit}
                    disabled={!input.trim() || isThinking}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-gray-200 transition-all hover:-translate-y-0.5 hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none sm:w-auto"
                  >
                    <Send className="h-4 w-4" />
                    ちょっと聞く
                  </button>
                </div>
              </motion.div>

              <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/70 bg-white/55 px-4 py-3 text-xs font-semibold text-gray-500 backdrop-blur-xl">
                  <span className="text-gray-950">{combinations}</span>
                  返答に対応
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/55 px-4 py-3 text-xs font-semibold text-gray-500 backdrop-blur-xl">
                  OpenAI API
                  <span className="text-gray-950"> 接続中</span>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/55 px-4 py-3 text-xs font-semibold text-gray-500 backdrop-blur-xl">
                  現在プラン
                  <span className="text-gray-950">
                    {plan === "pro" ? " Pro" : " 無料"}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <RobotCard />
            </div>
          </div>

          <div className="mt-2 grid gap-6 lg:mt-4 lg:grid-cols-[1fr,360px] lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-[1.5rem] border border-white/80 bg-white/70 p-3 shadow-[0_24px_80px_-46px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:rounded-[2rem] sm:p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="flex items-center gap-2 text-xs font-extrabold tracking-[0.18em] text-gray-400">
                    <Sparkles className="h-4 w-4 text-green-500" />
                    CHOT CHAT
                  </p>
                  <h3 className="mt-1 text-base font-bold text-gray-950 sm:text-lg">
                    こんなやりとり、よくあります。
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMessages(initialMessages)}
                  className="hidden rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-500 transition hover:bg-gray-50 sm:block"
                >
                  reset
                </button>
              </div>

              <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
                {messages.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-gray-200 bg-white/60 px-5 py-8 text-center text-sm text-gray-400">
                    まだ何も聞いていません。沈黙もまた、ちょっとしたAI体験です。
                  </div>
                )}

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
                      className={`whitespace-pre-line px-4 py-3 text-sm leading-7 shadow-sm sm:px-5 ${
                        message.role === "user"
                          ? "max-w-[94%] rounded-3xl rounded-tr-md bg-gray-950 text-white sm:max-w-[88%]"
                          : "max-w-[96%] rounded-3xl rounded-tl-md border border-gray-100 bg-white text-gray-800 sm:max-w-[92%]"
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
              </div>
            </motion.div>

            <div className="space-y-5">
              <div className="lg:hidden">
                <RobotCard />
              </div>

              <div className="rounded-[1.5rem] border border-white/80 bg-white/60 p-5 shadow-[0_24px_80px_-46px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:rounded-[2rem]">
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

              <div className="rounded-[1.5rem] border border-gray-900 bg-gray-950 p-5 text-white shadow-[0_24px_80px_-42px_rgba(15,23,42,0.8)] sm:rounded-[2rem]">
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
            <div className="mx-auto max-w-2xl rounded-[1.5rem] border border-white/80 bg-white/55 px-6 py-5 text-xs leading-7 text-gray-500 backdrop-blur-xl sm:rounded-[2rem]">
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
