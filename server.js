const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // 确保环境变量加载

// 启动时检查环境变量
console.log('环境变量检查 - EMAIL_PASSWORD存在:', !!process.env.EMAIL_PASSWORD);
console.log('EMAIL_PASSWORD长度:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0);
console.log('当前工作目录:', process.cwd());

const app = express();
const PORT = process.env.PORT || 10000; // 修改默认端口为10000

// 中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// 邮件发送路由
app.post('/send-email', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    console.log('收到邮件请求:', { name, email, subject, messageLength: message?.length });
    
    // 表单验证
    if (!name || !email || !message) {
      console.log('表单数据不完整');
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
    
    // 验证邮箱密码是否存在
    if (!process.env.EMAIL_PASSWORD) {
      console.error('缺少邮箱密码环境变量!');
      return res.status(500).json({ 
        status: 'error', 
        message: 'Server configuration error: Missing email password' 
      });
    }

    // 配置邮件传输
    console.log('配置SMTP传输...');
    const transporter = nodemailer.createTransport({
      service: 'QQ', // 使用QQ邮箱服务而不是直接指定host
      secure: true, // 使用SSL
      auth: {
        user: '2997725873@qq.com', // 您的QQ邮箱
        pass: process.env.EMAIL_PASSWORD // 从环境变量获取密码(授权码)
      },
      debug: true, // 开启调试模式以查看详细错误信息
      logger: true, // 启用日志记录
      tls: {
        // 不验证服务器证书
        rejectUnauthorized: false
      }
    });

    // 验证传输器配置
    console.log('验证SMTP配置...');
    try {
      await transporter.verify();
      console.log('SMTP配置有效!');
    } catch (verifyError) {
      console.error('SMTP配置验证失败, 详细错误:', verifyError);
      if (verifyError.message && verifyError.message.includes('Invalid login')) {
        return res.status(500).json({ 
          status: 'error', 
          message: 'Server configuration error: Invalid email password or authorization code' 
        });
      }
      return res.status(500).json({ 
        status: 'error', 
        message: 'Server configuration error: Cannot connect to mail server',
        error: verifyError.message
      });
    }
    
    // 发送邮件配置
    console.log('准备发送邮件...');
    const mailOptions = {
      from: `"网站访客" <2997725873@qq.com>`,
      to: '2997725873@qq.com',
      replyTo: email,
      subject: emailSubject,
      html: htmlContent
    };
    
    // 发送邮件
    try {
      console.log('发送邮件...');
      const info = await transporter.sendMail(mailOptions);
      console.log('邮件发送成功:', info.response);
      console.log('消息ID:', info.messageId);
      
      // 返回成功响应
      res.json({ status: 'success', message: 'Message sent successfully!' });
    } catch (emailError) {
      console.error('邮件发送详细错误:', emailError);
      
      // 提供更详细的错误信息
      let errorMessage = 'Failed to send message. Please try again later.';
      if (emailError.code === 'EAUTH') {
        errorMessage = 'Authentication error: Please check email credentials.';
      } else if (emailError.code === 'ESOCKET') {
        errorMessage = 'Network error: Cannot reach mail server.';
      }
      
      res.status(500).json({ 
        status: 'error', 
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }
  } catch (error) {
    console.error('处理邮件请求时出错:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error while processing your request.',
      error: error.message
    });
  }
});

// 添加一个端点用于测试邮件发送功能
app.get('/test-email', async (req, res) => {
  try {
    if (!process.env.EMAIL_PASSWORD) {
      return res.json({ status: 'error', message: '未配置邮箱密码环境变量' });
    }
    
    res.json({
      status: 'info',
      message: '环境变量已设置，请使用联系表单发送测试邮件',
      passwordLength: process.env.EMAIL_PASSWORD.length
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '服务器内部错误',
      error: String(error)
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Server started at: ${new Date().toISOString()}`);
  console.log('Server is ready to handle requests');
}); 