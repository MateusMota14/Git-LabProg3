# Configuração do Projeto

## 🚀 Passos para rodar o projeto

Depois de criar branchs com base na `main`, você vai rodar o comando:

npm install
Para checar se deu certo, vá para a pasta adotaPet (P maiusculo) e rode:

npx expo start
Se aparecer um QR Code, deu certo! ✅

Agora, para conectar com o Backend:

Abra o XAMPP e clique em Start no Apache e no MySQL.
No navegador, acesse:

http://localhost/phpmyadmin/index.php?route=/server/privileges&adduser=1
Preencha os campos assim:
Nome do utilizador: adotapet
Senha: 1234
✅ Marque a opção Criar banco de dados...
Clique em Continuar.
Agora basta ir para a pasta adotapet (p minusculo) dentro de Backend e rodar o comando:

.\gradlew.bat bootRun
A versão do Java deve o 17

Por último, em adotaPet\assets\constants\config.js deve ser colocado o IP do computador.

