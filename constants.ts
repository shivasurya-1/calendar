
import { TimeSlot, Appointment } from './types';

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'password123'
};

const format12h = (hour: number): string => {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h.toString().padStart(2, '0')}:00 ${ampm}`;
};

export const TIME_SLOTS: TimeSlot[] = Array.from({ length: 24 }, (_, i) => ({
  label: `${format12h(i)} - ${format12h((i + 1) % 24)}`,
  startHour: i,
}));

const getOffsetDateStr = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

const indianNames = [
  "Venkata Ramana Rao", "Srinivasa Murthy", "Lakshmi Prasanna", "Rajeswari Devi",
  "Murali Krishna", "Sreekanth Reddy", "Anitha Chowdary", "Gopalakrishna Pillai",
  "Subba Rao", "Padmavathiamma", "Chaitanya Varma", "Bhargavi Reddy",
  "Narasimha Murthy", "Savitri Devi", "Suresh Babu", "Kalyani Raman",
  "Satyanarayana Raju", "Jyothirmayi", "Raghava Rao", "Vimala Kumari",
  "Prabhakar Reddy", "Sita Mahalakshmi", "Mohan Babu", "Indira Priyadarshini",
  "Sekhar Kammula", "Amrutha Varshini", "Vishnu Vardhan", "Gayatri Devi",
  "Trivikram Srinivas", "Shanti Swaroop", "Ravi Shankar", "Lalitha Kumari",
  "Pawan Kumar", "Sneha Latha", "Balaji Rao", "Kausalya Devi",
  "Venkatesh Prasad", "Sujatha Reddy", "Arun Kumar", "Meenakshi Sundaram"
];

const politicalTopics = [
  "Complaint about erratic water supply in Ward 12.",
  "Request for speed breakers on the main market road.",
  "Inquiry regarding the delay in pension disbursement.",
  "Proposal for installing LED streetlights in the colony.",
  "Grievance regarding non-functioning drainage system.",
  "Request for a new public library in the community center.",
  "Discussion on garbage collection schedule and cleanliness.",
  "Reporting illegal encroachments on the local park land.",
  "Seeking assistance for a BPL card application.",
  "Discussing the quality of meals in the local mid-day meal scheme.",
  "Request for a health check-up camp for senior citizens.",
  "Concerns about rising cases of dengue in the locality.",
  "Request for repair of the damaged community hall roof.",
  "Application for a new borewell in the arid zone of the sector.",
  "Grievance regarding high electricity bills and meter accuracy.",
  "Seeking support for the local youth sports tournament.",
  "Discussing potential sites for a new vegetable market.",
  "Feedback on the recent road widening project.",
  "Inquiry about self-employment grants for women.",
  "Request for better security patrolling during night hours."
];

const meetingOutcomes = [
  "Noted the complaint. Escalated to the Public Works Department for immediate action.",
  "Explained the budget constraints. Promised to prioritize the request in the next quarter.",
  "Resolved the issue on the spot by coordinating with the social welfare officer.",
  "Site visit scheduled for next Tuesday to assess the damage.",
  "Informed the constituent about the upcoming government scheme that addresses this.",
  "Collected necessary documents. Processing the application through the fast-track channel.",
  "Detailed discussion held. Constituent agreed to lead a local awareness drive.",
  "Forwarded the proposal to the Urban Development Committee for review.",
  "Issue partially resolved. Follow-up meeting required in 15 days.",
  "Completed the meeting. The constituent expressed satisfaction with the response."
];

const generateMockData = (): Appointment[] => {
  const mockApps: Appointment[] = [];
  let idCounter = 1;

  // Generate 80 appointments spread over the last 60 days to show in Reports
  // and ensure today/tomorrow have data to show in Calendar.
  for (let i = 0; i < 80; i++) {
    // We want a mix: 10 for today, 10 for tomorrow, 60 for the past
    let dayOffset: number;
    if (i < 10) {
      dayOffset = 0; // Today
    } else if (i < 20) {
      dayOffset = 1; // Tomorrow
    } else {
      dayOffset = -Math.floor(Math.random() * 60) - 1; // Past 60 days
    }

    const date = getOffsetDateStr(dayOffset);
    const nameIndex = Math.floor(Math.random() * indianNames.length);
    const topicIndex = Math.floor(Math.random() * politicalTopics.length);
    
    // Spread across common office hours (9 AM to 6 PM)
    const slotIndex = 9 + (Math.floor(Math.random() * 9)); 
    const timeSlot = TIME_SLOTS[slotIndex].label;

    let status: 'completed' | 'missed' | 'pending' | undefined = 'completed';
    
    // Future or Today logic
    if (dayOffset >= 0) {
      status = 'pending';
    } else {
      // Small chance of missed in the past
      status = Math.random() < 0.15 ? 'missed' : 'completed';
    }

    const outcome = status === 'completed' 
      ? meetingOutcomes[Math.floor(Math.random() * meetingOutcomes.length)]
      : undefined;

    mockApps.push({
      id: `${idCounter++}`,
      date,
      timeSlot,
      name: indianNames[nameIndex],
      description: politicalTopics[topicIndex],
      status,
      outcome,
      createdAt: Date.now() - (Math.abs(dayOffset) * 86400000) - (Math.random() * 3600000)
    });
  }

  // Sort by date descending
  return mockApps.sort((a, b) => b.createdAt - a.createdAt);
};

export const MOCK_APPOINTMENTS: Appointment[] = generateMockData();
