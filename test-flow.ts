// Test script using TypeScript via tsx
class MockLocalStorage {
  private store: Record<string, string> = {};
  getItem(key: string) { return this.store[key] || null; }
  setItem(key: string, value: string) { this.store[key] = value; }
  removeItem(key: string) { delete this.store[key]; }
  clear() { this.store = {}; }
}

(global as any).localStorage = new MockLocalStorage();

async function runTests() {
  console.log('🧪 Starting Facility Fix & Report Core Flow Tests...');

  const {
    initStorage,
    getTickets,
    getRooms,
    checkDuplicateActiveTicket,
    createTicket,
    claimTicket,
    updateTicketStatus,
    subscribeToTicket,
    getEmailNotifications
  } = await import('./src/lib/storage');

  // Test 1: Init Storage
  initStorage();
  const rooms = getRooms();
  const tickets = getTickets();
  console.log(`✅ [Test 1] Storage initialized. Rooms: ${rooms.length}, Tickets: ${tickets.length}`);
  if (rooms.length < 5 || tickets.length < 4) throw new Error('Failed initial fixtures count');

  // Test 2: Duplicate Check
  const duplicate = checkDuplicateActiveTicket('ROOM-SPU-11-502', 'AIR_CONDITIONER');
  console.log(`✅ [Test 2] Duplicate check found active ticket: #${duplicate?.id} (${duplicate?.title})`);
  if (!duplicate) throw new Error('Duplicate ticket was expected for AC in ROOM-SPU-11-502');

  // Test 3: Create New Ticket
  const newTicket = createTicket({
    roomId: 'ROOM-SPU-5-301',
    category: 'PROJECTOR_PC',
    title: 'Projector HDMI blinking orange code',
    description: 'Projector in 5-301 blinking orange lamp warning code on ceiling mount',
    photoUrl: 'data:image/svg+xml;utf8,<svg>test</svg>',
    studentEmail: 'praew.test@spu.ac.th'
  });
  console.log(`✅ [Test 3] Ticket created successfully: #${newTicket.id}, Token: ${newTicket.accessToken}`);
  if (!newTicket.id || !newTicket.accessToken) throw new Error('Ticket ID or Token missing');

  // Test 4: Verification of Automated Confirmation Email
  let emails = getEmailNotifications();
  const confirmationEmail = emails.find(e => e.ticketId === newTicket.id && e.type === 'CONFIRMATION');
  console.log(`✅ [Test 4] Student confirmation email verified: "${confirmationEmail?.subject}"`);
  if (!confirmationEmail) throw new Error('Confirmation email not generated');

  // Test 5: Technician Claim Task
  const claimSuccess = claimTicket(newTicket.id, 'Somchai K.', 'TECH-609');
  const claimedTicket = getTickets().find(t => t.id === newTicket.id);
  console.log(`✅ [Test 5] Claim task success: ${claimSuccess}, New Status: ${claimedTicket?.status}, Assigned: ${claimedTicket?.assignedTechName}`);
  if (claimedTicket?.status !== 'IN_PROGRESS' && claimedTicket?.status !== 'ACKNOWLEDGED') throw new Error('Expected claimed status');

  // Test 6: Technician Start Work & Resolve with Proof
  const resolveSuccess = updateTicketStatus({
    ticketId: newTicket.id,
    status: 'RESOLVED',
    note: 'Replaced HDMI splitter and tested video projection at 1080p 60Hz.',
    proofPhotoUrl: 'data:image/svg+xml;utf8,<svg>proof-resolved</svg>',
    technicianName: 'Somchai K.'
  });
  const resolvedTicket = getTickets().find(t => t.id === newTicket.id);
  console.log(`✅ [Test 6] Resolve success: ${resolveSuccess}, Status: ${resolvedTicket?.status}, Proof: ${!!resolvedTicket?.resolutionProofPhotoUrl}`);
  if (resolvedTicket?.status !== 'RESOLVED' || !resolvedTicket?.resolutionProofPhotoUrl) {
    throw new Error('Expected status RESOLVED with proof photo');
  }

  // Test 7: Verify Resolution Email with Proof Link
  emails = getEmailNotifications();
  const resolvedEmail = emails.find(e => e.ticketId === newTicket.id && e.type === 'RESOLVED');
  console.log(`✅ [Test 7] Resolution email dispatched to student: "${resolvedEmail?.subject}"`);
  if (!resolvedEmail) throw new Error('Resolution email was not dispatched');

  // Test 8: Subscribe to Existing Ticket
  const subSuccess = subscribeToTicket('SPU-8821', 'friend@spu.ac.th');
  const subscribedTicket = getTickets().find(t => t.id === 'SPU-8821');
  console.log(`✅ [Test 8] Subscribe to duplicate ticket: ${subSuccess}, Total Subscribers: ${subscribedTicket?.subscribers.length}`);
  if (!subscribedTicket?.subscribers.includes('friend@spu.ac.th')) {
    throw new Error('Subscriber email not added');
  }

  console.log('\n🎉 ALL 8 BUSINESS LOGIC & EMAIL VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
