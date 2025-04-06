import { NextResponse } from "next/server"

// 百度翻译 API 配置
const BAIDU_TRANSLATE_API = "http://api.fanyi.baidu.com/api/trans/vip/translate"
const BAIDU_APP_ID = process.env.BAIDU_APP_ID
const BAIDU_SECRET_KEY = process.env.BAIDU_SECRET_KEY

/**
 * 生成随机字符串
 */
function generateSalt() {
  return Math.random().toString(36).substring(2)
}

/**
 * 生成签名
 */
function generateSign(text: string, salt: string) {
  const str = `${BAIDU_APP_ID}${text}${salt}${BAIDU_SECRET_KEY}`
  return require("crypto").createHash("md5").update(str).digest("hex")
}

/**
 * 翻译 API
 */
export async function POST(request: Request) {
  try {
    // 如果没有配置百度翻译 API，返回模拟数据
    if (!BAIDU_APP_ID || !BAIDU_SECRET_KEY) {
      const { text, from } = await request.json()
      // 简单的模拟翻译
      const translatedText = from === "zh" 
        ? text.replace(/[\u4e00-\u9fa5]/g, "Test") 
        : "测试"
      return NextResponse.json({ translatedText })
    }

    const { text, from, to } = await request.json()
    const salt = generateSalt()
    const sign = generateSign(text, salt)

    const params = new URLSearchParams({
      q: text,
      from,
      to,
      appid: BAIDU_APP_ID,
      salt,
      sign,
    })

    const response = await fetch(`${BAIDU_TRANSLATE_API}?${params.toString()}`)
    const data = await response.json()

    if (data.error_code) {
      throw new Error(data.error_msg)
    }

    return NextResponse.json({
      translatedText: data.trans_result[0].dst,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "翻译失败" },
      { status: 500 }
    )
  }
} 