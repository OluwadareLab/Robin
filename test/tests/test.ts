import { Selector } from "testcafe";
import { webPath } from "../testConfig";
import { HomePage } from "../models/homePage";
import { SubmitPage } from "../models/submitPage";
import { AboutPage } from "../models/aboutPage";
import { ResultPage } from "../models/resultPage";

fixture(`Start From Home`)
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

test('Can view a job', async t => {
    // Starts at http://devexpress.github.io/testcafe/example
    const homePage = new HomePage();
    const resultPage = new ResultPage();
    await homePage.onPage();
    await t.navigateTo(`http://${webPath}results/1/`)
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