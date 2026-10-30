# =====================================================================
#  ამბავი · მოსაწვევების განახლება საიტზე
#
#  რას აკეთებს:  აქედან (მოსაწვევები\) ყველა მოსაწვევს აკოპირებს საიტში:
#                Desktop\ambavi-site\public\invitations\<მოსაწვევი>\
#  საერთო ფაილები (ძრავა და 3D) საიტზე ერთხელ ინახება: public\assets\core\ და public\assets\3d\
#  საიტის გვერდებს (src\pages\*.astro) და public\assets\site\-ს არ ეხება.
#
#  გაშვება:  მარჯვენა ღილაკი → „Run with PowerShell“   ან   .\build-site.ps1
# =====================================================================
param([string]$Out = (Join-Path ([Environment]::GetFolderPath("Desktop")) "ambavi-site\public"))   # Astro: სტატიკური ფაილები public\-შია
$ErrorActionPreference = "Stop"
$src = $PSScriptRoot
$enc = New-Object Text.UTF8Encoding($false)
$inv = Join-Path $Out "invitations"

# ფაილები, რომლებიც ყველა მოსაწვევში ერთნაირია → საიტზე ერთ ადგილას (assets\<core|3d>\...)
$shared = @{ "js\core.js" = "core"; "js\i18n.js" = "core"; "js\icons.js" = "core"; "js\fx.js" = "core"; "js\music.js" = "core"; "css\base.css" = "core";
             "js\stage3d.js" = "3d"; "js\emb3d.js" = "3d"; "js\theme.js" = "3d" }
# რაც საიტზე არ უნდა მოხვდეს (ვიდეოები, შიდა ჩანაწერები, სკრიპტები)
$skip = @("*.mp4", "*.txt", "*.ps1", "reel*.html", "*.log")

# 1. ძველის წაშლა: მხოლოდ ის, რასაც ეს სკრიპტი თავიდან აწყობს
if (Test-Path $inv){ Remove-Item -Recurse -Force $inv }
Get-ChildItem $Out -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '^(wedding|engagement|birthday|kids|christening)-' } | Remove-Item -Recurse -Force   # ძველი განლაგება (მოსაწვევები საიტის ძირში)
foreach ($d in "core", "3d"){ if (Test-Path "$Out\assets\$d"){ Remove-Item -Recurse -Force "$Out\assets\$d" } }
New-Item -ItemType Directory -Force $inv, "$Out\assets\core\js", "$Out\assets\core\css", "$Out\assets\3d\js" | Out-Null

# 2. საერთო ფაილები: ძრავა _core-დან, 3D მთავარი 3D დიზაინიდან
foreach ($f in "js\core.js", "js\i18n.js", "js\icons.js", "js\fx.js", "js\music.js", "css\base.css"){ Copy-Item "$src\_core\$f" "$Out\assets\core\$f" }
foreach ($f in "js\stage3d.js", "js\emb3d.js", "js\theme.js"){ Copy-Item "$src\wedding-natia-davit\$f" "$Out\assets\3d\$f" }
$hash = @{}; foreach ($k in $shared.Keys){ $hash[$k] = (Get-FileHash "$Out\assets\$($shared[$k])\$k").Hash }

# 3. ერთი მოსაწვევის კოპირება; ერთნაირი ფაილების ნაცვლად გვერდი საერთოზე მიუთითებს
function Copy-Invitation($from, $name){
  $to = Join-Path $inv $name
  Get-ChildItem -LiteralPath $from -Recurse -File | Where-Object { $n = $_.Name; -not ($skip | Where-Object { $n -like $_ }) } | ForEach-Object {
    $dst = Join-Path $to $_.FullName.Substring($from.Length + 1)
    New-Item -ItemType Directory -Force (Split-Path $dst) | Out-Null
    Copy-Item -LiteralPath $_.FullName $dst
  }
  $page = Join-Path $to "index.html"
  if (-not (Test-Path $page)){ return }
  $html = [IO.File]::ReadAllText($page)
  foreach ($k in $shared.Keys){
    $local = Join-Path $to $k
    if ((Test-Path $local) -and (Get-FileHash $local).Hash -eq $hash[$k]){        # მხოლოდ თუ ბაიტ-ბაიტ იგივეა
      $u = $k.Replace("\", "/")
      $html = $html.Replace('"' + $u + '"', '"../../assets/' + $shared[$k] + '/' + $u + '"')
      Remove-Item $local
    }
  }
  [IO.File]::WriteAllText($page, $html, $enc)
  Get-ChildItem $to -Recurse -Directory | Sort-Object FullName -Descending | Where-Object { -not (Get-ChildItem $_.FullName -Force) } | Remove-Item   # ცარიელი საქაღალდეები
}

# 4. ყველა მოსაწვევი (საქაღალდე ინგლისური სახელით და js\config.js-ით)
$names = @()
Get-ChildItem $src -Directory | Where-Object { $_.Name -match '^[a-z0-9-]+$' -and (Test-Path "$($_.FullName)\js\config.js") } | ForEach-Object {
  Copy-Invitation $_.FullName $_.Name; $names += $_.Name
}
# მაკა და ლევანი წყვილების საქაღალდეშია — საიტზე ინგლისური სახელით
$maka = Join-Path (Split-Path $src -Parent) "წყვილები\მაკა და ლევანი"
if (Test-Path -LiteralPath $maka){ Copy-Invitation $maka "wedding-maka-levan"; $names += "wedding-maka-levan" }

"განახლდა: $inv"
"მოსაწვევები: " + $names.Count
