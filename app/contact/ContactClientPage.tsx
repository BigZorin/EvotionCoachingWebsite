"use client"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"

const ContactClientPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const router = useRouter()

  const onSubmit = (data) => {
    // Handle form submission logic here
    console.log(data)
    router.push("/thank-you")
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.name && <p className="text-red-500 text-xs italic">Please enter your name</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.email && <p className="text-red-500 text-xs italic">Please enter a valid email</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-700 font-bold mb-2">
            Message
          </label>
          <textarea
            id="message"
            {...register("message", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
          />
          {errors.message && <p className="text-red-500 text-xs italic">Please enter your message</p>}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="w-full bg-evotion-primary hover:bg-[#2d2654] text-white py-3 text-lg font-semibold transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContactClientPage
