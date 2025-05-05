import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { RelatorioComponent } from './components/relatorio/relatorio.component';
import { AuthGuard } from './AuthGuard';
import { MenuComponent } from './components/menu/menu.component';
import { LoadingComponent } from './components/loading/loading.component';
import { UserComponent } from './components/user/user.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },

  {
    path: "home",
    component: HomeComponent, canActivate: [AuthGuard]
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "signup",
    component: SignupComponent
  },
  {
    path: "user",
    component: UserComponent, canActivate: [AuthGuard]
  },
  {
    path: "menu",
    component: MenuComponent,
  },
  {
    path: "loading",
    component: LoadingComponent,
  },

];
