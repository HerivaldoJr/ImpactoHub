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
  Users, 
  Target, 
  FileCheck, 
  Heart,
  Plus,
  Edit,
  Trash2,
  Building2,
  BarChart3
} from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useState } from "react";

export default function OSCDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isBeneficiaryDialogOpen, setIsBeneficiaryDialogOpen] = useState(false);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);

  const { data: organization, refetch: refetchOrg } = trpc.organization.getMyOrganization.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'osc',
  });

  const { data: stats } = trpc.organization.getStats.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'osc',
  });

  const { data: projects, refetch: refetchProjects } = trpc.project.getMyProjects.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'osc',
  });

  const { data: beneficiaries, refetch: refetchBeneficiaries } = trpc.beneficiary.getMyBeneficiaries.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'osc',
  });

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    objectives: '',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'planning' as 'planning' | 'active' | 'completed' | 'cancelled',
    targetAudience: '',
    location: '',
  });

  // Beneficiary Form State
  const [beneficiaryForm, setBeneficiaryForm] = useState({
    name: '',
    birthDate: '',
    gender: 'prefer_not_to_say' as 'male' | 'female' | 'other' | 'prefer_not_to_say',
    ethnicity: '',
    income: 'no_income' as 'no_income' | 'low' | 'medium' | 'high',
    education: '',
    addressStreet: '',
    addressCity: '',
    addressState: '',
    addressZipCode: '',
    contactPhone: '',
    contactEmail: '',
    registrationDate: new Date().toISOString().split('T')[0],
  });

  // Attendance Form State
  const [attendanceForm, setAttendanceForm] = useState({
    projectId: 0,
    beneficiaryId: 0,
    date: new Date().toISOString().split('T')[0],
    type: '',
    duration: 0,
    description: '',
    followUp: '',
    status: 'completed' as 'scheduled' | 'completed' | 'cancelled',
  });

  const createOrgMutation = trpc.organization.create.useMutation({
    onSuccess: () => {
      toast.success("Organização cadastrada com sucesso!");
      refetchOrg();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const createProjectMutation = trpc.project.create.useMutation({
    onSuccess: () => {
      toast.success("Projeto criado com sucesso!");
      refetchProjects();
      setIsProjectDialogOpen(false);
      setProjectForm({
        name: '',
        description: '',
        objectives: '',
        startDate: '',
        endDate: '',
        budget: '',
        status: 'planning',
        targetAudience: '',
        location: '',
      });
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const createBeneficiaryMutation = trpc.beneficiary.create.useMutation({
    onSuccess: () => {
      toast.success("Atendido cadastrado com sucesso!");
      refetchBeneficiaries();
      setIsBeneficiaryDialogOpen(false);
      setBeneficiaryForm({
        name: '',
        birthDate: '',
        gender: 'prefer_not_to_say',
        ethnicity: '',
        income: 'no_income',
        education: '',
        addressStreet: '',
        addressCity: '',
        addressState: '',
        addressZipCode: '',
        contactPhone: '',
        contactEmail: '',
        registrationDate: new Date().toISOString().split('T')[0],
      });
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const createAttendanceMutation = trpc.attendance.create.useMutation({
    onSuccess: () => {
      toast.success("Atendimento registrado com sucesso!");
      setIsAttendanceDialogOpen(false);
      setAttendanceForm({
        projectId: 0,
        beneficiaryId: 0,
        date: new Date().toISOString().split('T')[0],
        type: '',
        duration: 0,
        description: '',
        followUp: '',
        status: 'completed',
      });
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deleteProjectMutation = trpc.project.delete.useMutation({
    onSuccess: () => {
      toast.success("Projeto excluído");
      refetchProjects();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deleteBeneficiaryMutation = trpc.beneficiary.delete.useMutation({
    onSuccess: () => {
      toast.success("Atendido excluído");
      refetchBeneficiaries();
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

  if (user?.role !== 'osc' && user?.role !== 'admin') {
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

  // If organization doesn't exist, show registration form
  if (!organization) {
    const [orgForm, setOrgForm] = useState({
      name: '',
      cnpj: '',
      description: '',
      mission: '',
      addressStreet: '',
      addressCity: '',
      addressState: '',
      addressZipCode: '',
      phone: '',
      website: '',
    });

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle>Cadastro de Organização</CardTitle>
            <CardDescription>
              Complete o cadastro da sua OSC para começar a usar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              createOrgMutation.mutate(orgForm);
            }} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Organização *</Label>
                <Input
                  id="name"
                  value={orgForm.name}
                  onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={orgForm.cnpj}
                  onChange={(e) => setOrgForm({ ...orgForm, cnpj: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={orgForm.description}
                  onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="mission">Missão</Label>
                <Textarea
                  id="mission"
                  value={orgForm.mission}
                  onChange={(e) => setOrgForm({ ...orgForm, mission: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={orgForm.phone}
                    onChange={(e) => setOrgForm({ ...orgForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={orgForm.website}
                    onChange={(e) => setOrgForm({ ...orgForm, website: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="addressStreet">Endereço</Label>
                <Input
                  id="addressStreet"
                  value={orgForm.addressStreet}
                  onChange={(e) => setOrgForm({ ...orgForm, addressStreet: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="addressCity">Cidade</Label>
                  <Input
                    id="addressCity"
                    value={orgForm.addressCity}
                    onChange={(e) => setOrgForm({ ...orgForm, addressCity: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="addressState">Estado</Label>
                  <Input
                    id="addressState"
                    value={orgForm.addressState}
                    onChange={(e) => setOrgForm({ ...orgForm, addressState: e.target.value })}
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label htmlFor="addressZipCode">CEP</Label>
                  <Input
                    id="addressZipCode"
                    value={orgForm.addressZipCode}
                    onChange={(e) => setOrgForm({ ...orgForm, addressZipCode: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createOrgMutation.isPending}>
                {createOrgMutation.isPending ? 'Cadastrando...' : 'Cadastrar Organização'}
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
              <Building2 className="h-3 w-3 mr-1" />
              OSC
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {organization.name}
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
          <h1 className="text-3xl font-bold mb-2">Dashboard OSC</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel de gestão da <strong>{organization.name}</strong>
          </p>
          {organization.status === 'pending' && (
            <Badge variant="secondary" className="mt-2">
              Aguardando aprovação do administrador
            </Badge>
          )}
          {organization.status === 'approved' && (
            <Badge variant="default" className="mt-2">
              Organização aprovada
            </Badge>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
              <p className="text-xs text-muted-foreground">Projetos cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atendidos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalBeneficiaries || 0}</div>
              <p className="text-xs text-muted-foreground">Beneficiários cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atendimentos</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAttendances || 0}</div>
              <p className="text-xs text-muted-foreground">Atendimentos realizados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atividades</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalActivities || 0}</div>
              <p className="text-xs text-muted-foreground">Oficinas e cursos</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="beneficiaries">Atendidos</TabsTrigger>
            <TabsTrigger value="attendances">Atendimentos</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestão de Projetos</CardTitle>
                    <CardDescription>
                      Cadastre e gerencie os projetos da sua organização
                    </CardDescription>
                  </div>
                  <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Projeto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Cadastrar Novo Projeto</DialogTitle>
                        <DialogDescription>
                          Preencha as informações do projeto
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        createProjectMutation.mutate(projectForm);
                      }} className="space-y-4">
                        <div>
                          <Label htmlFor="projectName">Nome do Projeto *</Label>
                          <Input
                            id="projectName"
                            value={projectForm.name}
                            onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectDescription">Descrição</Label>
                          <Textarea
                            id="projectDescription"
                            value={projectForm.description}
                            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectObjectives">Objetivos</Label>
                          <Textarea
                            id="projectObjectives"
                            value={projectForm.objectives}
                            onChange={(e) => setProjectForm({ ...projectForm, objectives: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="startDate">Data de Início</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={projectForm.startDate}
                              onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="endDate">Data de Término</Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={projectForm.endDate}
                              onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="budget">Orçamento (R$)</Label>
                            <Input
                              id="budget"
                              type="number"
                              step="0.01"
                              value={projectForm.budget}
                              onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="status">Status</Label>
                            <Select value={projectForm.status} onValueChange={(value: any) => setProjectForm({ ...projectForm, status: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="planning">Planejamento</SelectItem>
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="completed">Concluído</SelectItem>
                                <SelectItem value="cancelled">Cancelado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="targetAudience">Público-Alvo</Label>
                          <Input
                            id="targetAudience"
                            value={projectForm.targetAudience}
                            onChange={(e) => setProjectForm({ ...projectForm, targetAudience: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Localização</Label>
                          <Input
                            id="location"
                            value={projectForm.location}
                            onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={createProjectMutation.isPending}>
                          {createProjectMutation.isPending ? 'Cadastrando...' : 'Cadastrar Projeto'}
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
                      <TableHead>Nome</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Orçamento</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects?.map((proj) => (
                      <TableRow key={proj.id}>
                        <TableCell className="font-medium">{proj.name}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              proj.status === 'active' ? 'default' : 
                              proj.status === 'completed' ? 'secondary' : 
                              'outline'
                            }
                          >
                            {proj.status === 'active' ? 'Ativo' : 
                             proj.status === 'completed' ? 'Concluído' : 
                             proj.status === 'cancelled' ? 'Cancelado' : 
                             'Planejamento'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {proj.budget ? `R$ ${parseFloat(proj.budget).toLocaleString('pt-BR')}` : 'N/A'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {proj.startDate ? new Date(proj.startDate).toLocaleDateString('pt-BR') : 'N/A'} - {proj.endDate ? new Date(proj.endDate).toLocaleDateString('pt-BR') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (confirm('Tem certeza que deseja excluir este projeto?')) {
                                  deleteProjectMutation.mutate({ id: proj.id });
                                }
                              }}
                              disabled={deleteProjectMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Beneficiaries Tab */}
          <TabsContent value="beneficiaries" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestão de Atendidos</CardTitle>
                    <CardDescription>
                      Cadastre e gerencie os beneficiários da sua organização
                    </CardDescription>
                  </div>
                  <Dialog open={isBeneficiaryDialogOpen} onOpenChange={setIsBeneficiaryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Atendido
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Cadastrar Novo Atendido</DialogTitle>
                        <DialogDescription>
                          Preencha as informações do beneficiário
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        createBeneficiaryMutation.mutate(beneficiaryForm);
                      }} className="space-y-4">
                        <div>
                          <Label htmlFor="beneficiaryName">Nome Completo *</Label>
                          <Input
                            id="beneficiaryName"
                            value={beneficiaryForm.name}
                            onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="birthDate">Data de Nascimento</Label>
                            <Input
                              id="birthDate"
                              type="date"
                              value={beneficiaryForm.birthDate}
                              onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, birthDate: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="gender">Gênero</Label>
                            <Select value={beneficiaryForm.gender} onValueChange={(value: any) => setBeneficiaryForm({ ...beneficiaryForm, gender: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Masculino</SelectItem>
                                <SelectItem value="female">Feminino</SelectItem>
                                <SelectItem value="other">Outro</SelectItem>
                                <SelectItem value="prefer_not_to_say">Prefiro não dizer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="ethnicity">Etnia</Label>
                            <Input
                              id="ethnicity"
                              value={beneficiaryForm.ethnicity}
                              onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, ethnicity: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="income">Renda</Label>
                            <Select value={beneficiaryForm.income} onValueChange={(value: any) => setBeneficiaryForm({ ...beneficiaryForm, income: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="no_income">Sem renda</SelectItem>
                                <SelectItem value="low">Baixa</SelectItem>
                                <SelectItem value="medium">Média</SelectItem>
                                <SelectItem value="high">Alta</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="education">Escolaridade</Label>
                          <Input
                            id="education"
                            value={beneficiaryForm.education}
                            onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, education: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="addressStreet">Endereço</Label>
                          <Input
                            id="addressStreet"
                            value={beneficiaryForm.addressStreet}
                            onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, addressStreet: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="addressCity">Cidade</Label>
                            <Input
                              id="addressCity"
                              value={beneficiaryForm.addressCity}
                              onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, addressCity: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="addressState">Estado</Label>
                            <Input
                              id="addressState"
                              value={beneficiaryForm.addressState}
                              onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, addressState: e.target.value })}
                              maxLength={2}
                            />
                          </div>
                          <div>
                            <Label htmlFor="addressZipCode">CEP</Label>
                            <Input
                              id="addressZipCode"
                              value={beneficiaryForm.addressZipCode}
                              onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, addressZipCode: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="contactPhone">Telefone</Label>
                            <Input
                              id="contactPhone"
                              value={beneficiaryForm.contactPhone}
                              onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, contactPhone: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="contactEmail">Email</Label>
                            <Input
                              id="contactEmail"
                              type="email"
                              value={beneficiaryForm.contactEmail}
                              onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, contactEmail: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={createBeneficiaryMutation.isPending}>
                          {createBeneficiaryMutation.isPending ? 'Cadastrando...' : 'Cadastrar Atendido'}
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
                      <TableHead>Nome</TableHead>
                      <TableHead>Idade</TableHead>
                      <TableHead>Gênero</TableHead>
                      <TableHead>Renda</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {beneficiaries?.map((ben) => {
                      const age = ben.birthDate ? Math.floor((new Date().getTime() - new Date(ben.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365)) : null;
                      return (
                        <TableRow key={ben.id}>
                          <TableCell className="font-medium">{ben.name}</TableCell>
                          <TableCell>{age ? `${age} anos` : 'N/A'}</TableCell>
                          <TableCell>
                            {ben.gender === 'male' ? 'Masculino' : 
                             ben.gender === 'female' ? 'Feminino' : 
                             ben.gender === 'other' ? 'Outro' : 
                             'Não informado'}
                          </TableCell>
                          <TableCell>
                            {ben.income === 'no_income' ? 'Sem renda' : 
                             ben.income === 'low' ? 'Baixa' : 
                             ben.income === 'medium' ? 'Média' : 
                             ben.income === 'high' ? 'Alta' : 
                             'N/A'}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (confirm('Tem certeza que deseja excluir este atendido?')) {
                                  deleteBeneficiaryMutation.mutate({ id: ben.id });
                                }
                              }}
                              disabled={deleteBeneficiaryMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendances Tab */}
          <TabsContent value="attendances" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Registro de Atendimentos</CardTitle>
                    <CardDescription>
                      Registre os atendimentos realizados
                    </CardDescription>
                  </div>
                  <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Atendimento
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Registrar Novo Atendimento</DialogTitle>
                        <DialogDescription>
                          Preencha as informações do atendimento
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        createAttendanceMutation.mutate(attendanceForm);
                      }} className="space-y-4">
                        <div>
                          <Label htmlFor="projectId">Projeto *</Label>
                          <Select 
                            value={attendanceForm.projectId.toString()} 
                            onValueChange={(value) => setAttendanceForm({ ...attendanceForm, projectId: parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um projeto" />
                            </SelectTrigger>
                            <SelectContent>
                              {projects?.map((proj) => (
                                <SelectItem key={proj.id} value={proj.id.toString()}>
                                  {proj.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="beneficiaryId">Atendido *</Label>
                          <Select 
                            value={attendanceForm.beneficiaryId.toString()} 
                            onValueChange={(value) => setAttendanceForm({ ...attendanceForm, beneficiaryId: parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um atendido" />
                            </SelectTrigger>
                            <SelectContent>
                              {beneficiaries?.map((ben) => (
                                <SelectItem key={ben.id} value={ben.id.toString()}>
                                  {ben.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="attendanceDate">Data *</Label>
                            <Input
                              id="attendanceDate"
                              type="date"
                              value={attendanceForm.date}
                              onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="duration">Duração (minutos)</Label>
                            <Input
                              id="duration"
                              type="number"
                              value={attendanceForm.duration}
                              onChange={(e) => setAttendanceForm({ ...attendanceForm, duration: parseInt(e.target.value) })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="type">Tipo de Atendimento</Label>
                          <Input
                            id="type"
                            value={attendanceForm.type}
                            onChange={(e) => setAttendanceForm({ ...attendanceForm, type: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            value={attendanceForm.description}
                            onChange={(e) => setAttendanceForm({ ...attendanceForm, description: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="followUp">Acompanhamento</Label>
                          <Textarea
                            id="followUp"
                            value={attendanceForm.followUp}
                            onChange={(e) => setAttendanceForm({ ...attendanceForm, followUp: e.target.value })}
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="attendanceStatus">Status</Label>
                          <Select value={attendanceForm.status} onValueChange={(value: any) => setAttendanceForm({ ...attendanceForm, status: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="scheduled">Agendado</SelectItem>
                              <SelectItem value="completed">Concluído</SelectItem>
                              <SelectItem value="cancelled">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full" disabled={createAttendanceMutation.isPending}>
                          {createAttendanceMutation.isPending ? 'Registrando...' : 'Registrar Atendimento'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Cadastre projetos e atendidos primeiro para registrar atendimentos.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
