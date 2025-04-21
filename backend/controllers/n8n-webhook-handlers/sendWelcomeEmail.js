// sendWelcomeEmail.js
import axios from "axios";

export const sendWelcomeEmail = async (req, res) => {
  try {

    const user = req.userRecord;

    // Your shared secret key
    const SECRET_KEY = process.env.N8N_WEBHOOK_SECRET;

    // Call the n8n webhook
    await axios.post(`${process.env.N8N_WEBHOOK_URL}/send-welcome-email`, { user } , {
      headers: {
        'x-n8n-secret': SECRET_KEY
      }
    });

    res.status(200).json({ message: 'Welcome email triggered.' });
  } catch (error) {
    res.status(401).json({ error: error.message});
  }
};
