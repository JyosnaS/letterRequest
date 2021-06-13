const express = require("express")
const route = express.Router()
const tempService = require("./template.service")
const pdf = require("html-pdf-node")
const fs = require("fs")
const nodemailer = require("nodemailer")
const RequestModel = require("../schemas/request.model")


const emailConfig = process.env.EMAIL_CONFIG? JSON.parse(process.env.EMAIL_CONFIG):{};
const transporter = nodemailer.createTransport(emailConfig);


const processT = (email, fullname, type) => {
    const content = tempService(type, { fullname });
    const option = {
        format: "A4",
        margin: {
            top: 50,
            right: 50,
            left: 50,
            buttom: 50
        }
    };

    const file = { content }
    const filePath= `${__dirname}/temp/sample_${Date.now().toString(32)}.pdf`
    pdf.generatePdf(file, option).then(result => {
        fs.writeFileSync(filePath, result)
    })

    // send mail with defined transport object
    transporter.sendMail({
        from: process.env.EMAIL_FROM || "sanmeranam@outlook.com",
        to: email, 
        subject: "Response for letter request",
        text: `Hello ${fullname}, Please find the attached pdf document`,
        attachments: [{
            filename: `${type}_document.pdf`,
            path: filePath,
            contentType: "application/pdf"
        }]
    }).then((r)=> {
        console.log("sent", r)
        fs.unlinkSync(filePath)

        new RequestModel(
            {
                fullname,
                email,
                type,
                requestedDate: new Date(),
                status: true
            }
        ).save()

    }).catch(err => console.error(err));


    console.log("htmlGen ", content)
}



route.post("/request", (req, res) => {
    console.log(req.body)
    const { email, fullname, type } = req.body
    if (!email || !fullname || !type) {
        return res.status(400).json({ ok: 0 })
    }
    processT(email, fullname, type);
    res.json({ ok: 1 })
})


module.exports = route;