import { CommonModule } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TarefaService } from '../../services/tarefa.service';
import { isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee, faArrowLeft, faDroplet, faSun, faDumbbell, faWind, faBible, faScaleBalanced, faCarrot, faChevronLeft, faMoon, faCheck,faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuComponent {

  isVisible = false
  taskService = inject(TarefaService)
  userService = inject(UserService)
  router = inject(Router)
  hoje: string = ''
  tasks: any[] = []
  tasksHoje: any = []
  faCoffee = faCoffee;
  faCheck = faCheck
  faArrowLeft = faArrowLeft
  faDroplet = faDroplet
  faMoon = faMoon
  faSun = faSun
  faDumbbell = faDumbbell
  faWind = faWind
  faCarrot = faCarrot
  faBible = faBible
  faScaleBalanced = faScaleBalanced
  faChevronLeft = faChevronLeft
  faLightbulb = faLightbulb
  agualml: number = 0
  concluidos = 0
  user: any = ''
  sol: boolean = false
  temperanca: boolean = false
  exercicio: boolean = false
  ar_puro: boolean = false
  luz_solar: boolean = false
  alimentacao: boolean = false
  espiritualidade: boolean = false
  sono = 0
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
        console.log(this.user)
        this.getAll()
      }
    }
  }

  get passosCompletos(): number {
    return this.steps.filter(chave => this.ehConcluido(chave)).length;
  }

  ehConcluido(chave: string): boolean {
    const task = this.tasksHoje?.[0];
    if (!task) return false;

    const valor = task[chave];

    if (chave === 'agua' || chave === 'sono') {
      return typeof valor === 'number' && valor > 0;
    }

    return valor === true;
  }

  checkTaskCompleted(){
    if(
      this.tasksHoje[0].agua !== 0 &&
      this.tasksHoje[0].sono !== 0 &&
      this.tasksHoje[0].sol === true &&
      this.tasksHoje[0].alimentacao === true &&
      this.tasksHoje[0].ar_puro === true &&
      this.tasksHoje[0].exercicio === true &&
      this.tasksHoje[0].temperanca === true &&
      this.tasksHoje[0].espiritualidade === true
    ){
      console.log("completa")
      this.userService.updatePontos(this.user.id,this.user.pontos + 1).subscribe({
        next:(data) =>{
          if(this.user.pontos === 7 && this.user.nivel === 1){
            this.userService.updateLevel(this.user.id,this.user.level + 1).subscribe({
              next: (data) =>{
                console.log("Level Up")
              }
            })
          }
        }
      })
    }
  }


  back() {
    this.router.navigate(["/home"])
  }
  increase() {
    this.agualml += 250
    this.updateAgua()
    this.checkTaskCompleted()
  }
  decrease() {
    if (this.agualml > 250) {
      this.agualml -= 250
      this.updateAgua()
      this.checkTaskCompleted()

    }
  }
  increaseSono() {
    this.sono += 30;
    this.updateSono()
    this.checkTaskCompleted()

  }

  decreaseSono() {
    if (this.sono >= 30) {
      this.sono -= 30;
      this.updateSono()
    }
  }

  formatarTempo(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}:${mins.toString().padStart(2, '0')}`;
  }


  updateAgua() {
    this.taskService.updateAgua(this.tasksHoje[0].id, this.agualml).subscribe({
      next: (data) => {
        console.log(data)
        this.checkTaskCompleted()

      }
    })
  }
  updateSol(res:boolean) {
    this.taskService.updateSol(this.tasksHoje[0].id, res).subscribe({
      next: (data) => {
        console.log(data)
        this.checkTaskCompleted()
      }
    })
  }
  updateExercicio(res:boolean) {
    console.log(this.tasksHoje)
    this.taskService.updateExercicio(this.tasksHoje[0].id, res).subscribe({
      next: (data) => {
        console.log(data)
        this.checkTaskCompleted()
      }
    })
  }
  updateAr(res:boolean) {
    this.taskService.updateAr(this.tasksHoje[0].id, res).subscribe({
      next: (data) => {
        console.log(data)
        this.checkTaskCompleted()
      }
    })
  }
  updateEspiritualidade(res:boolean) {
    this.taskService.updateEspiritualidade(this.tasksHoje[0].id, res).subscribe({
      next: (data) => {
        console.log(data)
        this.checkTaskCompleted()
      }
    })
  }
  updateTemperanca(res:boolean) {
    this.taskService.updateTemperanca(this.tasksHoje[0].id, res).subscribe({
      next: (data) => {
        console.log(data)
        this.checkTaskCompleted()
      }
    })
  }
  updateSono() {
    this.taskService.updateSono(this.tasksHoje[0].id,this.sono ).subscribe({
      next: (data) => {
        console.log(data)
        this.checkTaskCompleted()
      }
    })
  }
  updateAlimentacao(res:boolean) {
    this.taskService.updateAlimentacao(this.tasksHoje[0].id, res).subscribe({
      next: (data) => {
        console.log(data)
        this.checkTaskCompleted()
      }
    })
  }


  getAll() {
    this.taskService.getAll().subscribe({
      next: (data) => {
        this.tasks.push(data)
        for (let i = 0; i < this.tasks[0].length; i++) {

          if (this.tasks[0][i].data === this.hoje && parseInt(this.tasks[0][i].id_user,10) === parseInt(this.user.id, 10)) {
            this.tasksHoje.push(this.tasks[0][i])
            console.log(this.tasksHoje)
            this.agualml = this.tasksHoje[0].agua
            this.sono = this.tasksHoje[0].sono
          }
        }
      },
    })
  }
}
