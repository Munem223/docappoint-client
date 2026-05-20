const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <h2 className="text-4xl font-semibold mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-4">Sorry, the page you're looking for doesn't exist.</p>
        <a href="/" className="mt-8 inline-block bg-blue-600 text-white px-8 py-4 rounded-3xl font-medium">
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;