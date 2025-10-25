# PowerShell Script to Disable SSR for All Pages
# Run this in the frontend directory: .\disable-ssr-all-pages.ps1

Write-Host "🚀 Disabling SSR for all pages in src/app..." -ForegroundColor Cyan

$pagesUpdated = 0
$pagesSkipped = 0

Get-ChildItem -Path "src\app" -Filter "page.tsx" -Recurse | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw
    
    # Skip if already has dynamic export
    if ($content -match 'export const dynamic') {
        Write-Host "⏭️  Skipping $($file.Name) (already configured)" -ForegroundColor Yellow
        $pagesSkipped++
        return
    }
    
    # Handle client components
    if ($content -match '"use client"') {
        $newContent = $content -replace '("use client")', "`$1`n`nexport const dynamic = 'force-dynamic'`nexport const fetchCache = 'force-no-store'`nexport const revalidate = 0"
        Set-Content $file.FullName $newContent -NoNewline
        Write-Host "✅ Updated $($file.FullName) (client component)" -ForegroundColor Green
        $pagesUpdated++
    }
    # Handle server components
    else {
        $newContent = "export const dynamic = 'force-dynamic'`nexport const fetchCache = 'force-no-store'`n`n" + $content
        Set-Content $file.FullName $newContent -NoNewline
        Write-Host "✅ Updated $($file.FullName) (server component)" -ForegroundColor Green
        $pagesUpdated++
    }
}

Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "   ✅ Pages updated: $pagesUpdated" -ForegroundColor Green
Write-Host "   ⏭️  Pages skipped: $pagesSkipped" -ForegroundColor Yellow
Write-Host "`n🎉 Done! Your Next.js dev server will now be much faster!" -ForegroundColor Cyan
Write-Host "💡 Restart your dev server (npm run dev) to see the changes." -ForegroundColor Yellow
