import { Router } from '@angular/router';
import { Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { TarefaService } from '../../services/tarefa.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  router = inject(Router)
  taskService = inject(TarefaService)
  user: any = []
  img: string = ""
  tasks: any[] = [];
  taskHoje:any = []
  hoje: string = ''
  level:number = 0
  falta:number = 0
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    this.hoje = `${ano}/${mes}/${dia}`;
  }

  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {
      const userString = localStorage.getItem('user');
      if (userString) {
        this.user = JSON.parse(userString);
        this.level = this.user.nivel
        this.falta = 7 - this.level
        this.taskService.verificarOuCriarTarefa(this.user.id).subscribe(task => {
          this.taskHoje = [task];
          console.log("Tarefa carregada/criada:", task);
        });
      }

     this.taskService.getTarefaDoDia(this.user.id).subscribe(task => {
      if (task) {
        this.taskHoje = [task];
      }else{

        // this.taskService.createTarefa(tarefa).subscribe({
        //   next:(data) =>{
        //     alert("task Criada")
        //   }
        // })
      }
    });
    this.taskService.getTaskToUser(this.user.id).subscribe(taskList => {
      if (taskList) {
        this.tasks = [taskList];
        console.log(this.tasks)
      }
    });

      this.img = `${this.user.pontos}.png`;
    }
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

  diaValido(task: any): boolean {
    const completos = this.steps.filter(chave => this.ehConcluido(chave, task)).length;
    return (completos / this.steps.length) >= 0.6;
  }

  calcularStreak(): number {
    if(this.tasks.length <= 0){
      return 0
    }
      const ordenado = [...this.tasks].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    let streak = 0;

    for (let i = 0; i < ordenado.length; i++) {
      const diaAtual = new Date(ordenado[i].data);
      const diaEsperado = new Date();
      diaEsperado.setDate(diaEsperado.getDate() - streak);

      const mesmoDia = diaAtual.toDateString() === diaEsperado.toDateString();

      if (mesmoDia && this.diaValido(ordenado[i])) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  gerarSemanaAtual(): { dia: string, valido: boolean }[] {
    const dias: { dia: string, valido: boolean }[] = [];

    const hoje = new Date();
    const diaSemana = hoje.getDay(); // 0 = domingo, ..., 6 = sábado

    const domingo = new Date(hoje);
    domingo.setDate(hoje.getDate() - diaSemana);

    for (let i = 0; i < 7; i++) {
      const data = new Date(domingo);
      data.setDate(domingo.getDate() + i);

      const dataFormatada = data.toISOString().slice(0, 10); // 'YYYY-MM-DD'

      const taskDoDia = this.tasks.find(t => t.data === dataFormatada);
      const valido = taskDoDia ? this.diaValido(taskDoDia) : false;

      dias.push({
        dia: data.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0).toUpperCase(),
        valido
      });
    }

    return dias;
  }





  logout() {
    localStorage.removeItem('user')
    this.router.navigate(['/login']);

  }

  goToMenu() {
    this.router.navigate(['/menu']);

  }


}
