import { Selector } from "testcafe";
import { webPath } from "../testConfig";
import { HomePage } from "../models/homePage";
import { SubmitPage } from "../models/submitPage";
import { AboutPage } from "../models/aboutPage";
import { ResultPage } from "../models/resultPage";
import { JobsPage } from "../models/jobsPage";

fixture(`Home Page Tests`)
    .page(`http://${webPath}`);

//used in part to wait till server is launched
test('Page Loads', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    await t.expect(await Selector("body").visible).eql(true);
}).timeouts({
    pageLoadTimeout:    60000*5,
    pageRequestTimeout: 60000*5,
    ajaxRequestTimeout: 60000*5,
});

test('Can Navigate to Submit page', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const submitPage = new SubmitPage();
    await homePage.onPage();
    await t
        .click(homePage.submitJobBtn)
        .expect(submitPage.identifyer.visible).ok();
});

test('Can Navigate to documentation page', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    await homePage.onPage();
    await t.expect(homePage.documentationLink.visible).ok();
})

test('Can Navigate to Oluwadare Lab page', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    await homePage.onPage();
    await t.expect(homePage.olabLink.visible).ok();
});

test('Can Navigate to about page', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const aboutPage = new AboutPage();
    const homePage = new HomePage();
    await homePage.onPage();
    await t.click(Selector("a").withText("About"));
    await aboutPage.onPage();
});

test('Can Navigate to Documentation page', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    await homePage.onPage();
    await t.expect(Selector("a").withText("Documentation")).ok();
});

test('Can Navigate to GitHub page', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    await homePage.onPage();
    await t.expect(Selector("a").withText("GitHub")).ok();
});

test('Can Navigate to Example page', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const resultPage = new ResultPage();
    await homePage.onPage();
    await t.click(Selector("a").withText("Example"));
    await resultPage.onPage();
});

test('Can use darkMode', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    await homePage.onPage();
    await t.expect(Selector("html").getAttribute("data-bs-theme")).eql("light")
    await t.click(homePage.darkModeToggle);
    await t.expect(Selector("html").getAttribute("data-bs-theme")).eql("dark")
    await t.click(homePage.darkModeToggle);
    await t.expect(Selector("html").getAttribute("data-bs-theme")).eql("light")
});


fixture(`Home->Results Page Tests`)
    .page(`http://${webPath}`);

test('Can view a job', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const resultPage = new ResultPage();
    await homePage.onPage();
    await t.navigateTo(`http://${webPath}results/1/`)
    await resultPage.onPage();
});

test('Can view a job 2', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const resultPage = new ResultPage();
    await homePage.onPage();
    await t.navigateTo(`http://${webPath}results/2/`)
    await resultPage.onPage();
});

test('Can view example', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const resultPage = new ResultPage();
    await homePage.onPage();
    await t.navigateTo(`http://${webPath}example/`)
    await resultPage.onPage();
});

test('Can submit job', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const submitPage = new SubmitPage();
    await homePage.onPage();
    await t
        .click(homePage.submitJobBtn)
        .expect(submitPage.identifyer.visible).ok();
    await submitPage.submitMockJob();
});

test('Can submit job 2', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const submitPage = new SubmitPage();
    await homePage.onPage();
    await t
        .click(homePage.submitJobBtn)
        .expect(submitPage.identifyer.visible).ok();
    await submitPage.submitMockJob();
});

test('Can submit job 3', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const submitPage = new SubmitPage();
    await homePage.onPage();
    await t
        .click(homePage.submitJobBtn)
        .expect(submitPage.identifyer.visible).ok();
    await submitPage.submitMockJob();
});

test('Can submit job 4', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const submitPage = new SubmitPage();
    await homePage.onPage();
    await t
        .click(homePage.submitJobBtn)
        .expect(submitPage.identifyer.visible).ok();
    await submitPage.submitMockJob();
});

test('Can submit job 5', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const submitPage = new SubmitPage();
    await homePage.onPage();
    await t
        .click(homePage.submitJobBtn)
        .expect(submitPage.identifyer.visible).ok();
    await submitPage.submitMockJob();
});

fixture(`Results Page Tests`)
    .page(`http://${webPath}`);

test('overlap tab', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const resultPage = new ResultPage();
    await homePage.onPage();
    await t.navigateTo(`http://${webPath}results/1/`)
    await resultPage.onPage();
});

test('regression tab', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const resultPage = new ResultPage();
    await homePage.onPage();
    await t.navigateTo(`http://${webPath}results/1/`)
    await resultPage.onPage();
});

test('protien tabs', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const resultPage = new ResultPage();
    await homePage.onPage();
    await t.navigateTo(`http://${webPath}results/1/`)
    await resultPage.onPage();
});

test('higlass tab', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const resultPage = new ResultPage();
    await homePage.onPage();
    await t.navigateTo(`http://${webPath}results/1/`)
    await resultPage.onPage();
});

test('ai assistant tab', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const resultPage = new ResultPage();
    await homePage.onPage();
    await t.navigateTo(`http://${webPath}results/1/`)
    await resultPage.onPage();
});

test('data tab', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const resultPage = new ResultPage();
    await homePage.onPage();
    await t.navigateTo(`http://${webPath}results/1/`)
    await resultPage.onPage();
});

fixture(`Job Page Tests`)
    .page(`http://${webPath}`);

test('jobs page loads', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const jobPage = new JobsPage();
    await homePage.onPage();
    await t.navigateTo(`http://${webPath}jobs/`)
    await jobPage.onPage();
});

test('jobs page loads and displays jobs', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const jobPage = new JobsPage();
    await homePage.onPage();
    await t.navigateTo(`http://${webPath}jobs/`);
    await jobPage.onPage();
    await jobPage.expectAtleastOneJob()
});

test('jobs page loads and can click on job', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const jobPage = new JobsPage();
    await homePage.onPage();
    await t.navigateTo(`http://${webPath}jobs/`);
    await jobPage.onPage();
    await jobPage.expectAtleastOneJob()
    await t.click(jobPage.jobDisplay.nth(0).find(jobPage.adminBtnsCss));
});

test('jobs page loads and can use admin menu', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const jobPage = new JobsPage();
    await homePage.onPage();
    await t.navigateTo(`http://${webPath}jobs/`);
    await jobPage.onPage();
    await jobPage.expectAtleastOneJob()
    await t.click(jobPage.jobDisplay.nth(0).find(jobPage.adminBtnsCss));
    await t.expect(await jobPage.rerunBtns.count).gt(0, "check atleast 1 admin menu button exists");
});


test('jobs page loads and can use forceView btn', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const jobPage = new JobsPage();
    await homePage.onPage();
    await t.navigateTo(`http://${webPath}jobs/`);
    await jobPage.onPage();
    await jobPage.expectAtleastOneJob()
    await t.click(jobPage.jobDisplay.nth(0).find(jobPage.adminBtnsCss));
    await t.expect(await jobPage.forceViewBtns.count).gt(0, "check atleast 1 admin menu button exists");
    await t.click(jobPage.forceViewBtns.nth(0))
    await jobPage.onPage(false);
});
