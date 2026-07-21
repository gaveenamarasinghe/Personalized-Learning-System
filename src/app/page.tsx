import GoogleSignInButton from "../components/GoogleSignInButton";
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-5">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full">

        <h1 className="text-4xl text-center mb-3">
          🎓
        </h1>

        <h2 className="text-3xl font-bold text-center">
          AI Learning Platform
        </h2>

        <p className="text-center mt-2 text-gray-500">
          Welcome!
        </p>

        <p className="text-center text-gray-400 mb-8">
          Create your account in seconds.
        </p>

       <GoogleSignInButton />

        <div className="mt-8 text-center">
          <span className="text-gray-500">
            Already have an account?
          </span>

          <a
            href="/login"
            className="text-blue-600 ml-2 font-semibold"
          >
            Sign In
          </a>
        </div>

        <p className="text-xs text-gray-400 text-center mt-8">
          By continuing, you agree to our
          <br />
          Terms & Privacy Policy.
        </p>

      </div>
    </main>
  );
}