import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  faFireFlameCurved = faFireFlameCurved
  user:any = []
  userName:string = ''
  letter:string = ''
  tasks: any[] = [];
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

  }

  ngOnInit() {

    if (isPlatformBrowser(this.platformId)) {
      const userString = localStorage.getItem('user');
      if (userString) {
        this.user = JSON.parse(userString);
        this.userName = this.user.nome
        this.letter =  this.userName[0].toUpperCase()
      }
    }
  }

  getSaudacao(): string {
    const hora = new Date().getHours();
  
    if (hora >= 5 && hora < 12) {
      return 'Good morning';
    } else if (hora >= 12 && hora < 18) {
      return 'Good afternoon';
    } else if (hora >= 18 && hora < 22) {
      return 'Good evening';
    } else {
      return 'Good night';
    }
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
}
