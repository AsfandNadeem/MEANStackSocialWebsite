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
  MatSelectModule,
  MatIconModule,
  MatDividerModule,
  MatListModule,
  MatNativeDateModule,
  MatSidenavModule,
  MatTableModule,
  MatAutocompleteModule
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
import { SidebarComponent } from './sidebar/sidebar/sidebar.component';
import { AdminGroupComponent } from './admin/admin-group/admin-group.component';
import { AdminEventComponent } from './admin/admin-event/admin-event.component';
import { AdminPostsComponent } from './admin/admin-posts/admin-posts.component';
import { ReportPageComponent } from './admin/report-page/report-page.component';
import { UserspageComponent } from './posts/userspage/userspage/userspage.component';
import { ChatComponent } from './chat/chat.component';
import { MessageComponent } from './message/message.component';
import {NgxAutoScrollModule} from 'ngx-auto-scroll';
import { AdvertisepostComponent } from './posts/advertisepost/advertisepost/advertisepost.component';
import { AdvertiserloginComponent } from './auth/Advertiser/advertiserlogin/advertiserlogin/advertiserlogin.component';
import { AdvertisersignupComponent } from './auth/Advertiser/advertisersignup/advertisersignup/advertisersignup.component';


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
    AdminUsersComponent,
    SidebarComponent,
    AdminGroupComponent,
    AdminEventComponent,
    AdminPostsComponent,
    ReportPageComponent,
    UserspageComponent,
    ChatComponent,
    MessageComponent,
    AdvertisepostComponent,
    AdvertiserloginComponent,
    AdvertisersignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatCardModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatMenuModule,
    MatSidenavModule,
    MatNativeDateModule,
    ScrollDispatchModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    NgxAutoScrollModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
, AuthService    ],
  bootstrap: [AppComponent]
})
export class AppModule {}
