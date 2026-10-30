# Ambavi: copies the shared engine (_core) into every invitation folder.
# Run after changing anything in _core:  right-click > Run with PowerShell
$root = $PSScriptRoot
$core = Join-Path $root "_core"
Get-ChildItem $root -Directory | Where-Object { $_.Name -ne "_core" -and (Test-Path (Join-Path $_.FullName "js\config.js")) } | ForEach-Object {
  $d = $_.FullName
  New-Item -ItemType Directory -Force (Join-Path $d "js"), (Join-Path $d "css"), (Join-Path $d "images\art") | Out-Null
  Copy-Item (Join-Path $core "js\*.js") (Join-Path $d "js") -Force
  Copy-Item (Join-Path $core "css\base.css") (Join-Path $d "css") -Force
  Get-ChildItem (Join-Path $core "images\art") -File | ForEach-Object {
    $target = Join-Path $d ("images\art\" + $_.Name)
    if (-not (Test-Path $target)) { Copy-Item $_.FullName $target }
  }
  Write-Output ("synced: " + $_.Name)
}
