# ამბავი · მოსაწვევის ატვირთვა Vercel-ზე → ბმული კლიენტისთვის (მაგ. https://ana-luka.vercel.app)
#   powershell -File ატვირთვა-vercel.ps1 -folder liquid-gold -name ana-luka
#   -folder = მოსაწვევის საქაღალდე აქ (მაგ. liquid-gold);  -name = ბმულის სახელი: პატარა ლათინური ასოები, ციფრები და ტირე
# პირველად Vercel შესვლას მოგთხოვს (ბრაუზერში იხსნება) — ეს ერთხელ.
param([Parameter(Mandatory = $true)][string]$folder, [Parameter(Mandatory = $true)][string]$name)
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $here $folder
if (-not (Test-Path (Join-Path $src "index.html"))) { Write-Output "ვერ ვიპოვე: $src\index.html"; exit 1 }
if ($name -notmatch '^[a-z0-9][a-z0-9-]{1,60}$') { Write-Output "სახელი მხოლოდ პატარა ლათინური ასოებით, ციფრებით და ტირეთი (მაგ. ana-luka)"; exit 1 }
$dst = Join-Path $env:TEMP "ambavi-deploy\$name"
if (Test-Path $dst) { Remove-Item $dst -Recurse -Force }
New-Item -ItemType Directory -Force $dst | Out-Null
Copy-Item (Join-Path $src "*") $dst -Recurse -Force
Set-Location $dst
& "C:\Program Files\nodejs\npx.cmd" --yes vercel@latest deploy --prod --yes
Write-Output ""
Write-Output "ბმული კლიენტისთვის: https://$name.vercel.app  (თუ სახელი დაკავებულია, Vercel ზემოთ სხვა ბმულს დაწერს)"
