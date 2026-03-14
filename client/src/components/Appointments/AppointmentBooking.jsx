import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import api from "../../services/api";
import "./AppointmentBooking.css";

const FALLBACK_DOCTORS = [
  {
    _id: "f1",
    name: "Dr. Rhea Sharma",
    specialty: "Cardiologist",
    experience: "14 Years",
    fees: "INR 1200",
    image: "https://i.pravatar.cc/300?img=47",
    availableTimes: ["09:30 AM", "11:00 AM", "02:00 PM", "05:00 PM"],
    city: "Bengaluru",
    hospital: "Manipal Hospital",
    languages: ["English", "Hindi", "Kannada"],
    consultationMode: ["Clinic", "Video"],
    rating: 4.8,
  },
  {
    _id: "f2",
    name: "Dr. Arjun Menon",
    specialty: "Neurologist",
    experience: "17 Years",
    fees: "INR 1500",
    image: "https://i.pravatar.cc/300?img=59",
    availableTimes: ["10:00 AM", "12:30 PM", "03:30 PM", "06:00 PM"],
    city: "Mumbai",
    hospital: "Kokilaben Hospital",
    languages: ["English", "Hindi", "Malayalam"],
    consultationMode: ["Clinic", "Video"],
    rating: 4.7,
  },
  {
    _id: "f3",
    name: "Dr. Neha Reddy",
    specialty: "Dermatologist",
    experience: "9 Years",
    fees: "INR 900",
    image: "https://i.pravatar.cc/300?img=45",
    availableTimes: ["09:00 AM", "11:30 AM", "01:30 PM", "04:30 PM"],
    city: "Hyderabad",
    hospital: "Apollo Hospitals",
    languages: ["English", "Hindi", "Telugu"],
    consultationMode: ["Clinic", "Video"],
    rating: 4.6,
  },
  {
    _id: "f4",
    name: "Dr. Aisha Khan",
    specialty: "Pediatrician",
    experience: "10 Years",
    fees: "INR 850",
    image: "https://i.pravatar.cc/300?img=44",
    availableTimes: ["09:30 AM", "11:00 AM", "02:30 PM", "05:30 PM"],
    city: "Delhi",
    hospital: "Max Hospital",
    languages: ["English", "Hindi", "Urdu"],
    consultationMode: ["Clinic", "Video"],
    rating: 4.8,
  },
  {
    _id: "f5",
    name: "Dr. Kavita Iyer",
    specialty: "General Physician",
    experience: "12 Years",
    fees: "INR 700",
    image: "https://i.pravatar.cc/300?img=32",
    availableTimes: ["08:30 AM", "10:30 AM", "01:00 PM", "07:00 PM"],
    city: "Chennai",
    hospital: "Fortis Malar",
    languages: ["English", "Tamil", "Hindi"],
    consultationMode: ["Clinic", "Video", "Home Visit"],
    rating: 4.7,
  },
  {
    _id: "f6",
    name: "Dr. Sandeep Kulkarni",
    specialty: "Orthopedic",
    experience: "11 Years",
    fees: "INR 1100",
    image: "https://i.pravatar.cc/300?img=13",
    availableTimes: ["09:00 AM", "12:00 PM", "04:00 PM", "06:30 PM"],
    city: "Pune",
    hospital: "Ruby Hall Clinic",
    languages: ["English", "Hindi", "Marathi"],
    consultationMode: ["Clinic", "Video"],
    rating: 4.5,
  },
  {
    _id: "f7",
    name: "Dr. Meera Banerjee",
    specialty: "Gynecologist",
    experience: "16 Years",
    fees: "INR 1400",
    image: "https://i.pravatar.cc/300?img=25",
    availableTimes: ["09:00 AM", "11:30 AM", "02:00 PM", "05:00 PM"],
    city: "Kolkata",
    hospital: "AMRI Hospital",
    languages: ["English", "Hindi", "Bengali"],
    consultationMode: ["Clinic", "Video"],
    rating: 4.9,
  },
  {
    _id: "f8",
    name: "Dr. Harpreet Singh",
    specialty: "Pulmonologist",
    experience: "15 Years",
    fees: "INR 1250",
    image: "https://i.pravatar.cc/300?img=68",
    availableTimes: ["08:30 AM", "10:30 AM", "01:30 PM", "04:30 PM"],
    city: "Chandigarh",
    hospital: "Fortis Mohali",
    languages: ["English", "Hindi", "Punjabi"],
    consultationMode: ["Clinic", "Video", "Home Visit"],
    rating: 4.6,
  },
];

const DEFAULT_TIMES = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"];
const STEP_LABELS = ["Discover", "Schedule", "Review", "Done"];

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

function readStatus(value) {
  const map = {
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return map[value] || "Confirmed";
}

export default function AppointmentBooking() {
  const [stage, setStage] = useState("discover");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [savingAppointment, setSavingAppointment] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");
  const [errorText, setErrorText] = useState("");

  const hasAuthToken = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const response = await api.get("/doctors", { timeout: 5000 });
        const payload = Array.isArray(response.data) ? response.data : [];
        setDoctors(payload.length ? payload : FALLBACK_DOCTORS);
      } catch {
        setDoctors(FALLBACK_DOCTORS);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!hasAuthToken) {
        setLoadingAppointments(false);
        return;
      }

      try {
        const response = await api.get("/appointments", { timeout: 5000 });
        const payload = Array.isArray(response.data) ? response.data : [];
        setAppointments(payload);
      } catch {
        setAppointments([]);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [hasAuthToken]);

  const cityOptions = useMemo(() => {
    const cities = doctors.map((doctor) => doctor.city).filter(Boolean);
    return ["All", ...Array.from(new Set(cities)).sort()];
  }, [doctors]);

  const specialtyOptions = useMemo(() => {
    const specialties = doctors.map((doctor) => doctor.specialty).filter(Boolean);
    return ["All", ...Array.from(new Set(specialties)).sort()];
  }, [doctors]);

  const modeOptions = useMemo(() => {
    const allModes = doctors.flatMap((doctor) => doctor.consultationMode || []);
    return ["All", ...Array.from(new Set(allModes)).sort()];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSearch =
        !normalizedSearch ||
        doctor.name?.toLowerCase().includes(normalizedSearch) ||
        doctor.specialty?.toLowerCase().includes(normalizedSearch) ||
        doctor.hospital?.toLowerCase().includes(normalizedSearch);

      const matchesCity = cityFilter === "All" || doctor.city === cityFilter;
      const matchesSpecialty =
        specialtyFilter === "All" || doctor.specialty === specialtyFilter;
      const matchesMode =
        modeFilter === "All" ||
        (doctor.consultationMode || []).includes(modeFilter);

      return matchesSearch && matchesCity && matchesSpecialty && matchesMode;
    });
  }, [doctors, searchText, cityFilter, specialtyFilter, modeFilter]);

  const selectedDoctorSlots =
    selectedDoctor?.availableTimes?.length > 0
      ? selectedDoctor.availableTimes
      : DEFAULT_TIMES;

  const currentStep =
    stage === "discover" ? 0 : stage === "schedule" ? 1 : stage === "review" ? 2 : 3;

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate("");
    setSelectedTime("");
    setNotes("");
    setErrorText("");
    setStage("schedule");
  };

  const goToReview = () => {
    if (!selectedDate || !selectedTime) {
      setErrorText("Please choose date and slot before continuing.");
      return;
    }
    setErrorText("");
    setStage("review");
  };

  const createLocalAppointment = () => ({
    _id: `local-${Date.now()}`,
    doctorId: selectedDoctor?._id,
    doctorName: selectedDoctor?.name,
    specialty: selectedDoctor?.specialty,
    date: new Date(`${selectedDate} ${selectedTime}`).toISOString(),
    status: "confirmed",
    notes,
    doctorSnapshot: selectedDoctor,
  });

  const handleBookAppointment = async () => {
    if (!selectedDoctor) return;

    setSavingAppointment(true);
    setErrorText("");

    const payload = {
      doctorId: selectedDoctor._id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: new Date(`${selectedDate} ${selectedTime}`),
      status: "confirmed",
      notes,
    };

    if (!hasAuthToken) {
      setAppointments((prev) => [createLocalAppointment(), ...prev]);
      setSavingAppointment(false);
      setStage("done");
      return;
    }

    try {
      const response = await api.post("/appointments", payload);
      if (response.data) {
        setAppointments((prev) => [response.data, ...prev]);
      }
      setStage("done");
    } catch {
      setAppointments((prev) => [createLocalAppointment(), ...prev]);
      setStage("done");
    } finally {
      setSavingAppointment(false);
    }
  };

  const resetBooking = () => {
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedTime("");
    setNotes("");
    setErrorText("");
    setStage("discover");
  };

  const renderStars = (rating = 4.5) => {
    const full = Math.round(rating);
    return "*".repeat(full).padEnd(5, "-");
  };

  return (
    <section className="appointments-shell">
      <div className="appointments-bg-glow appointments-bg-glow-a" />
      <div className="appointments-bg-glow appointments-bg-glow-b" />

      <div className="appointments-wrap">
        <motion.header
          className="appointments-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="appointments-kicker">PranexusAI Care Network</p>
          <h1>Book verified doctors across India</h1>
          <p>
            Filter by city, specialty and consultation mode. Choose your slot, confirm in seconds,
            and track all upcoming bookings.
          </p>
        </motion.header>

        <div className="appointments-progress">
          {STEP_LABELS.map((label, index) => (
            <div key={label} className={`appointments-step ${index <= currentStep ? "active" : ""}`}>
              <span>{index + 1}</span>
              <p>{label}</p>
            </div>
          ))}
        </div>

        <div className="appointments-actions-row">
          <button className="secondary-btn" onClick={() => setStage("discover")}>Find Doctors</button>
          <button className="secondary-btn" onClick={() => setStage("history")}>My Bookings</button>
        </div>

        <AnimatePresence mode="wait">
          {stage === "discover" && (
            <motion.div
              key="discover"
              className="appointments-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <div className="appointments-filter-grid">
                <input
                  className="appointments-input"
                  placeholder="Search doctor, specialty or hospital"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                />
                <select
                  className="appointments-input"
                  value={cityFilter}
                  onChange={(event) => setCityFilter(event.target.value)}
                >
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city === "All" ? "All Cities" : city}
                    </option>
                  ))}
                </select>
                <select
                  className="appointments-input"
                  value={specialtyFilter}
                  onChange={(event) => setSpecialtyFilter(event.target.value)}
                >
                  {specialtyOptions.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty === "All" ? "All Specialties" : specialty}
                    </option>
                  ))}
                </select>
                <select
                  className="appointments-input"
                  value={modeFilter}
                  onChange={(event) => setModeFilter(event.target.value)}
                >
                  {modeOptions.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode === "All" ? "All Modes" : mode}
                    </option>
                  ))}
                </select>
              </div>

              {loadingDoctors ? (
                <div className="appointments-empty">Loading doctors...</div>
              ) : filteredDoctors.length === 0 ? (
                <div className="appointments-empty">No doctors matched your filters. Try resetting city or specialty.</div>
              ) : (
                <div className="appointments-doctor-grid">
                  {filteredDoctors.map((doctor, index) => (
                    <motion.article
                      key={doctor._id}
                      className="doctor-card"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <div className="doctor-top">
                        <img src={doctor.image} alt={doctor.name} />
                        <div>
                          <h3>{doctor.name}</h3>
                          <p className="doctor-specialty">{doctor.specialty}</p>
                          <p className="doctor-rating">{renderStars(doctor.rating)} {doctor.rating || "4.5"}</p>
                        </div>
                      </div>

                      <div className="doctor-meta">
                        <span>{doctor.experience} exp</span>
                        <span>{doctor.fees}</span>
                      </div>
                      <p className="doctor-hospital">{doctor.hospital || "Top Multispecialty Hospital"}, {doctor.city || "India"}</p>

                      <div className="doctor-chip-row">
                        {(doctor.languages || []).slice(0, 3).map((language) => (
                          <span key={language} className="doctor-chip">{language}</span>
                        ))}
                      </div>

                      <div className="doctor-chip-row">
                        {(doctor.consultationMode || ["Clinic"]).map((mode) => (
                          <span key={mode} className="doctor-chip muted">{mode}</span>
                        ))}
                      </div>

                      <button className="primary-btn" onClick={() => handleSelectDoctor(doctor)}>
                        Book This Doctor
                      </button>
                    </motion.article>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {stage === "schedule" && selectedDoctor && (
            <motion.div
              key="schedule"
              className="appointments-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <div className="selected-doctor-banner">
                <img src={selectedDoctor.image} alt={selectedDoctor.name} />
                <div>
                  <h3>{selectedDoctor.name}</h3>
                  <p>{selectedDoctor.specialty} | {selectedDoctor.hospital}</p>
                </div>
              </div>

              <div className="appointments-schedule-grid">
                <div>
                  <label>Select Date</label>
                  <input
                    className="appointments-input"
                    type="date"
                    min={getTomorrowDate()}
                    value={selectedDate}
                    onChange={(event) => {
                      setSelectedDate(event.target.value);
                      setSelectedTime("");
                    }}
                  />
                </div>

                <div>
                  <label>Select Time Slot</label>
                  <div className="slot-grid">
                    {selectedDoctorSlots.map((slot) => (
                      <button
                        key={slot}
                        className={`slot-btn ${selectedTime === slot ? "active" : ""}`}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label>Add Notes</label>
                <textarea
                  className="appointments-input"
                  rows={4}
                  placeholder="Mention symptoms, reports, ongoing medication, or preferred consultation language"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>

              {errorText && <p className="error-text">{errorText}</p>}

              <div className="appointments-footer-actions">
                <button className="secondary-btn" onClick={resetBooking}>Cancel</button>
                <button className="primary-btn" onClick={goToReview}>Continue</button>
              </div>
            </motion.div>
          )}

          {stage === "review" && selectedDoctor && (
            <motion.div
              key="review"
              className="appointments-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <h2>Review and confirm</h2>
              <div className="review-grid">
                <div>
                  <p className="review-label">Doctor</p>
                  <p className="review-value">{selectedDoctor.name}</p>
                  <p className="review-sub">{selectedDoctor.specialty}</p>
                </div>
                <div>
                  <p className="review-label">Hospital</p>
                  <p className="review-value">{selectedDoctor.hospital}</p>
                  <p className="review-sub">{selectedDoctor.city}</p>
                </div>
                <div>
                  <p className="review-label">Schedule</p>
                  <p className="review-value">{selectedDate}</p>
                  <p className="review-sub">{selectedTime}</p>
                </div>
                <div>
                  <p className="review-label">Consultation Fee</p>
                  <p className="review-value">{selectedDoctor.fees}</p>
                  <p className="review-sub">Estimated total</p>
                </div>
              </div>

              {notes ? (
                <div className="notes-box">
                  <p className="review-label">Notes</p>
                  <p>{notes}</p>
                </div>
              ) : null}

              {errorText && <p className="error-text">{errorText}</p>}

              <div className="appointments-footer-actions">
                <button className="secondary-btn" onClick={() => setStage("schedule")}>Edit</button>
                <button className="primary-btn" onClick={handleBookAppointment} disabled={savingAppointment}>
                  {savingAppointment ? "Booking..." : "Confirm Appointment"}
                </button>
              </div>
            </motion.div>
          )}

          {stage === "done" && selectedDoctor && (
            <motion.div
              key="done"
              className="appointments-card success-card"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="success-pill">Booking Confirmed</p>
              <h2>Your appointment is locked in</h2>
              <p>
                {selectedDoctor.name} on {selectedDate} at {selectedTime}. You can review all bookings from
                the history section.
              </p>

              <div className="appointments-footer-actions center">
                <button className="secondary-btn" onClick={() => setStage("history")}>View My Bookings</button>
                <button className="primary-btn" onClick={resetBooking}>Book Another</button>
              </div>
            </motion.div>
          )}

          {stage === "history" && (
            <motion.div
              key="history"
              className="appointments-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <h2>My Appointments</h2>
              {loadingAppointments ? (
                <div className="appointments-empty">Loading appointment history...</div>
              ) : appointments.length === 0 ? (
                <div className="appointments-empty">No appointments yet. Book your first doctor consultation.</div>
              ) : (
                <div className="history-list">
                  {appointments.map((appointment) => {
                    const doctorFromDirectory = doctors.find(
                      (doctor) => doctor._id === appointment.doctorId
                    );
                    const doctorName = appointment.doctorName || doctorFromDirectory?.name || "Doctor";
                    const specialty = appointment.specialty || doctorFromDirectory?.specialty || "General";
                    const dateValue = appointment.date
                      ? new Date(appointment.date).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Upcoming";

                    return (
                      <article className="history-item" key={appointment._id}>
                        <div>
                          <h4>{doctorName}</h4>
                          <p>{specialty}</p>
                        </div>
                        <div>
                          <p className="history-date">{dateValue}</p>
                          <span className={`status-tag ${String(appointment.status || "").toLowerCase()}`}>
                            {readStatus(String(appointment.status || "confirmed").toLowerCase())}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
