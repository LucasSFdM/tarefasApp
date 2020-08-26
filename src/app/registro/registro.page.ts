import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CpfValidator } from '../validators/cpf-validator';
import { ComparaValidator } from '../validators/comparacao-validator';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public formRegistro: FormGroup;

  public mensagem_validacao = {
    email: [
      { tipo: 'required', mensagem: 'O campo E-mail é obrigatório!' },
    ],
    senha1: [
      { tipo: 'required', mensagem: 'O campo senha é obrigatório!' },
      { tipo: 'minlength', mensagem: 'A senha deve ter pelo menos 6 caracteres!!' }
    ],
    senha2: [
      { tipo: 'required', mensagem: 'O campo senha é obrigatório!' },
      { tipo: 'minlength', mensagem: 'A senha deve ter pelo menos 6 caracteres!!' },
      { tipo: 'comparacao', mensagem: 'Deve ser igual a senha!' }
    ],
    nome: [
      { tipo: 'required', mensagem: 'O campo nome é obrigatório!' },
      { tipo: 'minlength', mensagem: 'O nome deve ter pelo menos 3 caracteres!!' }
    ],
    cpf: [
      { tipo: 'required', mensagem: 'O CPF é obrigatório!' },
      { tipo: 'minlength', mensagem: 'O CPF deve ter no mínimo 11 caracteres!!' },
      { tipo: 'maxlength', mensagem: 'O CPF deve ter no máximo 14 caracteres!!' },
      { tipo: 'invalido', mensagem: 'CPF inválido!' }
    ],
    datanascimento: [
      { tipo: 'required', mensagem: 'A data de nascimento é obrigatória!' },
    ],
    genero: [
      { tipo: 'required', mensagem: 'O genero é obrigatório!' },
    ],
    celular: [
      { tipo: 'minlength', mensagem: 'O celular deve ter no mínimo 10 caracteres!!' },
      { tipo: 'maxlength', mensagem: 'O celular deve ter no máximo 16 caracteres!!' }
    ]
  };

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.formRegistro = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      senha1: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      senha2: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cpf: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(14),
      CpfValidator.cpfValido
      ])],
      datanascimento: ['', Validators.compose([Validators.required])],
      genero: ['', Validators.compose([Validators.required])],
      celular: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(14)])]
    },{
      validator: ComparaValidator('senha1', 'senha2')
    });
  }

  ngOnInit() {
  }

  public salvar() {
    if (this.formRegistro.valid) {
      console.log('formulário válido!');
      this.router.navigateByUrl('/home');
    } else {
      console.log('formulário inválido.')
    }
  }
}
