const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

async function getPageLoadTime(driver) {
  // Capture the time when the page is fully loaded
  const startTime = Date.now();
  await driver.wait(until.elementLocated(By.css('h1')), 5000); // Wait for an element to confirm page is loaded
  const endTime = Date.now();
  return endTime - startTime; // Return the total time taken for page load
}

async function testUI() {
  // Setup the ChromeDriver
  let options = new chrome.Options();
  options.addArguments('--disable-gpu'); // Disable GPU hardware acceleration

  // Initialize WebDriver
  let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    // Open the React-based UI
    await driver.get('http://localhost:3000');

    // Initial Page Load Time
    let loadTime = await getPageLoadTime(driver);
    console.log(`Initial Page Load Time: ${loadTime} ms`);

    // Test: Process Tab
    const processStart = Date.now();
    await driver.findElement(By.xpath("//button[text()='Process']")).click();
    await driver.sleep(3000); // Add wait between actions
    await driver.findElement(By.xpath("//input[@placeholder='Enter folder path']")).sendKeys('/Users/anandreddy/Desktop/PerfEngg/MedTech_AI/DiagnosisImages', Key.RETURN);
    await driver.sleep(3000); // Add wait after input
    await driver.wait(until.elementLocated(By.xpath("//button[text()='Process Folder']")), 5000);
    await driver.findElement(By.xpath("//button[text()='Process Folder']")).click();
    const processEnd = Date.now();
    console.log(`Process Tab Execution Time: ${processEnd - processStart} ms`);

    // Test: Analytics Tab
    const analyticsStart = Date.now();
    await driver.findElement(By.xpath("//button[text()='Analytics']")).click();
    await driver.sleep(3000); // Add wait between clicks
    const analyticsEnd = Date.now();
    console.log(`Analytics Tab Execution Time: ${analyticsEnd - analyticsStart} ms`);

    // Test: Metadata Tab
    const metadataStart = Date.now();
    await driver.findElement(By.xpath("//button[text()='Metadata']")).click();
    await driver.sleep(3000); // Add wait between clicks
    await driver.findElement(By.xpath("//input[@placeholder='Enter path to fetch metadata']")).sendKeys('/Users/anandreddy/Desktop/PerfEngg/MedTech_AI/DiagnosisImages', Key.RETURN);
    await driver.sleep(3000); // Add wait after input
    await driver.findElement(By.xpath("//input[@value='basic']")).click();
    await driver.sleep(3000); // Add wait after selecting Basic Metadata
    await driver.findElement(By.xpath("//button[text()='Find Metadata']")).click();
    console.log("Clicked 'Find Metadata' for Basic Metadata");
    await driver.sleep(5000); // Wait for metadata loading

    // Now click Advanced Metadata and wait
    await driver.findElement(By.xpath("//input[@value='advanced']")).click();
    await driver.sleep(3000); // Add wait after selecting Advanced Metadata
    await driver.findElement(By.xpath("//button[text()='Find Metadata']")).click();
    console.log("Clicked 'Find Metadata' for Advanced Metadata");
    await driver.sleep(5000); // Wait for metadata loading

    // Add a delay to give the browser time to process before navigating to Analytics tab
    console.log("Waiting before navigating to Analytics Tab...");
    await driver.sleep(3000); // Adjust delay here as per requirement

    const metadataEnd = Date.now();
    console.log(`Metadata Tab Execution Time: ${metadataEnd - metadataStart} ms`);

    // Test: Delete Tab
    const deleteStart = Date.now();
    await driver.findElement(By.xpath("//button[text()='Delete']")).click();
    await driver.sleep(3000); // Wait between clicks
    await driver.findElement(By.xpath("//input[@placeholder='Enter path to delete metadata']")).sendKeys('/Users/anandreddy/Desktop/PerfEngg/MedTech_AI/DiagnosisImages', Key.RETURN);
    await driver.sleep(3000); // Wait after input
    await driver.wait(until.elementLocated(By.xpath("//button[text()='Delete Metadata']")), 5000);
    await driver.findElement(By.xpath("//button[text()='Delete Metadata']")).click();
    console.log("Clicked 'Delete Metadata'");
    await driver.sleep(5000); // Wait for deletion to complete
    const deleteEnd = Date.now();
    console.log(`Delete Tab Execution Time: ${deleteEnd - deleteStart} ms`);

  } finally {
    // Close the browser after the test
    await driver.quit();
  }
}

testUI();
