"use client";

import { useEffect, useMemo, useState } from "react";

type Step =
  | "landing"
  | "q1"
  | "q2"
  | "intermezzo"
  | "q3"
  | "q4"
  | "loading"
  | "final";

type Answers = {
  nivel?: "iniciante" | "casual" | "veterano";
  q2?: string;
  campeonato?: "brasileirao" | "champions" | "copa" | "libertadores" | "premier";
  frequencia?: "diaria" | "fds" | "clasicos";
};

const QUESTION_STEPS: Step[] = ["q1", "q2", "q3", "q4"];

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : initialSeconds));
    }, 1000);
    return () => clearInterval(interval);
  }, [initialSeconds]);
  return seconds;
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Page() {
  const [step, setStep] = useState<Step>("landing");
  const [answers, setAnswers] = useState<Answers>({});
  const [loadingProgress, setLoadingProgress] = useState(0);
  const seconds = useCountdown(15 * 60);

  useEffect(() => {
    if (step !== "loading") return;
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + 4;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep("final"), 400);
          return 100;
        }
        return next;
      });
    }, 90);
    return () => clearInterval(interval);
  }, [step]);

  const questionIndex = QUESTION_STEPS.indexOf(step);
  const showTopBar = step !== "landing" && step !== "loading" && step !== "final";

  return (
    <main className="min-h-screen w-full flex flex-col">
      {showTopBar && (
        <div className="w-full bg-black/70 border-b border-brand-gold/25 backdrop-blur">
          <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-brand-gold pulse-dot" />
              <span>Próxima vaga expira em</span>
            </div>
            <div className="font-mono font-semibold text-brand-gold tabular-nums">
              {formatTime(seconds)}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-start sm:items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl">
          {step === "landing" && (
            <Landing onStart={() => setStep("q1")} timer={formatTime(seconds)} />
          )}

          {questionIndex >= 0 && (
            <QuestionShell
              current={questionIndex + 1}
              total={QUESTION_STEPS.length}
            >
              {step === "q1" && (
                <QuestionCard
                  title="Qual seu nível com apostas em futebol?"
                  subtitle="Sem julgamento. Quero entender de onde tu parte."
                  options={[
                    {
                      value: "iniciante",
                      label: "Sou iniciante",
                      hint: "Comecei agora ou apostei pouquíssimas vezes"
                    },
                    {
                      value: "casual",
                      label: "Já aposto há um tempo",
                      hint: "Aposto casualmente, sem método fixo"
                    },
                    {
                      value: "veterano",
                      label: "Aposto há anos",
                      hint: "Entendo de múltiplas, linhas e mercados"
                    }
                  ]}
                  onSelect={(v) => {
                    setAnswers((a) => ({ ...a, nivel: v as Answers["nivel"] }));
                    setStep("q2");
                  }}
                />
              )}

              {step === "q2" && (
                <QuestionCard
                  title="Só pra confirmar que tu é do meio 👀"
                  subtitle="Qual seleção ganhou a última Copa do Mundo?"
                  options={[
                    {
                      value: "franca",
                      label: "França",
                      hint: "Vice em 2022"
                    },
                    {
                      value: "argentina",
                      label: "Argentina",
                      hint: "Messi levantou a taça"
                    },
                    {
                      value: "brasil",
                      label: "Brasil",
                      hint: "Ficamos nas quartas"
                    }
                  ]}
                  onSelect={(v) => {
                    setAnswers((a) => ({ ...a, q2: v }));
                    setStep("intermezzo");
                  }}
                />
              )}

              {step === "q3" && (
                <QuestionCard
                  title="Última do teste 😄"
                  subtitle="Quem fez o gol do Brasil que deu o título em 2002?"
                  options={[
                    {
                      value: "rivaldo",
                      label: "Rivaldo",
                      hint: "Craque na Coreia/Japão"
                    },
                    {
                      value: "ronaldinho",
                      label: "Ronaldinho Gaúcho",
                      hint: "Da falta contra a Inglaterra"
                    },
                    {
                      value: "ronaldo",
                      label: "Ronaldo Fenômeno",
                      hint: "Os dois gols da final"
                    }
                  ]}
                  onSelect={() => setStep("q4")}
                />
              )}

              {step === "q4" && (
                <QuestionCard
                  title="Última pra liberar tua vaga 🔥"
                  subtitle="Com que frequência tu acompanha futebol?"
                  options={[
                    {
                      value: "diaria",
                      label: "Todo dia rola algo",
                      hint: "Assisto vários jogos por semana"
                    },
                    {
                      value: "fds",
                      label: "Fim de semana e clássicos",
                      hint: "Sábado e domingo é sagrado"
                    },
                    {
                      value: "clasicos",
                      label: "Só datas grandes",
                      hint: "Copa, decisão e clássicos"
                    }
                  ]}
                  onSelect={(v) => {
                    setAnswers((a) => ({
                      ...a,
                      frequencia: v as Answers["frequencia"]
                    }));
                    setStep("loading");
                  }}
                />
              )}
            </QuestionShell>
          )}

          {step === "intermezzo" && (
            <Intermezzo onContinue={() => setStep("q3")} />
          )}

          {step === "loading" && <LoadingScreen progress={loadingProgress} />}

          {step === "final" && <FinalScreen answers={answers} />}
        </div>
      </div>

      <Footer />
    </main>
  );
}

// ============= LANDING =============
function Landing({ onStart, timer }: { onStart: () => void; timer: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-6 sm:gap-8">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-brand-gold/30 text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-brand-gold pulse-dot" />
        <span className="text-neutral-300">Próxima vaga expira em</span>
        <span className="text-brand-gold font-mono">{timer}</span>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/40 text-brand-gold text-xs font-semibold uppercase tracking-wider">
        Grupo Gratuito
      </div>

      <h1 className="text-3xl sm:text-5xl font-black leading-tight max-w-xl">
        O grupo do{" "}
        <span className="text-brand-gold">Dupla Aposta</span> é feito pra quem
        curte futebol de verdade.
      </h1>

      <p className="text-neutral-300 text-base sm:text-lg max-w-lg">
        Análise dos jogos, debate diário e camisa de futebol toda semana pra
        quem tá dentro.
      </p>

      <div className="w-full max-w-md grid grid-cols-3 gap-2 sm:gap-3">
        <Benefit icon="⚽" label="Análise diária" />
        <Benefit icon="🔥" label="Comunidade" />
        <Benefit icon="👕" label="Camisa semanal" />
      </div>

      <button
        onClick={onStart}
        className="mt-2 w-full max-w-md group inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand-gold text-black font-bold text-lg shadow-gold hover:brightness-110 active:scale-[0.98] transition"
      >
        Responder teste e liberar minha vaga
        <span className="group-hover:translate-x-0.5 transition">→</span>
      </button>

      <p className="text-xs text-neutral-500 max-w-md">
        Leva 30 segundos. Sem cadastro, sem cartão.
      </p>

      <div className="text-xs text-neutral-500 flex items-center gap-2 mt-1">
        <span>98% das vagas de hoje já preenchidas</span>
      </div>
    </div>
  );
}

// ============= QUESTION SHELL =============
function QuestionShell({
  current,
  total,
  children
}: {
  current: number;
  total: number;
  children: React.ReactNode;
}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <div className="uppercase tracking-wider">
          Etapa {current} de {total}
        </div>
        <div className="font-mono">{pct}%</div>
      </div>
      <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-gold transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {children}
    </div>
  );
}

// ============= QUESTION CARD =============
function QuestionCard({
  title,
  subtitle,
  options,
  onSelect
}: {
  title: string;
  subtitle?: string;
  options: { value: string; label: string; hint?: string }[];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-neutral-400 text-sm sm:text-base">{subtitle}</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="group text-left rounded-2xl p-5 bg-black/60 border border-neutral-800 hover:border-brand-gold hover:bg-black/80 transition"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-lg">{opt.label}</div>
                {opt.hint && (
                  <div className="text-sm text-neutral-400 mt-0.5">
                    {opt.hint}
                  </div>
                )}
              </div>
              <div className="text-neutral-500 group-hover:text-brand-gold group-hover:translate-x-0.5 transition">
                →
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-neutral-500 text-center">
        Toca pra selecionar. Avança automaticamente.
      </p>
    </div>
  );
}

// ============= INTERMEZZO =============
function Intermezzo({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="text-xs uppercase tracking-wider text-brand-gold">
          Comunidade
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold">
          A galera do Dupla tá dentro há tempos
        </h2>
        <p className="text-neutral-400 text-sm max-w-md">
          Membros ativos que debatem futebol todo dia no grupo gratuito.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat number="+30k" label="membros ativos" />
        <Stat number="+120" label="jogos debatidos por mês" />
        <Stat number="94%" label="permanência semanal" />
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-black/60 p-5 flex flex-col gap-3">
        <div className="text-xs uppercase tracking-wider text-brand-gold">
          Quem tá dentro fala
        </div>
        <Testimonial
          name="Rafael, palmeirense"
          text="grupo é ativo demais mano, tem gente falando o dia todo. tô achando doido"
        />
        <Testimonial
          name="Bruno, de SP"
          text="entrei achando que era mais um, mas o pessoal é raiz. tô no grupo faz uns 3 meses"
        />
        <Testimonial
          name="Carolina, do Rio"
          text="ganhei a camisa do meu time semana retrasada... ainda tô impressionada, sério"
        />
      </div>

      <button
        onClick={onContinue}
        className="w-full py-4 rounded-2xl bg-brand-gold text-black font-bold text-lg shadow-gold hover:brightness-110 active:scale-[0.98] transition"
      >
        Continuar teste
      </button>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-2xl bg-black/60 border border-neutral-800 p-4 text-center">
      <div className="text-2xl sm:text-3xl font-black text-brand-gold">
        {number}
      </div>
      <div className="text-xs text-neutral-400 mt-1">{label}</div>
    </div>
  );
}

function Testimonial({ name, text }: { name: string; text: string }) {
  return (
    <div className="rounded-xl bg-neutral-950/60 border border-neutral-800 p-4">
      <p className="text-sm text-neutral-200">"{text}"</p>
      <p className="text-xs text-neutral-500 mt-2">{name}</p>
    </div>
  );
}

function Benefit({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="rounded-xl bg-black/60 border border-neutral-800 py-3 px-2 flex flex-col items-center justify-center gap-1.5 text-center">
      <div className="text-xl leading-none">{icon}</div>
      <div className="text-[11px] sm:text-xs font-medium text-neutral-200 leading-tight">
        {label}
      </div>
    </div>
  );
}

// ============= LOADING =============
function LoadingScreen({ progress }: { progress: number }) {
  const items = [
    { label: "Lendo tuas respostas", threshold: 25 },
    { label: "Cruzando com a base do Dupla", threshold: 50 },
    { label: "Identificando teu perfil", threshold: 75 },
    { label: "Reservando tua vaga no grupo", threshold: 100 }
  ];
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/40 text-brand-gold text-xs font-semibold uppercase tracking-wider">
        Analisando teu perfil
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold max-w-md">
        Preparando teu acesso ao grupo do Dupla
      </h2>
      <div className="w-full max-w-md">
        <div className="flex justify-between text-xs text-neutral-400 mb-2">
          <span>Progresso</span>
          <span className="font-mono">{progress}%</span>
        </div>
        <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-gold transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <ul className="w-full max-w-md flex flex-col gap-2 text-left">
        {items.map((it) => {
          const done = progress >= it.threshold;
          return (
            <li
              key={it.label}
              className={`flex items-center gap-3 rounded-xl p-3 border transition ${
                done
                  ? "border-brand-gold/40 bg-brand-gold/5 text-white"
                  : "border-neutral-800 bg-black/40 text-neutral-500"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  done ? "bg-brand-gold text-black" : "bg-neutral-800"
                }`}
              >
                {done ? "✓" : "•"}
              </span>
              <span className="text-sm">{it.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ============= FINAL =============
function FinalScreen({ answers }: { answers: Answers }) {
  const timer = useCountdown(14 * 60 + 53);
  const personal = useMemo(() => buildPersonalCopy(answers), [answers]);

  return (
    <div className="flex flex-col gap-6 items-center text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/40 text-brand-green text-xs font-semibold uppercase tracking-wider">
        Vaga reservada
      </div>
      <h2 className="text-3xl sm:text-4xl font-black leading-tight max-w-xl">
        Tua vaga no <span className="text-brand-gold">grupo do Dupla</span> tá
        liberada.
      </h2>
      <p className="text-neutral-300 text-base sm:text-lg max-w-lg">
        {personal}
      </p>

      <div className="w-full max-w-md rounded-2xl border border-brand-gold/40 bg-black/70 p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-neutral-400">
            Vaga expira em
          </div>
          <div className="font-mono font-bold text-brand-gold tabular-nums">
            {formatTime(timer)}
          </div>
        </div>
        <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full shimmer w-1/2" />
        </div>
        <div className="text-xs text-neutral-400">
          Toque no botão pra entrar no grupo agora:
        </div>
        <a
          href="https://t.me/+WKCKukzGF0lpY1Ws"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 rounded-2xl bg-brand-gold text-black font-bold text-lg shadow-gold hover:brightness-110 active:scale-[0.98] transition text-center"
        >
          Entrar no grupo do Dupla
        </a>
        <div className="flex items-center justify-around text-xs text-neutral-400 pt-1">
          <span>✓ Acesso imediato</span>
          <span>✓ 100% gratuito</span>
          <span>✓ Comunidade ativa</span>
        </div>
      </div>

      <p className="text-xs text-neutral-500 max-w-md">
        Se tu não entrar nas próximas horas, tua vaga volta pra fila e libera pra
        próxima pessoa.
      </p>
    </div>
  );
}

function buildPersonalCopy(answers: Answers) {
  const parts: string[] = [];

  if (answers.nivel === "iniciante")
    parts.push(
      "Como tu tá começando, o grupo vai ser teu chão pra entender como o Dupla lê os jogos."
    );
  else if (answers.nivel === "casual")
    parts.push(
      "Tu já aposta casualmente, então o grupo vai te dar rotina e estrutura pra melhorar."
    );
  else if (answers.nivel === "veterano")
    parts.push(
      "Tu já tem estrada, então o grupo vai te dar debate de alto nível e visão nova de mercados."
    );

  if (answers.frequencia === "diaria")
    parts.push(
      "E como tu acompanha futebol todo dia, vai curtir demais o boletim diário."
    );
  else if (answers.frequencia === "fds")
    parts.push(
      "E como tu foca no fim de semana, vais curtir a rotina de boletim de sexta e a discussão do domingão."
    );
  else if (answers.frequencia === "clasicos")
    parts.push(
      "E como tu curte mais os clássicos e datas grandes, vais adorar as coberturas especiais."
    );

  if (parts.length === 0)
    return "Nossa comunidade vai te receber bem. Todo dia rola conteúdo, debate e ação por dentro do grupo.";

  return parts.join(" ");
}

// ============= FOOTER =============
function Footer() {
  return (
    <footer className="w-full border-t border-neutral-900 bg-black/80">
      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-3 text-center">
        <div className="flex items-center justify-center gap-3 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-1 border border-neutral-800 rounded-full px-2 py-0.5">
            +18
          </span>
          <span>Casas parceiras autorizadas pela SPA/MF</span>
        </div>
        <p className="text-xs text-neutral-500 max-w-lg mx-auto leading-relaxed">
          Ministério da Fazenda adverte: aposta não é investimento. Jogue com
          responsabilidade. Apostas esportivas envolvem risco. Somente maiores
          de 18 anos.
        </p>
        <p className="text-[10px] text-neutral-600">
          © Dupla Aposta. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
