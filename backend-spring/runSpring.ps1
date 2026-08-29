Write-Host "Setting up portable Maven..."
$tempZip = Join-Path $env:TEMP "maven.zip"
$extractPath = Join-Path $env:TEMP "maven-extracted"

if (-not (Test-Path $extractPath)) {
    New-Item -ItemType Directory -Path $extractPath -Force | Out-Null
    Write-Host "Downloading Maven binary zip (approx 9MB)..."
    Invoke-WebRequest -Uri "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip" -OutFile $tempZip
    Write-Host "Extracting Maven..."
    Expand-Archive -Path $tempZip -DestinationPath $extractPath
}

$mvnCmd = Join-Path $extractPath "apache-maven-3.9.6\bin\mvn.cmd"
Write-Host "Maven setup complete: $mvnCmd"
Write-Host "Compiling and launching OutLawed Spring Boot Application..."
& $mvnCmd spring-boot:run
