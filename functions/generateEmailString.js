import { currentDomain } from "../const"

export default function generateEmailstring(title,recipient,message,paragraphs, links, code) {

    let body = ''
    let buttons = ''

    paragraphs.forEach( para => {
        body = body.concat('<br />', `<p style='font-size: 16px;color:#424242'>${para}</p>`)
    })

    links.forEach (link => {
      buttons = buttons.concat('  ',`<a href="${link[0]}" style="display: inline-block; padding: 5px 10px; height: 20px; background-color: #476D94; color: white; border-radius: 20px; text-decoration: none; text-align: center; text-transform: uppercase;">${link[1]} →</a>`)
    })


    return `
    <div style='background-color:#476D94; padding: 12px; display: flex; width: 750px;'>
      <div style='margin:auto;background-color:white; width:100%; padding:24px'>
        <div style='display:flex'>
          <img style='margin: 0 auto;' src='https://firebasestorage.googleapis.com/v0/b/fruitiionfinal-dev.appspot.com/o/emailMedia%2FfruitiionLogoBlackTxt.png?alt=media&token=66f27927-eb39-4632-8cfc-20a44e62a64c' style='width:194px;height:44px;'>
        </div>
        <div style='display:flex'>
          <h3 style='font-size: 24px;color:#424242'>${title}</h3>
          <a style='font-size: 16px; color:#424242; margin:auto 24px auto auto;'href='${currentDomain}/'>Login</a>
        </div>
        <br />
        <p style='font-size: 16px;color:#424242'>Hello ${recipient},</p>
        ${body}
        <br />
        ${message != "" ?
          `<p style='font-size: 16px;color:#424242'>More details are below.</p><p style='font-size: 16px;color:#424242'>${message}</p><br />`:
          ""
        }
        ${code != "" ?
        `<h3 style='font-size: 24px;color:#424242'>${code}</h3>`:
        ""
        }
        ${links != "" ?
          buttons:
          ""
        }
        <p style='font-size: 16px;color:#424242'>- The Fruitiion team.</p>
        <img src='https://firebasestorage.googleapis.com/v0/b/fruitiionfinal-dev.appspot.com/o/emailMedia%2FfruitiionLogoBlackTxt.png?alt=media&token=66f27927-eb39-4632-8cfc-20a44e62a64c' style='width:194px;height:44px;'>
        <br />
        <br />
        <footer style='
          background-color: #f5f5f5f5;
          padding: 24px 24px;
          text-align: center;
          color: #bdbdbd;
          font-size: small;
        '>
          <p>Fruitiion, Inc (&quot;Fruitiion&quot;) operates a website at Fruitiion.com and certain mobile apps (the &quot;Platform&quot;). By using the Platform, you accept our <a href='https://www.fruitiion.com/terms-of-service'>Terms of Service</a> and <a href='https://www.fruitiion.com/privacy-policy'>Privacy Policy.</a> Past performance is no guarantee of future results. Any historical returns, expected returns, or probability projections may not reflect actual future performance. All securities involve risk and may result in partial or total loss. While the data we use from third parties is believed to be reliable, we cannot ensure the accuracy or completeness of data provided by investors or other third parties. Neither Fruitiion nor any of its affiliates provide tax advice and do not represent in any manner that the outcomes described herein will result in any particular tax consequence. Prospective investors should confer with their personal tax advisors regarding the tax consequences based on their particular circumstances. Neither Fruitiion nor any of its affiliates assume responsibility for the tax consequences for any investor of any investment. <a href='https://www.fruitiion.com/general-disclosure'>Full Disclosure.</a></p>
          <p>The publicly filed offering circulars of the issuers sponsored by Fruitiion Inc., not all of which may be currently qualified by the Securities and Exchange Commission, may be found at <a href='https://www.fruitiion.com/privacy-policy'>fruitiion.com/privacy-policy.</a> For investors and potential investors who are residents of the State of California, please send all correspondence, including any questions or comments, to info@Fruitiion.com.</p>
          <p>All trademarks of Fruitiion Corp. Proudly designed and coded in San Diego, CA.</p>
          <p>©2023 Fruitiion, Inc. All rights reserved.</p>
        </footer>
        </div>
    </div>
    `
}