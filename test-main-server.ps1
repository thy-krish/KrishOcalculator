cd D:\Projects\Kalculator
$server = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\Projects\Kalculator; `$env:NODE_ENV='development'; pnpm exec tsx server/_core/index.ts" -PassThru
Start-Sleep -Seconds 8
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:3000/" -UseBasicParsing
    Write-Host "Response: $($response.StatusCode)"
    Write-Host "Content length: $($response.Content.Length)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
Stop-Process -Id $server.Id -Force