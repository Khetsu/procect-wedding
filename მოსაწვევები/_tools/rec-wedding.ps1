# ამბავი · ქორწილის კოლექცია — 5 ვიდეო (33 წმ + ბოლო ბარათი, თითოს თავისი მელოდია)
param([string]$only = "")
$t = Split-Path -Parent $MyInvocation.MyCommand.Path; Set-Location $t
$out = "C:\Users\User\Desktop\Procect wedding\ქორწილის-კოლექცია\ვიდეოები"
$node = "C:\Program Files\nodejs\node.exe"
function CS { Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like "*rk-prof*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }; Start-Sleep 2 }
function CG { Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--headless=new","--remote-debugging-port=9333","--user-data-dir=$env:TEMP\rk-prof","--use-angle=d3d11","--enable-gpu","--ignore-gpu-blocklist","about:blank"; Start-Sleep 4 }
$L1 = [uri]::EscapeDataString("ქორწილის კოლექცია"); $L2 = [uri]::EscapeDataString("დახვეწილი 3D მოსაწვევები"); $CTA = [uri]::EscapeDataString("შეუკვეთეთ თქვენი მოსაწვევი ✨")
$jobs = @(
  @("champagne", "1-შამპანურის-კოშკი.mp4", "bg1=%233A2616&bg2=%230E0805&ink=%23FBF4E8&acc=%23E8CB8A", "gala"),
  @("chapel", "2-სანთლების-ტაძარი.mp4", "bg1=%232C2016&bg2=%230A0705&ink=%23FBF3E6&acc=%23E2C48C", "adagio"),
  @("rings", "3-ბეჭდები.mp4", "bg1=%236E5A48&bg2=%232A2019&ink=%23FFF8EE&acc=%23F0D3A0", "celesta"),
  @("veil", "4-ფატა.mp4", "bg1=%238C735C&bg2=%233A2E24&ink=%23FFF9F2&acc=%23F3D6C2", "ballad"),
  @("cake", "5-საქორწილო-ტორტი.mp4", "bg1=%233E2B1E&bg2=%23100B08&ink=%23FFF7EC&acc=%23EBCB8E", "serenade")
)
foreach ($j in $jobs) {
  if ($only -and $j[0] -ne $only) { continue }
  CS; CG; & $node rec.mjs "http://localhost:5514/$($j[0])/?auto&rec" "frames\w-$($j[0])" 33 7.2 | Select-Object -Last 1
  CS; CG; & $node mp4.mjs "frames/w-$($j[0])" 990 "frames\w-$($j[0]).mp4" "$($j[2])&song=$($j[3])&adelay=1.5&l1=$L1&l2=$L2&cta=$CTA" | Select-Object -Last 1
  Copy-Item "frames\w-$($j[0]).mp4" (Join-Path $out $j[1]) -Force; Write-Output "DONE $($j[1])"
}
CS; Write-Output "ALL DONE"
