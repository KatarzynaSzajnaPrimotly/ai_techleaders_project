/**
 * Entry point: dispatches to the right page initializer based on
 * <body data-page="..."> and renders the shared header/footer slots
 * that every page includes.
 */
namespace MentorApp {
  const initializers: Record<string, () => void> = {
    home: initHome,
    search: initSearch,
    "tutor-profile": initTutorProfile,
    booking: initBooking,
    checkout: initCheckout,
    "booking-confirmation": initBookingConfirmation,
    dashboard: initDashboard,
    billing: initBilling,
    messages: initMessages,
    "lesson-room": initLessonRoom,
    review: initReview,
    "become-tutor": initBecomeTutor,
    "become-tutor-apply": initTutorApply,
    "become-tutor-submitted": initApplicationSubmitted,
    "tutor-dashboard": initTutorDashboard,
    "tutor-calendar": initTutorCalendar,
    "tutor-bookings": initTutorBookings,
    "tutor-earnings": initTutorEarnings,
    "tutor-reviews": initTutorReviews,
    admin: initAdmin,
    settings: initSettings,
    notifications: initNotifications,
  };

  function boot(): void {
    const page = document.body.dataset.page || "";
    const headerSlot = document.getElementById("headerSlot");
    if (headerSlot) {
      headerSlot.innerHTML = renderHeader(page);
      wireHeader();
    }
    const footerSlot = document.getElementById("footerSlot");
    if (footerSlot) footerSlot.innerHTML = renderFooter();

    const run = initializers[page];
    if (run) run();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
}
