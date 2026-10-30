# ამბავი · გრანდიოზული კონტენტი — ყველა მონტაჟის ვიდეო და ქავერი (specs\jobs.json)
param([string]$only = "")
$t = Split-Path -Parent $MyInvocation.MyCommand.Path; Set-Location $t
$root = "C:\Users\User\Desktop\Procect wedding\გრანდიოზული-კონტენტი"
$node = "C:\Program Files\nodejs\node.exe"
function CS { Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like "*rk-prof*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }; Start-Sleep 2 }
function CG { Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--headless=new","--remote-debugging-port=9333","--user-data-dir=$env:TEMP\rk-prof","about:blank"; Start-Sleep 4 }
$jobs = Get-Content "specs\jobs.json" -Raw -Encoding UTF8 | ConvertFrom-Json
foreach ($j in $jobs) {
  if ($only -and $j.id -notlike "$only*") { continue }
  $dir = Join-Path $root $j.folder; New-Item -ItemType Directory -Force $dir | Out-Null
  $mp4 = Join-Path $dir $j.file; $png = Join-Path $dir ("ქავერი-" + [IO.Path]::GetFileNameWithoutExtension($j.file) + ".png")
  CS; CG; & $node montage.mjs "specs/$($j.id).json" $mp4 $png | Select-Object -Last 1
  Write-Output "DONE $($j.folder)\$($j.file)"
}
CS; Write-Output "ALL DONE"
