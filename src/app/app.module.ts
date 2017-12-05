import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { NotAPageComponent } from './components/not-a-page/not-a-page.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { ViewregistryComponent } from './components/viewregistry/viewregistry.component';
import { SearchregistryComponent } from './components/searchregistry/searchregistry.component';
import { CreateregistryComponent } from './components/createregistry/createregistry.component';
import {RegisterService} from './services/register.service'; 
import { FlashMessagesModule} from 'angular2-flash-messages';
import { InventoryService } from './services/inventory.service';
import {RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule} from '@angular/http'
import {AuthserviceService} from './services/authservice.service';
import {DataserviceService} from './services/dataservice.service';
import {UserRegistryService} from './services/user-registry.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AdminComponent } from './components/admin/admin.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ViewsharedregistriesComponent } from './components/viewsharedregistries/viewsharedregistries.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import {AuthGuard} from './gaurds/auth.guard';
import { SocialLoginModule, AuthServiceConfig } from "angular4-social-login";
import { GoogleLoginProvider } from "angular4-social-login";


let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("700886642018-jedqgienkvmgsg6088aflkbomgf484oc.apps.googleusercontent.com")
  }
]);

//routes for this application
const appRoutes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard] 
    
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'about-us',
    component: AboutusComponent
  },
  {
    path: 'create-registry/:regName',
    component: CreateregistryComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'view-registry/:regUrl',
    component: ViewregistryComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'admin-panel',
    component: AdminComponent
  },
  {
    path: 'view/:regUrl',
    component: ViewsharedregistriesComponent
  },
  {
    path: 'profile/:userEmail',
    component: UserprofileComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'forgot-password',
    component: ForgotpasswordComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AboutusComponent,
    NotAPageComponent,
    UserprofileComponent,
    ViewregistryComponent,
    SearchregistryComponent,
    CreateregistryComponent,
    AdminComponent,
    ViewsharedregistriesComponent,
    ForgotpasswordComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    SocialLoginModule.initialize(config),
    FormsModule, 
    ReactiveFormsModule,
    FlashMessagesModule,
    HttpModule,
    Ng2SmartTableModule
  ],

  providers: [AuthGuard, AuthserviceService, DataserviceService, UserRegistryService, InventoryService, RegisterService ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
