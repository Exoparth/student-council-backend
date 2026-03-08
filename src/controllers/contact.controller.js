const ContactMessage = require("../models/contact.model");

async function sendMessage(req, res) {
  try {
    const { name, email, message } = req.body;

    const newMessage = await ContactMessage.create({
      name,
      email,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send message",
    });
  }
}

async function getAllMessages(req, res) {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
}

module.exports = {
  sendMessage,
  getAllMessages,
};