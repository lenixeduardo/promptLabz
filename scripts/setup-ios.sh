#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# PromptLabz — iOS Setup Script
# Run this once on a Mac with Xcode installed to initialize the iOS project.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

echo "🍎 PromptLabz iOS Setup"
echo "────────────────────────"

# Check prerequisites
if ! command -v xcode-select &>/dev/null; then
  echo "❌ Xcode não encontrado. Instale o Xcode da App Store primeiro."
  exit 1
fi

if ! command -v pod &>/dev/null; then
  echo "📦 Instalando CocoaPods..."
  sudo gem install cocoapods
fi

if ! command -v pnpm &>/dev/null; then
  echo "📦 Instalando pnpm..."
  npm install -g pnpm
fi

echo "📦 Instalando dependências..."
pnpm install

echo "🏗  Gerando build de produção..."
pnpm build

echo "📱 Inicializando plataforma iOS..."
if [ ! -d "ios" ]; then
  npx cap add ios
else
  echo "   Pasta ios/ já existe, sincronizando..."
  npx cap sync ios
fi

echo "📦 Instalando pods do iOS..."
cd ios/App
pod install
cd ../..

echo ""
echo "✅ Setup completo!"
echo ""
echo "Próximos passos:"
echo "  1. Abra o projeto no Xcode:"
echo "     pnpm ios:open"
echo ""
echo "  2. Em Xcode → Signing & Capabilities:"
echo "     - Selecione seu Team (Apple Developer Account)"
echo "     - Bundle ID: com.promptlabz.app"
echo ""
echo "  3. Para rodar no simulador: ⌘R"
echo "  4. Para submeter à App Store: Product → Archive"
echo ""
echo "📖 Guia completo: docs/ios-deployment.md"
