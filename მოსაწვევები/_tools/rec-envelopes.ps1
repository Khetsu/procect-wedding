# ამბავი · პრემიუმ კონვერტები — 5 ვიდეო (33 წმ + ბოლო ბარათი, თითოს თავისი მელოდია; სერვერი: node serve.mjs ../../პრემიუმ-კონვერტები 5516)
param([string]$only = "")
$t = Split-Path -Parent $MyInvocation.MyCommand.Path; Set-Location $t
$out = "C:\Users\User\Desktop\Procect wedding\პრემიუმ-კონვერტები\ვიდეოები"
$node = "C:\Program Files\nodejs\node.exe"
function CS { Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like "*rk-prof*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }; Start-Sleep 2 }
function CG { Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--headless=new","--remote-debugging-port=9333","--user-data-dir=$env:TEMP\rk-prof","--use-angle=d3d11","--enable-gpu","--ignore-gpu-blocklist","about:blank"; Start-Sleep 4 }
$aud = "&aria=http%3A%2F%2Flocalhost%3A5516%2F_core%2Faria.js&adelay=1.8"
$jobs = @(
  @("wax-seal", "1-ცვილის-ბეჭედი.mp4", "bg1=%232A1B10&bg2=%230C0805&ink=%23FBF3E6&acc=%23E9CC8E", "valse", 8.2),
  @("ribbon", "2-აბრეშუმის-ლენტი.mp4", "bg1=%23123F32&bg2=%23040A08&ink=%23F3EAD3&acc=%23D9B66C", "emerald", 7.6),
  @("bloom", "3-ყვავილის-კონვერტი.mp4", "bg1=%23FBF1EE&bg2=%23EBD3CE&ink=%235B3B40&acc=%23B9707C", "blossom", 7.6),
  @("stars", "4-ვარსკვლავების-წერილი.mp4", "bg1=%231C2C5E&bg2=%2304081A&ink=%23EEF1FA&acc=%23E5C987", "lullaby", 8.8),
  @("noir", "5-ოქროს-დანა.mp4", "bg1=%23221D17&bg2=%23050404&ink=%23F1E6CC&acc=%23D4AF62", "noir", 8.5)
)
$sub = "&sub=" + [uri]::EscapeDataString("პრემიუმ კონვერტები · 3D მოსაწვევები")
foreach ($j in $jobs) {
  if ($only -and $j[0] -ne $only) { continue }
  CS; CG; & $node rec.mjs "http://localhost:5516/$($j[0])/?auto&rec" "frames\ev-$($j[0])" 33 $j[4] | Select-Object -Last 1
  CS; CG; & $node mp4.mjs "frames/ev-$($j[0])" 990 "frames\ev-$($j[0]).mp4" "$($j[2])$sub&song=$($j[3])$aud" | Select-Object -Last 1
  Copy-Item "frames\ev-$($j[0]).mp4" (Join-Path $out $j[1]) -Force; Write-Output "DONE $($j[1])"
}
CS; Write-Output "ALL DONE"
