import { Injectable } from '@angular/core';
import { ArmazenamentoService } from './armazenamento.service';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  public listaUsuarios = [];

  constructor(private armazenamentoService: ArmazenamentoService) { }

  public async buscarTodos(){
    this.listaUsuarios = await this.armazenamentoService.pegarDados('usuarios');

    if (!this.listaUsuarios){
      this.listaUsuarios = [];
    }
  }

  public async salvar(usuario: Usuario){
    await this.buscarTodos();;

    if(!usuario){
      return false;
    }

    if(!this.listaUsuarios){
      this.listaUsuarios = [];
    }

    this.listaUsuarios.push(usuario);

    return await this.armazenamentoService.salvarDados('usuarios', this.listaUsuarios);
  }

  public async login(email: string, senha: string){
    let usuario: Usuario;

    await this.buscarTodos();

    const listaTemporaria = this.listaUsuarios.filter(usuarioArmazenado => {
      return (usuarioArmazenado.email == email && usuarioArmazenado.senha == senha);
    }); // retorna um array 

    if (listaTemporaria.length > 0){
      usuario = listaTemporaria.reduce(item => item);
    }

    return usuario;
  }

  public salvarUsuarioLogado(usuario: Usuario){
    delete usuario.senha;
    this.armazenamentoService.salvarDados('usuarioLogado', usuario);
  }

  public async buscarUsuarioLogado(){
    return await this.armazenamentoService.pegarDados('usuarioLogado');
  }

  public async removerUsuarioLogado(){
    return await this.armazenamentoService.removerDados('usuarioLogado');
  }

  public async alterar(usuario: Usuario){ //método
    if(!usuario){ // exclamação é se o usuário não for válido
      return false; // vai retornar falso
    }

    await this.buscarTodos(); // vai atualizar a lista de usuários

    const index = this.listaUsuarios.findIndex(usuarioArmazenado =>{ // encontrar qual a posição que o usuário está armazenado dentro do array
      return usuarioArmazenado.email == usuario.email;
    });

    const usuarioTemporario = this.listaUsuarios[index] as Usuario; // serve para não perder os dados de senha

    usuario.senha = usuarioTemporario.senha; // está pegando a senha dos dados armazenados e colocando no temporário

    this.listaUsuarios[index] = usuario; // colocando dentro da lista na mesma posição onde estava

    return await this.armazenamentoService.salvarDados('usuarios', this.listaUsuarios); // salvando os dados
  }
}
