const lighthouse = require('lighthouse').default;
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
  });

  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  console.log('🚀 Running Lighthouse audit on homepage...');
  
  try {
    // Audit homepage
    const runnerResult = await lighthouse('http://localhost:3000', options);
    
    if (!runnerResult) {
      throw new Error('Lighthouse audit failed');
    }

    // Extract scores
    const { lhr } = runnerResult;
    const scores = lhr.categories;

    console.log('\n📊 Lighthouse Scores:');
    console.log(`Performance: ${Math.round(scores.performance.score * 100)}/100`);
    console.log(`Accessibility: ${Math.round(scores.accessibility.score * 100)}/100`);
    console.log(`Best Practices: ${Math.round(scores['best-practices'].score * 100)}/100`);
    console.log(`SEO: ${Math.round(scores.seo.score * 100)}/100`);

    // Core Web Vitals
    console.log('\n⚡ Core Web Vitals:');
    const metrics = lhr.audits;
    
    if (metrics['largest-contentful-paint']) {
      console.log(`LCP: ${metrics['largest-contentful-paint'].displayValue}`);
    }
    if (metrics['cumulative-layout-shift']) {
      console.log(`CLS: ${metrics['cumulative-layout-shift'].displayValue}`);
    }
    if (metrics['total-blocking-time']) {
      console.log(`TBT: ${metrics['total-blocking-time'].displayValue}`);
    }
    if (metrics['first-contentful-paint']) {
      console.log(`FCP: ${metrics['first-contentful-paint'].displayValue}`);
    }

    // Save HTML report
    const reportsDir = path.join(__dirname, '../lighthouse-reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(reportsDir, `lighthouse-report-${timestamp}.html`);
    fs.writeFileSync(reportPath, runnerResult.report);
    
    console.log(`\n📄 Full HTML report saved to: ${reportPath}`);

    // Performance opportunities
    console.log('\n🔍 Top Performance Opportunities:');
    const opportunities = Object.entries(lhr.audits)
      .filter(([key, audit]) => 
        audit.scoreDisplayMode === 'numeric' && 
        audit.score !== null && 
        audit.score < 0.9 &&
        audit.details?.overallSavingsMs > 100
      )
      .sort(([, a], [, b]) => (b.details?.overallSavingsMs || 0) - (a.details?.overallSavingsMs || 0))
      .slice(0, 5);

    opportunities.forEach(([key, audit]) => {
      console.log(`- ${audit.title}: ${audit.displayValue || 'Needs attention'}`);
      if (audit.details?.overallSavingsMs) {
        console.log(`  Potential savings: ${audit.details.overallSavingsMs}ms`);
      }
    });

    if (opportunities.length === 0) {
      console.log('✅ No major performance opportunities found!');
    }

  } catch (error) {
    console.error('❌ Error running Lighthouse:', error);
  } finally {
    await chrome.kill();
  }
}

// Run the audit
runLighthouse().catch(console.error);