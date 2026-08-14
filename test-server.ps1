cd D:\Projects\Kalculator
$server = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\Projects\Kalculator; pnpm exec tsx test-vite.ts" -PassThru
Start-Sleep -Seconds 5
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:3002/" -UseBasicParsing
    Write-Host "Response: $($response.StatusCode)"
    Write-Host "Content: $($response.Content.Substring(0, 200))"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
Stop-Process -Id $server.Id -Force