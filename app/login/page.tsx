"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

export default function LoginPage() {
  const { user, loading, signInWithMagicLink, signUpWithPassword, signInWithPassword } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  if (loading) return null;

  async function handlePasswordAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setSending(true);
    setError("");

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("As senhas não conferem.");
        setSending(false);
        return;
      }
      if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres.");
        setSending(false);
        return;
      }
      const { error } = await signUpWithPassword(email.trim(), password);
      if (error) {
        setError(error.message || "Não foi possível criar a conta.");
      } else {
        setError("");
        alert("Conta criada! Faça login com suas credenciais.");
        setIsSignUp(false);
        setPassword("");
        setConfirmPassword("");
      }
    } else {
      const { error } = await signInWithPassword(email.trim(), password);
      if (error) {
        setError(error.message || "Email ou senha inválidos.");
      }
    }

    setSending(false);
  }

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setError("");
    const { error } = await signInWithMagicLink(email.trim());
    setSending(false);
    if (error) {
      setError("Não foi possível enviar o link. Tente novamente.");
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg mx-auto mb-4">
            <Sparkles size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Planner da Amanda</h1>
          <p className="text-sm text-gray-500 mt-2">Seu organizador pessoal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Abas */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setTab("password")}
              className={`pb-3 px-2 text-sm font-medium border-b-2 transition-all ${
                tab === "password"
                  ? "text-purple-600 border-purple-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock size={16} />
                Senha
              </div>
            </button>
            <button
              onClick={() => setTab("magic")}
              className={`pb-3 px-2 text-sm font-medium border-b-2 transition-all ${
                tab === "magic"
                  ? "text-purple-600 border-purple-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Mail size={16} />
                Magic Link
              </div>
            </button>
          </div>

          {/* Formulário de Email + Senha */}
          {tab === "password" && !sent && (
            <form onSubmit={handlePasswordAuth} className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                {isSignUp ? "Crie sua conta para começar" : "Faça login com sua senha"}
              </p>

              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>

              {isSignUp && (
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar senha"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
              )}

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={sending}
                className="flex items-center justify-center gap-2 w-full bg-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-all"
              >
                {sending ? "Processando..." : isSignUp ? "Criar conta" : "Fazer login"}
                {!sending && <ArrowRight size={16} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-xs text-purple-600 hover:underline w-full text-center mt-4"
              >
                {isSignUp ? "Já tem conta? Faça login" : "Não tem conta? Crie uma"}
              </button>
            </form>
          )}

          {/* Formulário de Magic Link */}
          {tab === "magic" && !sent && (
            <form onSubmit={handleSendLink} className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Digite seu email e enviaremos um link de acesso.
              </p>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={sending || !email.trim()}
                className="flex items-center justify-center gap-2 w-full bg-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-all"
              >
                {sending ? "Enviando..." : "Enviar link de acesso"}
                {!sending && <ArrowRight size={16} />}
              </button>
            </form>
          )}

          {/* Confirmação de Link Enviado */}
          {sent && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} className="text-purple-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Link enviado!</p>
                <p className="text-sm text-gray-500 mt-1">
                  Acesse seu email <span className="font-medium text-gray-700">{email}</span> e clique no link para entrar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setSent(false); setEmail(""); setError(""); }}
                className="text-xs text-purple-600 hover:underline"
              >
                Usar outro email
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Seus dados são privados e sincronizados apenas para você.
        </p>
      </div>
    </div>
  );
}
