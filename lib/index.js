const chalk = require("chalk")
const qs = require('query-string')
const humanizeUrl = require("humanize-url")
const { forIn, sortBy } = require("lodash")
const terminalLink = require("terminal-link")
const { get } = require("./request")
const { divider, outputObject, transToPercent } = require("./utils")

const apiPath = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'

const defaultOptions = {
    strategy: "mobile",
    key: null
}


const unusedAudits = ["unused-javascript", "unused-css-rules"];
const reportsAudits = ["first-meaningful-paint", "total-blocking-time", "first-contentful-paint", "interactive"];
const sourceAudits = ["dom-size", "large-javascript-libraries", "uses-optimized-images", "legacy-javascript", "uses-webp-images", "unminified-javascript",]

module.exports = ookk;

process.on('uncaughtException', function (err) {
    console.log(err.stack);
    console.log('NOT exit...');
});

// 获取测试的数据
async function ookk(url, options = {}) {

    const opts = Object.assign({}, defaultOptions, options)
    const linkQuery = {
        url,
        strategy: opts.strategy
    }
    const link = `${apiPath}?${qs.stringify({ ...linkQuery, url })}`
    const query = `http://207.148.94.100:8081/redirect?link=${encodeURIComponent(link)}`
    const { data } = await get(query, {
        header: {
            "Cache-Control": "no-cache, no-store, must-revalidate"
        }
    })
    const { lighthouseResult } = data;

    let res = '';

    res += setDefaultTitle(data, url)
    console.log(divider)
    res += setEnvironment(lighthouseResult)
    console.log(divider)


    console.log(res)
    setCustomAudit(lighthouseResult, 'Source Audits', sourceAudits)
    console.log(divider)
    setCustomAudit(lighthouseResult, 'Reports Audits', reportsAudits)
    console.log(divider)
    setCustomAudit(lighthouseResult, 'Unused Audits', unusedAudits)
    console.log(divider)

}

// 解析测试获取的数据
function setTitle(title) {
    return '\n' + chalk.green(title) + '\n'
}

function setEnvironment(lighthouseResult) {
    let str = '';

    str += setTitle('Environment');

    const { environment } = lighthouseResult;
    const { hostUserAgent, networkUserAgent } = environment;

    const outputData = outputObject({
        hostUserAgent,
        networkUserAgent
    })

    forIn(outputData, (o, k) => {
        str += `${k}: ${o}\n`
    })

    return str
}


function setDefaultTitle(response, link) {
    const { lighthouseResult, id } = response
    const { lighthouseVersion, categories: { performance: { score } } } = lighthouseResult;
    let str = '';
    str += setTitle("Summary")


    str += `Total Score : ${transToPercent(score)}\n`
    str += `Visit Link : ${terminalLink(humanizeUrl(id), link)}\n`;
    str += `Lighthouse Version : ${lighthouseVersion}\n`;
    return str
}

function condition(value) {
    if (!value.score) {
        return 0
    }
    return value.score
}

function setCustomAudit(lighthouseResult, title, processingAudits) {
    const { audits } = lighthouseResult;

    let str = '';

    str += setTitle(title);

    console.log(str)

    const maps = processingAudits.map(sourceAudit => {
        return {
            score: transToPercent(audits[sourceAudit].score),
            name: sourceAudit,
            displayValue: audits[sourceAudit].displayValue
        }
    })
    console.table(sortBy(maps, condition))
}

// 输出测试获取的数据