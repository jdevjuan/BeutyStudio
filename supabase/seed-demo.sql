-- DADOS DE DEMONSTRAÇÃO (opcional). Não são dados reais do salão. Edite pelo painel admin.
insert into servicos (nome, descricao, preco, duracao_minutos) values
 ('Corte feminino','Corte com análise do formato do rosto e finalização.',90,60),
 ('Corte masculino','Corte na tesoura ou máquina, com acabamento.',50,40),
 ('Escova','Escova modelada para qualquer ocasião.',60,45),
 ('Hidratação','Tratamento para devolver brilho, maciez e elasticidade.',80,60),
 ('Coloração','Cor personalizada, com cuidado para preservar a saúde dos fios.',180,120),
 ('Progressiva','Alinhamento dos fios com redução de volume.',250,150),
 ('Penteado','Penteados para festas, eventos e cerimônias.',120,75);

insert into profissionais (nome, descricao, especialidades) values
 ('Profissional 1','Descrição de exemplo.','Cortes, Coloração'),
 ('Profissional 2','Descrição de exemplo.','Cortes masculinos'),
 ('Profissional 3','Descrição de exemplo.','Penteados, Escova');

-- Todos fazem todos os serviços (ajuste depois)
insert into profissional_servicos select p.id, s.id from profissionais p cross join servicos s;

-- Expediente demo: segunda a sábado, 09:00-18:00
insert into expediente (profissional_id, dia_semana, abertura, fechamento)
select p.id, d, '09:00', '18:00' from profissionais p, generate_series(1,6) d;
