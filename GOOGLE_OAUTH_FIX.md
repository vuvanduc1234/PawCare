## 🔐 Guia Completo: Corrigir Erro "Unknown Authentication Strategy 'google'"

### 🔴 Problema

```
{"success":false,"message":"Unknown authentication strategy \"google\""}
```

**Causa**: `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão faltando no arquivo `.env`

---

## ✅ Solução Passo a Passo

### **Passo 1: Obter Credenciais do Google OAuth 2.0**

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Vá para **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth 2.0 Client IDs**
5. Se solicitado, configure a tela de consentimento do OAuth:
   - **User Type**: External
   - Preencha informações necessárias
6. Em **Application Type**, escolha **Web application**
7. Nome: `PawCare` (ou qualquer nome)
8. Em **Authorized JavaScript origins**, adicione:
   - `http://localhost:5000`
   - `http://localhost:5173`
   - (E seu domínio de produção depois)

9. Em **Authorized redirect URIs**, adicione:
   - `http://localhost:5000/api/auth/google/callback`
   - (E seu callback URI de produção depois)

10. Clique **Create**
11. Você receberá **Client ID** e **Client Secret**

---

### **Passo 2: Atualizar o arquivo `.env`**

Edite `backend/.env` e procure por esta seção:

```env
# Google OAuth 2.0 (Required for Google Login)
# Get credentials from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
BACKEND_URL=http://localhost:5000
```

**Substitua** `your_google_client_id_here` e `your_google_client_secret_here` pelas credenciais obtidas:

```env
# Exemplo (NÃO use estes valores reais):
GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xyzabcdefghijk123456
BACKEND_URL=http://localhost:5000
```

⚠️ **Importante**:

- NÃO compartilhe `GOOGLE_CLIENT_SECRET` com ninguém
- NÃO faça commit de `.env` no Git (já deve estar em `.gitignore`)

---

### **Passo 3: Reiniciar o Backend**

```bash
# Parar o servidor (Ctrl+C no terminal)
# Depois executar:
cd backend
npm start
```

Você verá no console:

```
✅ Estratégia Google OAuth foi inicializada com sucesso
```

---

### **Passo 4: Testar Google Login**

1. Abra `http://localhost:5173/login` ou `/register`
2. Clique no botão **"Đăng nhập với Google"**
3. Você será redirecionado para a página de login do Google
4. Faça login com sua conta Google
5. Será redirecionado de volta ao PawCare

---

## 🆘 Troubleshooting

| Erro                    | Causa                        | Solução                                                                                   |
| ----------------------- | ---------------------------- | ----------------------------------------------------------------------------------------- |
| `redirect_uri_mismatch` | Callback URI não registrada  | Adicione `http://localhost:5000/api/auth/google/callback` em **Authorized redirect URIs** |
| `invalid_client`        | Client ID ou Secret errado   | Verifique e copie novamente sem espaços                                                   |
| `OAuth not configured`  | Env vars ainda não definidas | Confirme que `.env` tem `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`                       |
| Blank screen após click | CORS issue                   | Certifique-se de que `http://localhost:5173` está em **Authorized JavaScript origins**    |

---

## 📋 Checklist Final

- [ ] Criei projeto no Google Cloud Console
- [ ] Obtive `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`
- [ ] Atualizei `.env` com as credenciais
- [ ] Reiniciei o backend server
- [ ] Vi a mensagem "✅ Estratégia Google OAuth foi inicializada com sucesso"
- [ ] Testei Google Login no navegador

---

## 🚀 Próximos Passos

Depois que Google Login estiver funcionando:

1. **Deploy em produção**: Substitua `BACKEND_URL` e adicione seu domínio real nas configurações do Google
2. **Email verification**: Já está implementado! Usuários receberão email após se registrarem
3. **Rating**: Já está implementado na página de detalhes do serviço

---

**Dúvidas?** Entre em contato com o time de desenvolvimento!
