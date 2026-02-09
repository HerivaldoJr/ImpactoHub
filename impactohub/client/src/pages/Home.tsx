import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Heart, BarChart3, Users, Settings, ArrowRight } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated && user) {
    // Usuário autenticado - mostrar seleção de área
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">ImpactoHub</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Bem-vindo, {user.name}</span>
              <Button variant="outline" onClick={() => logout()}>
                Sair
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Selecione sua Área de Acesso
              </h2>
              <p className="text-xl text-gray-600">
                Escolha entre a área administrativa ou a plataforma de gestão social
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Admin Area */}
              {user.role === "admin" && (
                <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all cursor-pointer shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Settings className="w-8 h-8 text-blue-600" />
                      <CardTitle className="text-2xl">Área Administrativa</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      Gestão completa do negócio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span className="text-gray-700">Gestão de clientes (OSCs/Investidores)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span className="text-gray-700">Cobrança e faturas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span className="text-gray-700">Propostas comerciais</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span className="text-gray-700">Editor visual de página inicial</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span className="text-gray-700">Customização de temas e branding</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span className="text-gray-700">Relatórios financeiros</span>
                      </li>
                    </ul>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => setLocation("/admin/dashboard")}
                    >
                      Acessar Admin <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Client Area */}
              <Card className="border-2 border-green-200 hover:border-green-400 transition-all cursor-pointer shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-8 h-8 text-green-600" />
                    <CardTitle className="text-2xl">Plataforma de Gestão</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Gestão de projetos e impacto social
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">Gestão de projetos com marcos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">Cadastro de beneficiários</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">Registro de atendimentos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">Gestão de oficinas e turmas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">Gráficos e relatórios</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">Exportação em PDF/Excel</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => setLocation("/client/dashboard")}
                  >
                    Acessar Plataforma <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Info Box */}
            <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-3">
                <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Desenvolvido por Herivaldo Junior</h3>
                  <p className="text-gray-700">
                    ImpactoHub é uma plataforma profissional de gestão social que conecta organizações e investidores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Usuário não autenticado - mostrar landing page
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">ImpactoHub</h1>
          </div>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Tecnologia e Dados para Impulsionar o Impacto Social
          </h2>
          <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
            Com o ImpactoHub, a gestão fica mais simples e organizada, do dia a dia das OSCs à estratégia de investimentos sociais.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-green-50"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Começar Gratuitamente
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-green-700"
            >
              Conhecer Funcionalidades
            </Button>
          </div>
          <p className="text-green-100 text-sm mt-6">
            ✨ Desenvolvido por Herivaldo Junior
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Funcionalidades Principais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Gestão de Projetos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Organize projetos com marcos, ações e evidências. Acompanhe o progresso em tempo real.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Gestão de Atendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Cadastro completo de beneficiários com dados demográficos e socioeconômicos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Gráficos e Relatórios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Dashboards em tempo real, relatórios personalizados e exportação em PDF/Excel.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 ImpactoHub. Desenvolvido por Herivaldo Junior.
          </p>
        </div>
      </footer>
    </div>
  );
}
