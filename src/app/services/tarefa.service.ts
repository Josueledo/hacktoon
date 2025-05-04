import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private taskUrl = 'http://localhost:3000/tarefas';

  constructor(private http: HttpClient) { }

  createTarefa(tarefa: any): Observable<any> {
    return this.http.post(`${this.taskUrl}`, tarefa);
  }

  getAll() {
    return this.http.get(`${this.taskUrl}`)
  }

  getDataLocalFormatada(): string {
    const agora = new Date();
    const fusoCorreto = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000);

    const ano = fusoCorreto.getFullYear();
    const mes = String(fusoCorreto.getMonth() + 1).padStart(2, '0');
    const dia = String(fusoCorreto.getDate()).padStart(2, '0');

    return `${ano}/${mes}/${dia}`;
  }

  getTarefaDoDia(userId: number): Observable<any> {
    const dataFormatada = this.getDataLocalFormatada();
    const url = `${this.taskUrl}?id_user=${userId}&data=${dataFormatada}`;

    return this.http.get<any[]>(url).pipe(
      map(tasks => tasks[0] || null)
    );
  }
  getTaskToUser(userId: number): Observable<any> {
    const url = `${this.taskUrl}?id_user=${userId}`;

    return this.http.get<any[]>(url).pipe(
      map(tasks => tasks[0] || null)
    );
  }

  verificarOuCriarTarefa(userId: number): Observable<any> {
    const dataFormatada = this.getDataLocalFormatada();

    const url = `${this.taskUrl}?id_user=${userId}&data=${dataFormatada}`;
    return this.http.get<any[]>(url).pipe(
      switchMap(tasks => {
        if (tasks.length > 0) {
          return of(tasks[0]); // Já existe, retorna
        }

        // Criar nova tarefa
        const novaTarefa = {
          id_user: userId,
          data: dataFormatada,
          agua: 0,
          sono: 0,
          sol: false,
          alimentacao: false,
          ar_puro: false,
          exercicio: false,
          temperança: false,
          espiritualidade: false
        };

        return this.createTarefa(novaTarefa);
      })
    );
  }




  updateSol(id: number, sol: boolean): Observable<any> {
    return this.http.patch(`${this.taskUrl}/${id}`, { sol });
  }
  updateAgua(id: number, agua: number): Observable<any> {
    return this.http.patch(`${this.taskUrl}/${id}`, { agua });
  }
  updateSono(id: number, sono: number): Observable<any> {
    return this.http.patch(`${this.taskUrl}/${id}`, { sono });
  }
  updateExercicio(id: number, exercicio: boolean): Observable<any> {
    return this.http.patch(`${this.taskUrl}/${id}`, { exercicio });
  }
  updateTemperanca(id: number, temperanca: boolean): Observable<any> {
    return this.http.patch(`${this.taskUrl}/${id}`, { temperanca });
  }
  updateAlimentacao(id: number, alimentacao: boolean): Observable<any> {
    return this.http.patch(`${this.taskUrl}/${id}`, { alimentacao });
  }
  updateEspiritualidade(id: number, Espiritualidade: boolean): Observable<any> {
    return this.http.patch(`${this.taskUrl}/${id}`, { Espiritualidade });
  }

  updateAr(id: number, ar: boolean): Observable<any> {
    return this.http.patch(`${this.taskUrl}/${id}`, { ar });
  }

}
