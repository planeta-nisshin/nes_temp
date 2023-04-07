export default function handler(req: any, res: any) {
    let response = null;

    if (req.method === 'POST') {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_APIKEY);
        const msg = {
            to: req.body.email,
            bcc: 'hisano@planeta.co.jp',
            from: 'hisano@planeta.co.jp',
            subject: 'お問合せありがとうございました。',
            text: `${req.body.name} 様\nお問合せを受け付けました。回答をお待ちください。\n\n【件名】${req.body.subject}\n${req.body.message}`
        };
        const msg2 = {
            to: 'hisano@planeta.co.jp',
            bcc: '',
            from: 'hisano@planeta.co.jp',
            subject: 'お問合せがありました',
            text: `${req.body.name} 様\nお問合せを受け付けました。回答をお待ちください。\n\n【件名】${req.body.subject}\n${req.body.message}`
        };
        (async () => {
            try {
                response = await sgMail.send(msg);
                response = await sgMail.send(msg2);
            } catch (error: any) {
                console.error(error);
                if (error.response) {
                    console.error(error.response.body)
                }
            }
        })();
    }
    res.status(200);
    res.send(response);
}