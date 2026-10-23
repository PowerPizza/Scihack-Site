import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv("../.env")

def send_email_verification_code(to_, code_):
    html_msg = MIMEMultipart('alternative')
    html_msg["Subject"] = "Verification Code"
    html_msg["To"] = to_
    html_msg["From"] = "Sci hack"

    plain_text = "Verification code mail"  # JUST TO PREVENT GOING GMAIL INTO SPAM (WORKS SOMETIME)
    html_msg.attach((MIMEText(plain_text, "plain")))

    html_ = """\
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Email</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #1f1f1f;
                color: #ffffff;
            }
            .email-container {
                min-width: 250px;
                max-width: 600px;
                margin: 0 auto;
                background-color: #2c3e50;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            }
            .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 2px solid #34495e;
            }
            .header h1 {
                color: #3498db;
                font-size: 28px;
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .verification-code {
                font-size: 40px;
                font-weight: bold;
                color: #2ecc71;
                letter-spacing: 2px;
                margin-top: 20px;
            }
            .instructions {
                margin-top: 20px;
                font-size: 18px;
                color: #ecf0f1;
            }
            .emoji {
                font-size: 24px;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #95a5a6;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #34495e;
            }
            .footer a {
                color: #3498db;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>🔐 Verify Your Email Address</h1>
            </div>
            <div class="content">
                <p style="color: white;">Hey there, <span class="emoji">👋</span></p>
                <p style="color: white;">Please use the verification code below:</p>
                <p class="verification-code">^784001^</p>
                <p class="instructions">Enter the code in the verification field to verify your email address. 🚀</p>
            </div>
            <div class="footer">
                <p>If you didn't request this, no worries—just ignore this email! 😊</p>
                <!-- <p>Need help? <a href="#">Contact Support</a></p> -->
            </div>
        </div>
    </body>
    </html>
    """.replace("^784001^", str(code_))
    html_msg.attach(MIMEText(html_, "html"))

    smtp = smtplib.SMTP("smtp.gmail.com", 587)
    smtp.starttls()
    smtp.login(os.getenv("SENDER_GMAIL"), os.getenv("GMAIL_PASS_KEY"))
    smtp.sendmail(os.getenv("SENDER_GMAIL"), to_, html_msg.as_string())
    smtp.quit()

def send_contact_mail(date_of_submission, cli_name, cli_email, cli_age, cli_ph_no, cli_msg):
    html_msg = MIMEMultipart('alternative')
    html_msg["Subject"] = "Client's Contact Application"
    html_msg["To"] = os.getenv("SENDER_GMAIL")
    html_msg["From"] = "Sci hack"
    html_ = """\
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Client Contact Application</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #1a1a1a;
                color: #ddd;
                margin: 0;
                padding: 0;
            }
            .email-container {
                min-width: 250px;
                max-width: 600px;
                margin: 20px auto;
                background-color: #2c2c2c;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header h1 {
                color: #ff9800;
                font-size: 28px;
                margin: 0;
                font-weight: 600;
            }
            .info-section {
                background-color: #333;
                padding: 20px;
                border-radius: 6px;
                margin-bottom: 20px;
                border: 1px solid #444;
            }
            .info-section h2 {
                font-size: 22px;
                color: #ff9800;
                margin-bottom: 15px;
            }
            .info-section p {
                font-size: 16px;
                color: #ddd;
                line-height: 1.6;
            }
            .info-section p span {
                font-weight: bold;
                color: #ff9800;
            }
            .footer {
                text-align: center;
                font-size: 14px;
                color: #bbb;
                margin-top: 20px;
            }
            .footer a {
                color: #ff9800;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Client Contact Application</h1>
            </div>
    
            <div class="info-section">
                <h2>Client Details:</h2>
                <p><span>Date of Submission:</span> ^date_of_submission^</p>
                <p><span>Name:</span> ^client_name^</p>
                <p><span>Email:</span> ^client_email^</p>
                <p><span>Age:</span> ^client_age^</p>
                <p><span>Phone Number:</span> ^client_phone_number^</p>
                <p><span>Message:</span> ^client_message^</p>
            </div>
    
            <div class="footer">
                <p>If you have any questions, feel free to <a href="mailto:scihack.official@gmail.com">contact us</a>.</p>
            </div>
        </div>
    </body>
    </html>
    """.replace("^date_of_submission^", date_of_submission).replace("^client_name^", cli_name).replace("^client_email^", cli_email).replace("^client_age^", cli_age).replace("^client_phone_number^", cli_ph_no).replace("^client_message^", cli_msg)
    html_msg.attach(MIMEText(html_, "html"))

    smtp = smtplib.SMTP("smtp.gmail.com", 587)
    smtp.starttls()
    smtp.login(os.getenv("SENDER_GMAIL"), os.getenv("GMAIL_PASS_KEY"))
    smtp.sendmail(os.getenv("SENDER_GMAIL"), os.getenv("SENDER_GMAIL"), html_msg.as_string())
    smtp.quit()

def send_hire_mail(cli_name, cli_email, date_of_submission, cli_project_details):
    html_msg = MIMEMultipart('alternative')
    html_msg["Subject"] = "Hiring Application"
    html_msg["To"] = os.getenv("SENDER_GMAIL")
    html_msg["From"] = "Sci hack"
    html_ = """\
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Hire Me Application</title>
        <style>
          body {
            margin: 0;
            padding: 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0f1115;
            color: #e0e0e0;
          }
    
          .container {
            min-width: 250px;
            max-width: 600px;
            margin: auto;
            background-color: #1a1d23;
            padding: 14px;
            border-radius: 12px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
          }
    
          .heading {
            text-align: center;
            color: cyan;
            padding-bottom: 20px;
          }
    
          .label {
            font-weight: 600;
            color: cyan;
            margin-top: 12px;
            display: block;
            font-size: 1.2rem;
          }
    
          .value {
            color: #f1f1f1;
            font-size: 16px;
            margin-top: 4px;
          }
    
          .project-details {
            background-color: #2a2e37;
            padding: 14px;
            border-radius: 8px;
            margin-top: 6px;
            color: #dddddd;
            white-space: pre-line;
          }
    
          .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            padding-top: 30px;
          }
    
          .emoji {
            font-style: normal;
            font-size: 18px;
            margin-right: 6px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="heading">🚀 New Hiring Application</h2>
          <span class="label"><span class="emoji"></span>Date of submission:</span>
          <div class="value">^date_of_submission^</div>
          
          <span class="label"><span class="emoji"></span>Name:</span>
          <div class="value">^cli_name^</div>
    
          <span class="label"><span class="emoji"></span>Email:</span>
          <div class="value">^cli_email^</div>
    
          <span class="label"><span class="emoji"></span>Project Details:</span>
          <div class="project-details">^cli_project_details^</div>
    
          <div class="footer">
            This email was automatically generated from your portfolio site's hire me page.
          </div>
        </div>
      </body>
    </html>
    """.replace("^cli_name^", cli_name).replace("^cli_email^", cli_email).replace("^date_of_submission^", date_of_submission).replace("^cli_project_details^", cli_project_details)
    html_msg.attach(MIMEText(html_, "html"))
    smtp = smtplib.SMTP("smtp.gmail.com", 587)
    smtp.starttls()
    smtp.login(os.getenv("SENDER_GMAIL"), os.getenv("GMAIL_PASS_KEY"))
    smtp.sendmail(os.getenv("SENDER_GMAIL"), os.getenv("SENDER_GMAIL"), html_msg.as_string())
    smtp.quit()


def send_birthday_mail(cli_name, to_):
    html_msg = MIMEMultipart('alternative')
    html_msg["Subject"] = "Happy Birthday"
    html_msg["To"] = os.getenv("SENDER_GMAIL")
    html_msg["From"] = "Sci hack"
    html_ = """\
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #001414;
          color: #ffffff;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .party_emoji{
          display: flex;
        }
        .party_emoji .right{
          margin-left: auto;
          rotate: -90deg;
        }
        .container {
          max-width: 600px;
          margin: auto;
          margin-top: 20px;
          background-color: #000d0e;
          padding: 10px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 217, 255, 0.1);
        }
        h1 {
          color: cyan;
          font-size: 32px;
          text-align: center;
          margin-bottom: 20px;
        }
        p {
          font-size: 18px;
          line-height: 1.6;
          color: #dddddd;
          text-align: center;
        }
        .highlight {
          color: cyan;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 14px;
          color: #aaaaaa;
        }
        .btn {
          display: inline-block;
          margin-top: 25px;
          padding: 12px 24px;
          border: 3px solid cyan;
          color: cyan !important;
          text-decoration: none;
          font-weight: bold;
          border-radius: 5px;
          font-size: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="party_emoji">
          <h1 class="left">🎉</h1>
          <h1 class="right">🎉</h1>
        </div>
        <h1>Happy Birthday!</h1>
        <p>
          Dear <span class="highlight">^cli_name^</span>,
        </p>
        <p>
          Wishing you a day filled with joy, laughter, and all the things you love most.
          May this year bring you closer to your dreams and happiness.
        </p>
        <p>
          You're not just getting older, you're becoming wiser, stronger, and even more awesome!
        </p>
        <p>
          🎂 Enjoy your special day to the fullest! 🎂
        </p>
        <div style="text-align: center;">
          <a href="https://scihack-official.onrender.com/login" class="btn">🎁 Claim Your Surprise Gift</a>
        </div>
        <div class="footer">
          Visit our site with your account logged in for an exclusive birthday experience and your gift!
        </div>
      </div>
    </body>
    </html>
    """.replace("^cli_name^", cli_name)
    html_msg.attach(MIMEText(html_, "html"))
    smtp = smtplib.SMTP("smtp.gmail.com", 587)
    smtp.starttls()
    smtp.login(os.getenv("SENDER_GMAIL"), os.getenv("GMAIL_PASS_KEY"))
    smtp.sendmail(os.getenv("SENDER_GMAIL"), to_, html_msg.as_string())
    smtp.quit()

if __name__ == '__main__':
    # send_email_verification_code("goatbale@gmail.com", 849394)
    # send_hire_mail("mememe", "aaa@gmail.com", "20-12-2020", "THIS IS A NEW PROJECT.")
    send_birthday_mail("GoatBale", "test-1j9c4b9fn@srv1.mail-tester.com")