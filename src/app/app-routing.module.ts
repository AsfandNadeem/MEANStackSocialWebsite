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

const routes: Routes = [
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
  { path: 'profile/:userId', component: ProfileComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
