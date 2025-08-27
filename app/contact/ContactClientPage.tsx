"use client"

import { logContactSubmission } from "@/utils/cookie-utils"

const ContactClientPage = () => {
  const handleSubmit = (formData) => {
    // Simulate form submission
    console.log("Form submitted:", formData)

    // Log contact form submission
    logContactSubmission("contact", {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
    })
  }

  return (
    <div>
      <h1>Contact Us</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = {
            name: e.target.name.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
            message: e.target.message.value,
          }
          handleSubmit(formData)
        }}
      >
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="tel" name="phone" placeholder="Phone" required />
        <textarea name="message" placeholder="Message" required />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default ContactClientPage
