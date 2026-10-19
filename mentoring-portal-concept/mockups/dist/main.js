"use strict";
/**
 * Entry point: dispatches to the right page initializer based on
 * <body data-page="..."> and renders the shared header/footer slots
 * that every page includes.
 */
var MentorApp;
(function (MentorApp) {
    const initializers = {
        home: MentorApp.initHome,
        search: MentorApp.initSearch,
        "tutor-profile": MentorApp.initTutorProfile,
        booking: MentorApp.initBooking,
        checkout: MentorApp.initCheckout,
        "booking-confirmation": MentorApp.initBookingConfirmation,
        dashboard: MentorApp.initDashboard,
        billing: MentorApp.initBilling,
        messages: MentorApp.initMessages,
        "lesson-room": MentorApp.initLessonRoom,
        review: MentorApp.initReview,
        "become-tutor": MentorApp.initBecomeTutor,
        "become-tutor-apply": MentorApp.initTutorApply,
        "become-tutor-submitted": MentorApp.initApplicationSubmitted,
        "tutor-dashboard": MentorApp.initTutorDashboard,
        "tutor-calendar": MentorApp.initTutorCalendar,
        "tutor-bookings": MentorApp.initTutorBookings,
        "tutor-earnings": MentorApp.initTutorEarnings,
        "tutor-reviews": MentorApp.initTutorReviews,
        admin: MentorApp.initAdmin,
        settings: MentorApp.initSettings,
        notifications: MentorApp.initNotifications,
    };
    function boot() {
        const page = document.body.dataset.page || "";
        const headerSlot = document.getElementById("headerSlot");
        if (headerSlot) {
            headerSlot.innerHTML = MentorApp.renderHeader(page);
            MentorApp.wireHeader();
        }
        const footerSlot = document.getElementById("footerSlot");
        if (footerSlot)
            footerSlot.innerHTML = MentorApp.renderFooter();
        const run = initializers[page];
        if (run)
            run();
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    }
    else {
        boot();
    }
})(MentorApp || (MentorApp = {}));
