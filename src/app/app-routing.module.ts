import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PostListComponent} from './posts/post-list/post-list.component';
import {PostCreateComponent} from './posts/post-create/post-create.component';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {AuthGuard} from './auth/auth.guard';
import {ProfileComponent} from './auth/profile/profile.component';
import {GroupCreateComponent} from './groups/group-create/group-create.component';
import {EventCreateComponent} from './events/event-create/event-create.component';
import {GroupListComponent} from './groups/group-list/group-list.component';
import {EventListComponent} from './events/event-list/event-list.component';
import {GroupPageComponent} from './groups/group-page/group-page.component';
import {EventPageComponent} from './events/event-page/event-page.component';
import {ArchivedpostsComponent} from './posts/archivedposts/archivedposts.component';
import {AdminLoginComponent} from './admin/admin-login/admin-login.component';
import {AdminPageComponent} from './admin/admin-page/admin-page.component';
import {AdminUsersComponent} from './admin/admin-users/admin-users.component';

const routes: Routes = [
  {path: 'admin', component: AdminLoginComponent},
  {path: 'adminpage', component: AdminPageComponent},
  {path: 'adminusers', component: AdminUsersComponent},
  { path: '' , component: LoginComponent},
  { path: 'messages' , component: PostListComponent, canActivate: [AuthGuard] },
  {path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'grouplist', component: GroupListComponent, canActivate: [AuthGuard]},
  { path: 'eventlist', component: EventListComponent, canActivate: [AuthGuard]},
  { path: 'groupcreate', component: GroupCreateComponent, canActivate: [AuthGuard]},
  { path: 'eventcreate', component: EventCreateComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'archives', component: ArchivedpostsComponent, canActivate: [AuthGuard]},
  {path: 'grouppage/:groupId', component: GroupPageComponent, canActivate: [AuthGuard]},
  {path: 'eventpage/:eventId', component: EventPageComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
