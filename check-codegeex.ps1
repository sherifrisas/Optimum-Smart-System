Write-Host "=== CodeGeeX Preflight Audit ===" -ForegroundColor Cyan

# Check VS Code version
$codeVersion = code --version 2>$null
if ($codeVersion) {
    Write-Host "VS Code version: $codeVersion" -ForegroundColor Green
} else {
    Write-Host "VS Code CLI not found in PATH" -ForegroundColor Red
}

# Check Python
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Python: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "Python not found in PATH" -ForegroundColor Red
}

# Check Node.js
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "Node.js not found in PATH" -ForegroundColor Yellow
}

# Check CodeGeeX extension
$extensions = code --list-extensions
if ($extensions -match "codegeex") {
    Write-Host "CodeGeeX extension installed" -ForegroundColor Green
} else {
    Write-Host "CodeGeeX extension NOT installed" -ForegroundColor Red
}

Write-Host "=== Audit Complete ==="
