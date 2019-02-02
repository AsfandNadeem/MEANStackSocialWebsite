import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {mimeType} from '../../posts/post-create/mime-type.validator';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit  {

  nform: FormGroup;
  imagePreview: string;
  isLoading = false;
  departments = ['Computer Science',
    'Architecture',
    'Electrical Engineering'
  ];

  constructor(public authService: AuthService) {}
  ngOnInit() {
    this.nform = new FormGroup({
      image: new FormControl(null,{
        asyncValidators: [mimeType]
      })
    });
  }

  onSignup(form: NgForm) {
    if ( form.invalid ) {
      return;
    }
    if ( this.nform.invalid){
      return;
    }
    this.isLoading = true;
    console.log(form.value.email, this.nform.value.image, form.value.password, form.value.uname, form.value.dname, form.value.regno);
    this.authService.createUser(form.value.email, this.nform.value.image, form.value.password, form.value.uname, form.value.dname, form.value.regno);
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.nform.patchValue({ image: file});
    this.nform.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);

  }

  // onSavePost() {
  //   // console.log(this.form.value.title, this.form.value.content,  this.form.value.cname);
  //   if (this.form.invalid) {
  //     return;
  //   }
  //   this.isLoading = true;
  //   if (this.mode === 'create') {
  //     this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image, this.form.value.cname);
  //   } else {
  //     this.postsService.updatePost(
  //       this.postId,
  //       this.form.value.title,
  //       this.form.value.content,
  //       this.form.value.image);
  //   }
  //
  //   this.form.reset();
  // }

}
