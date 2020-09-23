import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../models/Usuario';
import { UsuariosService } from '../services/usuarios.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CpfValidator } from '../validators/cpf-validator';

@Component({
  selector: 'app-alterar-usuario',
  templateUrl: './alterar-usuario.page.html',
  styleUrls: ['./alterar-usuario.page.scss'],
})
export class AlterarUsuarioPage implements OnInit {

  public formAlterar: FormGroup;

  public mensagem_validacao = {
    email: [
      { tipo: 'required', mensagem: 'O campo E-mail é obrigatório!' },
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

  private usuario: Usuario;

  private manterLogadoTemp: boolean;

  constructor(private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    public alertController: AlertController,
    public router: Router) {

    this.formAlterar = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cpf: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(14),
      CpfValidator.cpfValido
      ])],
      datanascimento: ['', Validators.compose([Validators.required])],
      genero: ['', Validators.compose([Validators.required])],
      celular: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(14)])]
    });

    this.preencherFormulario();
  }

  ngOnInit() {
  }

  public async preencherFormulario(){
    this.usuario = await this.usuariosService.buscarUsuarioLogado();
    this.manterLogadoTemp = this.usuario.manterLogado;
    delete this.usuario.manterLogado;

    this.formAlterar.setValue(this.usuario);
    this.formAlterar.patchValue({dataNascimento: this.usuario.dataNascimento.toISOString()});
  }

  /* método abaixo funciona basicamente assim: Vai primeiramente verificar se o formulário
   está válido, e se estiver ele vai atualizar o usuário com os novos dados cadasttrados no formulário
   e depois vai salvar, e caso o formulário não esteja válido, vai exibir um alerta mostrando ao usuário que
   os dados dos campos cadastrados estão errados.
   */
  public async salvar(){
    if(this.formAlterar.valid){ // caso o formulário esteja válido:
      // preencher o usuário com os dados do formulário
      this.usuario.nome = this.formAlterar.value.nome;
      this.usuario.dataNascimento = new Date(this.formAlterar.value.dataNascimento);
      this.usuario.genero = this.formAlterar.value.genero;
      this.usuario.celular = this.formAlterar.value.celular;
      this.usuario.email = this.formAlterar.value.email;

      // salvar os dados
      if(await this.usuariosService.alterar(this.usuario)){
        this.usuario.manterLogado = this.manterLogadoTemp;
        this.usuariosService.salvarUsuarioLogado(this.usuario);
        this.exibirAlerta("SUCESSO!", "Usuário alterado com sucesso!");
        this.router.navigateByUrl('/configuracoes');
      }
    }else{ // caso o formulário não esteja válido:
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
