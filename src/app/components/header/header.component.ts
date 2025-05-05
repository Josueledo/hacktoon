import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../services/user.service';
import { TarefaService } from '../../services/tarefa.service'; // Importe o TarefaService
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
    router = inject(Router)

  faFireFlameCurved = faFireFlameCurved;
  user: any = [];
  userName: string = '';
  letter: string = '';
  tasks: any[] = [];
  currentStreak: number = 0; // Variável para armazenar o streak atual
  steps: string[] = [
    'agua',
    'sono',
    'exercicio',
    'ar_puro',
    'espiritualidade',
    'temperança',
    'alimentacao',
    'sol'
  ];

  private tarefaService = inject(TarefaService); // Injete o TarefaService

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userString = localStorage.getItem('user');
      if (userString) {
        this.user = JSON.parse(userString);
        this.userName = this.user.nome;
        this.letter = this.userName[0].toUpperCase();

        // Carrega as tarefas do usuário
        this.carregarTarefas();
      }
    }
  }

  carregarTarefas() {
    this.tarefaService.getTaskToUser(this.user.id).subscribe({
      next: (taskList) => {
        // Garante que tasks seja sempre um array
        this.tasks = Array.isArray(taskList) ? taskList : Object.values(taskList);
        // Calcula o streak após carregar as tarefas
        this.currentStreak = this.calcularStreak();
      },
      error: (err) => {
        console.error('Erro ao carregar tarefas:', err);
      }
    });
  }

  getSaudacao(): string {
    const hora = new Date().getHours();

    if (hora >= 5 && hora < 12) {
      return 'Bom dia';
    } else if (hora >= 12 && hora < 18) {
      return 'Boa Tarde';
    } else if (hora >= 18 && hora < 23) {
      return 'Boa noite';
    } else {
      return 'Cuidado com o sono';
    }
  }

  calcularStreak(): number {
    if (this.tasks.length <= 0) {
      return 0;
    }

    // Ordena as tarefas por data (mais recente primeiro)
    const ordenado = [...this.tasks].sort((a, b) =>
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );

    let streak = 0;
    const hoje = new Date();
    const umDiaEmMs = 24 * 60 * 60 * 1000; // 1 dia em milissegundos

    for (let i = 0; i < ordenado.length; i++) {
      const dataTarefa = new Date(ordenado[i].data);
      const diferencaDias = Math.floor((hoje.getTime() - dataTarefa.getTime()) / umDiaEmMs);

      // Verifica se a tarefa é de hoje ou dos dias anteriores consecutivos
      if (diferencaDias === streak && this.diaValido(ordenado[i])) {
        streak++;
      } else if (diferencaDias > streak) {
        // Se houver uma lacuna maior que o streak atual, para o loop
        break;
      }
    }

    return streak;
  }

  diaValido(task: any): boolean {
    const completos = this.steps.filter(chave => this.ehConcluido(chave, task)).length;
    return (completos / this.steps.length) >= 0.6;
  }

  ehConcluido(chave: string, task: any): boolean {
    const valor = task[chave];

    if (chave === 'agua' || chave === 'sono') {
      return typeof valor === 'number' && valor > 0;
    }
    if (chave === 'exercicio') {
      return Array.isArray(valor) && valor[0] === 'sim';
    }

    return valor === true;
  }



  goToUser() {
    this.router.navigate(['/user']);
  }
}
