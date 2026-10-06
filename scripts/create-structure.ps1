# Creates the route and src folders inside mobile/ after the Expo app has been scaffolded.
# Run from the repo root:  ./scripts/create-structure.ps1
# Each empty folder gets a .gitkeep so Git tracks it.

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$mobile = Join-Path $root 'mobile'

if (-not (Test-Path (Join-Path $mobile 'src/app'))) {
    Write-Error "mobile/src/app not found. Scaffold the Expo app first (docs/LEAD_SETUP.md step 4)."
}

$folders = @(
    'src/app/(auth)',
    'src/app/(customer)',
    'src/app/(customer)/cook',
    'src/app/(customer)/dish',
    'src/app/(customer)/track',
    'src/app/(customer)/review',
    'src/app/(cook)',
    'src/app/(cook)/order',
    'src/app/(rider)',
    'src/app/(rider)/trip',
    'src/components',
    'src/constants',
    'src/context',
    'src/features/customer',
    'src/features/cook',
    'src/features/rider',
    'src/hooks',
    'src/services',
    'src/types',
    'src/utils',
    '__tests__'
)

foreach ($f in $folders) {
    $path = Join-Path $mobile $f
    New-Item -ItemType Directory -Force -Path $path | Out-Null
    $keep = Join-Path $path '.gitkeep'
    $hasFiles = Get-ChildItem -LiteralPath $path -Force | Where-Object { $_.Name -ne '.gitkeep' }
    if (-not $hasFiles -and -not (Test-Path -LiteralPath $keep)) {
        New-Item -ItemType File -Path $keep | Out-Null
    }
    Write-Host "ok  mobile/$f"
}

Write-Host "`nDone. Run 'git status' to review before committing."
