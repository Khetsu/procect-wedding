# ამბავი · პრემიუმ დიზაინები — 6 ვიდეო (33 წმ + ბოლო ბარათი, თითოს თავისი მელოდია aria.js-დან)
param([string]$only = "")
$t = Split-Path -Parent $MyInvocation.MyCommand.Path; Set-Location $t
$out = "C:\Users\User\Desktop\Procect wedding\პრემიუმ-დიზაინები\ვიდეოები"
$node = "C:\Program Files\nodejs\node.exe"
function CS { Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like "*rk-prof*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }; Start-Sleep 2 }
function CG { Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--headless=new","--remote-debugging-port=9333","--user-data-dir=$env:TEMP\rk-prof","--use-angle=d3d11","--enable-gpu","--ignore-gpu-blocklist","about:blank"; Start-Sleep 4 }
$end = "&sub=%E1%83%9E%E1%83%A0%E1%83%94%E1%83%9B%E1%83%98%E1%83%A3%E1%83%9B%203D%20%E1%83%9B%E1%83%9D%E1%83%A1%E1%83%90%E1%83%AC%E1%83%95%E1%83%94%E1%83%95%E1%83%94%E1%83%91%E1%83%98"
$jobs = @(
  @("liquid-gold", "1-თხევადი-ოქრო.mp4", "bg1=%231A120A&bg2=%23050302&ink=%23FBF3E2&acc=%23E7C68A", "velvet"),
  @("aurora", "2-ჩრდილოეთის-ციალი.mp4", "bg1=%230A2233&bg2=%2302060E&ink=%23F2F6FF&acc=%238FF0CE", "borealis"),
  @("galaxy", "3-გალაქტიკა.mp4", "bg1=%23201450&bg2=%2304030A&ink=%23FFF6E8&acc=%23E3C6FF", "stardust"),
  @("fireworks", "4-ფეიერვერკი.mp4", "bg1=%232A0F4A&bg2=%2306041A&ink=%23FFFFFF&acc=%23FFD35A", "celebration"),
  @("silk", "5-აბრეშუმი.mp4", "bg1=%23F4E6DC&bg2=%23E4C4B8&ink=%233E2A20&acc=%23A8786A", "satin"),
  @("vitrage", "6-ვიტრაჟი.mp4", "bg1=%23241812&bg2=%23070605&ink=%23F3EEE4&acc=%23E8C27A", "cathedral")
)
foreach ($j in $jobs) {
  if ($only -and $j[0] -ne $only) { continue }
  CS; CG; & $node rec.mjs "http://localhost:5515/$($j[0])/?auto&rec" "frames\pv-$($j[0])" 33 7.6 | Select-Object -Last 1
  CS; CG; & $node mp4.mjs "frames/pv-$($j[0])" 990 "frames\pv-$($j[0]).mp4" "$($j[2])$end&song=$($j[3])&aria&adelay=1.75" | Select-Object -Last 1
  Copy-Item "frames\pv-$($j[0]).mp4" (Join-Path $out $j[1]) -Force; Write-Output "DONE $($j[1])"
}
CS; Write-Output "ALL DONE"
