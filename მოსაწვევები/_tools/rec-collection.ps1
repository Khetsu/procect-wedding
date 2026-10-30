# ამბავი · ახალი კოლექცია 10/25 — 6 ვიდეო (33 წმ + ბოლო ბარათი, თითოს თავისი მელოდია)
param([string]$only = "", [string]$from = "")
$t = Split-Path -Parent $MyInvocation.MyCommand.Path; Set-Location $t
$out = "C:\Users\User\Desktop\Procect wedding\ახალი-კოლექცია-10-25\ვიდეოები"
$node = "C:\Program Files\nodejs\node.exe"
function CS { Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like "*rk-prof*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }; Start-Sleep 2 }
function CG { Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--headless=new","--remote-debugging-port=9333","--user-data-dir=$env:TEMP\rk-prof","--use-angle=d3d11","--enable-gpu","--ignore-gpu-blocklist","about:blank"; Start-Sleep 4 }
$jobs = @(
  @("moon-lake", "1-მთვარის-ტბა.mp4", "bg1=%231A1D52&bg2=%2305061A&ink=%23F4F1FA&acc=%23E9D3A0", "nocturne", 5.3),
  @("vineyard", "2-ვენახი.mp4", "bg1=%237A3B2A&bg2=%231E0F0B&ink=%23FFF6EA&acc=%23F3C680", "chonguri", 5.4),
  @("curtain", "3-ფარდა.mp4", "bg1=%233A0A12&bg2=%23060203&ink=%23FBF2E4&acc=%23E8C77E", "lounge", 5.3),
  @("cranes", "4-წეროები.mp4", "bg1=%23F7E7EF&bg2=%23E4ECF8&ink=%234A3F57&acc=%23C9839F", "harp", 5.3),
  @("bottle", "5-ბოთლი-ზღვაში.mp4", "bg1=%237C4486&bg2=%2314112E&ink=%23FFF5EC&acc=%23FFC38A", "island", 5.5),
  @("vinyl", "6-ვინილი.mp4", "bg1=%233A0E5C&bg2=%2307021A&ink=%23FFF2FF&acc=%23FF6CC8", "synthwave", 5.3),
  @("snow-globe", "7-თოვლის-გლობუსი.mp4", "bg1=%231E3A66&bg2=%23060E1E&ink=%23F3F7FF&acc=%23E6C47E", "snow", 5.5),
  @("flower-arch", "8-ყვავილების-თაღი.mp4", "bg1=%23F2EEE4&bg2=%23E6EFE2&ink=%2334402C&acc=%23B9707F", "garden", 5.3),
  @("balloons", "9-საჰაერო-ბუშტები.mp4", "bg1=%23F6D8C6&bg2=%23EADBEA&ink=%233E2E44&acc=%23C0644E", "boho", 5.4),
  @("planets", "10-პლანეტები.mp4", "bg1=%233A1C6E&bg2=%230B0A2E&ink=%23FFFFFF&acc=%23FFD36E", "chiptune", 5.7)
)
foreach ($j in $jobs) {
  if ($only -and $j[0] -ne $only) { continue }
  if ($from -and ($jobs.IndexOf($j) -lt ($jobs | ForEach-Object { $_[0] }).IndexOf($from))) { continue }
  CS; CG; & $node rec.mjs "http://localhost:5513/$($j[0])/?auto&rec" "frames\v-$($j[0])" 33 ($j[4] + 1.6) | Select-Object -Last 1
  CS; CG; & $node mp4.mjs "frames/v-$($j[0])" 990 "frames\v-$($j[0]).mp4" "$($j[2])&song=$($j[3])&adelay=1.5" | Select-Object -Last 1
  Copy-Item "frames\v-$($j[0]).mp4" (Join-Path $out $j[1]) -Force; Write-Output "DONE $($j[1])"
}
CS; Write-Output "ALL DONE"
