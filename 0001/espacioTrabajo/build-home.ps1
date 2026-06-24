$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$sectionsDir = Join-Path $root 'secciones'
$output = Join-Path $root 'home.html'
$encoding = [System.Text.Encoding]::UTF8

function Read-Section($name) {
  $path = Join-Path $sectionsDir $name
  if (-not (Test-Path $path)) { throw "No existe la seccion requerida: $name" }
  return [System.IO.File]::ReadAllText($path, $encoding).Trim()
}

$sectionFiles = @(
  '01-lanzamiento.html',
  '02-senales.html',
  '03-paradigma.html',
  '04-capacidades.html',
  '05-libro.html',
  '06-adaptabilidad-imagenes.html',
  '07-presentaciones.html',
  '08-autor.html',
  '09-elogios.html',
  '10-comunidad.html'
)

$parts = New-Object System.Collections.Generic.List[string]
$parts.Add((Read-Section '00-header.html'))
$parts.Add('<main id="inicio">')
foreach ($sectionFile in $sectionFiles) {
  $parts.Add('')
  $parts.Add('  ' + ((Read-Section $sectionFile) -replace "`r?`n", "`n  "))
}
$parts.Add('')
$parts.Add('</main>')
$parts.Add('')
$parts.Add((Read-Section '11-footer.html'))
$parts.Add('')
$parts.Add((Read-Section '99-hero-canvas-script.html'))

[System.IO.File]::WriteAllText($output, (($parts -join "`n") + "`n"), $encoding)
Write-Host "home.html regenerado desde secciones/."
