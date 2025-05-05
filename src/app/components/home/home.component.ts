import { Router } from '@angular/router';
import { Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { TarefaService } from '../../services/tarefa.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule, LoadingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  router = inject(Router)
  taskService = inject(TarefaService)
  user: any = []
  img: string = ""
  tasks: any[] = []; // Alterado para array explícito
  taskHoje: any = []
  diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  diasStreak: { dia: string, feito: boolean }[] = [];
  hoje: string = ''
  level: number = 0
  pontos: number = 0
  falta: number = 0
  currentStreak: number = 0; // Adicionado para armazenar o streak atual
  steps: string[] = [
    'agua',
    'sono',
    'exercicio',
    'ar_puro',
    'espiritualidade',
    'temperanca',
    'alimentacao',
    'sol'
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    const dataAtual = new Date();
    this.hoje = this.formatarData(dataAtual);
  }

  // Função auxiliar para formatar datas consistentemente
  private formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}/${mes}/${dia}`;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userString = localStorage.getItem('user');
      if (userString) {
        this.user = JSON.parse(userString);
        this.pontos = this.user.pontos;
        this.falta = 7 - this.pontos;
        this.level = this.user.nivel
        this.img = `${this.user.pontos}.png`;

        this.taskService.verificarOuCriarTarefa(this.user.id).subscribe(() => {
          this.taskService.getTarefaDoDia(this.user.id).subscribe(task => {
            this.taskHoje = [task];
          });

          this.taskService.getTaskToUser(this.user.id).subscribe(taskList => {
            // Garante que tasks seja sempre um array
            this.tasks = Array.isArray(taskList) ? taskList : [];


            this.preencherDiasStreak();
          });
        });
      }
    }
  }

  preencherDiasStreak() {
    const hoje = new Date();
    const primeiroDiaSemana = new Date(hoje);
    primeiroDiaSemana.setDate(hoje.getDate() - hoje.getDay());

    this.diasStreak = this.diasSemana.map((letra, index) => {
      const data = new Date(primeiroDiaSemana);
      data.setDate(primeiroDiaSemana.getDate() + index);
      const dataStr = data.toISOString().split('T')[0];

      const task = this.tasks.find(t => new Date(t.data).toISOString().split('T')[0] === dataStr);
      const feito = task ? this.isTaskCompletada(task) : false;

      return { dia: letra, feito };
    });
  }

  calcularStreak(): number {
    let streak = 0;
    const hoje = new Date();

    while (true) {
      const data = new Date();
      data.setDate(hoje.getDate() - streak);
      const dataStr = data.toISOString().split('T')[0];

      const task = this.tasks.find(t => new Date(t.data).toISOString().split('T')[0] === dataStr);
      if (task && this.isTaskCompletada(task)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  isTaskCompletada(task: any): boolean {
    if (!task) return false;

    const steps = [
      'agua',
      'sono',
      'exercicio',
      'ar_puro',
      'espiritualidade',
      'temperanca',
      'alimentacao',
      'sol'
    ];

    const completos = steps.filter(chave => {
      const valor = task[chave];

      if (chave === 'agua' || chave === 'sono') {
        return typeof valor === 'number' && valor > 0;
      }

      return valor === true;
    });

    const percentual = completos.length / steps.length;
    return percentual >= 0.6;
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  goToMenu() {
    this.router.navigate(['/menu']);
  }
  goToUser() {
    this.router.navigate(['/user']);
  }
}
