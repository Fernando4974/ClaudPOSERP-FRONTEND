import { Routes } from '@angular/router';
import { SingInComponent } from './components/sing-in/sing-in.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ErrorpageComponent } from './components/errorpage/errorpage.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { tokenGuard } from './utils/token.guard';
import { userExitGuard } from './guards/user-exit.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ProductComponent } from './pages/product/product.component';
import { NewProductComponent } from './pages/product/new-product/new-product.component';
import { PosRegisterComponent } from './pages/pos/pos-version/pos-register/pos-register.component';
import { PosVersionComponent } from './pages/pos/pos-version/pos-version.component';
import { UpdateProductComponent } from './pages/product/update-product/update-product.component';
import { UserComponent } from './pages/user/user.component';
const param: string = '';
export const routes: Routes = [
  { path: "", redirectTo: '/logIn', pathMatch: 'full' },
  { path: "singIn", component: SingInComponent },
  { path: "logIn", component: LoginComponent, canDeactivate: [userExitGuard] },
  { path: "forgotPassword", component: ForgotPasswordComponent },
  { path: "resetPassword", component: ResetPasswordComponent },
  { path: 'product', component: ProductComponent },
  { path: 'newProduct', component: NewProductComponent },
  { path: "dashboard", component: DashboardComponent, canActivate: [tokenGuard], canDeactivate: [userExitGuard] },
  { path: "errorPage", component: ErrorpageComponent },
  { path: "maintenancePage", component: MaintenanceComponent },
  { path: "pos-register", component: PosRegisterComponent },
  { path: "posVersion", component: PosVersionComponent },
  { path: "updateProduct/:id", component: UpdateProductComponent },
  { path: "user", component: UserComponent },
  { path: "**", redirectTo: "/errorPage", pathMatch: 'full' },
];
