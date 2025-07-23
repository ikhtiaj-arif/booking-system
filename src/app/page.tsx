import BookingTabs from "@/components/BookingTabs";

export default async function Home() {

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Resource Booking System
        </h1>
        <p className="text-lg text-gray-600">
          Book shared resources with automatic conflict detection and buffer time management
        </p>
      </div>
      <BookingTabs />
    </div>
  );
}
