import resend
import os

# You should set this in your environment variables
# For now, I'll use a placeholder. Please replace with your actual API key.
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "re_123456789")
resend.api_key = RESEND_API_KEY

def send_signup_notification(to_email: str, name: str):
    try:
        resend.Emails.send({
            "from": "CycleAI <onboarding@resend.dev>",
            "to": to_email,
            "subject": "Welcome to CycleAI! 🌸",
            "html": f"""
                <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #f66f9e;">Welcome to CycleAI, {name}!</h2>
                    <p>Thank you for joining our platform for proactive menstrual health intelligence.</p>
                    <p>You can now start tracking your cycles, symptoms, and health metrics to receive AI-powered insights.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 0.9rem; color: #777;">If you have any questions, feel free to reply to this email.</p>
                </div>
            """
        })
        return True
    except Exception as e:
        print(f"Error sending signup email: {e}")
        return False

def send_risk_alert(to_email: str, name: str, risk_level: str):
    try:
        resend.Emails.send({
            "from": "CycleAI Alerts <alerts@resend.dev>",
            "to": to_email,
            "subject": "Health Alert: New Risk Assessment from CycleAI",
            "html": f"""
                <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #f66f9e;">Health Update for {name}</h2>
                    <p>Our AI engine has analyzed your recent symptoms and health logs.</p>
                    <div style="background: #fff5f8; padding: 15px; border-radius: 8px; border-left: 4px solid #f66f9e; margin: 20px 0;">
                        <strong>Current Risk Level: {risk_level}</strong>
                    </div>
                    <p>We recommend reviewing your monthly report and discussing these trends with your healthcare provider.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 0.9rem; color: #777;">Stay proactive, stay healthy.</p>
                </div>
            """
        })
        return True
    except Exception as e:
        print(f"Error sending risk alert email: {e}")
        return False
