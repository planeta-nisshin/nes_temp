import React, { ChangeEvent, useEffect, useState } from 'react'
import Router from 'next/router'
import styles from '../styles/contact.module.scss'
import axios from "axios"

type Zipcode = {
    main: string
    sub: string
}

const formid = [
    { num: 0, idname: "formname" },
    { num: 1, idname: "formemail" },
    { num: 2, idname: "formmessage" },
]

const ContactForm = () => {
    const [formname, setFormname] = useState("")
    const [formemail, setFormemail] = useState("")
    const [formmessage, setFormmessage] = useState("")
    const [formsuccess, setFormsuccess] = useState(false)
    const [formerror, setFormerror] = useState(false)
    const onErrorCheck = () => {
        if (!formname) {
            alert("名前を入れてください")
        }
        if (!formemail) {
            alert("メールアドレスを入れてください")
        }
        if (formemail) {
            if (!formemail.match(/.+@.+\..+/)) {
                alert("正しいメールアドレスを入れてください")
            }
        }
        if (!formmessage) {
            alert("本文を入れてください")
        }
        Router.push(`#formid`)
        setFormerror(true)
    }
    const onformCheck = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (formname || formemail || formmessage) {
            setFormsuccess(true)
        }
        Router.push(`#formid`)
    }
    const onformCheckout = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setFormsuccess(false)
    }
    const onformreset = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setFormname("")
        setFormemail("")
        setFormmessage("")
        setFormerror(false)
    }
    const sendForm = async (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault()
        const res = await fetch('/api/send', {
            body: JSON.stringify({
                name: formname,
                email: formemail,
                message: formmessage,
                subject: "お問い合わせいただきました"
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })
        if (res.ok) {
            alert("送信完了しました")
        }
        if (res.ok) Router.push('/thank-you')
    }
    const [zipcode, setZipcodeMain] = useState<Zipcode>({
        main: "",
        sub: ""
    })
    const [address, setAddress] = useState("")
    const updateZipcodeSub = async (e: ChangeEvent<HTMLInputElement>) => {
        setZipcodeMain({ ...zipcode, sub: e.target.value })
        if (e.target.value.length === 7) {
            try {
                const res = await axios.get(
                    "https://zipcloud.ibsnet.co.jp/api/search",
                    {
                        params: {
                            zipcode: e.target.value
                        }
                    }
                )
                if (res.data.results) {
                    const result = res.data.results[0]
                    console.log(result)
                    setAddress(`${result.address1}${result.address2}${result.address3}`)
                }
            } catch {
                alert("住所の取得に失敗しました。")
            }
        }
    }
    return (
        <form className={`${formsuccess ? `${styles.checknow}` : ""}`} id="formid">
            <input
                type="text"
                name="name"
                value={formname}
                id={formid[0].idname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormname(e.target.value)
                }}
            />
            <span className={`${styles.musttext}`}>{formerror ? <>{!formname ? <>名前を記入してください</> : <></>}</> : <></>}</span>
            <input
                type="text"
                name="email"
                id={formid[1].idname}
                value={formemail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormemail(e.target.value)
                }}
            />
            <span className={`${styles.musttext}`}>{formerror ? <>{!formemail ? <>アドレスを記入してください</> : <>{!formemail.match(/.+@.+\..+/) ? <>正しいフォーマットで入れてください</> : <></>}</>}</> : <></>}</span>
            <h2>郵便番号から住所の住所の自動入力</h2>
            <div>
                <span>郵便番号：</span>
                <input type="text" name="addcode" onChange={updateZipcodeSub} value={zipcode.sub} />
            </div>
            <div>
                <input
                    type="text"
                    name="add"
                    value={address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAddress(e.target.value)
                    }}
                />
            </div>
            <textarea
                name="message"
                value={formmessage}
                id={formid[2].idname}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setFormmessage(e.target.value)
                }}
            ></textarea>
            <span className={`${styles.musttext}`}>{formerror ? <>{!formmessage ? <>内容を記入してください</> : <></>}</> : <></>}</span>
            {!formsuccess ? <>
                <button onClick={onformreset} disabled={formname == "" && formemail == "" && formmessage == ""}>リセット</button>
                <span className={`${styles.formcheck}`}>
                    {!formname || !formemail || !formmessage || !formemail.match(/.+@.+\..+/) ? <><div onClick={onErrorCheck} className={`${styles.formchecksub}`}></div></> : <></>}
                    <button onClick={onformCheck} disabled={!formname || !formemail || !formmessage || !formemail.match(/.+@.+\..+/)}>確認へ</button>
                </span>
            </> : <>
                <button onClick={onformCheckout} disabled={!formname || !formemail || !formmessage || !formemail.match(/.+@.+\..+/)}>戻る</button>
                <input type="submit" onClick={sendForm} />
            </>}
        </form>
    )
}

export default ContactForm