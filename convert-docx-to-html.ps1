# LibreOffice DOC/DOCX to HTML Converter Script
# This script loops through DOC and DOCX files and converts them to HTML

param(
    [string]$InputDir = "D:\rfxcel_backup\Trial\25 Nos. of SOPs",
    [string]$OutputDir = "D:\rfxcel_backup\Trial\output",
    [string]$LibreOfficePath = "C:\Program Files\LibreOffice\program\soffice.com",
    [string]$ProfilePath = "file:///C:/lo-profile"
)

# Create output directory if it doesn't exist
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    Write-Host "Created output directory: $OutputDir" -ForegroundColor Green
}

# Get all DOC and DOCX files from input directory
$docFiles = Get-ChildItem -Path $InputDir -File | Where-Object { $_.Extension -match '\.(doc|docx)$' }

if ($docFiles.Count -eq 0) {
    Write-Host "No DOC or DOCX files found in $InputDir" -ForegroundColor Yellow
    exit
}

Write-Host "Found $($docFiles.Count) file(s) to convert" -ForegroundColor Cyan
Write-Host ""

# Loop through each DOC/DOCX file
foreach ($file in $docFiles) {
    $inputFile = $file.FullName
    $fileName = $file.BaseName
    
    Write-Host "Converting: $($file.Name)..." -ForegroundColor Yellow
    
    # Run LibreOffice conversion
    & $LibreOfficePath --headless -env:UserInstallation=$ProfilePath --convert-to "html:XHTML Writer File:UTF8" "$inputFile" --outdir "$OutputDir"
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -eq 0) {
        Write-Host "  [OK] Successfully converted: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "  [FAILED] Failed to convert: $($file.Name) (Exit Code: $exitCode)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Conversion complete! Output files are in: $OutputDir" -ForegroundColor Cyan
