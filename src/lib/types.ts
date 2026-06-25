export type Profissional = {
  id: string
  nome: string
  foto_url: string | null
  ativo: boolean
  user_id: string | null
  ordem: number
  bio: string | null
  whatsapp: string | null
  instagram: string | null
}

export type Servico = {
  id: string
  nome: string
  duracao_minutos: number
  preco: number
  ativo: boolean
}

export type Agendamento = {
  id: string
  profissional_id: string
  servico_id: string
  horario_id: string
  cliente_nome: string
  cliente_telefone: string
  status: 'pendente' | 'confirmado' | 'cancelado'
  cliente_compareceu: boolean | null
  valor_cobrado: number | null
  criado_em: string
}

export type HorarioDisponivel = {
  id: string
  profissional_id: string
  data: string
  hora: string
  disponivel: boolean
}

export type AtendimentoAvulso = {
  id: string
  profissional_id: string
  descricao: string | null
  valor: number
  data: string
  criado_em: string
}

export type MetaMensal = {
  id: string
  profissional_id: string
  mes: number
  ano: number
  meta: number
}