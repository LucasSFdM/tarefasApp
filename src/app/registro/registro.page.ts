import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CpfValidator } from '../validators/cpf-validator';
import { ComparaValidator } from '../validators/comparacao-validator';
import { UsuariosService } from '../services/usuarios.service';
import { AlertController } from '@ionic/angular';
import { Usuario } from '../models/Usuario';


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

  constructor(
    private formBuilder: FormBuilder, 
    private usuariosService: UsuariosService,
    public alertController: AlertController,
    public router: Router) {

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

  async ngOnInit() {
    await this.usuariosService.buscarTodos();
    console.log(this.usuariosService.listaUsuarios);
  }

  public async salvarFormulario(){
    if(this.formRegistro.valid){

      let usuario = new Usuario();
      usuario.nome = this.formRegistro.value.nome;
      usuario.cpf = this.formRegistro.value.cpf;
      usuario.dataNascimento = new Date(this.formRegistro.value.dataNascimento);
      usuario.genero = this.formRegistro.value.genero;
      usuario.celular = this.formRegistro.value.celular;
      usuario.email = this.formRegistro.value.email;
      usuario.senha = this.formRegistro.value.senha;

      if(await this.usuariosService.salvar(usuario)){
        this.exibirAlerta('SUCESSO!', 'Usuário salvo com sucesso!');
        this.router.navigateByUrl('/login');
      }else{
        this.exibirAlerta('ERRO!', 'Erro ao salvar o usuário!');
        this.router.navigateByUrl('/login');
      }

    }else{
      this.exibirAlerta('ADVERTENCIA', 'Formulário inválido<br/>Verifique os campos do seu formulário!')
    }
  }

  
  async exibirAlerta(titulo:string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }

}
