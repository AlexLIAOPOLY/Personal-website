const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // 确保环境变量加载

// 启动时检查环境变量
console.log('环境变量检查 - EMAIL_PASSWORD存在:', !!process.env.EMAIL_PASSWORD);

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// 邮件发送路由
app.post('/send-email', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // 表单验证
    if (!name || !email || !message) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Please fill all required fields' 
      });
    }
    
    // 设置邮件主题
    const emailSubject = subject || '新消息来自个人网站';
    
    // 创建邮件内容
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ddd;
                  border-radius: 5px;
              }
              h2 {
                  color: #0366d6;
              }
              .message-info {
                  margin-bottom: 20px;
                  padding-bottom: 20px;
                  border-bottom: 1px solid #eee;
              }
              .footer {
                  margin-top: 30px;
                  font-size: 12px;
                  color: #777;
              }
          </style>
      </head>
      <body>
          <div class='container'>
              <h2>新消息来自个人网站</h2>
              <div class='message-info'>
                  <p><strong>姓名:</strong> ${name}</p>
                  <p><strong>邮箱:</strong> ${email}</p>
                  <p><strong>主题:</strong> ${emailSubject}</p>
              </div>
              <div class='message-content'>
                  <p><strong>消息内容:</strong></p>
                  <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
              <div class='footer'>
                  <p>此邮件自动发送自您的个人网站联系表单。</p>
              </div>
          </div>
      </body>
      </html>
    `;
    
    // 配置邮件传输
    const transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 465,
      secure: true,
      auth: {
        user: '2997725873@qq.com', // 您的QQ邮箱
        pass: process.env.EMAIL_PASSWORD // 从环境变量获取密码
      },
      debug: true, // 开启调试模式以查看详细错误信息
      tls: {
        // 不验证服务器证书
        rejectUnauthorized: false
      }
    });
    
    // 发送邮件配置
    const mailOptions = {
      from: `"网站访客" <2997725873@qq.com>`,
      to: '2997725873@qq.com',
      replyTo: email,
      subject: emailSubject,
      html: htmlContent
    };
    
    // 发送邮件
    try {
      console.log('尝试发送邮件...');
      const info = await transporter.sendMail(mailOptions);
      console.log('邮件发送成功:', info.response);
    } catch (emailError) {
      console.error('邮件发送详细错误:', emailError);
      throw emailError;
    }
    
    // 返回成功响应
    res.json({ status: 'success', message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to send message. Please try again later.' 
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 