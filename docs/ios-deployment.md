# PromptLabz — Guia de Deploy iOS (App Store)

## Visão Geral

O PromptLabz usa **Capacitor** para transformar o app React/Vite em um app nativo iOS distribuível pela App Store. O Capacitor renderiza o app em um WebView nativo otimizado, com acesso a APIs nativas como StatusBar, Keyboard e Haptics.

```
React SPA (Vite build) → Capacitor → iOS Native App → App Store
```

---

## Pré-requisitos

| Requisito | Versão mínima | Onde obter |
|-----------|--------------|------------|
| macOS | 13 (Ventura) | — |
| Xcode | 15+ | App Store |
| CocoaPods | 1.14+ | `sudo gem install cocoapods` |
| Apple Developer Account | — | [developer.apple.com](https://developer.apple.com) |
| Node.js | 22+ | [nodejs.org](https://nodejs.org) |
| pnpm | 10+ | `npm i -g pnpm` |

---

## Setup Inicial (uma vez por máquina)

```bash
# Clone o repo e entre na pasta
git clone https://github.com/lenixeduardo/promptlabz.git
cd promptlabz

# Copie o .env
cp .env.example .env.local
# Preencha as variáveis do Supabase

# Execute o script de setup
./scripts/setup-ios.sh
```

---

## Desenvolvimento com iOS Simulator

```bash
# 1. Build + sync (sempre que mudar código)
pnpm ios:sync

# 2. Abrir no Xcode
pnpm ios:open

# 3. No Xcode: selecione um simulador e pressione ⌘R
```

---

## Configuração do Xcode (primeira vez)

1. **Signing & Capabilities** → selecione seu Team
2. **Bundle Identifier**: `com.promptlabz.app`
3. **Display Name**: `PromptLabz`
4. **Version**: `1.0.0` / **Build**: `1`
5. Em **Info.plist**, verifique:
   - `CFBundleDisplayName` = PromptLabz
   - `NSAppTransportSecurity` configurado para HTTPS

---

## Adicionar Ícones no Xcode

Os ícones gerados estão em `public/icons/`. Para usar no Xcode:

1. Abra `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. Arraste os arquivos de `public/icons/` correspondendo aos tamanhos pedidos:
   - `icon-180x180.png` → iPhone (3x)
   - `icon-120x120.png` → iPhone (2x)
   - `icon-167x167.png` → iPad Pro
   - `icon-152x152.png` → iPad (2x)
   - `icon-76x76.png` → iPad (1x)
   - `icon-1024x1024.png` → App Store (gere a partir do mascot-login-new.png 1024x1024)

---

## Splash Screen

O arquivo de splash screen já está configurado no `capacitor.config.ts`. Para personalizar:

1. Instale o plugin: `pnpm add @capacitor/splash-screen`
2. Adicione as imagens em `ios/App/App/Assets.xcassets/Splash.imageset/`
3. Use os arquivos de `public/icons/splash-*.png` como referência

---

## Build para App Store

### Via Xcode (manual)
1. `pnpm ios:sync` para sincronizar o build mais recente
2. Xcode → **Product** → **Archive**
3. Na janela Organizer → **Distribute App** → **App Store Connect**
4. Siga o assistente de upload

### Via GitHub Actions (automatizado)
Configure os seguintes secrets no repositório:

| Secret | Descrição |
|--------|-----------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anon do Supabase |
| `IOS_DIST_CERT_P12_BASE64` | Certificado de distribuição (base64) |
| `IOS_DIST_CERT_P12_PASSWORD` | Senha do certificado P12 |
| `IOS_PROVISIONING_PROFILE_NAME` | Nome do perfil de provisionamento |
| `APPSTORE_ISSUER_ID` | Issuer ID da App Store Connect API |
| `APPSTORE_KEY_ID` | Key ID da App Store Connect API |
| `APPSTORE_PRIVATE_KEY` | Chave privada da API (arquivo .p8) |
| `APPLE_TEAM_ID` | Team ID da Apple Developer |

Para disparar o build automático: crie uma tag `v1.0.0`:
```bash
git tag v1.0.0 && git push origin v1.0.0
```

---

## Primeira Submissão à App Store

1. **App Store Connect** → My Apps → **+** → New App
2. Plataformas: iOS | Bundle ID: `com.promptlabz.app` | Nome: PromptLabz
3. Preencha: descrição, screenshots, categoria (Educação), idade (4+)
4. **Screenshots obrigatórios**:
   - iPhone 6.9" (1320×2868) — iPhone 16 Pro Max
   - iPhone 6.5" (1242×2688) — iPhone 11 Pro Max
   - iPad Pro 12.9" (2048×2732)
5. Upload via Xcode Organizer ou GitHub Actions
6. Envie para revisão — prazo médio: 1-3 dias úteis

---

## Atualizações Subsequentes

```bash
# 1. Incremente a versão em package.json
# 2. Atualize Build Number em Xcode → General → Identity
# 3. Sincronize e archive
pnpm ios:sync
# Xcode → Product → Archive → Distribute
```

---

## Estrutura de Arquivos iOS

```
ios/                          ← Gerado pelo Capacitor (não edite manualmente)
  App/
    App/
      Assets.xcassets/        ← Ícones e splash screens
      Info.plist              ← Configurações do app
      capacitor.config.json   ← Config gerada automaticamente
    App.xcworkspace           ← Abrir com Xcode (não o .xcodeproj)
    Podfile                   ← Dependências CocoaPods
capacitor.config.ts           ← Configuração do Capacitor (edite aqui)
public/icons/                 ← Ícones gerados (PWA + iOS)
```

---

## Troubleshooting

**Erro: `No provisioning profile`**
→ Xcode → Preferences → Accounts → adicione seu Apple ID e baixe os perfis

**Erro: `Bundle ID already in use`**
→ Mude o `appId` em `capacitor.config.ts` para um ID único

**WebView não carrega o app**
→ Verifique se `pnpm build` foi executado antes do `cap sync ios`

**Fonts não aparecem**
→ No Xcode, verifique se os arquivos de fonte estão em "Build Phases → Copy Bundle Resources"
