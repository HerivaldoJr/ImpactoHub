import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { 
  Wallet, 
  TrendingUp, 
  BarChart3, 
  Heart,
  Plus,
  DollarSign,
  Target
} from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useState } from "react";

export default function InvestorDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [isInvestmentDialogOpen, setIsInvestmentDialogOpen] = useState(false);

  const { data: investor, refetch: refetchInvestor } = trpc.investor.getMyInvestor.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'investor',
  });

  const { data: stats } = trpc.investor.getStats.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'investor',
  });

  const { data: myInvestments, refetch: refetchInvestments } = trpc.investor.getMyInvestments.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'investor',
  });

  const { data: allProjects } = trpc.admin.getAllProjects.useQuery(undefined, {
    enabled: isAuthenticated && (user?.role === 'investor' || user?.role === 'admin'),
  });

  const [investmentForm, setInvestmentForm] = useState({
    projectId: 0,
    amount: '',
    investmentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const createInvestorMutation = trpc.investor.create.useMutation({
    onSuccess: () => {
      toast.success("Perfil de investidor cadastrado com sucesso!");
      refetchInvestor();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const createInvestmentMutation = trpc.projectInvestment.create.useMutation({
    onSuccess: () => {
      toast.success("Investimento registrado com sucesso! Aguardando aprovação.");
      refetchInvestments();
      setIsInvestmentDialogOpen(false);
      setInvestmentForm({
        projectId: 0,
        amount: '',
        investmentDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (user?.role !== 'investor' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta área.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation('/')}>Voltar para Início</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If investor profile doesn't exist, show registration form
  if (!investor) {
    const [invForm, setInvForm] = useState({
      name: '',
      type: 'individual' as 'individual' | 'company' | 'foundation',
      cnpjCpf: '',
      description: '',
      focusAreas: '',
      phone: '',
      website: '',
    });

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle>Cadastro de Investidor</CardTitle>
            <CardDescription>
              Complete o cadastro do seu perfil de investidor social
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              createInvestorMutation.mutate(invForm);
            }} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome / Razão Social *</Label>
                <Input
                  id="name"
                  value={invForm.name}
                  onChange={(e) => setInvForm({ ...invForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo de Investidor *</Label>
                <Select value={invForm.type} onValueChange={(value: any) => setInvForm({ ...invForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Pessoa Física</SelectItem>
                    <SelectItem value="company">Empresa</SelectItem>
                    <SelectItem value="foundation">Fundação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cnpjCpf">CPF / CNPJ</Label>
                <Input
                  id="cnpjCpf"
                  value={invForm.cnpjCpf}
                  onChange={(e) => setInvForm({ ...invForm, cnpjCpf: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={invForm.description}
                  onChange={(e) => setInvForm({ ...invForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="focusAreas">Áreas de Interesse</Label>
                <Textarea
                  id="focusAreas"
                  value={invForm.focusAreas}
                  onChange={(e) => setInvForm({ ...invForm, focusAreas: e.target.value })}
                  rows={2}
                  placeholder="Ex: Educação, Saúde, Meio Ambiente"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={invForm.phone}
                    onChange={(e) => setInvForm({ ...invForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={invForm.website}
                    onChange={(e) => setInvForm({ ...invForm, website: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createInvestorMutation.isPending}>
                {createInvestorMutation.isPending ? 'Cadastrando...' : 'Cadastrar Perfil'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary fill-primary" />
            <span className="text-xl font-bold">ImpactoHub</span>
            <Badge variant="secondary" className="ml-2">
              <Wallet className="h-3 w-3 mr-1" />
              Investidor
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {investor.name}
            </span>
            <Button variant="outline" size="sm" onClick={() => setLocation('/')}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard Investidor</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel de investimentos sociais de <strong>{investor.name}</strong>
          </p>
          {investor.status === 'pending' && (
            <Badge variant="secondary" className="mt-2">
              Aguardando aprovação do administrador
            </Badge>
          )}
          {investor.status === 'approved' && (
            <Badge variant="default" className="mt-2">
              Perfil aprovado
            </Badge>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {stats?.totalAmount ? parseFloat(stats.totalAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
              </div>
              <p className="text-xs text-muted-foreground">Investimentos aprovados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos Apoiados</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
              <p className="text-xs text-muted-foreground">Projetos com investimento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investimentos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalInvestments || 0}</div>
              <p className="text-xs text-muted-foreground">Total de investimentos</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="investments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="investments">Meus Investimentos</TabsTrigger>
            <TabsTrigger value="projects">Projetos Disponíveis</TabsTrigger>
          </TabsList>

          {/* My Investments Tab */}
          <TabsContent value="investments" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Meus Investimentos</CardTitle>
                    <CardDescription>
                      Acompanhe seus investimentos sociais
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Projeto ID</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Observações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myInvestments?.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-medium">#{inv.projectId}</TableCell>
                        <TableCell>
                          R$ {parseFloat(inv.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {inv.investmentDate ? new Date(inv.investmentDate).toLocaleDateString('pt-BR') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              inv.status === 'approved' ? 'default' : 
                              inv.status === 'rejected' ? 'destructive' : 
                              'secondary'
                            }
                          >
                            {inv.status === 'approved' ? 'Aprovado' : 
                             inv.status === 'rejected' ? 'Rejeitado' : 
                             'Pendente'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {inv.notes || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!myInvestments || myInvestments.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          Nenhum investimento realizado ainda
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Available Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Projetos Disponíveis</CardTitle>
                    <CardDescription>
                      Conheça os projetos e faça seus investimentos
                    </CardDescription>
                  </div>
                  <Dialog open={isInvestmentDialogOpen} onOpenChange={setIsInvestmentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Investimento
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Registrar Novo Investimento</DialogTitle>
                        <DialogDescription>
                          Preencha as informações do investimento
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        createInvestmentMutation.mutate(investmentForm);
                      }} className="space-y-4">
                        <div>
                          <Label htmlFor="projectId">Projeto *</Label>
                          <Select 
                            value={investmentForm.projectId.toString()} 
                            onValueChange={(value) => setInvestmentForm({ ...investmentForm, projectId: parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um projeto" />
                            </SelectTrigger>
                            <SelectContent>
                              {allProjects?.filter(p => p.status === 'active' || p.status === 'planning').map((proj) => (
                                <SelectItem key={proj.id} value={proj.id.toString()}>
                                  {proj.name} - {proj.status === 'active' ? 'Ativo' : 'Planejamento'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="amount">Valor do Investimento (R$) *</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={investmentForm.amount}
                            onChange={(e) => setInvestmentForm({ ...investmentForm, amount: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="investmentDate">Data do Investimento</Label>
                          <Input
                            id="investmentDate"
                            type="date"
                            value={investmentForm.investmentDate}
                            onChange={(e) => setInvestmentForm({ ...investmentForm, investmentDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="notes">Observações</Label>
                          <Textarea
                            id="notes"
                            value={investmentForm.notes}
                            onChange={(e) => setInvestmentForm({ ...investmentForm, notes: e.target.value })}
                            rows={3}
                            placeholder="Adicione observações sobre este investimento"
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={createInvestmentMutation.isPending}>
                          {createInvestmentMutation.isPending ? 'Registrando...' : 'Registrar Investimento'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Projeto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Orçamento</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Público-Alvo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allProjects?.filter(p => p.status === 'active' || p.status === 'planning').map((proj) => (
                      <TableRow key={proj.id}>
                        <TableCell className="font-medium">{proj.name}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              proj.status === 'active' ? 'default' : 
                              'outline'
                            }
                          >
                            {proj.status === 'active' ? 'Ativo' : 'Planejamento'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {proj.budget ? `R$ ${parseFloat(proj.budget).toLocaleString('pt-BR')}` : 'N/A'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {proj.startDate ? new Date(proj.startDate).toLocaleDateString('pt-BR') : 'N/A'} - {proj.endDate ? new Date(proj.endDate).toLocaleDateString('pt-BR') : 'N/A'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {proj.targetAudience || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!allProjects || allProjects.filter(p => p.status === 'active' || p.status === 'planning').length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          Nenhum projeto disponível no momento
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
