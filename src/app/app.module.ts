import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatSelectModule, MatIconModule, MatDividerModule, MatListModule, MatNativeDateModule, MatSidenavModule, MatTableModule
} from '@angular/material';
import { MatDatepickerModule} from '@angular/material/datepicker';

import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {AuthInterceptor} from './auth/auth-interceptor';
import {AuthService} from './auth/auth.service';
import {MatMenuModule} from '@angular/material/menu';
import { ProfileComponent } from './auth/profile/profile.component';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import { GroupCreateComponent } from './groups/group-create/group-create.component';
import { GroupListComponent } from './groups/group-list/group-list.component';
import { EventCreateComponent } from './events/event-create/event-create.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { GroupPageComponent } from './groups/group-page/group-page.component';
import { EventPageComponent } from './events/event-page/event-page.component';
import { ArchivedpostsComponent } from './posts/archivedposts/archivedposts.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminPageComponent } from './admin/admin-page/admin-page.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';


@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    GroupCreateComponent,
    GroupListComponent,
    EventCreateComponent,
    EventListComponent,
    GroupPageComponent,
    EventPageComponent,
    ArchivedpostsComponent,
    AdminLoginComponent,
    AdminPageComponent,
    AdminUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatDatepickerModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatCardModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatMenuModule,
    MatSidenavModule,
    MatNativeDateModule,
    ScrollDispatchModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
, AuthService    ],
  bootstrap: [AppComponent]
})
export class AppModule {}
