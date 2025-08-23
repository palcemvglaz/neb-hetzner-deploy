import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text?: string
}

export const sendEmail = async (template: EmailTemplate) => {
  if (!process.env.EMAIL_USER) {
    console.log('Email service not configured - would send:', template.subject)
    return { success: true, message: 'Email service disabled' }
  }

  try {
    const info = await transporter.sendMail({
      from: `"Nebachiv Academy" <${process.env.EMAIL_USER}>`,
      to: template.to,
      subject: template.subject,
      html: template.html,
      text: template.text
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const templates = {
  courseCompleted: (userName: string, courseTitle: string) => ({
    subject: `🎉 Вітаємо! Ви завершили курс "${courseTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Вітаємо, ${userName}!</h1>
        <p>Ви успішно завершили курс <strong>"${courseTitle}"</strong> в Nebachiv Academy!</p>
        <p>Це важливий крок у вашому шляху до безпечної їзди на мотоциклі.</p>
        <p>Продовжуйте навчання та залишайтеся в безпеці на дорозі!</p>
        <hr style="margin: 20px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          З повагою,<br>
          Команда Nebachiv Academy
        </p>
      </div>
    `,
    text: `Вітаємо, ${userName}! Ви успішно завершили курс "${courseTitle}" в Nebachiv Academy!`
  }),

  certificateEarned: (userName: string, courseTitle: string, certificateUrl: string) => ({
    subject: `📜 Ваш сертифікат готовий - "${courseTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #059669;">Сертифікат отримано!</h1>
        <p>Вітаємо, ${userName}!</p>
        <p>Ваш сертифікат про завершення курсу <strong>"${courseTitle}"</strong> готовий.</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${certificateUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Завантажити сертифікат
          </a>
        </p>
        <p>Поділіться своїм досягненням з друзями та колегами!</p>
      </div>
    `,
    text: `Вітаємо, ${userName}! Ваш сертифікат готовий: ${certificateUrl}`
  })
}